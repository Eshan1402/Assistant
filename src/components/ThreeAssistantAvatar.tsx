import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeAssistantAvatarProps {
  mood?: 'idle' | 'speaking' | 'thinking' | 'alert';
  isSpeaking?: boolean;
  onAvatarClick?: () => void;
  className?: string;
}

export const ThreeAssistantAvatar: React.FC<ThreeAssistantAvatarProps> = ({
  mood = 'idle',
  isSpeaking = false,
  onAvatarClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const headGroupRef = useRef<THREE.Group | null>(null);
  const coreReactorRef = useRef<THREE.Mesh | null>(null);
  const visorMeshRef = useRef<THREE.Mesh | null>(null);
  const leftEyeRef = useRef<THREE.Mesh | null>(null);
  const rightEyeRef = useRef<THREE.Mesh | null>(null);
  const mouthWaveformGroupRef = useRef<THREE.Group | null>(null);
  const mouthBarsRef = useRef<THREE.Mesh[]>([]);
  const ring1Ref = useRef<THREE.Mesh | null>(null);
  const ring2Ref = useRef<THREE.Mesh | null>(null);
  const haloRingRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const lightsRef = useRef<{ point1: THREE.PointLight; point2: THREE.PointLight } | null>(null);

  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isHovered = useRef(false);
  const animFrameId = useRef<number | null>(null);
  const clockRef = useRef(new THREE.Clock());

  const [interactionFeedback, setInteractionFeedback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // 1. Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 5.2);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and alpha transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x281c52, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xa855f7, 3.0);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    const pointLight1 = new THREE.PointLight(0xd946ef, 3, 8);
    pointLight1.position.set(0, 0.2, 1.8);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x6366f1, 2, 8);
    pointLight2.position.set(0, -1.2, 1.2);
    scene.add(pointLight2);

    lightsRef.current = { point1: pointLight1, point2: pointLight2 };

    // 5. Materials
    const chassisMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x140c2b,
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
      reflectivity: 0.8,
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8b4fe,
      metalness: 0.95,
      roughness: 0.1,
    });

    const glowingNeonCyan = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    const glowingNeonPink = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
    });

    const glowingPurpleCore = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      emissive: 0xa855f7,
      emissiveIntensity: 2.2,
      roughness: 0.2,
      metalness: 0.5,
    });

    const visorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x070312,
      roughness: 0.05,
      metalness: 0.9,
      transmission: 0.4,
      transparent: true,
      opacity: 0.92,
      clearcoat: 1.0,
    });

    // 6. Build 3D Character Rig
    const characterGroup = new THREE.Group();
    characterGroupRef.current = characterGroup;
    scene.add(characterGroup);

    // --- HEAD RIG ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.45, 0);
    headGroupRef.current = headGroup;
    characterGroup.add(headGroup);

    // Main Head Helmet (Rounded Futuristic Geometry)
    const headGeo = new THREE.SphereGeometry(0.85, 32, 32);
    headGeo.scale(1.0, 1.08, 0.95);
    const headMesh = new THREE.Mesh(headGeo, chassisMaterial);
    headGroup.add(headMesh);

    // Dark Visor Face Screen (Curved Front Plate)
    const visorGeo = new THREE.SphereGeometry(0.72, 32, 24, 0, Math.PI, 0, Math.PI * 0.7);
    const visorMesh = new THREE.Mesh(visorGeo, visorMaterial);
    visorMesh.rotation.y = -Math.PI / 2;
    visorMesh.position.set(0, 0.02, 0.26);
    visorMesh.scale.set(0.98, 0.95, 1.0);
    visorMeshRef.current = visorMesh;
    headGroup.add(visorMesh);

    // Visor Rim Trim
    const visorRimGeo = new THREE.TorusGeometry(0.68, 0.025, 16, 40, Math.PI * 1.1);
    const visorRim = new THREE.Mesh(visorRimGeo, chromeMaterial);
    visorRim.rotation.x = Math.PI * 0.05;
    visorRim.rotation.z = Math.PI * 0.45;
    visorRim.position.set(0, 0.04, 0.65);
    headGroup.add(visorRim);

    // Cybernetic Glowing Eyes
    const eyeGeo = new THREE.CapsuleGeometry(0.065, 0.14, 16, 16);
    
    // Left Eye
    const leftEye = new THREE.Mesh(eyeGeo, glowingNeonCyan);
    leftEye.rotation.z = Math.PI / 2.2;
    leftEye.position.set(-0.25, 0.12, 0.75);
    leftEyeRef.current = leftEye;
    headGroup.add(leftEye);

    // Right Eye
    const rightEye = new THREE.Mesh(eyeGeo, glowingNeonCyan);
    rightEye.rotation.z = -Math.PI / 2.2;
    rightEye.position.set(0.25, 0.12, 0.75);
    rightEyeRef.current = rightEye;
    headGroup.add(rightEye);

    // Visor Voice Soundwave Visualizer Bars (Mouth Area)
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, -0.16, 0.76);
    mouthWaveformGroupRef.current = mouthGroup;
    headGroup.add(mouthGroup);

    const bars: THREE.Mesh[] = [];
    const barGeo = new THREE.BoxGeometry(0.025, 0.08, 0.02);
    for (let i = -3; i <= 3; i++) {
      const bar = new THREE.Mesh(barGeo, glowingNeonCyan);
      bar.position.set(i * 0.045, 0, 0);
      mouthGroup.add(bar);
      bars.push(bar);
    }
    mouthBarsRef.current = bars;

    // Ear Pods / Audio Sensor Cannons (Left & Right)
    const earGeo = new THREE.CylinderGeometry(0.2, 0.24, 0.15, 32);
    earGeo.rotateZ(Math.PI / 2);
    
    // Left Ear
    const leftEar = new THREE.Mesh(earGeo, chassisMaterial);
    leftEar.position.set(-0.85, 0.05, 0);
    headGroup.add(leftEar);
    const leftEarRing = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.02, 16, 32), glowingNeonCyan);
    leftEarRing.rotation.y = Math.PI / 2;
    leftEarRing.position.set(-0.93, 0.05, 0);
    headGroup.add(leftEarRing);

    // Right Ear
    const rightEar = new THREE.Mesh(earGeo, chassisMaterial);
    rightEar.position.set(0.85, 0.05, 0);
    headGroup.add(rightEar);
    const rightEarRing = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.02, 16, 32), glowingNeonCyan);
    rightEarRing.rotation.y = Math.PI / 2;
    rightEarRing.position.set(0.93, 0.05, 0);
    headGroup.add(rightEarRing);

    // Floating Sensor Halo / Antenna Ring above head
    const haloGeo = new THREE.TorusGeometry(0.55, 0.02, 16, 64);
    const halo = new THREE.Mesh(haloGeo, chromeMaterial);
    halo.rotation.x = Math.PI / 2.3;
    halo.position.set(0, 0.95, -0.05);
    haloRingRef.current = halo;
    headGroup.add(halo);

    // --- FLOATING TORSO & QUANTUM REACTOR CORE ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.75, 0);
    characterGroup.add(torsoGroup);

    // Floating Collar Neck Joint
    const collarGeo = new THREE.CylinderGeometry(0.35, 0.42, 0.18, 32);
    const collar = new THREE.Mesh(collarGeo, chromeMaterial);
    collar.position.set(0, 0.42, 0);
    torsoGroup.add(collar);

    // Main Floating Torso Shell
    const chestGeo = new THREE.CylinderGeometry(0.65, 0.28, 0.75, 32);
    chestGeo.scale(1.1, 1.0, 0.85);
    const chestMesh = new THREE.Mesh(chestGeo, chassisMaterial);
    chestMesh.position.set(0, 0, 0);
    torsoGroup.add(chestMesh);

    // Central Glowing Arc Reactor Core
    const reactorGeo = new THREE.SphereGeometry(0.22, 32, 32);
    const coreReactor = new THREE.Mesh(reactorGeo, glowingPurpleCore);
    coreReactor.position.set(0, 0.08, 0.38);
    coreReactorRef.current = coreReactor;
    torsoGroup.add(coreReactor);

    const reactorRingGeo = new THREE.TorusGeometry(0.28, 0.025, 16, 32);
    const reactorRing = new THREE.Mesh(reactorRingGeo, chromeMaterial);
    reactorRing.position.set(0, 0.08, 0.38);
    torsoGroup.add(reactorRing);

    // Floating Gyroscope Orbital Rings (Orbiting the Avatar)
    const ring1Geo = new THREE.TorusGeometry(1.65, 0.015, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.65 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1Ref.current = ring1;
    characterGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.45, 0.012, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    ring2Ref.current = ring2;
    characterGroup.add(ring2);

    // Background Cyber Particles / Cosmic Dust
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd8b4fe,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // 7. Mouse and Pointer tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current.targetX = Math.max(-1.5, Math.min(1.5, x));
      mousePos.current.targetY = Math.max(-1.5, Math.min(1.5, y));
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (!isHovered.current) {
        mousePos.current.targetX = x * 0.8;
        mousePos.current.targetY = y * 0.8;
      }
    };

    const handleMouseEnter = () => {
      isHovered.current = true;
    };

    const handleMouseLeave = () => {
      isHovered.current = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', handleGlobalMouseMove);

    // Handle container resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth || 360;
      const newHeight = container.clientHeight || 360;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. Animation & Render Loop
    let blinkTimer = 0;
    let isBlinking = false;

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clockRef.current.getElapsedTime();

      // Smooth mouse interpolation (Lerp)
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.06;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.06;

      // Natural Harmonic Floating (Sine wave bobbing)
      if (characterGroupRef.current) {
        characterGroupRef.current.position.y = Math.sin(elapsedTime * 1.8) * 0.12;
        characterGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.8) * 0.08;
      }

      // Head tracking cursor smoothly in 3D
      if (headGroupRef.current) {
        headGroupRef.current.rotation.y = mousePos.current.x * 0.65;
        headGroupRef.current.rotation.x = -mousePos.current.y * 0.45;
        headGroupRef.current.rotation.z = -mousePos.current.x * 0.15;
      }

      // Blinking animation logic
      blinkTimer += 0.016;
      if (blinkTimer > 3.5 + Math.sin(elapsedTime) * 1.5) {
        isBlinking = true;
        blinkTimer = 0;
      }
      if (isBlinking && blinkTimer > 0.14) {
        isBlinking = false;
      }

      const eyeScaleY = isBlinking ? 0.08 : 1.0;
      if (leftEyeRef.current) leftEyeRef.current.scale.y = eyeScaleY;
      if (rightEyeRef.current) rightEyeRef.current.scale.y = eyeScaleY;

      // Voice Soundwave Bar Animation when speaking
      if (mouthBarsRef.current.length > 0) {
        mouthBarsRef.current.forEach((bar, index) => {
          if (isSpeaking) {
            const freq = Math.sin(elapsedTime * 14 + index * 1.2) * 0.5 + 0.5;
            bar.scale.y = 0.4 + freq * 2.2;
            (bar.material as THREE.MeshBasicMaterial).color.setHex(0xf43f5e);
          } else {
            bar.scale.y = 0.25;
            (bar.material as THREE.MeshBasicMaterial).color.setHex(0x38bdf8);
          }
        });
      }

      // Core Reactor Pulsing
      if (coreReactorRef.current) {
        const pulse = Math.sin(elapsedTime * (isSpeaking ? 7.0 : 3.0)) * 0.15 + 1.0;
        coreReactorRef.current.scale.set(pulse, pulse, pulse);
      }

      // Orbiting Gyroscope Rings Rotation
      if (ring1Ref.current) {
        ring1Ref.current.rotation.z = elapsedTime * 0.35;
        ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.5) * 0.1;
      }
      if (ring2Ref.current) {
        ring2Ref.current.rotation.z = -elapsedTime * 0.45;
        ring2Ref.current.rotation.y = elapsedTime * 0.3;
      }
      if (haloRingRef.current) {
        haloRingRef.current.rotation.z = elapsedTime * 0.8;
      }

      // Particle floating drift
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.04;
      }

      // Point lights reaction
      if (lightsRef.current) {
        lightsRef.current.point1.intensity = 2.5 + Math.sin(elapsedTime * 4) * 0.8;
        if (isSpeaking) {
          lightsRef.current.point1.color.setHex(0xf43f5e);
        } else {
          lightsRef.current.point1.color.setHex(0xd946ef);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [isSpeaking]);

  // Click trigger animation
  const handleClick = () => {
    setInteractionFeedback(true);
    setTimeout(() => setInteractionFeedback(false), 800);

    if (headGroupRef.current) {
      headGroupRef.current.position.y += 0.08;
      setTimeout(() => {
        if (headGroupRef.current) headGroupRef.current.position.y -= 0.08;
      }, 250);
    }

    if (onAvatarClick) {
      onAvatarClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer select-none group ${className}`}
      title="Click to interact with your 3D CareerOS Assistant"
    >
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full h-72 sm:h-80 md:h-96 flex items-center justify-center relative overflow-hidden"
      />

      {/* Floating Holographic Ring Base Glow in CSS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-44 h-8 bg-purple-600/30 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/50 transition-all duration-500" />

      {/* Interactive feedback badge on click */}
      {interactionFeedback && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-pink-500 text-white text-[11px] font-bold shadow-lg shadow-pink-950 animate-bounce">
          ⚡ System Listening!
        </div>
      )}
    </div>
  );
};
