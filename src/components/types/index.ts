// HoverIndex set function
export type HoverEventHandler = (index: number | null) => void;
// Data types
export interface ChartDataPoint {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}
