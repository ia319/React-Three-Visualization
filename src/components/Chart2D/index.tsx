import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  CartesianGrid,
  YAxis,
  Tooltip,
  Legend,
  Rectangle,
} from 'recharts';

import { ChartDataPoint } from '../types';
import { CategoricalChartState } from 'recharts/types/chart/types';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHoveredIndex } from '@/store/slices/visualizationSlice';
import type { StoreState } from '@/store/store';
import { CustomTooltip } from '@/components/Chart2D/CustomTooltip';

interface ChartProps {
  data: ChartDataPoint[];
}

const Index: React.FC<ChartProps> = ({ data }) => {
  const chartRef = useRef<any>(null);

  // Using Redux to read and update hoveredIndex
  const dispatch = useDispatch();
  const { modelColor, hoveredIndex } = useSelector(
    (state: StoreState) => state.visualization,
  );

  const internalMouseMoveHandler = (state: CategoricalChartState) => {
    const internalIndex = state.isTooltipActive
      ? (state.activeTooltipIndex ?? null)
      : null;
    if (hoveredIndex !== internalIndex) {
      dispatch(setHoveredIndex(internalIndex)); // Distribute to Redux
    }
  };

  const internalMouseLeaveHandler = () => {
    dispatch(setHoveredIndex(null)); // Mouse leaves reset state
  };

  // Reference to the BarChart component instance
  useEffect(() => {
    // Do nothing if ref is not set
    if (!chartRef.current) return;

    // If activeIndex is null (e.g., mouse left the list),
    // manually hide the tooltip by updating the chart state
    if (hoveredIndex === null) {
      chartRef.current.setState({
        isTooltipActive: false,
      } as Partial<CategoricalChartState>);
    }
  }, [hoveredIndex]);
  if (!data || data.length === 0) {
    return null;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        onMouseMove={internalMouseMoveHandler}
        onMouseLeave={internalMouseLeaveHandler}
        ref={chartRef}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis padding={{ top: 50 }} />
        <Tooltip
          content={<CustomTooltip color={modelColor} />}
          defaultIndex={hoveredIndex ?? undefined}
        />
        <Legend
          wrapperStyle={{
            color: modelColor,
            fontSize: 14,
          }}
        />
        <Bar
          dataKey="uv"
          fill={modelColor}
          shape={(props: any) => {
            const isActive = props.index === hoveredIndex;
            const fillColor = isActive ? '#FFC658' : props.fill; // fallback to original
            return <Rectangle {...props} fill={fillColor} />;
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Index;
