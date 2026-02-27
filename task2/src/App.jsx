import React, { Suspense, lazy } from 'react';

// Lazy loading the Three.js viewer component
const ModelViewer = lazy(() => import('./ModelViewer'));

function App() {
  return (
    <div className="w-full h-screen bg-gray-50 overflow-hidden font-sans">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50">
          <div className="animate-spin w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"></div>
          <p className="text-xl font-medium text-gray-600 animate-pulse">Initializing 3D Engine...</p>
        </div>
      }>
        <ModelViewer />
      </Suspense>
    </div>
  );
}

export default App;
