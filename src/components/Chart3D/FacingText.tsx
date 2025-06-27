import { Text, TextProps } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { RootState, useFrame, useThree } from '@react-three/fiber';

export default function FacingText({
  position,
  children,
  ...props
}: {
  position: [number, number, number];
  children: React.ReactNode;
} & TextProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const { camera } = useThree<RootState>();

  useFrame(() => {
    if (ref.current) {
      // Sync text orientation with camera by copying its quaternion
      ref.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <Text ref={ref} position={position} {...props}>
      {children}
    </Text>
  );
}
