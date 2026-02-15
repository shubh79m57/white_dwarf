import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

/**
 * Inner component that loads and displays the OBJ wireframe
 */
function WireframeMesh({ objUrl }) {
    const meshRef = useRef();
    const obj = useLoader(OBJLoader, objUrl);

    // Auto-rotate the mesh
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    // Convert all child meshes to wireframe
    const wireframeGroup = useMemo(() => {
        const group = new THREE.Group();

        obj.traverse((child) => {
            if (child.isMesh) {
                // Compute bounding box for normalization
                child.geometry.computeBoundingBox();
                child.geometry.computeBoundingSphere();

                // Wireframe material — white lines on black
                const wireframeMat = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.85,
                });

                // Edge highlight material for extra definition
                const edges = new THREE.EdgesGeometry(child.geometry, 15);
                const edgeMat = new THREE.LineBasicMaterial({
                    color: 0x6c5ce7,
                    transparent: true,
                    opacity: 0.3,
                });

                const wireframeMesh = new THREE.Mesh(child.geometry.clone(), wireframeMat);
                wireframeMesh.position.copy(child.position);
                wireframeMesh.rotation.copy(child.rotation);
                wireframeMesh.scale.copy(child.scale);

                const edgeLine = new THREE.LineSegments(edges, edgeMat);
                edgeLine.position.copy(child.position);
                edgeLine.rotation.copy(child.rotation);
                edgeLine.scale.copy(child.scale);

                group.add(wireframeMesh);
                group.add(edgeLine);
            }
        });

        // Normalize scale so it fits nicely in the viewport
        const box = new THREE.Box3().setFromObject(group);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        group.scale.setScalar(scale);

        // Center the group
        const center = box.getCenter(new THREE.Vector3());
        group.position.sub(center.multiplyScalar(scale));

        return group;
    }, [obj]);

    return <primitive ref={meshRef} object={wireframeGroup} />;
}

/**
 * Loading placeholder while the OBJ is being parsed
 */
function LoadingFallback() {
    const meshRef = useRef();

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.5;
            meshRef.current.rotation.y += delta * 0.7;
        }
    });

    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial color="#6c5ce7" wireframe />
        </mesh>
    );
}

/**
 * WireframeViewer — Main component
 * Renders a .obj file as a rotating black-and-white wireframe
 */
export default function WireframeViewer({ objUrl, onApprove, approved }) {
    return (
        <div className="canvas-area" id="wireframe-viewer">
            <Canvas
                gl={{ antialias: true, alpha: false }}
                style={{ background: '#050508' }}
            >
                <color attach="background" args={['#050508']} />

                <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={2}
                    maxDistance={15}
                    autoRotate={false}
                />

                {/* Subtle ambient + point lights for edge definition */}
                <ambientLight intensity={0.1} />
                <pointLight position={[10, 10, 10]} intensity={0.3} color="#6c5ce7" />
                <pointLight position={[-10, -5, 5]} intensity={0.15} color="#00cec9" />

                {/* Grid for spatial reference */}
                <gridHelper args={[20, 40, '#1a1a2e', '#111122']} position={[0, -1.5, 0]} />

                <Suspense fallback={<LoadingFallback />}>
                    {objUrl && <WireframeMesh objUrl={objUrl} />}
                </Suspense>
            </Canvas>

            {/* Overlay buttons */}
            {objUrl && (
                <div className="canvas-overlay">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            color: 'var(--text-muted)',
                            background: 'rgba(0,0,0,0.6)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                        }}>
                            WIREFRAME MODE
                        </span>
                    </div>

                    {!approved && onApprove && (
                        <button
                            className="btn btn-success btn-lg"
                            onClick={onApprove}
                            id="approve-wireframe-btn"
                        >
                            ✓ Approve Wireframe
                        </button>
                    )}

                    {approved && (
                        <span className="physics-badge stable" style={{ fontSize: '0.78rem' }}>
                            ✓ Wireframe Approved
                        </span>
                    )}
                </div>
            )}

            {/* Empty state */}
            {!objUrl && (
                <div className="welcome-state" style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
                    <div className="welcome-icon">✦</div>
                    <h2 className="welcome-title gradient-text">Ready to Create</h2>
                    <p className="welcome-desc">
                        Enter a text prompt or upload a reference image to generate a 3D model.
                        The wireframe will appear here for your review.
                    </p>
                </div>
            )}
        </div>
    );
}
