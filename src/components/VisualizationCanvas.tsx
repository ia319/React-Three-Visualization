// src/components/VisualizationCanvas.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import DataPoints from './DataPoints';

// Define Props
interface VisualizationCanvasProps {
  data: any[];
}

export default function VisualizationCanvas({
  data,
}: VisualizationCanvasProps) {
  return (
    <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 10], fov: 25 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} />
      <Center>
        {/* Pass data prop to DataPoints */}
        <DataPoints data={data} />
      </Center>
      <OrbitControls makeDefault />
    </Canvas>
  );
}
