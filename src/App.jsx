import React, { useState, useEffect } from 'react';
import MatrixInput from './components/MatrixInput';
import Visualizer from './components/Visualizer';
import { solveGaussElimination, solveGaussEliminationWithPivoting, solveGaussJordan, solveJacobi, solveGaussSeidel } from './utils/solverLogic';
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
      </main>
    </div>
  );
}

export default App;