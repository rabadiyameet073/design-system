import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Interactive3DCanvasProps {
  primaryColor?: string;
  accentColor?: string;
  className?: string;
  interactive?: boolean;
}

export const Interactive3DCanvas: React.FC<Interactive3DCanvasProps> = ({
  primaryColor = '#6366f1',
  accentColor = '#f43f5e',
  className = '',
  interactive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      1000
    );
    camera.position.z = 4.8;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // 3. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(primaryColor, 3.0);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(accentColor, 4.0, 20);
    rimLight.position.set(-4, -3, 2);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(0, -4, -3);
    scene.add(fillLight);

    // 4. Central 3D Geometry: Torus Knot + Wireframe Shell
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Core smooth knot
    const knotGeometry = new THREE.TorusKnotGeometry(1.05, 0.32, 120, 24, 2, 3);
    const knotMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(primaryColor),
      metalness: 0.15,
      roughness: 0.25,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      transmission: 0.1,
      opacity: 0.95,
      transparent: true
    });
    const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
    mainGroup.add(knotMesh);

    // Outer architectural wireframe cage
    const cageGeometry = new THREE.IcosahedronGeometry(1.9, 1);
    const cageMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentColor),
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const cageMesh = new THREE.Mesh(cageGeometry, cageMaterial);
    mainGroup.add(cageMesh);

    // Orbiting particle field
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.0 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(primaryColor),
      size: 0.04,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particleSystem);

    // 5. Mouse Parallax & Inertia
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.8;
      targetY = y * 0.6;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 6. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    // 7. Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp mouse parallax
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      mainGroup.rotation.x = currentY * 0.7 + Math.sin(elapsedTime * 0.4) * 0.12;
      mainGroup.rotation.y = currentX * 0.9 + elapsedTime * 0.28;

      cageMesh.rotation.x = -elapsedTime * 0.15;
      cageMesh.rotation.y = -elapsedTime * 0.2;

      particleSystem.rotation.y = elapsedTime * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();

      knotGeometry.dispose();
      knotMaterial.dispose();
      cageGeometry.dispose();
      cageMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [primaryColor, accentColor, interactive]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      style={{ touchAction: 'none' }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
