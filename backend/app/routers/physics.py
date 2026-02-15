"""
White Dwarf — Physics Router
POST /api/physics → Analyze structural stability of a mesh
"""
import logging
from fastapi import APIRouter, HTTPException

from ..config import OUTPUTS_DIR
from ..services.physics_engine import analyze_stability
from ..models.schemas import PhysicsRequest, PhysicsResult

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/physics", response_model=PhysicsResult)
async def physics_check(request: PhysicsRequest):
    """
    Run structural physics analysis on a mesh file.
    Computes center of mass, base stability, and returns a verdict.
    """
    # Resolve the mesh file path
    mesh_filename = request.mesh_url.split("/")[-1]
    mesh_path = OUTPUTS_DIR / mesh_filename

    if not mesh_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Mesh file not found: {mesh_filename}",
        )

    try:
        result = analyze_stability(str(mesh_path))
        return PhysicsResult(**result)

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Physics analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Physics analysis error: {str(e)}")
