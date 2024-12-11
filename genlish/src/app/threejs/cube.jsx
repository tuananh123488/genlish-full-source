// components/UrbanBlock.js
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const UrbanBlock = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        // Create the scene
        const scene = new THREE.Scene();

        // Set up the camera
        const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
        camera.position.z = 10;
        camera.position.y = 5;

        // Set up the renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(800, 600);
        mountRef.current.appendChild(renderer.domElement);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        // scene.add(directionalLight);

        // Create the building base (this is just an example)
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const building = new THREE.Mesh(geometry, material);
        scene.add(building);

        // Positioning the building
        building.position.set(0, 1, 0);

        // Render loop
        const animate = function () {
            requestAnimationFrame(animate);

            // You can add rotation or other animations here
            building.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();

        // Cleanup on unmount
        return () => {
            mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} />;
};

export default UrbanBlock;
