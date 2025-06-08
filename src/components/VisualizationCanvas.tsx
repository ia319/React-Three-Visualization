import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function VisualizationCanvas() {
  return (
    <Canvas>
      {/*Light*/}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} />
      {/*3D Model*/}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      {/*Controller*/}
      <OrbitControls />
    </Canvas>
  );
}
