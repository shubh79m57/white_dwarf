"""
White Dwarf — Configuration & Environment Variables
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# ── API Keys ──────────────────────────────────────────────────
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN", "")
RUNPOD_API_KEY = os.getenv("RUNPOD_API_KEY", "")

# ── Paths ─────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUTS_DIR = BASE_DIR / "outputs"
OUTPUTS_DIR.mkdir(exist_ok=True)

# ── Model IDs ─────────────────────────────────────────────────
# Replicate model for 3D mesh generation
MESH_MODEL_ID = os.getenv(
    "MESH_MODEL_ID",
    "tencent/hunyuan3d-2:d5b6a060bb03613697aa4e39b983ed8f3e0de0bade54a6e1b5a5ecf10e182258"
)

# Replicate model for texture generation (Stable Diffusion XL + ControlNet)
TEXTURE_MODEL_ID = os.getenv(
    "TEXTURE_MODEL_ID",
    "jagilley/controlnet-depth:922c7bb67b87ec32cbc2fd11b1d5f94f0ba4f5519c4dbd02856376444127cc60"
)

# ── Server ────────────────────────────────────────────────────
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
