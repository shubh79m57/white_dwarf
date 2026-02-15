"""
White Dwarf — Catalog Router
Serves the furniture catalog data.
"""
from fastapi import APIRouter, HTTPException

router = APIRouter()

FURNITURE_CATALOG = [
    {
        "id": "nordic-chair",
        "name": "Nordic Lounge Chair",
        "description": "A beautifully sculpted Scandinavian-inspired lounge chair with organic curves and solid wood legs.",
        "category": "Chairs",
        "price": 899,
        "modelPrompt": "A Nordic Scandinavian lounge chair with organic curved backrest, solid oak wood legs, minimalist design, light fabric upholstery",
        "tags": ["modern", "scandinavian", "wood", "lounge"],
    },
    {
        "id": "glass-coffee-table",
        "name": "Crystalline Coffee Table",
        "description": "Elegant tempered glass coffee table with a geometric brushed-gold metal frame.",
        "category": "Tables",
        "price": 1249,
        "modelPrompt": "An elegant tempered glass coffee table with geometric brushed gold metal frame, contemporary design",
        "tags": ["modern", "glass", "gold", "luxury"],
    },
    {
        "id": "velvet-sofa",
        "name": "Velvet Cloud Sofa",
        "description": "Deep-seated velvet sofa with plush cushioning and tapered brass legs.",
        "category": "Sofas",
        "price": 2499,
        "modelPrompt": "A luxurious deep-seated velvet sofa with plush cushioning, tapered brass legs, emerald green velvet",
        "tags": ["luxury", "velvet", "green", "modern"],
    },
    {
        "id": "modular-shelf",
        "name": "Hex Modular Shelving",
        "description": "Honeycomb-inspired modular wall shelving system in matte black steel.",
        "category": "Storage",
        "price": 679,
        "modelPrompt": "Hexagonal honeycomb modular wall shelving system, matte black steel, geometric design",
        "tags": ["modular", "geometric", "black", "wall-mount"],
    },
    {
        "id": "pendant-light",
        "name": "Aurora Pendant Light",
        "description": "Blown glass pendant lamp with gradient amber-to-clear finish.",
        "category": "Lighting",
        "price": 459,
        "modelPrompt": "A blown glass pendant lamp with gradient amber to clear finish, sculptural organic shape",
        "tags": ["glass", "amber", "pendant", "artisan"],
    },
    {
        "id": "dining-table",
        "name": "Live Edge Dining Table",
        "description": "Solid walnut dining table with natural live edge and matte black steel legs.",
        "category": "Tables",
        "price": 3299,
        "modelPrompt": "A solid walnut live edge dining table with natural wood grain, matte black steel legs",
        "tags": ["walnut", "rustic", "live-edge", "dining"],
    },
    {
        "id": "accent-chair",
        "name": "Bouclé Accent Chair",
        "description": "Cozy boucle fabric accent chair with curved wraparound back and walnut dowel legs.",
        "category": "Chairs",
        "price": 749,
        "modelPrompt": "A cozy boucle fabric accent chair with curved wraparound backrest, walnut dowel legs",
        "tags": ["boucle", "cream", "mid-century", "accent"],
    },
    {
        "id": "floor-lamp",
        "name": "Arc Floor Lamp",
        "description": "Sweeping arc floor lamp with brushed nickel finish and linen drum shade.",
        "category": "Lighting",
        "price": 389,
        "modelPrompt": "A sweeping arc floor lamp with brushed nickel metal finish, linen drum shade",
        "tags": ["nickel", "arc", "modern", "floor"],
    },
    {
        "id": "sectional-sofa",
        "name": "Modular Sectional",
        "description": "Configurable modular sectional in performance linen.",
        "category": "Sofas",
        "price": 3899,
        "modelPrompt": "A large modular sectional sofa in light gray performance linen, L-shaped configuration",
        "tags": ["modular", "linen", "gray", "sectional"],
    },
    {
        "id": "ceramic-vase",
        "name": "Sculptural Ceramic Vase",
        "description": "Hand-crafted ceramic vase with an asymmetric organic form and matte sage finish.",
        "category": "Decor",
        "price": 189,
        "modelPrompt": "A hand-crafted sculptural ceramic vase with asymmetric organic form, matte sage green",
        "tags": ["ceramic", "sage", "organic", "handmade"],
    },
    {
        "id": "console-table",
        "name": "Marble Console Table",
        "description": "Slim console table with white Carrara marble top and brass hairpin legs.",
        "category": "Tables",
        "price": 1599,
        "modelPrompt": "A slim console table with white Carrara marble top, brass hairpin legs",
        "tags": ["marble", "brass", "luxury", "console"],
    },
    {
        "id": "bookcase",
        "name": "Industrial Bookcase",
        "description": "Five-shelf industrial bookcase with reclaimed pine shelves and black iron frame.",
        "category": "Storage",
        "price": 949,
        "modelPrompt": "A five-shelf industrial bookcase with reclaimed pine wood shelves, black iron metal frame",
        "tags": ["industrial", "pine", "reclaimed", "rustic"],
    },
]


@router.get("/catalog")
async def list_catalog(category: str | None = None):
    """Return all furniture items, optionally filtered by category."""
    items = FURNITURE_CATALOG
    if category:
        items = [i for i in items if i["category"].lower() == category.lower()]
    return {"items": items, "total": len(items)}


@router.get("/catalog/{item_id}")
async def get_catalog_item(item_id: str):
    """Return a single furniture item by ID."""
    for item in FURNITURE_CATALOG:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail=f"Item '{item_id}' not found")
