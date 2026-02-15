"""
White Dwarf — Pydantic Models / Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List


class GenerateRequest(BaseModel):
    prompt: str = Field(..., description="Text description of the 3D object to generate")


class GenerateResponse(BaseModel):
    mesh_url: str = Field(..., description="URL path to the generated .obj mesh file")
    message: str = "Mesh generated successfully"


class PhysicsRequest(BaseModel):
    mesh_url: str = Field(..., description="URL path to the .obj mesh file to analyze")


class PhysicsResult(BaseModel):
    is_stable: bool = Field(..., description="Whether the object is structurally stable")
    center_of_mass_y: float = Field(0.0, description="Normalized Y position of center of mass (0=bottom, 1=top)")
    base_support_ratio: float = Field(0.0, description="Ratio of base area to total footprint")
    bounding_box: List[float] = Field(default_factory=lambda: [0, 0, 0], description="Width, Height, Depth of bounding box")
    verdict: str = Field("", description="Human-readable stability verdict")


class TextureRequest(BaseModel):
    mesh_url: str = Field(..., description="URL path to the .obj mesh file")
    material_prompt: str = Field(..., description="Description of the desired material/texture")


class TextureResponse(BaseModel):
    textured_model_url: str = Field("", description="URL to the textured model (GLB)")
    texture_image_url: Optional[str] = Field(None, description="URL to the generated texture image")
    message: str = "Texture applied successfully"


class ExportRequest(BaseModel):
    mesh_url: str = Field(..., description="URL path to the mesh file to export")


class ExportResponse(BaseModel):
    glb_url: Optional[str] = Field(None, description="Download URL for .glb file")
    usdz_url: Optional[str] = Field(None, description="Download URL for .usdz file")
    public_url: Optional[str] = Field(None, description="Temporary public URL for AR preview")
    message: str = "Export complete"
