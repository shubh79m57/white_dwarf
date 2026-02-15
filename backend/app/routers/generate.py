"""
White Dwarf — Generate Router
POST /api/generate → Generate a 3D mesh from text/image via Replicate API
"""
import uuid
import httpx
import logging
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from ..config import REPLICATE_API_TOKEN, MESH_MODEL_ID, OUTPUTS_DIR
from ..services.replicate_client import ReplicateClient
from ..models.schemas import GenerateResponse

router = APIRouter()
logger = logging.getLogger(__name__)

replicate = ReplicateClient(REPLICATE_API_TOKEN)


@router.post("/generate", response_model=GenerateResponse)
async def generate_mesh(
    prompt: str = Form(...),
    image: UploadFile = File(None),
):
    """
    Generate a 3D mesh (.obj) from a text prompt and optional reference image.
    Uses Hunyuan3D-2.0 (or similar) via Replicate API.
    """
    if not REPLICATE_API_TOKEN:
        raise HTTPException(
            status_code=503,
            detail="REPLICATE_API_TOKEN is not configured. Add it to backend/.env",
        )

    job_id = uuid.uuid4().hex[:8]

    # Handle image upload → temporary data URL or hosted URL
    image_url = None
    if image and image.filename:
        image_data = await image.read()
        # Save locally and serve through FastAPI static files
        img_path = OUTPUTS_DIR / f"{job_id}_ref{Path(image.filename).suffix}"
        img_path.write_bytes(image_data)
        image_url = f"/outputs/{img_path.name}"
        logger.info(f"Reference image saved: {img_path.name}")

    try:
        # Call Replicate for mesh generation
        mesh_remote_url = await replicate.generate_mesh(
            model_version=MESH_MODEL_ID,
            prompt=prompt,
            image_url=image_url,
        )

        # Download the generated mesh to local outputs folder
        obj_filename = f"{job_id}_mesh.obj"
        obj_path = OUTPUTS_DIR / obj_filename

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.get(mesh_remote_url)
            resp.raise_for_status()
            obj_path.write_bytes(resp.content)

        logger.info(f"Mesh saved: {obj_filename} ({len(resp.content)} bytes)")

        return GenerateResponse(
            mesh_url=f"/outputs/{obj_filename}",
            message=f"Mesh generated successfully ({len(resp.content)} bytes)",
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
