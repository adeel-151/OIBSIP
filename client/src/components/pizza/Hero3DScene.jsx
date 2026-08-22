import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// A dynamic abstract pizza representation
const AbstractPizza = () => {
  const group = useRef();
  
  // Floating ingredients
  const ingredients = useMemo(() => {
    const items = [];
    const colors = ['#e63946', '#2a9d8f', '#f4a261', '#e9c46a']; // Red (tomato), Green (basil), Orange (cheese), Yellow
    for (let i = 0; i < 20; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 2 + 1,
          (Math.random() - 0.5) * 5
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: Math.random() * 0.2 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(t / 4) / 4;
      group.current.rotation.z = Math.sin(t / 3) / 6;
      group.current.position.y = Math.sin(t / 2) / 4;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Crust */}
        <mesh castShadow receiveShadow rotation={[-Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[2, 0.3, 32, 64]} />
          <meshStandardMaterial 
            color="#d4a373" 
            roughness={0.7} 
            metalness={0.2} 
            emissive="#d4a373"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Inner Cheese/Sauce Base */}
        <mesh castShadow receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2.2, 0, 0]}>
          <cylinderGeometry args={[1.9, 1.9, 0.1, 64]} />
          <meshStandardMaterial 
            color="#e76f51" 
            roughness={0.4} 
            metalness={0.1}
            emissive="#e76f51"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Abstract Floating Toppings */}
        {ingredients.map((props, i) => (
          <mesh 
            key={i} 
            position={props.position} 
            rotation={props.rotation} 
            scale={props.scale}
            castShadow
          >
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial 
              color={props.color} 
              roughness={0.2} 
              metalness={0.8}
              emissive={props.color}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </Float>
    </group>
  );
};

// Mouse interaction for parallax
const Rig = () => {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 2, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 1 + 2, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
};

export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0 bg-background overflow-hidden pointer-events-none md:pointer-events-auto">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping }}>
        <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={45} />
        
        {/* Dramatic Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={5} 
          castShadow 
          color="#ff7b00" 
        />
        <spotLight 
          position={[-10, -10, -10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={2} 
          color="#0055ff" 
        />
        <pointLight position={[0, -2, 5]} intensity={2} color="#ff0000" />

        <AbstractPizza />

        {/* Cinematic Particles */}
        <Sparkles count={300} scale={12} size={2} speed={0.4} opacity={0.3} color="#ffa600" />
        <Sparkles count={100} scale={10} size={4} speed={0.2} opacity={0.2} color="#ffffff" />

        <ContactShadows position={[0, -3, 0]} opacity={0.5} scale={20} blur={2} far={4.5} />

        {/* Parallax Effect */}
        <Rig />

        {/* Post Processing for Cinematic Look */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
          <DepthOfField target={[0, 0, 0]} focalLength={0.02} bokehScale={5} height={480} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
      
      {/* Overlay to ensure text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50 pointer-events-none" />
    </div>
  );
}
