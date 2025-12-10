"use client";

import { useGSAP } from "@gsap/react";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { useState } from "react";
import { Group, PointLight } from "three";

export default function Page() {
  const [groupRef, setGroupRef] = useState<Group | null>(null);
  const [lightRef, setLightRef] = useState<PointLight | null>(null);

  useGSAP(
    () => {
      if (!groupRef || !lightRef) return;
      gsap.from(groupRef.position, {
        y: -1,
        duration: 1,
        ease: "power2.out",
      });

      gsap.from(groupRef.rotation, {
        x: 0.5,
        duration: 1,
        ease: "power2.out",
      });

      gsap.from(lightRef, {
        intensity: 0,
        duration: 1.2,
        ease: "power2.out",
      });

      gsap.to(lightRef.position, {
        x: -4,
      });
    },
    {
      dependencies: [groupRef, lightRef],
    }
  );

  return (
    <div className="absolute h-screen w-screen top-0 left-0 bg-black">
      <Canvas>
        <group ref={setGroupRef}>
          <Scene />
        </group>
        <pointLight ref={setLightRef} position={[10, 2, 2]} intensity={10} />
        <PerspectiveCamera fov={28} makeDefault position={[0, 1.5, 5]} />
      </Canvas>
    </div>
  );
}

function Scene() {
  const { scene } = useGLTF("/models/rover/source/Perseverance.glb");

  return <primitive object={scene} />;
}
