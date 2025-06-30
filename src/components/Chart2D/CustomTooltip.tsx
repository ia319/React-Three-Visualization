import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

type CustomTooltipProps = TooltipProps<ValueType, NameType> & {
  color: string;
};
export const CustomTooltip = ({
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
