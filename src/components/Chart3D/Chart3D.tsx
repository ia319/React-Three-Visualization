import { useMemo } from 'react';
import { ChartDataPoint } from '@/components/types';
import { useDispatch, useSelector } from 'react-redux';
import type { StoreState } from '@/store/store';
import { setHoveredIndex } from '@/store/slices/visualizationSlice';
import FacingText from './FacingText';

const data: ChartDataPoint[] = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
export default function Chart3D() {
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

  return (
    <group>
      {data.map((item, index) => {
        const height = (item.uv / max) * 5;
        const [x, z] = positions[index];
        const isActive = hoveredIndex === index;
        const color = isActive ? '#FFC658' : modelColor;
        return (
          <group key={item.name} scale={[modelScale, modelScale, modelScale]}>
            <mesh
              position={[x, height / 2, z]}
              onPointerOver={() => dispatch(setHoveredIndex(index))}
              onPointerOut={() => dispatch(setHoveredIndex(null))}
            >
              <boxGeometry args={[1, height, 1]} />
              <meshStandardMaterial color={color} />
            </mesh>
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
