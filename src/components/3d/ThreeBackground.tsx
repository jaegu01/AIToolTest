"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";

function AnimatedSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.4}
          metalness={0.8}
          opacity={0.6}
          transparent
        />
      </Sphere>
    </Float>
  );
}

function FloatingShapes() {
  const positions = useMemo(
    () =>
      [
        [-4, 2, -5],
        [4, -2, -6],
        [-3, -3, -4],
        [3, 3, -7],
        [0, -4, -5],
      ] as [number, number, number][],
    []
  );

  return (
    <>
      {positions.map((pos, i) => (
        <AnimatedSphere key={i} position={pos} />
      ))}
    </>
  );
}

function MathSymbols() {
  const groupRef = useRef<THREE.Group>(null);
  const symbols = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10 - 5,
        ] as [number, number, number],
        rotation: Math.random() * Math.PI * 2,
        scale: 0.1 + Math.random() * 0.2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {symbols.map((symbol, i) => (
        <mesh
          key={i}
          position={symbol.position}
          rotation={[0, 0, symbol.rotation]}
          scale={symbol.scale}
        >
          <torusGeometry args={[1, 0.3, 16, 32]} />
          <meshStandardMaterial
            color="#a855f7"
            opacity={0.3}
            transparent
            emissive="#a855f7"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />

        <Stars
          radius={100}
          depth={50}
          count={1000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        <FloatingShapes />
        <MathSymbols />
      </Canvas>
    </div>
  );
}
