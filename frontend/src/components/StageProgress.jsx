import React from 'react';

const STAGES = [
    { key: 'generate', label: 'Generate', icon: '✦' },
    { key: 'physics', label: 'Physics', icon: '⚡' },
    { key: 'texture', label: 'Skin', icon: '🎨' },
    { key: 'export', label: 'Export', icon: '📱' },
];

export default function StageProgress({ currentStage, completedStages }) {
    return (
        <div className="stage-progress glass-card" style={{ borderRadius: 'var(--radius-lg)' }}>
            {STAGES.map((stage, i) => {
                const isDone = completedStages.includes(stage.key);
                const isActive = currentStage === stage.key;

                return (
                    <div
                        key={stage.key}
                        className={`stage-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                    >
                        <div className="stage-dot">
                            {isDone ? '✓' : stage.icon}
                        </div>
                        <span className="stage-label">{stage.label}</span>
                        {i < STAGES.length - 1 && <div className="stage-line" />}
                    </div>
                );
            })}
        </div>
    );
}
