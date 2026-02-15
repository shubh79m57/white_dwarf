"""
White Dwarf — FastAPI Main Application
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import OUTPUTS_DIR
from .routers import generate, physics, texture, export, catalog

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

# Create FastAPI app
app = FastAPI(
    title="White Dwarf",
    description="AI-powered 3D model generator with physics validation and VR export",
    version="1.0.0",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve generated files as static
OUTPUTS_DIR.mkdir(exist_ok=True)
app.mount("/outputs", StaticFiles(directory=str(OUTPUTS_DIR)), name="outputs")

# Register routers
app.include_router(generate.router, prefix="/api", tags=["Generate"])
app.include_router(physics.router, prefix="/api", tags=["Physics"])
app.include_router(texture.router, prefix="/api", tags=["Texture"])
app.include_router(export.router, prefix="/api", tags=["Export"])
app.include_router(catalog.router, prefix="/api", tags=["Catalog"])


@app.get("/")
async def root():
    return {
        "name": "White Dwarf",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
