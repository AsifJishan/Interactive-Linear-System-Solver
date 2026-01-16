import React from 'react';

const MatrixInput = ({ size, matrix, vector, onChange, onSizeChange }) => {
  const handleMatrixChange = (r, c, val) => {
    const newM = [...matrix];
    newM[r][c] = parseFloat(val) || 0;
    onChange(newM, vector);
  };

  const handleVectorChange = (r, val) => {
    const newV = [...vector];
    newV[r] = parseFloat(val) || 0;
    onChange(matrix, newV);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">System Input</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Size:</label>
          <select 
            value={size} 
            onChange={(e) => onSizeChange(parseInt(e.target.value))}
            className="border rounded p-1"
          >
            <option value={2}>2x2</option>
            <option value={3}>3x3</option>
            <option value={4}>4x4</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto matrix-scroll pb-2">
        {/* Matrix A */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(60px, 1fr))` }}>
          {matrix.map((row, r) => (
            row.map((val, c) => (
              <input
                key={`m-${r}-${c}`}
                type="number"
                value={val}
                onChange={(e) => handleMatrixChange(r, c, e.target.value)}
                className="w-16 h-12 text-center border rounded bg-blue-50 focus:ring-2 focus:ring-blue-500"
              />
            ))
          ))}
        </div>
        
        <div className="text-2xl font-bold text-gray-400">×</div>

        {/* Vector x (Label) */}
        <div className="flex flex-col gap-2">
          {Array(size).fill(0).map((_, i) => (
            <div key={i} className="w-10 h-12 flex items-center justify-center font-serif italic">x{i+1}</div>
          ))}
        </div>

        <div className="text-2xl font-bold text-gray-400">=</div>

        {/* Vector b */}
        <div className="flex flex-col gap-2">
          {vector.map((val, r) => (
            <input
              key={`v-${r}`}
              type="number"
              value={val}
              onChange={(e) => handleVectorChange(r, e.target.value)}
              className="w-16 h-12 text-center border rounded bg-green-50 focus:ring-2 focus:ring-green-500"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatrixInput;