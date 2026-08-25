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
  const leftEyeRef = useRef<THREE.Mesh | null>(null);
  const rightEyeRef = useRef<THREE.Mesh | null>(null);
  const copterBladeRef = useRef<THREE.Mesh | null>(null);
  const armGroupRef = useRef<THREE.Group | null>(null);

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
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.6, 5.5);
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
    renderer.toneMappingExposure = 1.2;
    
    // Enable Shadows for realism
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Realistic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(5, 10, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xccddff, 1.8);
    fillLight.position.set(-8, 4, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffccaa, 2.5);
    rimLight.position.set(0, 6, -8);
    scene.add(rimLight);

    // 5. High-Gloss Realistic Toy Materials
    const bluePlastic = new THREE.MeshPhysicalMaterial({
      color: 0x008be3,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.5,
    });
    const whitePlastic = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.5,
    });
    const redPlastic = new THREE.MeshPhysicalMaterial({
      color: 0xff3838,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 0.8,
      envMapIntensity: 1.5,
    });
    const goldMetal = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      roughness: 0.1,
      metalness: 0.9,
      envMapIntensity: 2.0,
    });
    const yellowPlastic = new THREE.MeshPhysicalMaterial({
      color: 0xffe600,
      roughness: 0.2,
      metalness: 0.1,
      envMapIntensity: 1.0,
    });
    const blackPlastic = new THREE.MeshBasicMaterial({ color: 0x222222 });

    // 6. Build Doraemon 3D Rig
    const characterGroup = new THREE.Group();
    characterGroupRef.current = characterGroup;
    scene.add(characterGroup);

    // --- HEAD RIG ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.7, 0);
    headGroupRef.current = headGroup;
    characterGroup.add(headGroup);

    // Blue Head Sphere
    const headGeo = new THREE.SphereGeometry(0.85, 64, 64);
    const headMesh = new THREE.Mesh(headGeo, bluePlastic);
    headGroup.add(headMesh);

    // White Face Sphere
    const faceGeo = new THREE.SphereGeometry(0.72, 64, 64);
    const faceMesh = new THREE.Mesh(faceGeo, whitePlastic);
    faceMesh.position.set(0, -0.1, 0.18);
    headGroup.add(faceMesh);

    // Eyes (Black ovals)
    const eyeSphereGeo = new THREE.SphereGeometry(0.12, 32, 32);
    
    // Left Eye Area (White base)
    const leftEyeBase = new THREE.Mesh(eyeSphereGeo, whitePlastic);
    leftEyeBase.scale.set(1.4, 1.8, 0.5);
    leftEyeBase.position.set(-0.2, 0.3, 0.8);
    headGroup.add(leftEyeBase);
    
    const leftEye = new THREE.Mesh(eyeSphereGeo, blackPlastic);
    leftEye.scale.set(0.4, 0.8, 0.2);
    leftEye.position.set(-0.15, 0.25, 0.86);
    leftEyeRef.current = leftEye;
    headGroup.add(leftEye);

    // Right Eye Area (White base)
    const rightEyeBase = new THREE.Mesh(eyeSphereGeo, whitePlastic);
    rightEyeBase.scale.set(1.4, 1.8, 0.5);
    rightEyeBase.position.set(0.2, 0.3, 0.8);
    headGroup.add(rightEyeBase);

    const rightEye = new THREE.Mesh(eyeSphereGeo, blackPlastic);
    rightEye.scale.set(0.4, 0.8, 0.2);
    rightEye.position.set(0.15, 0.25, 0.86);
    rightEyeRef.current = rightEye;
    headGroup.add(rightEye);

    // Nose (Red Sphere)
    const noseGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const nose = new THREE.Mesh(noseGeo, redPlastic);
    nose.position.set(0, 0.05, 0.9);
    headGroup.add(nose);

    // Whiskers
    const whiskerGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.45, 8);
    const createWhisker = (x: number, y: number, zRot: number) => {
      const w = new THREE.Mesh(whiskerGeo, blackPlastic);
      w.position.set(x, y, 0.82);
      w.rotation.z = zRot;
      w.rotation.y = x > 0 ? -0.2 : 0.2;
      return w;
    };
    headGroup.add(
      createWhisker(-0.4, 0.0, Math.PI / 2),
      createWhisker(-0.4, 0.15, Math.PI / 2.2),
      createWhisker(-0.4, -0.15, Math.PI / 1.8),
      createWhisker(0.4, 0.0, -Math.PI / 2),
      createWhisker(0.4, 0.15, -Math.PI / 2.2),
      createWhisker(0.4, -0.15, -Math.PI / 1.8)
    );

    // Smile (Mouth line)
    const mouthGeo = new THREE.TorusGeometry(0.4, 0.015, 16, 64, Math.PI * 0.8);
    const mouth = new THREE.Mesh(mouthGeo, blackPlastic);
    mouth.position.set(0, 0.15, 0.83);
    mouth.rotation.z = -Math.PI * 0.9;
    headGroup.add(mouth);
    const noseLineGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.35, 8);
    const noseLine = new THREE.Mesh(noseLineGeo, blackPlastic);
    noseLine.position.set(0, -0.1, 0.9);
    headGroup.add(noseLine);

    // Bamboo Copter (Take-copter)
    const copterGroup = new THREE.Group();
    copterGroup.position.set(0, 0.83, 0);
    const baseGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 32);
    const base = new THREE.Mesh(baseGeo, yellowPlastic);
    copterGroup.add(base);
    const stickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 16);
    const stick = new THREE.Mesh(stickGeo, yellowPlastic);
    stick.position.set(0, 0.1, 0);
    copterGroup.add(stick);
    const bladeGeo = new THREE.BoxGeometry(0.8, 0.02, 0.06);
    const blade = new THREE.Mesh(bladeGeo, yellowPlastic);
    blade.position.set(0, 0.2, 0);
    copterGroup.add(blade);
    copterBladeRef.current = blade;
    headGroup.add(copterGroup);

    // --- TORSO RIG ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.4, 0);
    characterGroup.add(torsoGroup);

    // Blue Body
    const bodyGeo = new THREE.CylinderGeometry(0.55, 0.65, 0.9, 64);
    const bodyMesh = new THREE.Mesh(bodyGeo, bluePlastic);
    torsoGroup.add(bodyMesh);

    // White Belly
    const bellyGeo = new THREE.SphereGeometry(0.5, 64, 64);
    const bellyMesh = new THREE.Mesh(bellyGeo, whitePlastic);
    bellyMesh.scale.set(1.0, 0.85, 0.4);
    bellyMesh.position.set(0, 0, 0.45);
    torsoGroup.add(bellyMesh);

    // 4D Pocket
    const pocketGeo = new THREE.SphereGeometry(0.38, 32, 16, 0, Math.PI);
    const pocketMesh = new THREE.Mesh(pocketGeo, whitePlastic);
    pocketMesh.rotation.x = Math.PI / 2;
    pocketMesh.scale.set(1.0, 0.25, 1.0);
    pocketMesh.position.set(0, -0.15, 0.58);
    const pocketLine = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.012, 16, 32, Math.PI), blackPlastic);
    pocketLine.rotation.z = Math.PI;
    pocketMesh.add(pocketLine);
    torsoGroup.add(pocketMesh);

    // Red Collar
    const collarGeo = new THREE.TorusGeometry(0.58, 0.08, 32, 64);
    const collar = new THREE.Mesh(collarGeo, redPlastic);
    collar.position.set(0, 0.45, 0);
    collar.rotation.x = Math.PI / 2;
    torsoGroup.add(collar);

    // Gold Bell
    const bellGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const bell = new THREE.Mesh(bellGeo, goldMetal);
    bell.position.set(0, 0.3, 0.62);
    const bellLine1 = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.015, 16, 32), blackPlastic);
    bellLine1.rotation.x = Math.PI / 2;
    bellLine1.position.set(0, 0.05, 0);
    bell.add(bellLine1);
    const bellLine2 = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.015, 16, 32), blackPlastic);
    bellLine2.rotation.x = Math.PI / 2;
    bellLine2.position.set(0, -0.05, 0);
    bell.add(bellLine2);
    const bellDot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), blackPlastic);
    bellDot.position.set(0, -0.12, 0.15);
    bell.add(bellDot);
    torsoGroup.add(bell);

    // Legs and Feet
    const footGeo = new THREE.SphereGeometry(0.25, 32, 32);
    const leftFoot = new THREE.Mesh(footGeo, whitePlastic);
    leftFoot.scale.set(1.0, 0.6, 1.2);
    leftFoot.position.set(-0.3, -0.5, 0.1);
    torsoGroup.add(leftFoot);
    const rightFoot = new THREE.Mesh(footGeo, whitePlastic);
    rightFoot.scale.set(1.0, 0.6, 1.2);
    rightFoot.position.set(0.3, -0.5, 0.1);
    torsoGroup.add(rightFoot);

    // Waving Arm (Right arm)
    const armGroup = new THREE.Group();
    armGroup.position.set(0.65, 0.2, 0);
    const armGeo = new THREE.CapsuleGeometry(0.18, 0.3, 32, 32);
    const armMesh = new THREE.Mesh(armGeo, bluePlastic);
    armMesh.rotation.z = -Math.PI / 3;
    armMesh.position.set(0.2, 0.2, 0);
    armGroup.add(armMesh);
    const handGeo = new THREE.SphereGeometry(0.25, 32, 32);
    const handMesh = new THREE.Mesh(handGeo, whitePlastic);
    handMesh.position.set(0.45, 0.45, 0);
    armGroup.add(handMesh);
    torsoGroup.add(armGroup);
    armGroupRef.current = armGroup;

    // Left Arm (Idle)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.65, 0.2, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, bluePlastic);
    leftArmMesh.rotation.z = Math.PI / 5;
    leftArmMesh.position.set(-0.15, -0.15, 0);
    leftArmGroup.add(leftArmMesh);
    const leftHandMesh = new THREE.Mesh(handGeo, whitePlastic);
    leftHandMesh.position.set(-0.3, -0.4, 0);
    leftArmGroup.add(leftHandMesh);
    torsoGroup.add(leftArmGroup);

    // Shadow Floor
    const planeGeo = new THREE.PlaneGeometry(20, 20);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1.2;
    plane.receiveShadow = true;
    scene.add(plane);

    // Enable Shadows for all character parts
    characterGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // 7. Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current.targetX = Math.max(-1.0, Math.min(1.0, x));
      mousePos.current.targetY = Math.max(-1.0, Math.min(1.0, y));
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (!isHovered.current) {
        mousePos.current.targetX = x * 0.6;
        mousePos.current.targetY = y * 0.6;
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
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;

      // Natural Harmonic Floating
      if (characterGroupRef.current) {
        characterGroupRef.current.position.y = Math.sin(elapsedTime * 2.0) * 0.08;
      }

      // Head tracking cursor
      if (headGroupRef.current) {
        headGroupRef.current.rotation.y = mousePos.current.x * 0.5;
        headGroupRef.current.rotation.x = -mousePos.current.y * 0.3;
        headGroupRef.current.rotation.z = -mousePos.current.x * 0.1;
      }

      // Spinning Take-copter
      if (copterBladeRef.current) {
        copterBladeRef.current.rotation.y += 0.8;
      }

      // Waving Arm Animation
      if (armGroupRef.current) {
        if (isSpeaking) {
          armGroupRef.current.rotation.z = Math.sin(elapsedTime * 8) * 0.15;
        } else {
          armGroupRef.current.rotation.z = Math.sin(elapsedTime * 3) * 0.05;
        }
      }

      // Blinking animation logic
      blinkTimer += 0.016;
      if (blinkTimer > 3.0 + Math.sin(elapsedTime) * 1.5) {
        isBlinking = true;
        blinkTimer = 0;
      }
      if (isBlinking && blinkTimer > 0.12) {
        isBlinking = false;
      }

      const eyeScaleY = isBlinking ? 0.1 : 0.8;
      const eyeScaleX = isBlinking ? 0.6 : 0.4;
      if (leftEyeRef.current) {
        leftEyeRef.current.scale.y = eyeScaleY;
        leftEyeRef.current.scale.x = eyeScaleX;
      }
      if (rightEyeRef.current) {
        rightEyeRef.current.scale.y = eyeScaleY;
        rightEyeRef.current.scale.x = eyeScaleX;
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
      headGroupRef.current.position.y += 0.1;
      setTimeout(() => {
        if (headGroupRef.current) headGroupRef.current.position.y -= 0.1;
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
      title="Click to interact with Doraemon"
    >
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center relative overflow-hidden"
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/10 rounded-full blur-md pointer-events-none group-hover:bg-black/15 transition-all duration-500" />

      {interactionFeedback && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-doraemon-gold text-black text-[11px] font-bold shadow-lg animate-bounce border-2 border-black">
          ✨ Gadget ready!
        </div>
      )}
    </div>
  );
};
