# 🌟 White Dwarf — AI 3D Model Generator

A full-stack web application that generates 3D models from text/images, performs structural physics validation, applies photorealistic textures, and exports VR-ready QR codes.

> **Designed for low-spec hardware** — All AI inference runs in the cloud (Replicate/RunPod). The local app handles UI, API orchestration, and lightweight physics scripts only.

---

## ✨ Features

| Stage | Feature | Tech |
|-------|---------|------|
| **1. Generate** | Text/image → 3D wireframe mesh | Hunyuan3D-2.0 via Replicate API |
| **2. Physics** | Structural stability analysis | Trimesh (local CPU) |
| **3. Skin** | Photorealistic material textures | SDXL + ControlNet Depth via Replicate |
| **4. Export** | GLB/USDZ + QR code for AR | Trimesh + qrcode.react |

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- A [Replicate API token](https://replicate.com/account/api-tokens)

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and add your REPLICATE_API_TOKEN

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Open the App

Visit **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
white_dwarf/
├── frontend/                     React + Vite + react-three-fiber
│   ├── src/
│   │   ├── components/
│   │   │   ├── WireframeViewer.jsx    ← Three.js wireframe renderer
│   │   │   ├── InputPanel.jsx         ← Text/image prompt input
│   │   │   ├── PhysicsStatus.jsx      ← Stability badge & metrics
│   │   │   ├── MaterialSelector.jsx   ← Texture material picker
│   │   │   ├── TexturedViewer.jsx     ← Skinned 3D preview
│   │   │   ├── QRExportPanel.jsx      ← QR code + downloads
│   │   │   ├── StageProgress.jsx      ← Pipeline stage indicator
│   │   │   └── Layout.jsx            ← App shell & header
│   │   ├── hooks/useApi.js           ← API fetch wrappers
│   │   ├── App.jsx                   ← Main state machine
│   │   └── index.css                 ← Design system
│   └── public/sample.obj            ← Test wireframe
│
├── backend/                      FastAPI (Python)
│   ├── app/
│   │   ├── main.py               ← FastAPI entry + CORS + static
│   │   ├── routers/
│   │   │   ├── generate.py       ← POST /api/generate
│   │   │   ├── physics.py        ← POST /api/physics
│   │   │   ├── texture.py        ← POST /api/texture
│   │   │   └── export.py         ← POST /api/export
│   │   ├── services/
│   │   │   ├── replicate_client.py  ← Replicate API wrapper
│   │   │   ├── runpod_client.py     ← RunPod API wrapper
│   │   │   ├── physics_engine.py    ← Trimesh stability analysis
│   │   │   └── converter.py        ← OBJ → GLB/USDZ
│   │   ├── models/schemas.py    ← Pydantic models
│   │   └── config.py            ← Env config
│   └── requirements.txt
│
└── README.md
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REPLICATE_API_TOKEN` | ✅ | Your Replicate.com API token |
| `RUNPOD_API_KEY` | ❌ | Optional RunPod API key |
| `MESH_MODEL_ID` | ❌ | Override default mesh model |
| `TEXTURE_MODEL_ID` | ❌ | Override default texture model |

---

## 🎮 Usage

1. **Enter a prompt** — Describe the 3D object you want (e.g., "A modern minimalist chair")
2. **Review wireframe** — The generated mesh appears as a rotating wireframe. Click "Approve" to proceed.
3. **Physics check** — Automatic stability analysis runs (center of mass, base support ratio).
4. **Apply material** — Choose a preset material or describe a custom one.
5. **Export** — Download as GLB/USDZ and scan the QR code for instant AR on your phone.

---

## 📜 License

MIT
