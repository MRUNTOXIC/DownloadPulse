import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Maximize2, RefreshCw, Eye } from 'lucide-react';

interface ThreeCanvasProps {
  interactive?: boolean;
  onTriggerPulse?: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ onTriggerPulse }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const outerRing1Ref = useRef<THREE.Mesh | null>(null);
  const outerRing2Ref = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const lightRef = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x09090b, 0.08);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa1a1aa, 1.2);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 3, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);
    lightRef.current = pointLight;

    // 1. Central Metallic Obsidian Core (Icosahedron / Octahedron)
    const coreGeometry = new THREE.IcosahedronGeometry(1.4, 1);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x18181b,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
      reflectivity: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // Inner wireframe overlay
    const wireframeGeo = new THREE.IcosahedronGeometry(1.42, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    coreMesh.add(wireframeMesh);

    // 2. Orbital Sync Rings (IDE & Mobile Data Channels)
    const ring1Geo = new THREE.TorusGeometry(2.3, 0.025, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xe4e4e7,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x27272a,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    scene.add(ring1);
    outerRing1Ref.current = ring1;

    const ring2Geo = new THREE.TorusGeometry(2.8, 0.018, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x18181b,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);
    outerRing2Ref.current = ring2;

    // 3. Floating Data Particles
    const particleCount = 150;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Mouse tilt interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      const y = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1);
      mouseX = x * 0.5;
      mouseY = y * 0.5;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (coreMeshRef.current) {
        if (isRotating) {
          coreMeshRef.current.rotation.y += delta * 0.5;
          coreMeshRef.current.rotation.x += delta * 0.2;
        }
        // Smooth target tilt based on mouse
        coreMeshRef.current.rotation.x += (mouseY - coreMeshRef.current.rotation.x) * 0.05;
        coreMeshRef.current.rotation.y += (mouseX - coreMeshRef.current.rotation.y) * 0.05;
      }

      if (outerRing1Ref.current) {
        outerRing1Ref.current.rotation.z += delta * 0.3;
        outerRing1Ref.current.rotation.y += delta * 0.1;
      }

      if (outerRing2Ref.current) {
        outerRing2Ref.current.rotation.z -= delta * 0.2;
        outerRing2Ref.current.rotation.x += delta * 0.15;
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.05;
      }

      // Dynamic light intensity breathing
      if (lightRef.current) {
        lightRef.current.intensity = 2.5 + Math.sin(elapsedTime * 3) * 0.8;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating]);

  // Handle wireframe toggle
  useEffect(() => {
    if (coreMeshRef.current) {
      const mat = coreMeshRef.current.material as THREE.MeshPhysicalMaterial;
      mat.wireframe = wireframeMode;
    }
  }, [wireframeMode]);

  // Pulse flash effect on click or trigger
  const handlePulse = () => {
    setPulseCount((prev) => prev + 1);
    if (lightRef.current) {
      lightRef.current.intensity = 10;
      setTimeout(() => {
        if (lightRef.current) lightRef.current.intensity = 2.5;
      }, 300);
    }
    if (onTriggerPulse) {
      onTriggerPulse();
    }
  };

  return (
    <div className="relative w-full h-[480px] lg:h-[580px] rounded-2xl bg-gradient-to-b from-zinc-950 via-zinc-900/90 to-black border border-white/10 shadow-2xl overflow-hidden flex flex-col justify-between group">
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-mono text-white/80">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>3D CORE ENGINE: ACTIVE</span>
          <span className="text-white/40">|</span>
          <span className="text-white/60">FPS: 60</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`px-4 py-1.5 rounded-full border text-xs font-mono uppercase tracking-widest flex items-center space-x-1.5 transition-all cursor-pointer ${
              wireframeMode
                ? 'bg-white text-black border-white shadow-lg'
                : 'bg-black/80 text-white/80 border-white/20 hover:border-white/40'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{wireframeMode ? 'Solid' : 'Wireframe'}</span>
          </button>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-2 rounded-full bg-black/80 border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all cursor-pointer"
            title="Toggle Auto Rotation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Canvas Mounting Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Interactive Bottom Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/20">
        <div className="flex items-center space-x-3 text-xs text-white/60 font-light">
          <Sparkles className="w-4 h-4 text-white" />
          <span>Interactive WebGL Model. Drag to orbit, hover for light reflections.</span>
        </div>

        <button
          onClick={handlePulse}
          className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest rounded-full transition-all transform active:scale-95 shadow-lg flex items-center space-x-2 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>EMIT DATA PULSE ({pulseCount})</span>
        </button>
      </div>
    </div>
  );
};
