import React, { useState, useEffect } from 'react';
import MatrixInput from './components/MatrixInput';
import Visualizer from './components/Visualizer';
import { solveGaussElimination, solveGaussEliminationWithPivoting, solveGaussJordan, solveJacobi, solveGaussSeidel } from './utils/solverLogic';
import { compareAllMethods, getRanking } from './utils/compareAlgorithms';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

function App() {
  // --- STATE ---
  const [size, setSize] = useState(3);
  const [matrix, setMatrix] = useState([[4, -1, 0], [-1, 4, -1], [0, -1, 3]]);
  const [vector, setVector] = useState([1, 2, 0]); // b vector
  
  const [method, setMethod] = useState('gauss'); // 'gauss', 'jacobi', etc.
  const [steps, setSteps] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms per step
  const [comparison, setComparison] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  // --- HANDLERS ---
  const handleSizeChange = (newSize) => {
    setSize(newSize);
    // Reset matrix/vector with zeros or identity logic
    const newM = Array(newSize).fill(0).map(() => Array(newSize).fill(0));
    const newV = Array(newSize).fill(0);
    // Fill diagonal to avoid singular matrix by default
    for(let i=0; i<newSize; i++) newM[i][i] = 1;
    
    setMatrix(newM);
    setVector(newV);
    resetSolver();
  };

  const resetSolver = () => {
    setSteps(null);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleSolve = () => {
    resetSolver();
    let result;
    if (method === 'gauss') {
      result = solveGaussElimination(matrix, vector);
    } else if (method === 'pivoting') {
      result = solveGaussEliminationWithPivoting(matrix, vector);
    } else if (method === 'gauss-jordan') {
      result = solveGaussJordan(matrix, vector);
    } else if (method === 'jacobi') {
      result = solveJacobi(matrix, vector);
    } else if (method === 'seidel') {
      result = solveGaussSeidel(matrix, vector);
    }
    // Add other methods here...
    
    setSteps(result);
  };

  const handleCompare = () => {
    const compResult = compareAllMethods(matrix, vector);
    setComparison(compResult);
    setShowComparison(true);
  };

  // --- ANIMATION LOOP ---
  useEffect(() => {
    if (!isPlaying || !steps) return;
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev >= steps.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [isPlaying, steps, speed]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-gray-800">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-blue-900">Interactive Linear System Solver by team WiFi Problem</h1>
        <p className="text-gray-600">Visualize Numerical Methods Step-by-Step</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Column: Settings & Input */}
          <div className="md:col-span-3 lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <label className="block text-sm font-bold mb-2">Select Method</label>
              <select 
                value={method} 
                onChange={(e) => { setMethod(e.target.value); resetSolver(); }}
                className="w-full border p-2 rounded"
              >
                <option value="gauss">Gauss Elimination (Basic)</option>
                <option value="pivoting">Gauss with Pivoting</option>
                <option value="gauss-jordan">Gauss-Jordan Elimination</option>
                <option value="jacobi">Jacobi Iteration</option>
                <option value="seidel">Gauss-Seidel</option>
              </select>
            </div>

            <button 
              onClick={handleSolve}
              className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
            >
              Solve System
            </button>

            <button 
              onClick={handleCompare}
              className="w-full bg-purple-600 text-white py-3 rounded font-bold hover:bg-purple-700 transition"
            >
              Compare All Methods
            </button>
          </div>

          {/* Right Column: Matrix Input (Span 2) */}
          <div className="md:col-span-3 lg:col-span-2">
            <MatrixInput 
              size={size} 
              matrix={matrix} 
              vector={vector} 
              onChange={(m, v) => { setMatrix(m); setVector(v); resetSolver(); }}
              onSizeChange={handleSizeChange}
            />
          </div>
        </div>

        {/* Visualization Area */}
        <div className="mt-8">
          {steps && (
            <>
              {/* Controls */}
              <div className="flex items-center justify-between bg-white p-4 rounded-t shadow border-b">
                <div className="flex gap-2">
                  <button onClick={() => setCurrentStepIndex(0)} className="p-2 hover:bg-gray-100 rounded"><RotateCcw size={20}/></button>
                  <button onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex-1))} className="p-2 hover:bg-gray-100 rounded"><SkipBack size={20}/></button>
                  <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 hover:bg-gray-100 rounded text-blue-600">
                    {isPlaying ? <Pause size={24}/> : <Play size={24}/>}
                  </button>
                  <button onClick={() => setCurrentStepIndex(Math.min(steps.steps.length-1, currentStepIndex+1))} className="p-2 hover:bg-gray-100 rounded"><SkipForward size={20}/></button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Speed:</span>
                  <input 
                    type="range" min="100" max="2000" step="100" 
                    value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-24"
                  />
                </div>

                <div className="font-mono font-bold text-lg">
                  Step {currentStepIndex + 1} / {steps.steps.length}
                </div>
              </div>

              {/* The Visualizer */}
              <Visualizer 
                stepData={steps.steps[currentStepIndex]} 
                isIterative={steps.type === 'iterative'} 
              />
              
              {/* Final Solution Display */}
              {currentStepIndex === steps.steps.length - 1 && (
                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded text-center">
                  <h3 className="font-bold text-green-800">Final Solution</h3>
                  <p className="font-mono mt-2">
                    {steps.solution.map((x, i) => `x${i+1} = ${x.toFixed(4)}`).join(', ')}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Comparison Section */}
        {showComparison && comparison && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Algorithm Comparison</h2>
              <button 
                onClick={() => setShowComparison(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Close Comparison
              </button>
            </div>

            {/* Best Method Recommendation */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-400 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-purple-900 mb-2">
                🎯 Recommended Method: {comparison.allMetrics[comparison.bestMethod].name}
              </h3>
              <p className="text-lg text-purple-800 font-semibold">{comparison.reason}</p>
            </div>

            {/* Metrics Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-3 text-left font-bold">Method</th>
                    <th className="border p-3 text-center font-bold">Type</th>
                    <th className="border p-3 text-center font-bold">Steps</th>
                    <th className="border p-3 text-center font-bold">Status</th>
                    <th className="border p-3 text-center font-bold">Efficiency</th>
                    <th className="border p-3 text-center font-bold">Complexity</th>
                  </tr>
                </thead>
                <tbody>
                  {getRanking(comparison.allMetrics).map((metric) => (
                    <tr 
                      key={metric.key}
                      className={metric.key === comparison.bestMethod ? "bg-yellow-50 border-l-4 border-l-yellow-500" : ""}
                    >
                      <td className="border p-3 font-semibold text-gray-800">{metric.name}</td>
                      <td className="border p-3 text-center">
                        <span className={`px-3 py-1 rounded text-white font-bold ${metric.type === 'direct' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                          {metric.type === 'direct' ? 'Direct' : 'Iterative'}
                        </span>
                      </td>
                      <td className="border p-3 text-center font-mono text-gray-700">{metric.steps}</td>
                      <td className="border p-3 text-center">
                        {metric.type === 'direct' ? (
                          <span className="text-green-600 font-bold">✓ Direct</span>
                        ) : (
                          <span className={metric.converged ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                            {metric.converged ? '✓ Converged' : '✗ No Conv.'}
                          </span>
                        )}
                      </td>
                      <td className="border p-3 text-center">
                        <div className="w-full bg-gray-200 rounded-full h-6">
                          <div 
                            className="bg-blue-500 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ width: `${metric.efficiency * 100}%` }}
                          >
                            {(metric.efficiency * 100).toFixed(0)}%
                          </div>
                        </div>
                      </td>
                      <td className="border p-3 text-center font-mono text-gray-700">{metric.timeComplexity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Details Section */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {getRanking(comparison.allMetrics).slice(0, 2).map((metric) => (
                <div key={metric.key} className="bg-white p-6 rounded-lg shadow border-l-4 border-l-blue-500">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">{metric.name}</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Type:</span> {metric.type === 'direct' ? 'Direct Method' : 'Iterative Method'}</p>
                    <p><span className="font-semibold">Steps:</span> {metric.steps}</p>
                    <p><span className="font-semibold">Complexity:</span> {metric.timeComplexity}</p>
                    {metric.advantage && <p className="text-green-700 font-semibold">💡 {metric.advantage}</p>}
                    {metric.description && <p className="text-gray-600 italic">{metric.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;