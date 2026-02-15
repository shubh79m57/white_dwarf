import React, { useState, useRef } from 'react';

export default function InputPanel({ onGenerate, isLoading }) {
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageName, setImageName] = useState('');
    const fileRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!prompt.trim() && !imageFile) return;
        onGenerate(prompt.trim(), imageFile);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageName(file.name);
        }
    };

    const clearImage = () => {
        setImageFile(null);
        setImageName('');
        if (fileRef.current) fileRef.current.value = '';
    };

    return (
        <div className="panel glass-card animate-fade-in-up">
            <div className="panel-header">
                <div className="panel-icon purple">✦</div>
                <div>
                    <div className="panel-title">Generate 3D Model</div>
                    <div className="panel-subtitle">Describe your object or upload a reference</div>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {/* Text Prompt */}
                <div className="input-group">
                    <label className="input-label" htmlFor="prompt-input">Text Prompt</label>
                    <textarea
                        id="prompt-input"
                        className="text-input"
                        placeholder="e.g. A modern minimalist chair with curved legs..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        disabled={isLoading}
                    />
                </div>

                {/* Image Upload */}
                <div className="input-group">
                    <label className="input-label">Reference Image (Optional)</label>
                    {!imageFile ? (
                        <div className="file-upload">
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isLoading}
                                id="image-upload-input"
                            />
                            <div className="file-upload-icon">📷</div>
                            <div className="file-upload-text">
                                Click or drag to upload a reference image
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--space-sm) var(--space-md)',
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                        }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                📷 {imageName}
                            </span>
                            <button
                                type="button"
                                className="btn"
                                onClick={clearImage}
                                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-full"
                    disabled={isLoading || (!prompt.trim() && !imageFile)}
                    id="generate-btn"
                >
                    {isLoading ? (
                        <>
                            <div className="loading-spinner" />
                            Generating Mesh...
                        </>
                    ) : (
                        <>✦ Generate 3D Model</>
                    )}
                </button>
            </form>
        </div>
    );
}
