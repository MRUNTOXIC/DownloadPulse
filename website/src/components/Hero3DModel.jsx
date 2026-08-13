import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DModel() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 580;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 9.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Metallic Silver Core
    const coreGroup = new THREE.Group();

    // Central Core Sphere
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 3);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
      emissive: 0x444444,
      emissiveIntensity: 0.8,
      shininess: 120,
      wireframe: false,
      transparent: true,
      opacity: 0.9
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Outer Silver Wireframe Shell
    const cageGeo = new THREE.IcosahedronGeometry(1.9, 2);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    // Concentric Ring 1
    const ring1Geo = new THREE.TorusGeometry(2.7, 0.025, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.7 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Concentric Ring 2
    const ring2Geo = new THREE.TorusGeometry(3.3, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xCCCCCC, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    mainGroup.add(coreGroup);

    // 2. Floating 3D MacBook (Left Side)
    const macGroup = new THREE.Group();
    macGroup.position.set(-4.2, 0.3, 0);

    // MacBook Base
    const macBaseGeo = new THREE.BoxGeometry(1.7, 0.08, 1.2);
    const macBaseMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.95, roughness: 0.1 });
    const macBase = new THREE.Mesh(macBaseGeo, macBaseMat);
    macGroup.add(macBase);

    // MacBook Screen Lid
    const macScreenGeo = new THREE.BoxGeometry(1.6, 1.05, 0.06);
    const macScreenMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.95, roughness: 0.1 });
    const macScreen = new THREE.Mesh(macScreenGeo, macScreenMat);
    macScreen.position.set(0, 0.58, -0.55);
    macScreen.rotation.x = -0.18;
    macGroup.add(macScreen);

    // MacBook Display Screen Glow
    const macDisplayGeo = new THREE.PlaneGeometry(1.45, 0.9);
    const macDisplayMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.85 });
    const macDisplay = new THREE.Mesh(macDisplayGeo, macDisplayMat);
    macDisplay.position.set(0, 0.58, -0.51);
    macDisplay.rotation.x = -0.18;
    macGroup.add(macDisplay);

    mainGroup.add(macGroup);

    // 3. Floating 3D iPhone (Right Side)
    const phoneGroup = new THREE.Group();
    phoneGroup.position.set(4.2, -0.3, 0);

    // Phone Frame
    const phoneGeo = new THREE.BoxGeometry(0.75, 1.45, 0.08);
    const phoneMat = new THREE.MeshStandardMaterial({ color: 0x151515, metalness: 0.95, roughness: 0.1 });
    const phoneMesh = new THREE.Mesh(phoneGeo, phoneMat);
    phoneGroup.add(phoneMesh);

    // Phone Screen Panel
    const phoneScreenGeo = new THREE.PlaneGeometry(0.66, 1.34);
    const phoneScreenMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.9 });
    const phoneScreen = new THREE.Mesh(phoneScreenGeo, phoneScreenMat);
    phoneScreen.position.z = 0.045;
    phoneGroup.add(phoneScreen);

    mainGroup.add(phoneGroup);

    // 4. Data Flow Tube Connecting MacBook -> Core -> iPhone
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.2, 0.5, 0),
      new THREE.Vector3(-2.1, 1.1, 0.4),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2.1, -1.1, 0.4),
      new THREE.Vector3(4.2, -0.3, 0)
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.02, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.65 });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    mainGroup.add(tubeMesh);

    // 5. Orbiting Metallic File Cubes
    const fileCubes = [];
    for (let i = 0; i < 6; i++) {
      const cubeGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
      const cubeMat = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x666666,
        emissiveIntensity: 0.4
      });
      const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);

      const angle = (i / 6) * Math.PI * 2;
      const radius = 3.3 + (i % 2) * 0.4;
      cubeMesh.position.x = Math.cos(angle) * radius;
      cubeMesh.position.y = Math.sin(angle) * radius;
      cubeMesh.position.z = (Math.random() - 0.5) * 1.5;

      mainGroup.add(cubeMesh);
      fileCubes.push({ mesh: cubeMesh, angle, radius, speed: 0.007 + (i % 3) * 0.003 });
    }

    // 6. Particle Field
    const particleCount = 300;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 22;
      particlePositions[i + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const whiteLight1 = new THREE.PointLight(0xffffff, 4, 30);
    whiteLight1.position.set(4, 5, 8);
    scene.add(whiteLight1);

    const whiteLight2 = new THREE.PointLight(0x888888, 3, 30);
    whiteLight2.position.set(-4, -4, 6);
    scene.add(whiteLight2);

    // Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) / 110;
      mouseY = (e.clientY - windowHalfY) / 110;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        coreMesh.rotation.x += 0.005;
        coreMesh.rotation.y += 0.008;

        cageMesh.rotation.x -= 0.004;
        cageMesh.rotation.y -= 0.006;

        ring1.rotation.z += 0.004;
        ring2.rotation.z -= 0.003;

        const time = Date.now() * 0.0015;
        macGroup.position.y = 0.3 + Math.sin(time) * 0.15;
        phoneGroup.position.y = -0.3 + Math.cos(time) * 0.15;

        fileCubes.forEach((cube) => {
          cube.angle += cube.speed;
          cube.mesh.position.x = Math.cos(cube.angle) * cube.radius;
          cube.mesh.position.y = Math.sin(cube.angle) * cube.radius;
          cube.mesh.rotation.x += 0.015;
          cube.mesh.rotation.y += 0.025;
        });

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        mainGroup.rotation.y = targetX * 0.25;
        mainGroup.rotation.x = targetY * 0.25;

        particleSystem.rotation.y += 0.0005;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      coreGeo.dispose();
      coreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      macBaseGeo.dispose();
      macBaseMat.dispose();
      macScreenGeo.dispose();
      macScreenMat.dispose();
      macDisplayGeo.dispose();
      macDisplayMat.dispose();
      phoneGeo.dispose();
      phoneMat.dispose();
      phoneScreenGeo.dispose();
      phoneScreenMat.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[480px] md:h-[580px] flex items-center justify-center pointer-events-none my-4">
      <div ref={mountRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}
