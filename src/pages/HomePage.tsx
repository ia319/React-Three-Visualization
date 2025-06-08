import VisualizationCanvas from '@/components/VisualizationCanvas';

export default function HomePage() {
  return (
    <main className="flex h-screen w-screen">
      {/*Left Data Panel*/}
      <div className="w-1/3 bg-slate-100 p-4">
        <h1 className="text-xl font-bold">Data Panel</h1>
      </div>

      {/*Right 3D Model*/}
      <div className="w-2/3 bg-slate-300">
        <VisualizationCanvas />
      </div>
    </main>
  );
}
