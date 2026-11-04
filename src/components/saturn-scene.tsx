"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Drone() {
  const orbit = useRef<THREE.Group>(null);
  const propellers = useRef<THREE.Mesh[]>([]);
  useFrame((state, delta) => {
    if (!orbit.current) return;
    orbit.current.rotation.y += delta * 0.17;
    orbit.current.rotation.x = THREE.MathUtils.damp(orbit.current.rotation.x, state.pointer.y * 0.035, 3, delta);
    orbit.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    propellers.current.forEach((propeller) => { if (propeller) propeller.rotation.y += delta * 8; });
  });
  return <group ref={orbit}>
    <group position={[2.05, 0.12, 0.4]} rotation={[0.2, 0.35, 0.1]}>
      <mesh castShadow><octahedronGeometry args={[0.105, 0]} /><meshStandardMaterial color="#b2c6ae" metalness={0.65} roughness={0.35} flatShading /></mesh>
      {[[-1, 0, -1], [1, 0, -1], [-1, 0, 1], [1, 0, 1]].map(([x, y, z], index) => <group key={index} position={[x * 0.2, y, z * 0.2]}>
        <mesh rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.34, 0.025, 0.025]} /><meshStandardMaterial color="#81917e" metalness={0.55} roughness={0.4} /></mesh>
        <mesh ref={(node) => { if (node) propellers.current[index] = node; }} position={[0, 0.035, 0]}><cylinderGeometry args={[0.075, 0.075, 0.012, 5]} /><meshStandardMaterial color="#a6cb9e" emissive="#456842" emissiveIntensity={0.4} flatShading /></mesh>
      </group>)}
      <pointLight color="#a6cb9e" intensity={0.8} distance={1.2} />
    </group>
  </group>;
}

function Saturn() {
  const planet = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!planet.current) return;
    planet.current.rotation.y += delta * 0.06;
    planet.current.rotation.x = THREE.MathUtils.damp(planet.current.rotation.x, state.pointer.y * 0.09, 3, delta);
    planet.current.rotation.z = THREE.MathUtils.damp(planet.current.rotation.z, state.pointer.x * 0.08, 3, delta);
  });
  return <group ref={planet}>
    <mesh castShadow><sphereGeometry args={[1, 36, 24]} /><meshStandardMaterial color="#9a886a" roughness={0.92} metalness={0.08} flatShading /></mesh>
    <mesh rotation={[Math.PI / 2.42, 0, -0.2]}><torusGeometry args={[1.44, 0.055, 5, 88]} /><meshStandardMaterial color="#b5a17d" roughness={0.8} metalness={0.16} transparent opacity={0.68} flatShading /></mesh>
    <mesh rotation={[Math.PI / 2.42, 0, -0.2]}><torusGeometry args={[1.63, 0.035, 4, 88]} /><meshStandardMaterial color="#6f6959" roughness={1} transparent opacity={0.42} flatShading /></mesh>
    <mesh rotation={[Math.PI / 2.42, 0, -0.2]}><torusGeometry args={[1.9, 0.008, 3, 96]} /><meshBasicMaterial color="#b0c99e" transparent opacity={0.34} /></mesh>
  </group>;
}

export default function SaturnScene() {
  return <div aria-label="Interactive low-poly Saturn with an orbiting reconnaissance drone" role="img" className="h-full w-full">
    <Canvas camera={{ position: [0, 0.35, 5.7], fov: 39 }} dpr={[1, 1.4]} gl={{ alpha: true, antialias: false }}>
      <ambientLight intensity={1.35} /><directionalLight position={[-3, 4, 4]} intensity={2.3} color="#d6dfc4" /><pointLight position={[3, -2, -1]} intensity={1.15} color="#738d6a" />
      <Float speed={0.55} rotationIntensity={0.08} floatIntensity={0.12}><Saturn /></Float><Drone />
      <Stars radius={24} depth={14} count={420} factor={1.1} saturation={0.2} fade speed={0.18} />
    </Canvas>
  </div>;
}

