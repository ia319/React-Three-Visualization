import { useLayoutEffect, useMemo, useRef } from 'react';
import { ChartDataPoint } from '@/components/types';
import * as THREE from 'three';
import { useDispatch, useSelector } from 'react-redux';
import type { StoreState } from '@/store/store';
import { setHoveredIndex } from '@/store/slices/visualizationSlice';
import FacingText from './FacingText';
import { ThreeEvent } from '@react-three/fiber';

interface Chart3DProps {
  data: ChartDataPoint[];
}

// Temporary object used for reuse outside the loop to avoid repeated creation within the loop
const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

export default function Index({ data }: Chart3DProps) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);

  const max = useMemo(() => Math.max(...data.map((d) => d.uv)), [data]);
  const dispatch = useDispatch();
  const { modelColor, modelScale, hoveredIndex } = useSelector(
    (state: StoreState) => state.visualization,
  );
  // The position of each pillar
  const positions = useMemo(() => {
    const columns = 3; // Number of columns per row
    const gap = 5; // Spacing between each item
    const rows = Math.ceil(data.length / columns);
    const xOffset = ((columns - 1) * gap) / 2;
    const zOffset = ((rows - 1) * gap) / 2;

    return data.map((_, i) => {
      const col = i % columns;
      const row = Math.floor(i / columns);
      const x = col * gap - xOffset;
      const z = row * gap - zOffset;
      return [x, z] as [number, number];
    });
  }, [data]);

  // Use useLayoutEffect to update the properties of each instance
  useLayoutEffect(() => {
    if (!instancedMeshRef.current) return;

    data.forEach((item, i) => {
      const height = (item.uv / max) * 5;
      const [x, z] = positions[i];
      const isActive = hoveredIndex === i;

      // Set transformation matrix (position, rotation, scaling)
      tempObject.position.set(x, height / 2, z);
      tempObject.scale.set(1, height, 1);
      tempObject.updateMatrix(); // 计算最终的变换矩阵
      instancedMeshRef.current.setMatrixAt(i, tempObject.matrix);

      // Set instance color
      tempColor.set(isActive ? '#FFC658' : modelColor);
      instancedMeshRef.current.setColorAt(i, tempColor);
    });

    // Marker transformation matrix (position/scale, etc.) has been updated
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, [data, positions, max, hoveredIndex, modelColor]);

  // Interactive processing
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // e.instanceId is the index of the instance that is hovered over
    if (e.instanceId !== undefined && hoveredIndex !== e.instanceId) {
      dispatch(setHoveredIndex(e.instanceId));
    }
  };

  const handlePointerOut = () => {
    dispatch(setHoveredIndex(null));
  };
  return (
    <group scale={[modelScale, modelScale, modelScale]}>
      {/* InstancedMesh component */}
      <instancedMesh
        ref={instancedMeshRef}
        // The third parameter of args is the geometry, material, and quantity of the instance
        // Subcomponent fills the first two parameters
        args={[undefined, undefined, data.length]}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        {/* All instances share geometry and materials */}
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial />
      </instancedMesh>

      {/* Text information component */}
      {data.map((item, index) => {
        const height = (item.uv / max) * 5;
        const [x, z] = positions[index];
        const isActive = hoveredIndex === index;
        const color = isActive ? '#FFC658' : modelColor;

        return (
          <group key={item.name}>
            <FacingText
              position={[x, 0, z]}
              fontSize={0.7}
              color={color}
              anchorX="center"
              anchorY="top"
            >
              {item.name}
            </FacingText>
            {isActive && (
              <FacingText
                position={[x, height + 0.5, z]}
                fontSize={0.5}
                color="black"
                anchorX="center"
                anchorY="bottom"
              >
                {`uv: ${item.uv}\npv: ${item.pv}\namt: ${item.amt}`}
              </FacingText>
            )}
          </group>
        );
      })}
    </group>
  );
}
