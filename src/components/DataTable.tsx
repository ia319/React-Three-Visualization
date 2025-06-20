import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setHoveredIndex } from '../store/visualizationSlice';

// Define our data object type
type DataPoint = {
  [key: string]: any;
};

// Define component Props
interface DataTableProps {
  data: DataPoint[];
  isLoading: boolean;
}

const columnHelper = createColumnHelper<DataPoint>();

export default function DataTable({ data, isLoading }: DataTableProps) {
  const dispatch = useDispatch();
  const { hoveredIndex } = useSelector(
    (state: RootState) => state.visualization,
  );
  // Use useMemo to memoize column definitions to avoid unnecessary recalculations
  const columns = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    // Dynamically create columns from the keys of the first data object
    return Object.keys(data[0]).map((key) =>
      columnHelper.accessor(key, {
        cell: (info) => info.getValue(),
        header: () => <span>{key.toUpperCase()}</span>,
      }),
    );
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading data...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Raw Data</h2>
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                // Dynamically change style based on hoveredIndex
                className={`border-b ${row.index === hoveredIndex ? 'bg-yellow-200' : 'bg-white hover:bg-gray-50'}`}
                // Add mouse events to dispatch actions
                onMouseEnter={() => dispatch(setHoveredIndex(row.index))}
                onMouseLeave={() => dispatch(setHoveredIndex(null))}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
