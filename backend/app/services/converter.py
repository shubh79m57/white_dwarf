"""
White Dwarf — Mesh Converter
Converts .obj meshes to .glb and .usdz formats.
"""
import trimesh
import logging
from pathlib import Path
from typing import Optional, Tuple

logger = logging.getLogger(__name__)


def to_glb(input_path: str, output_path: Optional[str] = None) -> str:
    """
    Convert an OBJ (or other format) mesh to GLB (binary glTF).

    Args:
        input_path: Path to the source mesh file.
        output_path: Optional output path. If None, replaces extension with .glb.

    Returns:
        Path to the generated .glb file.
    """
    src = Path(input_path)
    if not src.exists():
        raise FileNotFoundError(f"Input mesh not found: {input_path}")

    if output_path is None:
        output_path = str(src.with_suffix('.glb'))

    logger.info(f"Converting {src.name} → GLB")

    # Load the mesh
    scene = trimesh.load(str(src))

    if isinstance(scene, trimesh.Trimesh):
        # Wrap single mesh in a scene for proper GLB export
        scene = trimesh.Scene(geometry={'mesh': scene})

    # Export as GLB
    glb_data = scene.export(file_type='glb')
    out = Path(output_path)
    out.write_bytes(glb_data)

    logger.info(f"GLB saved: {out} ({len(glb_data)} bytes)")
    return str(out)


def to_usdz(input_path: str, output_path: Optional[str] = None) -> Optional[str]:
    """
    Attempt to convert a mesh to USDZ format.
    This requires the usd-core or usdz-tools package.

    Returns:
        Path to the .usdz file, or None if conversion is not available.
    """
    src = Path(input_path)
    if not src.exists():
        raise FileNotFoundError(f"Input mesh not found: {input_path}")

    if output_path is None:
        output_path = str(src.with_suffix('.usdz'))

    try:
        # Try using trimesh's built-in USDZ support (requires usd-core)
        scene = trimesh.load(str(src))

        if isinstance(scene, trimesh.Trimesh):
            scene = trimesh.Scene(geometry={'mesh': scene})

        # Trimesh may support USDZ via pxr (USD Python bindings)
        usdz_data = scene.export(file_type='usdz')
        out = Path(output_path)
        out.write_bytes(usdz_data)

        logger.info(f"USDZ saved: {out}")
        return str(out)

    except Exception as e:
        logger.warning(f"USDZ conversion not available: {e}")
        logger.info("To enable USDZ export, install: pip install usd-core")
        return None


def convert_mesh(input_path: str, output_dir: str) -> Tuple[str, Optional[str]]:
    """
    Convert a mesh to both GLB and USDZ.

    Returns:
        Tuple of (glb_path, usdz_path_or_None)
    """
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    stem = Path(input_path).stem

    glb_path = to_glb(input_path, str(out_dir / f"{stem}.glb"))
    usdz_path = to_usdz(input_path, str(out_dir / f"{stem}.usdz"))

    return glb_path, usdz_path
