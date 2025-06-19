import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import DataPoints from './DataPoints';

export default function VisualizationCanvas() {
  return (
    <Canvas>
      {/*Light*/}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} />
      {/*3D Model*/}
      <Suspense fallback={null}>
        {/* Display blanks when data is loaded */}
        <Center>
          {/*Center content*/}
          <DataPoints />
        </Center>
      </Suspense>
      {/*Controller*/}
      <OrbitControls />
    </Canvas>
  );
}
