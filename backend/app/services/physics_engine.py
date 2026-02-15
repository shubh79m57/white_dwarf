"""
White Dwarf — Physics Engine
Structural stability analysis using Trimesh.
"""
import trimesh
import numpy as np
import logging
from pathlib import Path
from typing import Dict, Any

logger = logging.getLogger(__name__)


def analyze_stability(obj_path: str) -> Dict[str, Any]:
    """
    Analyze the structural stability of a 3D mesh.

    Returns:
        dict with keys:
            - is_stable (bool)
            - center_of_mass_y (float, normalized 0-1)
            - base_support_ratio (float, 0-1)
            - bounding_box (list of 3 floats: W, H, D)
            - verdict (str)
    """
    path = Path(obj_path)
    if not path.exists():
        raise FileNotFoundError(f"Mesh file not found: {obj_path}")

    logger.info(f"Loading mesh for physics analysis: {obj_path}")

    # Load mesh — handle scenes with multiple meshes
    loaded = trimesh.load(str(path), force='mesh')

    if isinstance(loaded, trimesh.Scene):
        # Concatenate all meshes in the scene
        meshes = [g for g in loaded.geometry.values() if isinstance(g, trimesh.Trimesh)]
        if not meshes:
            raise ValueError("No valid meshes found in the file")
        mesh = trimesh.util.concatenate(meshes)
    elif isinstance(loaded, trimesh.Trimesh):
        mesh = loaded
    else:
        raise ValueError(f"Unsupported mesh type: {type(loaded)}")

    # ── Bounding Box ──────────────────────────────────────
    bbox = mesh.bounding_box.extents  # [width, height, depth]
    height = bbox[1] if len(bbox) > 1 else max(bbox)

    # ── Center of Mass ────────────────────────────────────
    com = mesh.center_mass
    bounds = mesh.bounds  # [[min_x, min_y, min_z], [max_x, max_y, max_z]]
    min_y = bounds[0][1]
    max_y = bounds[1][1]

    # Normalize center of mass Y to 0 (bottom) - 1 (top)
    if max_y - min_y > 0:
        com_y_normalized = (com[1] - min_y) / (max_y - min_y)
    else:
        com_y_normalized = 0.5

    # ── Base Support Analysis ─────────────────────────────
    # Look at vertices near the bottom 10% of the mesh
    y_range = max_y - min_y
    bottom_threshold = min_y + y_range * 0.1

    bottom_vertices = mesh.vertices[mesh.vertices[:, 1] <= bottom_threshold]

    if len(bottom_vertices) > 2:
        # Base footprint: convex hull area of bottom vertices projected to XZ plane
        base_points_2d = bottom_vertices[:, [0, 2]]  # project to XZ
        try:
            from scipy.spatial import ConvexHull
            hull = ConvexHull(base_points_2d)
            base_area = hull.volume  # In 2D, ConvexHull.volume = area
        except Exception:
            # Fallback: approximate with bounding rectangle
            base_area = (base_points_2d.max(axis=0) - base_points_2d.min(axis=0)).prod()
    else:
        base_area = 0.0

    # Total footprint: bounding box XZ area
    total_footprint = bbox[0] * bbox[2] if len(bbox) > 2 else bbox[0] ** 2
    base_support_ratio = base_area / total_footprint if total_footprint > 0 else 0.0
    base_support_ratio = min(base_support_ratio, 1.0)

    # ── Stability Verdict ─────────────────────────────────
    # Heuristic: stable if COM is in lower 60% AND base ratio > 0.3
    is_stable = com_y_normalized < 0.6 and base_support_ratio > 0.3

    if is_stable:
        if com_y_normalized < 0.4 and base_support_ratio > 0.6:
            verdict = "Very Stable — Low center of mass with wide base"
        elif com_y_normalized < 0.5:
            verdict = "Stable — Good weight distribution"
        else:
            verdict = "Marginally Stable — Center of mass is moderate"
    else:
        if com_y_normalized >= 0.6:
            verdict = "Top-Heavy — Center of mass is high, may tip over"
        elif base_support_ratio <= 0.3:
            verdict = "Narrow Base — Support area is too small for stability"
        else:
            verdict = "Unstable — Consider widening the base or lowering the center of mass"

    result = {
        "is_stable": bool(is_stable),
        "center_of_mass_y": float(com_y_normalized),
        "base_support_ratio": float(base_support_ratio),
        "bounding_box": [float(x) for x in bbox[:3]],
        "verdict": verdict,
    }

    logger.info(f"Physics result: {verdict} (CoM_Y={com_y_normalized:.3f}, base={base_support_ratio:.2f})")
    return result
