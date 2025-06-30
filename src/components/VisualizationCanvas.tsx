// src/components/VisualizationCanvas.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Chart3D from '@/components/Chart3D';
import { ChartDataPoint } from '@/components/types';
import { Suspense } from 'react';

// Define Props
interface VisualizationCanvasProps {
  data: ChartDataPoint[];
}

export default function VisualizationCanvas({
  data,
}: VisualizationCanvasProps) {
  return (
    <Canvas gl={{ alpha: true }} camera={{ position: [25, 10, 10], fov: 50 }}>
      // Lighting
      <ambientLight intensity={1} />
      <directionalLight position={[-5, 10, -5]} intensity={2} />
      // Grid
      <gridHelper args={[30, 30, '#888888', '#cccccc']} position={[0, 0, 0]} />
      // 3D model
      <Suspense fallback={null}>
        <Chart3D data={data} />
      </Suspense>
      <OrbitControls minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  );
}
