import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Central Futuristic Core (Icosahedron + Wireframe Outer Shell)
    const coreGroup = new THREE.Group();

    // Inner Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x38BDF8,
      emissive: 0x0284C7,
      emissiveIntensity: 0.8,
      shininess: 100,
      wireframe: false,
      transparent: true,
      opacity: 0.85
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // Outer Orbital Cage
    const outerGeo = new THREE.IcosahedronGeometry(1.9, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x3B82F6,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const outerCage = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerCage);

    // Outer Concentric Ring 1
    const ring1Geo = new THREE.TorusGeometry(2.6, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Outer Concentric Ring 2
    const ring2Geo = new THREE.TorusGeometry(3.2, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x818CF8, transparent: true, opacity: 0.4 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    scene.add(coreGroup);

    // 2. Orbiting Satellite Nodes (Files, Devices)
    const satellites = [];
    const satelliteColors = [0x38BDF8, 0x10B981, 0xF59E0B, 0x6366F1];
    const satelliteCount = 6;

    for (let i = 0; i < satelliteCount; i++) {
      const satGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
      const satMat = new THREE.MeshStandardMaterial({
        color: satelliteColors[i % satelliteColors.length],
        metalness: 0.8,
        roughness: 0.2
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);

      const angle = (i / satelliteCount) * Math.PI * 2;
      const radius = 3.6 + (i % 2) * 0.5;

      satMesh.position.x = Math.cos(angle) * radius;
      satMesh.position.y = Math.sin(angle) * radius;
      satMesh.position.z = (Math.random() - 0.5) * 1.5;

      scene.add(satMesh);
      satellites.push({ mesh: satMesh, angle, radius, speed: 0.008 + (i % 3) * 0.004 });
    }

    // 3. Background Floating Data Particle Field
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38BDF8,
      size: 0.05,
      transparent: true,
      opacity: 0.5
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38BDF8, 3, 20);
    pointLight.position.set(2, 4, 5);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x3B82F6, 2, 20);
    blueLight.position.set(-4, -2, -3);
    scene.add(blueLight);

    // 5. Mouse Parallax Reaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) / 100;
      mouseY = (e.clientY - windowHalfY) / 100;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        // Core Rotations
        innerCore.rotation.x += 0.005;
        innerCore.rotation.y += 0.008;

        outerCage.rotation.x -= 0.004;
        outerCage.rotation.y -= 0.006;

        ring1.rotation.z += 0.003;
        ring2.rotation.z -= 0.002;

        // Orbiting Satellites
        satellites.forEach((sat) => {
          sat.angle += sat.speed;
          sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
          sat.mesh.position.y = Math.sin(sat.angle) * sat.radius;
          sat.mesh.rotation.x += 0.01;
          sat.mesh.rotation.y += 0.02;
        });

        // Smooth Mouse Parallax
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        scene.rotation.y = targetX * 0.3;
        scene.rotation.x = targetY * 0.3;

        // Particle subtle pulse
        particleSystem.rotation.y += 0.0005;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center pointer-events-none">
      <div ref={mountRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}
