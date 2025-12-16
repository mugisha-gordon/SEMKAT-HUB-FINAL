import { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useTexture, PerspectiveCamera, ContactShadows, MeshReflectorMaterial } from '@react-three/drei';
import { RotateCcw, Maximize2, Minimize2, Move3D } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';

interface Room {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  features?: string[];
}

interface VirtualTour3DProps {
  propertyType: 'residential' | 'commercial' | 'land';
  rooms?: Room[];
  panoramaUrl?: string;
}

// 360° Panorama Viewer Component
const PanoramaSphere = ({ url }: { url: string }) => {
  const texture = useTexture(url);
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

// Realistic Room Box Component with PBR materials
const RoomBox = ({ room, isSelected, onSelect }: { room: Room; isSelected: boolean; onSelect: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      const targetY = (hovered || isSelected) ? 1.05 : 1;
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetY, 0.1);
    }
  });

  // Parse color for PBR material
  const baseColor = new THREE.Color(isSelected ? '#F97316' : room.color);

  return (
    <group position={room.position}>
      {/* Main room mesh with realistic material */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={room.size} />
        <meshPhysicalMaterial 
          color={baseColor}
          metalness={0.1}
          roughness={0.4}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          transparent
          opacity={hovered || isSelected ? 0.95 : 0.85}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Wireframe overlay for selection */}
      {(hovered || isSelected) && (
        <mesh>
          <boxGeometry args={[room.size[0] + 0.05, room.size[1] + 0.05, room.size[2] + 0.05]} />
          <meshBasicMaterial color="#ffffff" wireframe opacity={0.5} transparent />
        </mesh>
      )}
      
      {/* Room label */}
      <Html
        position={[0, room.size[1] / 2 + 0.4, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: 'none' }}
      >
        <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shadow-lg ${
          isSelected 
            ? 'bg-gradient-to-r from-semkat-orange to-orange-600 text-white' 
            : 'bg-white/95 text-slate-800'
        }`}>
          {room.name}
        </div>
      </Html>
    </group>
  );
};

// Realistic Floor with reflections
const RealisticFloor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={50}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#f0f0f0"
        metalness={0.5}
        mirror={0.5}
      />
    </mesh>
  );
};

// Camera Controls Component
const CameraController = ({ resetCamera }: { resetCamera: boolean }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  useFrame(() => {
    if (resetCamera && controlsRef.current) {
      camera.position.lerp(new THREE.Vector3(12, 12, 12), 0.05);
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2.2}
      minDistance={5}
      maxDistance={35}
      enableDamping
      dampingFactor={0.05}
    />
  );
};

// Default rooms for residential demo with realistic colors
const defaultResidentialRooms: Room[] = [
  { id: 'living', name: 'Living Room', position: [0, 0.6, 0], size: [5, 1.2, 6], color: '#64748b', features: ['Large windows', 'Fireplace', 'Open plan'] },
  { id: 'kitchen', name: 'Kitchen', position: [4, 0.6, 0], size: [3, 1.2, 4], color: '#059669', features: ['Modern appliances', 'Island counter', 'Pantry'] },
  { id: 'master', name: 'Master Bedroom', position: [-4, 0.6, 2.5], size: [4, 1.2, 4], color: '#7c3aed', features: ['En-suite bathroom', 'Walk-in closet', 'Balcony access'] },
  { id: 'bedroom2', name: 'Bedroom 2', position: [-4, 0.6, -2], size: [3, 1.2, 3.5], color: '#2563eb', features: ['Built-in wardrobe', 'Study nook'] },
  { id: 'bathroom', name: 'Bathroom', position: [0, 0.6, -4], size: [2.5, 1.2, 2.5], color: '#0891b2', features: ['Bathtub', 'Rain shower', 'Heated floors'] },
  { id: 'garage', name: 'Garage', position: [4, 0.6, -4], size: [3.5, 1.2, 3], color: '#475569', features: ['2-car capacity', 'Storage', 'Workshop area'] },
];

const defaultCommercialRooms: Room[] = [
  { id: 'reception', name: 'Reception', position: [0, 0.6, 4], size: [6, 1.2, 3], color: '#0ea5e9', features: ['Reception desk', 'Waiting area'] },
  { id: 'office1', name: 'Office Suite A', position: [-4, 0.6, 0], size: [4, 1.2, 5], color: '#6366f1', features: ['6 workstations', 'Meeting corner'] },
  { id: 'office2', name: 'Office Suite B', position: [4, 0.6, 0], size: [4, 1.2, 5], color: '#8b5cf6', features: ['8 workstations', 'Private office'] },
  { id: 'conference', name: 'Conference Room', position: [0, 0.6, -3], size: [5, 1.2, 4], color: '#f59e0b', features: ['20-person capacity', 'AV equipment', 'Video conferencing'] },
  { id: 'kitchen', name: 'Break Room', position: [-4, 0.6, -4], size: [3, 1.2, 3], color: '#10b981', features: ['Kitchen facilities', 'Lounge seating'] },
];

const VirtualTour3D = ({ propertyType, rooms, panoramaUrl }: VirtualTour3DProps) => {
  const defaultRooms = propertyType === 'commercial' ? defaultCommercialRooms : defaultResidentialRooms;
  const displayRooms = rooms || defaultRooms;
  
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [resetCamera, setResetCamera] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | '360'>('3d');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResetCamera = () => {
    setResetCamera(true);
    setTimeout(() => setResetCamera(false), 1000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const selectedRoomData = displayRooms.find(r => r.id === selectedRoom);

  return (
    <div 
      ref={containerRef} 
      className={`relative bg-gradient-to-b from-slate-100 via-slate-50 to-white rounded-xl overflow-hidden shadow-2xl ${
        isFullscreen ? 'h-screen' : 'h-[450px] md:h-[550px]'
      }`}
    >
      {/* Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button
            variant={viewMode === '3d' ? 'hero' : 'outline'}
            size="sm"
            onClick={() => setViewMode('3d')}
            className="gap-1.5 shadow-lg"
          >
            <Move3D className="h-4 w-4" />
            3D Floor Plan
          </Button>
          {panoramaUrl && (
            <Button
              variant={viewMode === '360' ? 'hero' : 'outline'}
              size="sm"
              onClick={() => setViewMode('360')}
              className="gap-1.5 shadow-lg"
            >
              360° View
            </Button>
          )}
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="icon"
            onClick={handleResetCamera}
            className="h-9 w-9 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="h-9 w-9 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [12, 12, 12], fov: 45 }}>
        <CameraController resetCamera={resetCamera} />
        
        {/* Realistic lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <directionalLight position={[-5, 10, -5]} intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={0.5} />
        
        <Suspense
          fallback={
            <Html center>
              <div className="px-4 py-2 rounded-lg bg-white shadow-lg text-sm text-slate-700 font-medium">
                Loading 3D visualization...
              </div>
            </Html>
          }
        >
          {viewMode === '360' && panoramaUrl ? (
            <PanoramaSphere url={panoramaUrl} />
          ) : (
            <>
              <RealisticFloor />
              <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={40} blur={2} far={10} />
              
              {displayRooms.map((room) => (
                <RoomBox
                  key={room.id}
                  room={room}
                  isSelected={selectedRoom === room.id}
                  onSelect={() => setSelectedRoom(room.id === selectedRoom ? null : room.id)}
                />
              ))}
              
              {/* Grid helper with better styling */}
              <gridHelper args={[40, 40, '#d1d5db', '#e5e7eb']} position={[0, 0.01, 0]} />
            </>
          )}
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>

      {/* Room Info Panel */}
      {selectedRoomData && viewMode === '3d' && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white/95 backdrop-blur-md rounded-xl p-5 border shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-heading font-bold text-lg text-foreground">{selectedRoomData.name}</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-slate-100"
              onClick={() => setSelectedRoom(null)}
            >
              ×
            </Button>
          </div>
          <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedRoomData.color }} />
            <span>Dimensions: {(selectedRoomData.size[0] * 2.5).toFixed(1)}m × {(selectedRoomData.size[2] * 2.5).toFixed(1)}m</span>
          </div>
          {selectedRoomData.features && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-foreground uppercase tracking-wide">Features</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                {selectedRoomData.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-semkat-orange" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
        {viewMode === '3d' ? '🖱️ Click rooms • Drag to rotate • Scroll to zoom' : '🖱️ Drag to look around'}
      </div>
    </div>
  );
};

export default VirtualTour3D;
