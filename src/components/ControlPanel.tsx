// src/components/ControlPanel.tsx
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '@/store/store';
import { setColor, setScale } from '@/store/slices/visualizationSlice';

// Define the upload function
const uploadDataset = async (file: File): Promise<{ id: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8080/api/datasets/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Define component Props type, accepts a function to set datasetId
interface ControlPanelProps {
  onUploadSuccess: (datasetId: string) => void;
}

export default function ControlPanel({ onUploadSuccess }: ControlPanelProps) {
  const dispatch = useDispatch();
  const { modelColor, modelScale } = useSelector(
    (state: StoreState) => state.visualization,
  );

  // Use useMutation
  const mutation = useMutation({
    mutationFn: uploadDataset,
    onSuccess: (data) => {
      console.log('Upload successful, dataset ID:', data.id);
      onUploadSuccess(data.id); // Call the parent component's function after successful upload
    },
    onError: (error) => {
      console.error('Error uploading file:', error);
      alert('File upload failed!');
    },
  });

  // File input change event handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      mutation.mutate(file); // Call mutation to upload the file
    }
  };

  return (
    <div className="p-4 space-y-6 bg-white rounded-lg shadow m-4">
      <div className="border-b pb-4">
        <h2 className="text-lg font-bold mb-2">Upload Data</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={mutation.isPending} // Disable while uploading
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
        {mutation.isPending && (
          <p className="text-sm text-gray-500 mt-2">Uploading...</p>
        )}
      </div>

      <h2 className="text-lg font-bold border-b pb-2">Controls</h2>
      <div>
        <label
          htmlFor="modelColor"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Model Color
        </label>
        <input
          type="color"
          id="modelColor"
          value={modelColor}
          onChange={(e) => dispatch(setColor(e.target.value))}
          className="mt-1 block w-full h-10 border-none cursor-pointer"
        />
      </div>
      <div>
        <label
          htmlFor="modelScale"
          className="block text-sm font-medium text-gray-700"
        >
          Model Scale: {modelScale.toFixed(2)}
        </label>
        <input
          type="range"
          id="modelScale"
          min="0.1"
          max="3"
          step="0.01"
          value={modelScale}
          onChange={(e) => dispatch(setScale(parseFloat(e.target.value)))}
          className="mt-1 block w-full"
        />
      </div>
    </div>
  );
}
