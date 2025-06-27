import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import VisualizationCanvas from '../components/VisualizationCanvas';
import ControlPanel from '../components/ControlPanel';
import DataChart from '@/components/Chart2D/DataChart';
// Move data fetching logic here
const fetchDatasetById = async (datasetId: string | null) => {
  if (!datasetId) return [];
  const response = await fetch(
    `http://localhost:8080/api/datasets/${datasetId}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch dataset');
  }
  return response.json();
};

export default function HomePage() {
  // Manage datasetId at top-level component
  const [datasetId, setDatasetId] = useState<string | null>(null);

  // useQuery depends on datasetId
  const { data, isLoading } = useQuery({
    queryKey: ['dataset', datasetId], // queryKey must include id to refetch when it changes
    queryFn: () => fetchDatasetById(datasetId),
    enabled: !!datasetId, // only run query if datasetId exists
  });

  return (
    <main className="flex h-screen w-screen bg-slate-100 ">
      <div className="w-1/2 max-w-xs border-r border-slate-300 h-px-100">
        {/* Pass the function to set id to ControlPanel */}
        <ControlPanel onUploadSuccess={setDatasetId} />
        <div className="h-1/3 w-2/3 m-auto mt-[50px]">
          {/*2D chart*/}
          <DataChart />
        </div>
      </div>
      <div className="flex-1 relative h-2/3 my-auto">
        {/* Pass fetched data to 3D canvas */}
        <VisualizationCanvas data={data || []} />
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
            Loading Data...
          </div>
        )}
      </div>
    </main>
  );
}
