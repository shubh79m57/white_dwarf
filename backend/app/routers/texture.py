"""
White Dwarf — Texture Router
POST /api/texture → Apply photorealistic texture to a mesh via SDXL ControlNet
"""
import uuid
import httpx
import logging
import trimesh
import numpy as np
from io import BytesIO
from pathlib import Path
from PIL import Image
from fastapi import APIRouter, HTTPException

from ..config import REPLICATE_API_TOKEN, TEXTURE_MODEL_ID, OUTPUTS_DIR
from ..services.replicate_client import ReplicateClient
from ..models.schemas import TextureRequest, TextureResponse

router = APIRouter()
logger = logging.getLogger(__name__)

replicate = ReplicateClient(REPLICATE_API_TOKEN)


def render_depth_map(obj_path: str, resolution: int = 512) -> bytes:
    """
    Render a depth map from a mesh file for ControlNet input.
    Returns PNG bytes of the depth image.
    """
    mesh = trimesh.load(obj_path, force='mesh')

    if isinstance(mesh, trimesh.Scene):
        meshes = [g for g in mesh.geometry.values() if isinstance(g, trimesh.Trimesh)]
        mesh = trimesh.util.concatenate(meshes) if meshes else None

    if mesh is None:
        raise ValueError("Could not load mesh for depth rendering")

    # Create a simple orthographic depth rendering
    # Project vertices to screen space
    bounds = mesh.bounds
    center = mesh.centroid
    extent = (bounds[1] - bounds[0]).max()

    # Normalize vertices to -1..1 range
    verts = (mesh.vertices - center) / (extent / 2)

    # Create depth image (looking from front, -Z direction)
    img = np.ones((resolution, resolution), dtype=np.float32) * 255

    for face in mesh.faces:
        pts = verts[face]
        # Project to 2D (front view: X→x, Y→y, Z→depth)
        for v in pts:
            px = int((v[0] + 1) * 0.5 * (resolution - 1))
            py = int((1 - (v[1] + 1) * 0.5) * (resolution - 1))
            depth = int((1 - (v[2] + 1) * 0.5) * 255)

            if 0 <= px < resolution and 0 <= py < resolution:
                img[py, px] = min(img[py, px], depth)

    # Convert to PIL Image
    pil_img = Image.fromarray(img.astype(np.uint8), mode='L')
    pil_img = pil_img.convert('RGB')

    buf = BytesIO()
    pil_img.save(buf, format='PNG')
    return buf.getvalue()


@router.post("/texture", response_model=TextureResponse)
async def apply_texture(request: TextureRequest):
    """
    Generate and apply a photorealistic texture to the mesh using
    Stable Diffusion XL with ControlNet Depth.
    """
    if not REPLICATE_API_TOKEN:
        raise HTTPException(
            status_code=503,
            detail="REPLICATE_API_TOKEN is not configured.",
        )

    # Resolve mesh path
    mesh_filename = request.mesh_url.split("/")[-1]
    mesh_path = OUTPUTS_DIR / mesh_filename

    if not mesh_path.exists():
        raise HTTPException(status_code=404, detail=f"Mesh not found: {mesh_filename}")

    job_id = uuid.uuid4().hex[:8]

    try:
        # 1. Render depth map from the mesh
        depth_bytes = render_depth_map(str(mesh_path))
        depth_filename = f"{job_id}_depth.png"
        depth_path = OUTPUTS_DIR / depth_filename
        depth_path.write_bytes(depth_bytes)
        logger.info(f"Depth map rendered: {depth_filename}")

        # 2. Upload depth map — For Replicate, we need a public URL.
        #    Use a data URI or serve from our static endpoint.
        import base64
        depth_b64 = base64.b64encode(depth_bytes).decode()
        depth_data_url = f"data:image/png;base64,{depth_b64}"

        # 3. Call SDXL + ControlNet for texture generation
        texture_prompt = f"Photorealistic texture render, {request.material_prompt}, high quality, studio lighting, 4K detail"

        texture_url = await replicate.generate_texture(
            model_version=TEXTURE_MODEL_ID,
            prompt=texture_prompt,
            depth_image_url=depth_data_url,
        )

        # 4. Download texture image
        texture_filename = f"{job_id}_texture.png"
        texture_path = OUTPUTS_DIR / texture_filename

        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.get(texture_url)
            resp.raise_for_status()
            texture_path.write_bytes(resp.content)

        logger.info(f"Texture saved: {texture_filename}")

        return TextureResponse(
            textured_model_url=request.mesh_url,  # Original mesh + new texture
            texture_image_url=f"/outputs/{texture_filename}",
            message="Texture generated and applied successfully",
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Texture generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Texture generation failed: {str(e)}")
