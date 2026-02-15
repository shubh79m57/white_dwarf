import React, { Suspense, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

/**
 * Loads and displays a textured GLB or OBJ with applied texture image
 */
function TexturedModel({ modelUrl, textureUrl }) {
    // Try to load as GLB first, fall back to OBJ
    const isGlb = modelUrl.endsWith('.glb') || modelUrl.endsWith('.gltf');

    if (isGlb) {
        return <GltfModel url={modelUrl} />;
    }

    return <ObjWithTexture objUrl={modelUrl} textureUrl={textureUrl} />;
}

function GltfModel({ url }) {
    const gltf = useLoader(GLTFLoader, url);

    const scene = useMemo(() => {
        const cloned = gltf.scene.clone(true);
        // Normalize
        const box = new THREE.Box3().setFromObject(cloned);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        cloned.scale.setScalar(scale);
        const center = box.getCenter(new THREE.Vector3());
        cloned.position.sub(center.multiplyScalar(scale));
        return cloned;
    }, [gltf]);

    return <primitive object={scene} />;
}

function ObjWithTexture({ objUrl, textureUrl }) {
    const obj = useLoader(OBJLoader, objUrl);
    const texture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;

    const group = useMemo(() => {
        const g = new THREE.Group();

        obj.traverse((child) => {
            if (child.isMesh) {
                const mat = new THREE.MeshStandardMaterial({
                    color: 0xcccccc,
                    roughness: 0.5,
                    metalness: 0.1,
                });

                if (texture) {
                    mat.map = texture;
                    mat.color.set(0xffffff);
                }

                const mesh = new THREE.Mesh(child.geometry.clone(), mat);
                mesh.position.copy(child.position);
                mesh.rotation.copy(child.rotation);
                mesh.scale.copy(child.scale);
                g.add(mesh);
            }
        });

        // Normalize
        const box = new THREE.Box3().setFromObject(g);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        g.scale.setScalar(scale);
        const center = box.getCenter(new THREE.Vector3());
        g.position.sub(center.multiplyScalar(scale));

        return g;
    }, [obj, texture]);

    return <primitive object={group} />;
}

export default function TexturedViewer({ modelUrl, textureUrl }) {
    if (!modelUrl) return null;

    return (
        <div className="canvas-area" id="textured-viewer">
            <Canvas gl={{ antialias: true }} style={{ background: '#0a0a12' }}>
                <color attach="background" args={['#0a0a12']} />

                <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
                <OrbitControls enableDamping dampingFactor={0.05} />

                {/* Studio lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
                <directionalLight position={[-3, 4, -5]} intensity={0.4} color="#a29bfe" />
                <pointLight position={[0, -2, 3]} intensity={0.3} color="#00cec9" />

                <Suspense fallback={null}>
                    <TexturedModel modelUrl={modelUrl} textureUrl={textureUrl} />
                </Suspense>
            </Canvas>

            <div className="canvas-overlay">
                <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                }}>
                    TEXTURED MODE
                </span>
            </div>
        </div>
    );
}
