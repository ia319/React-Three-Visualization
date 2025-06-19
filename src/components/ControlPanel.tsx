import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setColor, setScale } from '../store/visualizationSlice';

export default function ControlPanel() {
  const dispatch = useDispatch();
  const { modelColor, modelScale } = useSelector(
    (state: RootState) => state.visualization,
  );

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setColor(e.target.value));
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setScale(parseFloat(e.target.value)));
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label
          htmlFor="modelColor"
          className="block text-sm font-medium text-gray-700"
        >
          Model Color
        </label>
        <input
          type="color"
          id="modelColor"
          value={modelColor}
          onChange={handleColorChange}
          className="mt-1 block w-full h-10"
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
          max="5"
          step="0.01"
          value={modelScale}
          onChange={handleScaleChange}
          className="mt-1 block w-full"
        />
      </div>
    </div>
  );
}
