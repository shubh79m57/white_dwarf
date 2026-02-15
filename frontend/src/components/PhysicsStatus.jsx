import React from 'react';

export default function PhysicsStatus({ result, isAnalyzing }) {
    if (isAnalyzing) {
        return (
            <div className="panel glass-card animate-fade-in-up">
                <div className="panel-header">
                    <div className="panel-icon teal">⚡</div>
                    <div>
                        <div className="panel-title">Physics Validation</div>
                        <div className="panel-subtitle">Analyzing structural stability...</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <div className="loading-spinner" />
                    <span className="physics-badge analyzing">Analyzing...</span>
                </div>
            </div>
        );
    }

    if (!result) return null;

    const isStable = result.is_stable;

    return (
        <div className="panel glass-card animate-fade-in-up">
            <div className="panel-header">
                <div className="panel-icon teal">⚡</div>
                <div>
                    <div className="panel-title">Physics Validation</div>
                    <div className="panel-subtitle">Structural analysis complete</div>
                </div>
            </div>

            <div className={`physics-badge ${isStable ? 'stable' : 'unstable'}`}>
                {isStable ? '✓ Stable' : '⚠ Top-Heavy'}
            </div>

            <div className="physics-details">
                <div className="physics-row">
                    <span className="physics-label">Center of Mass (Y)</span>
                    <span className="physics-value">{result.center_of_mass_y?.toFixed(3) ?? '–'}</span>
                </div>
                <div className="physics-row">
                    <span className="physics-label">Base Support Ratio</span>
                    <span className="physics-value">{result.base_support_ratio?.toFixed(2) ?? '–'}</span>
                </div>
                <div className="physics-row">
                    <span className="physics-label">Bounding Box</span>
                    <span className="physics-value">
                        {result.bounding_box
                            ? `${result.bounding_box[0]?.toFixed(1)} × ${result.bounding_box[1]?.toFixed(1)} × ${result.bounding_box[2]?.toFixed(1)}`
                            : '–'}
                    </span>
                </div>
                <div className="physics-row" style={{ borderBottom: 'none' }}>
                    <span className="physics-label">Verdict</span>
                    <span className="physics-value" style={{ color: isStable ? 'var(--success)' : 'var(--warning)' }}>
                        {result.verdict ?? (isStable ? 'Structurally Sound' : 'May require wider base')}
                    </span>
                </div>
            </div>
        </div>
    );
}
