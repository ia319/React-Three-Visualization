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
  TooltipProps,
} from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { ChartDataPoint } from '../types';
import { CategoricalChartState } from 'recharts/types/chart/types';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHoveredIndex } from '@/store/slices/visualizationSlice';
import type { StoreState } from '@/store/store';

type CustomTooltipProps = TooltipProps<ValueType, NameType> & {
  color: string;
};

// Chart data
const data: ChartDataPoint[] = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const DataChart: React.FC = () => {
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
// Custom tooltip
const CustomTooltip = ({
  active,
  payload,
  label,
  color,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          padding: '5px',
        }}
      >
        <p
          className="label"
          style={{ color, margin: '5px 0', textAlign: 'center' }}
        >{`${label}`}</p>
        <p
          className="intro"
          style={{ color, margin: '0 0 4px 0' }}
        >{`uv : ${payload[0].payload.uv}`}</p>
        <p
          className="intro"
          style={{ color, margin: '0 0 4px 0' }}
        >{`pv : ${payload[0].payload.pv}`}</p>
        <p
          className="intro"
          style={{ color, margin: '0 0 4px 0' }}
        >{`amt : ${payload[0].payload.amt}`}</p>
      </div>
    );
  }
  return null;
};
export default DataChart;
