import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRExportPanel({ exportResult, isExporting, onExport }) {
    if (!exportResult && !isExporting) {
        return (
            <div className="panel glass-card animate-fade-in-up">
                <div className="panel-header">
                    <div className="panel-icon rose">📱</div>
                    <div>
                        <div className="panel-title">VR / AR Export</div>
                        <div className="panel-subtitle">Generate QR code for instant AR experience</div>
                    </div>
                </div>
                <button
                    className="btn btn-primary btn-lg btn-full"
                    onClick={onExport}
                    id="export-btn"
                >
                    📱 Export for AR
                </button>
            </div>
        );
    }

    if (isExporting) {
        return (
            <div className="panel glass-card animate-fade-in-up">
                <div className="panel-header">
                    <div className="panel-icon rose">📱</div>
                    <div>
                        <div className="panel-title">VR / AR Export</div>
                        <div className="panel-subtitle">Converting and generating QR code...</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', justifyContent: 'center', padding: 'var(--space-lg)' }}>
                    <div className="loading-spinner" />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Exporting...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="panel glass-card animate-fade-in-up">
            <div className="panel-header">
                <div className="panel-icon rose">📱</div>
                <div>
                    <div className="panel-title">VR / AR Export</div>
                    <div className="panel-subtitle">Scan the QR code for an instant AR experience</div>
                </div>
            </div>

            <div className="qr-container">
                {/* QR Code */}
                {exportResult.public_url && (
                    <div className="qr-code-wrapper">
                        <QRCodeSVG
                            value={exportResult.public_url}
                            size={180}
                            bgColor="#ffffff"
                            fgColor="#0a0a0f"
                            level="H"
                            includeMargin={false}
                        />
                    </div>
                )}

                <p className="qr-instructions">
                    Scan with your phone camera to view in AR.
                    <br />
                    Works on iOS (Safari) and Android (Chrome).
                </p>

                {/* Download Buttons */}
                <div className="download-buttons">
                    {exportResult.glb_url && (
                        <a
                            href={exportResult.glb_url}
                            download
                            className="btn btn-lg"
                            style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
                            id="download-glb-btn"
                        >
                            ⬇ .GLB (Android)
                        </a>
                    )}
                    {exportResult.usdz_url && (
                        <a
                            href={exportResult.usdz_url}
                            download
                            className="btn btn-lg"
                            style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
                            id="download-usdz-btn"
                        >
                            ⬇ .USDZ (iOS)
                        </a>
                    )}
                </div>

                {!exportResult.usdz_url && exportResult.glb_url && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Note: USDZ export is not available on this platform. GLB is ready for download.
                    </p>
                )}
            </div>
        </div>
    );
}
