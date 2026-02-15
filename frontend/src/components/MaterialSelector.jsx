import React, { useState } from 'react';

const PRESET_MATERIALS = [
    { name: 'Blue Velvet', swatch: 'linear-gradient(135deg, #2d3abe, #6c5ce7)', prompt: 'blue velvet fabric, soft plush texture, luxury upholstery' },
    { name: 'Mahogany Wood', swatch: 'linear-gradient(135deg, #4a2c1a, #8b4513)', prompt: 'polished mahogany wood grain, rich warm brown, furniture quality' },
    { name: 'White Marble', swatch: 'linear-gradient(135deg, #e8e8e8, #f5f5f5)', prompt: 'white Carrara marble, subtle grey veining, polished smooth surface' },
    { name: 'Brushed Steel', swatch: 'linear-gradient(135deg, #8a9bae, #c0c8d0)', prompt: 'brushed stainless steel, industrial metallic finish, reflective surface' },
    { name: 'Matte Black', swatch: 'linear-gradient(135deg, #1a1a1a, #333333)', prompt: 'matte black finish, soft-touch coating, premium dark surface' },
    { name: 'Rose Gold', swatch: 'linear-gradient(135deg, #b76e79, #e8b4b8)', prompt: 'rose gold metallic, warm pinkish gold tone, luxury finish' },
    { name: 'Concrete', swatch: 'linear-gradient(135deg, #8e8e8e, #b5b5b5)', prompt: 'raw concrete texture, brutalist industrial, matte grey surface' },
    { name: 'Emerald Glass', swatch: 'linear-gradient(135deg, #00695c, #00cec9)', prompt: 'translucent emerald green glass, glossy smooth, luxury crystal' },
];

export default function MaterialSelector({ onApply, isLoading }) {
    const [selected, setSelected] = useState(null);
    const [customPrompt, setCustomPrompt] = useState('');

    const handleApply = () => {
        const materialPrompt = selected !== null
            ? PRESET_MATERIALS[selected].prompt
            : customPrompt.trim();

        if (!materialPrompt) return;
        onApply(materialPrompt);
    };

    return (
        <div className="panel glass-card animate-fade-in-up">
            <div className="panel-header">
                <div className="panel-icon amber">🎨</div>
                <div>
                    <div className="panel-title">Photorealistic Skin</div>
                    <div className="panel-subtitle">Choose a material or describe your own</div>
                </div>
            </div>

            {/* Preset Grid */}
            <div className="material-grid" style={{ marginBottom: 'var(--space-md)' }}>
                {PRESET_MATERIALS.map((mat, i) => (
                    <div
                        key={mat.name}
                        className={`material-chip ${selected === i ? 'selected' : ''}`}
                        onClick={() => { setSelected(i); setCustomPrompt(''); }}
                    >
                        <div
                            className="material-swatch"
                            style={{ background: mat.swatch }}
                        />
                        <span>{mat.name}</span>
                    </div>
                ))}
            </div>

            {/* Custom Prompt */}
            <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="input-label">Or Custom Material</label>
                <input
                    type="text"
                    className="text-input"
                    placeholder="e.g. Weathered bronze patina, antique..."
                    value={customPrompt}
                    onChange={(e) => { setCustomPrompt(e.target.value); setSelected(null); }}
                    disabled={isLoading}
                    id="custom-material-input"
                />
            </div>

            <button
                className="btn btn-primary btn-lg btn-full"
                onClick={handleApply}
                disabled={isLoading || (selected === null && !customPrompt.trim())}
                id="apply-texture-btn"
            >
                {isLoading ? (
                    <>
                        <div className="loading-spinner" />
                        Generating Texture...
                    </>
                ) : (
                    <>🎨 Apply Material</>
                )}
            </button>
        </div>
    );
}
