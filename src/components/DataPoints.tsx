import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setHoveredIndex } from '../store/slices/visualizationSlice';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

interface DataPoint {
  x: number;
  y: number;
  z: number;

  [key: string]: any;
}

// Define component Props type
interface DataPointsProps {
  data: DataPoint[];
}

const HIGHLIGHT_COLOR = 'yellow';

export default function DataPoints({ data }: DataPointsProps) {
  const dispatch = useDispatch();
  const { modelColor, modelScale, hoveredIndex } = useSelector(
    (state: RootState) => state.visualization,
  );

  const meshRef = useRef<THREE.InstancedMesh>(null!);

  useEffect(() => {
    if (!data || !meshRef.current) {
      // If no data, ensure instance count is zero
      if (meshRef.current) meshRef.current.count = 0;
      return;
    }

    // Update instance count when data changes
    meshRef.current.count = data.length;

    data.forEach((point, i) => {
      tempObject.position.set(point.x, point.y, point.z);
      tempObject.scale.set(modelScale, modelScale, modelScale);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);

      const colorToApply = i === hoveredIndex ? HIGHLIGHT_COLOR : modelColor;
      meshRef.current.setColorAt(i, tempColor.set(colorToApply));
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [data, modelColor, modelScale, hoveredIndex]);

  // Set args count to data length or 0 initially
  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, data?.length || 0]}
      onPointerMove={(e) => {
        e.stopPropagation(); // 防止事件穿透到 Canvas 的 OrbitControls
        if (e.instanceId !== undefined && e.instanceId !== hoveredIndex) {
          dispatch(setHoveredIndex(e.instanceId));
        }
      }}
      onPointerOut={() => {
        dispatch(setHoveredIndex(null));
      }}
    >
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}
