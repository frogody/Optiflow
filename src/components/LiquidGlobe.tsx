// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

interface LiquidGlobeProps {
  isAgentSpeaking: boolean;
  color?: string;
  intensity?: number;
  scale?: number;
}

const AnimatedSphere: React.FC<LiquidGlobeProps> = ({
  isAgentSpeaking,
  color = '#3CDFFF',
  intensity = 1,
  scale = 1,
}) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (!sphereRef.current || !materialRef.current) return;

    // Animate distortion based on agent speaking state
    const targetDistort = isAgentSpeaking ? 0.6 : 0.3;
    materialRef.current.distort = THREE.MathUtils.lerp(
      materialRef.current.distort,
      targetDistort,
      0.1
    );

    // Rotate the sphere
    sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
    sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;

    // Pulse the sphere when agent is speaking
    if (isAgentSpeaking) {
      const pulse = Math.sin(state.clock.getElapsedTime() * 5) * 0.05;
      sphereRef.current.scale.set(scale + pulse, scale + pulse, scale + pulse);
    } else {
      sphereRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]}>
      <MeshDistortMaterial
        ref={materialRef}
        color={color}
        envMapIntensity={intensity}
        clearcoat={1}
        clearcoatRoughness={0}
        metalness={0.1}
        transmission={1}
        opacity={0.8}
        transparent
        distort={0.3}
        speed={5}
      />
    </Sphere>
  );
};

const GlobeEnvironment: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
    </>
  );
};

export const LiquidGlobe: React.FC<LiquidGlobeProps> = ({
  isAgentSpeaking,
  color,
  intensity,
  scale,
}) => {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <GlobeEnvironment />
        <AnimatedSphere
          isAgentSpeaking={isAgentSpeaking}
          color={color}
          intensity={intensity}
          scale={scale}
        />
      </Canvas>
    </div>
  );
};

export default LiquidGlobe;
