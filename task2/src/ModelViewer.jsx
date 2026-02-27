import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ModelViewer() {
    const mountRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [loadTime, setLoadTime] = useState(null);

    useEffect(() => {
        let currentMount = mountRef.current;
        if (!currentMount) return;

        // Set up scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f4f8);

        // Set up camera
        const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
        camera.position.set(0, 2, 8);

        // Set up renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(2, 5, 3).normalize();
        scene.add(directionalLight);

        // Load Model
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        const start = performance.now();
        let model;

        gltfLoader.load('/model-compressed.glb', (gltf) => {
            model = gltf.scene;

            // Center and scale the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 4 / maxDim; // scale to fit nicely
            model.scale.set(scale, scale, scale);
            model.position.sub(center.multiplyScalar(scale));

            scene.add(model);

            const timeTaken = (performance.now() - start).toFixed(2);
            console.log(`Model loaded in ${timeTaken}ms`);
            setLoadTime(timeTaken);
            setLoading(false);
        }, undefined, (error) => {
            console.error('Error loading model:', error);
            setLoading(false);
        });

        // Handle resize
        const onWindowResize = () => {
            if (!currentMount) return;
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener('resize', onWindowResize);

        // Animation loop
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            if (model) {
                model.rotation.y += 0.01;
                model.rotation.x += 0.005;
            }
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', onWindowResize);
            if (animationId) cancelAnimationFrame(animationId);
            controls.dispose();

            if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }

            // Dispose materials/geometries
            scene.traverse((child) => {
                if (child.isMesh) {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => mat.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                }
            });

            renderer.dispose();
            dracoLoader.dispose();
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {loading && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', zIndex: 10
                }}>
                    <div className="animate-spin inline-block w-16 h-16 border-[6px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading"></div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-800 tracking-wide">Loading 3D Model...</h2>
                </div>
            )}
            {!loading && loadTime && (
                <div style={{
                    position: 'absolute', top: 24, left: 24, padding: '12px 20px',
                    background: 'rgba(15, 23, 42, 0.85)', color: 'white', borderRadius: 12,
                    zIndex: 10, backdropFilter: 'blur(8px)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontFamily: 'monospace', fontSize: '14px', fontWeight: '500'
                }}>
                    <span style={{ color: '#60a5fa' }}>Load Time:</span> {loadTime}ms
                </div>
            )}
            <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}
