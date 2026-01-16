import React from 'react';
import { clsx } from 'clsx';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Visualizer = ({ stepData, isIterative }) => {
  if (!stepData) return <div className="text-gray-400 text-center p-10">Select a method and press Solve</div>;

  const { matrix, vector, xCurrent, description, highlights, errorHistory } = stepData;

  // Chart Data for Iterative Methods
  const chartData = isIterative && errorHistory ? {
    labels: errorHistory.map((_, i) => i + 1),
    datasets: [{
      label: 'Residual Error',
      data: errorHistory,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      tension: 0.1
    }]
  } : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
      <h3 className="text-lg font-semibold mb-2">Algorithm Visualization</h3>
      <div className="bg-gray-100 p-3 rounded mb-4 text-sm font-mono text-indigo-700">
        {description}
      </div>

      <div className="flex flex-wrap gap-8 justify-center mb-6">
        {/* Matrix Visualization */}
        <div>
          <h4 className="text-xs uppercase text-gray-500 mb-2">Augmented Matrix State</h4>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix.length}, 1fr)` }}>
            {matrix.map((row, r) => (
              row.map((val, c) => {
                const isHighlighted = highlights?.cells?.some(([hr, hc]) => hr === r && hc === c);
                const isRowActive = highlights?.rows?.includes(r);
                return (
                  <div key={`${r}-${c}`} className={clsx(
                    "w-12 h-12 flex items-center justify-center border rounded transition-colors duration-300",
                    isHighlighted ? "bg-yellow-200 font-bold border-yellow-400" : 
                    isRowActive ? "bg-blue-100" : "bg-white"
                  )}>
                    {val.toFixed(2)}
                  </div>
                );
              })
            ))}
          </div>
        </div>

        {/* Vector b Visualization */}
        <div>
           <h4 className="text-xs uppercase text-gray-500 mb-2">Vector B</h4>
           <div className="flex flex-col gap-1">
             {vector.map((val, r) => (
               <div key={r} className={clsx(
                 "w-12 h-12 flex items-center justify-center border rounded transition-colors duration-300",
                 highlights?.rows?.includes(r) ? "bg-green-100 border-green-400" : "bg-white"
               )}>
                 {val.toFixed(2)}
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Iterative Specific: Current X Values & Graph */}
      {isIterative && xCurrent && (
        <div className="mt-4 border-t pt-4">
          <div className="mb-4">
            <h4 className="text-sm font-bold mb-2">Current Approximation (x)</h4>
            <div className="flex gap-2">
              {xCurrent.map((val, i) => (
                <div key={i} className="px-3 py-1 bg-gray-800 text-white rounded text-sm">
                  x{i+1} = {val.toFixed(5)}
                </div>
              ))}
            </div>
          </div>
          <div className="h-64">
             {chartData && <Line options={{ responsive: true, maintainAspectRatio: false }} data={chartData} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Visualizer;