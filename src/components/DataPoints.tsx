import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useQuery } from '@tanstack/react-query';
import Papa from 'papaparse';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

interface DataPoints {
  x: number;
  y: number;
  z: number;
  value: number;
}

const fetchDataset = async (): Promise<DataPoints[]> => {
  const response = await fetch('/mock_data.csv');
  const text = await response.text();
  const result = Papa.parse<DataPoints>(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
  return result.data;
};

export default function DataPoints() {
  const { data } = useQuery({ queryKey: ['dataset'], queryFn: fetchDataset });
  const { modelColor, modelScale } = useSelector(
    (state: RootState) => state.visualization,
  );
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  useEffect(() => {
    if (!data || !meshRef.current) return;
    data.forEach((point, i) => {
      tempObject.position.set(point.x, point.y, point.z);
      tempObject.scale.set(modelScale, modelScale, modelScale);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
      meshRef.current.setColorAt(i, tempColor.set(modelColor));
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [data, modelColor, modelScale]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, data?.length || 0]}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}
