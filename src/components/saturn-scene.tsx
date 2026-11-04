"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Stars } from "@react-three/drei";
import { useRef, useState } from "react";
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

function SunGlow() {
  return <group position={[-3.5, 2.1, -4.5]}>
    <mesh><sphereGeometry args={[0.8, 24, 16]} /><meshBasicMaterial color="#d39b63" transparent opacity={0.055} depthWrite={false} /></mesh>
    <mesh><sphereGeometry args={[0.42, 20, 14]} /><meshBasicMaterial color="#dfb078" transparent opacity={0.09} depthWrite={false} /></mesh>
    <mesh><sphereGeometry args={[0.16, 16, 12]} /><meshBasicMaterial color="#f2d2a2" transparent opacity={0.56} /></mesh>
    <pointLight color="#d8a36e" intensity={3.2} distance={9} decay={2} />
  </group>;
}

function QuoteArtifact({ position, quote, color, geometry }: { position: [number, number, number]; quote: string; color: string; geometry: "crystal" | "planet" }) {
  const [hovered, setHovered] = useState(false);
  return <Float position={position} speed={0.7} rotationIntensity={0.14} floatIntensity={0.2}>
    <group>
      <mesh
        onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        onPointerDown={(event) => { event.stopPropagation(); setHovered((current) => !current); }}
      >
        {geometry === "crystal" ? <dodecahedronGeometry args={[0.22, 0]} /> : <sphereGeometry args={[0.2, 18, 12]} />}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.38} metalness={0.48} flatShading={geometry === "crystal"} />
      </mesh>
      {geometry === "planet" && <mesh rotation={[0.9, 0.2, -0.3]}><torusGeometry args={[0.32, 0.012, 4, 40]} /><meshBasicMaterial color="#c59a63" transparent opacity={0.62} /></mesh>}
      {hovered && <Html position={[0.36, 0.2, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="w-52 border border-[#8cba85]/25 bg-[#0c0f0d]/95 p-3 shadow-[0_10px_36px_rgba(0,0,0,0.55)] backdrop-blur-md">
          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#8cba85]">Signal / field note</p>
          <p className="mt-2 text-[11px] leading-5 text-[#e0e5dc]">{quote}</p>
        </div>
      </Html>}
    </group>
  </Float>;
}

function SpaceDebris() {
  return <group>
    <Float position={[-2.65, -1.15, -1.2]} speed={0.45} rotationIntensity={0.3} floatIntensity={0.18}><mesh><octahedronGeometry args={[0.08, 0]} /><meshStandardMaterial color="#a6cb9e" emissive="#557c50" emissiveIntensity={0.25} flatShading /></mesh></Float>
    <Float position={[2.8, 1.35, -1.5]} speed={0.35} rotationIntensity={0.3} floatIntensity={0.15}><mesh><icosahedronGeometry args={[0.06, 0]} /><meshStandardMaterial color="#b7a17e" metalness={0.45} roughness={0.6} flatShading /></mesh></Float>
    <Float position={[-2.35, 1.45, -2.4]} speed={0.55} rotationIntensity={0.2} floatIntensity={0.12}><mesh><tetrahedronGeometry args={[0.045, 0]} /><meshBasicMaterial color="#cb8a74" /></mesh></Float>
  </group>;
}

export default function SaturnScene() {
  return <div aria-label="Interactive low-poly Saturn with an orbiting reconnaissance drone" role="img" className="h-full w-full">
    <Canvas camera={{ position: [0, 0.35, 5.7], fov: 39 }} dpr={[1, 1.4]} gl={{ alpha: true, antialias: false }}>
      <ambientLight intensity={1.2} /><directionalLight position={[-3, 4, 4]} intensity={2.1} color="#d6dfc4" /><pointLight position={[3, -2, -1]} intensity={1.05} color="#738d6a" />
      <SunGlow />
      <Float speed={0.55} rotationIntensity={0.08} floatIntensity={0.12}><Saturn /></Float><Drone />
      <SpaceDebris />
      <QuoteArtifact position={[2.85, 0.95, -1.8]} color="#a6cb9e" geometry="planet" quote="System Maxim: Have fun, but don't allow fun have you." />
      <QuoteArtifact position={[-2.65, -0.15, -1.2]} color="#c49a7a" geometry="crystal" quote="Directive: Engineering robust intelligence and tactical architecture." />
      <Stars radius={24} depth={14} count={420} factor={1.1} saturation={0.2} fade speed={0.18} />
    </Canvas>
  </div>;
}

