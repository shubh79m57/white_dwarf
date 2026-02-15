import React, { useState, useCallback } from 'react';
import './App.css';

import Layout from './components/Layout.jsx';
import StageProgress from './components/StageProgress.jsx';
import InputPanel from './components/InputPanel.jsx';
import WireframeViewer from './components/WireframeViewer.jsx';
import PhysicsStatus from './components/PhysicsStatus.jsx';
import MaterialSelector from './components/MaterialSelector.jsx';
import TexturedViewer from './components/TexturedViewer.jsx';
import QRExportPanel from './components/QRExportPanel.jsx';
import { useApi } from './hooks/useApi.js';

/*
  Stages: 'idle' → 'generate' → 'physics' → 'texture' → 'export' → 'done'
*/

export default function App() {
    const api = useApi();

    // Pipeline state
    const [stage, setStage] = useState('idle');
    const [completedStages, setCompletedStages] = useState([]);

    // Data
    const [meshUrl, setMeshUrl] = useState(null);
    const [wireframeApproved, setWireframeApproved] = useState(false);
    const [physicsResult, setPhysicsResult] = useState(null);
    const [texturedModelUrl, setTexturedModelUrl] = useState(null);
    const [textureImageUrl, setTextureImageUrl] = useState(null);
    const [exportResult, setExportResult] = useState(null);
    const [error, setError] = useState(null);

    // Loading states
    const [generating, setGenerating] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [texturing, setTexturing] = useState(false);
    const [exporting, setExporting] = useState(false);

    const markComplete = useCallback((stageKey) => {
        setCompletedStages((prev) => [...new Set([...prev, stageKey])]);
    }, []);

    // ── Stage 1: Generate Mesh ──────────────────────────────────
    const handleGenerate = useCallback(async (prompt, imageFile) => {
        setError(null);
        setGenerating(true);
        setStage('generate');
        setWireframeApproved(false);
        setPhysicsResult(null);
        setTexturedModelUrl(null);
        setTextureImageUrl(null);
        setExportResult(null);
        setCompletedStages([]);

        try {
            const result = await api.generateMesh(prompt, imageFile);
            setMeshUrl(result.mesh_url);
            markComplete('generate');
        } catch (err) {
            setError(err.message);
            setStage('idle');
        } finally {
            setGenerating(false);
        }
    }, [api, markComplete]);

    // ── Stage 1.5: Approve Wireframe ───────────────────────────
    const handleApproveWireframe = useCallback(async () => {
        setWireframeApproved(true);
        setStage('physics');
        setAnalyzing(true);
        setError(null);

        try {
            const result = await api.analyzePhysics(meshUrl);
            setPhysicsResult(result);
            markComplete('physics');
            setStage('texture');
        } catch (err) {
            setError(err.message);
            // Still move to texture stage so user can continue
            markComplete('physics');
            setPhysicsResult({ is_stable: false, verdict: 'Analysis unavailable', center_of_mass_y: 0, base_support_ratio: 0, bounding_box: [0, 0, 0] });
            setStage('texture');
        } finally {
            setAnalyzing(false);
        }
    }, [api, meshUrl, markComplete]);

    // ── Stage 3: Apply Texture ─────────────────────────────────
    const handleApplyTexture = useCallback(async (materialPrompt) => {
        setTexturing(true);
        setError(null);

        try {
            const result = await api.applyTexture(meshUrl, materialPrompt);
            setTexturedModelUrl(result.textured_model_url || meshUrl);
            setTextureImageUrl(result.texture_image_url || null);
            markComplete('texture');
            setStage('export');
        } catch (err) {
            setError(err.message);
        } finally {
            setTexturing(false);
        }
    }, [api, meshUrl, markComplete]);

    // ── Stage 4: Export ────────────────────────────────────────
    const handleExport = useCallback(async () => {
        setExporting(true);
        setError(null);

        try {
            const result = await api.exportModel(meshUrl);
            setExportResult(result);
            markComplete('export');
            setStage('done');
        } catch (err) {
            setError(err.message);
        } finally {
            setExporting(false);
        }
    }, [api, meshUrl, markComplete]);

    // Determine current active stage for progress bar
    const activeStage = stage === 'idle' ? 'generate' : stage === 'done' ? 'export' : stage;

    return (
        <Layout>
            {/* Stage Progress Bar */}
            <StageProgress currentStage={activeStage} completedStages={completedStages} />

            <main className="app-main">
                {/* ── Sidebar ── */}
                <aside className="sidebar">
                    {/* Always show input panel */}
                    <InputPanel onGenerate={handleGenerate} isLoading={generating} />

                    {/* Physics (after wireframe approved) */}
                    {(stage === 'physics' || completedStages.includes('physics')) && (
                        <PhysicsStatus result={physicsResult} isAnalyzing={analyzing} />
                    )}

                    {/* Material Selector (after physics) */}
                    {(stage === 'texture' || completedStages.includes('texture')) && (
                        <MaterialSelector onApply={handleApplyTexture} isLoading={texturing} />
                    )}

                    {/* QR Export (after texture) */}
                    {(stage === 'export' || stage === 'done') && (
                        <QRExportPanel
                            exportResult={exportResult}
                            isExporting={exporting}
                            onExport={handleExport}
                        />
                    )}
                </aside>

                {/* ── Canvas Area ── */}
                <section>
                    {/* Error Banner */}
                    {error && (
                        <div className="error-banner" style={{ marginBottom: 'var(--space-md)' }}>
                            ⚠ {error}
                        </div>
                    )}

                    {/* Show textured viewer if available, otherwise wireframe */}
                    {texturedModelUrl ? (
                        <TexturedViewer modelUrl={texturedModelUrl} textureUrl={textureImageUrl} />
                    ) : (
                        <WireframeViewer
                            objUrl={meshUrl}
                            onApprove={handleApproveWireframe}
                            approved={wireframeApproved}
                        />
                    )}
                </section>
            </main>
        </Layout>
    );
}
