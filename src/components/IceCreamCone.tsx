
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Component for the ice cream scoop
const Scoop = ({ position, color, flavor, active }: { position: [number, number, number], color: string, flavor: string, active: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position} scale={active ? 1.05 : 1}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.4} 
        metalness={0.1}
        emissive={active ? color : '#000'} 
        emissiveIntensity={active ? 0.2 : 0} 
      />
    </mesh>
  );
};

// Component for the cone
const Cone = () => {
  const coneRef = useRef<THREE.Mesh>(null);
  const texture = useTexture('/placeholder.svg'); // Replace with actual waffle cone texture
  
  return (
    <mesh ref={coneRef} position={[0, -1, 0]} rotation={[0, 0, Math.PI]}>
      <coneGeometry args={[0.7, 2, 32]} />
      <meshStandardMaterial 
        map={texture}
        color="#F3E5AB" 
        roughness={0.8} 
        metalness={0.1}
      />
    </mesh>
  );
};

// Main 3D scene component
const IceCreamScene = ({ activeFlavor }: { activeFlavor: string }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <group position={[0, 0, 0]}>
        <Scoop 
          position={[0, 0.7, 0]} 
          color="#ff85a1" 
          flavor="strawberry" 
          active={activeFlavor === 'strawberry'}
        />
        <Scoop 
          position={[0, 1.8, 0]} 
          color="#AAD6A0" 
          flavor="mint" 
          active={activeFlavor === 'mint'}
        />
        <Scoop 
          position={[0, 2.9, 0]} 
          color="#7B3F00" 
          flavor="chocolate" 
          active={activeFlavor === 'chocolate'}
        />
        <Cone />
      </group>
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 2} 
      />
    </>
  );
};

// Flavor data for preview
const flavors = [
  { id: 'strawberry', name: 'Strawberry', color: '#FF85A1', description: 'Sweet and tangy strawberry ice cream made with fresh berries' },
  { id: 'mint', name: 'Mint Chip', color: '#AAD6A0', description: 'Cool mint with chocolate chips for a refreshing treat' },
  { id: 'chocolate', name: 'Chocolate', color: '#7B3F00', description: 'Rich and creamy chocolate from premium cocoa' },
];

// Main export component
export default function IceCreamCone() {
  const [activeFlavor, setActiveFlavor] = useState('');
  const [rotating, setRotating] = useState(true);
  
  // Auto rotate the cone periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const nextFlavor = flavors[Math.floor(Math.random() * flavors.length)].id;
      setActiveFlavor(nextFlavor);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[500px] w-full">
      <motion.div 
        className="absolute inset-0 bg-ice-cream rounded-3xl -z-10"
        animate={{ 
          boxShadow: rotating ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 15px 30px -15px rgba(0, 0, 0, 0.3)'
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
      
      <Canvas className="h-full w-full">
        <IceCreamScene activeFlavor={activeFlavor} />
      </Canvas>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4">
        {flavors.map(flavor => (
          <motion.button
            key={flavor.id}
            className={`px-4 py-2 rounded-full text-white ${
              activeFlavor === flavor.id ? 'ring-4 ring-white/50' : ''
            }`}
            style={{ backgroundColor: flavor.color }}
            onMouseEnter={() => {
              setActiveFlavor(flavor.id);
              setRotating(false);
            }}
            onMouseLeave={() => setRotating(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {flavor.name}
          </motion.button>
        ))}
      </div>
      
      {activeFlavor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-0 right-0 text-center"
        >
          <p className="font-heading text-lg">
            {flavors.find(f => f.id === activeFlavor)?.description}
          </p>
        </motion.div>
      )}
    </div>
  );
}
