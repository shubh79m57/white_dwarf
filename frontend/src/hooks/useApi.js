const API_BASE = '/api';

/**
 * Custom hook for API calls to the FastAPI backend
 */
export function useApi() {
    /**
     * Generate a 3D mesh from text prompt and optional image
     */
    async function generateMesh(prompt, imageFile = null) {
        const formData = new FormData();
        formData.append('prompt', prompt);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const res = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: 'Generation failed' }));
            throw new Error(err.detail || 'Generation failed');
        }

        return res.json();
    }

    /**
     * Run physics analysis on a mesh file
     */
    async function analyzePhysics(meshUrl) {
        const res = await fetch(`${API_BASE}/physics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mesh_url: meshUrl }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: 'Physics analysis failed' }));
            throw new Error(err.detail || 'Physics analysis failed');
        }

        return res.json();
    }

    /**
     * Apply a texture/material to the mesh
     */
    async function applyTexture(meshUrl, materialPrompt) {
        const res = await fetch(`${API_BASE}/texture`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mesh_url: meshUrl, material_prompt: materialPrompt }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: 'Texture generation failed' }));
            throw new Error(err.detail || 'Texture generation failed');
        }

        return res.json();
    }

    /**
     * Export the model to GLB/USDZ and get QR code data
     */
    async function exportModel(meshUrl) {
        const res = await fetch(`${API_BASE}/export`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mesh_url: meshUrl }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: 'Export failed' }));
            throw new Error(err.detail || 'Export failed');
        }

        return res.json();
    }

    return { generateMesh, analyzePhysics, applyTexture, exportModel };
}
