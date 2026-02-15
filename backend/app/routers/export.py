"""
White Dwarf — Export Router
POST /api/export → Convert mesh to GLB/USDZ and generate QR code
"""
import logging
from fastapi import APIRouter, HTTPException

from ..config import OUTPUTS_DIR
from ..services.converter import convert_mesh
from ..models.schemas import ExportRequest, ExportResponse

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/export", response_model=ExportResponse)
async def export_model(request: ExportRequest):
    """
    Convert the mesh to GLB (Android) and USDZ (iOS),
    and return download URLs plus a shareable public URL for QR code.
    """
    # Resolve mesh path
    mesh_filename = request.mesh_url.split("/")[-1]
    mesh_path = OUTPUTS_DIR / mesh_filename

    if not mesh_path.exists():
        raise HTTPException(status_code=404, detail=f"Mesh not found: {mesh_filename}")

    try:
        # Convert to GLB and USDZ
        glb_path, usdz_path = convert_mesh(str(mesh_path), str(OUTPUTS_DIR))

        glb_url = f"/outputs/{glb_path.split('/')[-1].split(chr(92))[-1]}" if glb_path else None
        usdz_url = f"/outputs/{usdz_path.split('/')[-1].split(chr(92))[-1]}" if usdz_path else None

        # For the QR code public URL:
        # In production, this would be a ngrok/Vercel URL.
        # For local dev, we use the local URL.
        public_base = "http://localhost:8000"
        public_url = f"{public_base}{glb_url}" if glb_url else None

        return ExportResponse(
            glb_url=glb_url,
            usdz_url=usdz_url,
            public_url=public_url,
            message="Export complete. Scan the QR code for AR preview.",
        )

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Export failed: {e}")
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")
