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
import { HoverEventHandler } from './type';
import { CategoricalChartState } from 'recharts/types/chart/types';
import { useEffect, useRef } from 'react';

interface ChartDataPoint {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

interface DataChartProps {
  activeIndex: number | null;
  onHover: HoverEventHandler;
}

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

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <p className="label" style={{ color: '#8884D8' }}>{`${label}`}</p>
        <p
          className="intro"
          style={{ color: '#8884D8' }}
        >{`uv : ${payload[0].value}`}</p>
        <p
          className="intro"
          style={{ color: '#8884D8' }}
        >{`pv : ${payload[0].payload.pv}`}</p>
      </div>
    );
  }
  return null;
};

const DataChart: React.FC<DataChartProps> = ({ activeIndex, onHover }) => {
  const internalMouseMoveHandler = (state: CategoricalChartState) => {
    console.log(state.activeTooltipIndex);
    const internalIndex = state.isTooltipActive
      ? (state.activeTooltipIndex ?? null)
      : null;
    if (activeIndex !== internalIndex) {
      onHover(internalIndex);
    }
  };

  const internalMouseLeaveHandler = () => {
    onHover(null);
  };

  // Reference to the BarChart component instance
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Do nothing if ref is not set
    if (!chartRef.current) return;

    // If activeIndex is null (e.g., mouse left the list),
    // manually hide the tooltip by updating the chart state
    if (activeIndex === null) {
      chartRef.current.setState({
        isTooltipActive: false,
      } as Partial<CategoricalChartState>);
    }
  }, [activeIndex]);

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
          content={<CustomTooltip />}
          defaultIndex={activeIndex ?? undefined}
        />
        <Legend />
        <Bar
          dataKey="uv"
          shape={(props: any) => {
            const isActive = props.index === activeIndex;
            return (
              <Rectangle {...props} fill={isActive ? '#FFC658' : '#8884d8'} />
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DataChart;
