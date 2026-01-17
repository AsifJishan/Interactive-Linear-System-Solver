// src/utils/solverLogic.js

// Helper to deep copy matrix to avoid mutation issues
const copyMatrix = (m) => m.map(row => [...row]);
const copyVector = (v) => [...v];

/**
 * Standard Result Format:
 * {
 *   steps: [ { matrix, vector, description, highlights: { rows: [], cols: [], cells: [] } } ],
 *   solution: [],
 *   converged: boolean
 * }
 */

// --- DIRECT METHOD: Gauss Elimination (Basic) ---
export const solveGaussElimination = (matrix, vector) => {
    let A = copyMatrix(matrix);
    let b = copyVector(vector);
    let n = A.length;
    let steps = [];

    steps.push({
        matrix: copyMatrix(A),
        vector: copyVector(b),
        description: "Gauss Elimination (NO PIVOTING) - Forward elimination without row swaps",
        highlights: {}
    });

    // 1. Forward Elimination (NO PIVOTING)
    for (let k = 0; k < n; k++) {
        // Record step: Pivot Selection
        steps.push({
            matrix: copyMatrix(A),
            vector: copyVector(b),
            description: `[NO PIVOTING] Step ${k+1}: Use diagonal element A[${k}][${k}] = ${A[k][k].toFixed(2)} as pivot (no row search)`,
            highlights: { cells: [[k, k]] }
        });

        for (let i = k + 1; i < n; i++) {
            let factor = A[i][k] / A[k][k];
            
            steps.push({
                matrix: copyMatrix(A),
                vector: copyVector(b),
                description: `Eliminating Row ${i}: R${i} = R${i} - (${factor.toFixed(2)}) * R${k}`,
                highlights: { rows: [i, k], cells: [[i, k]] }
            });

            for (let j = k; j < n; j++) {
                A[i][j] = A[i][j] - factor * A[k][j];
            }
            b[i] = b[i] - factor * b[k];
        }
    }

    // 2. Back Substitution
    let x = new Array(n).fill(0);
    steps.push({
        matrix: copyMatrix(A),
        vector: copyVector(b),
        description: "Forward elimination complete. Starting Back Substitution.",
        highlights: {}
    });

    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += A[i][j] * x[j];
        }
        x[i] = (b[i] - sum) / A[i][i];
        
        steps.push({
            matrix: copyMatrix(A),
            vector: copyVector(b),
            description: `Solving x[${i}]: (${b[i].toFixed(2)} - ${sum.toFixed(2)}) / ${A[i][i].toFixed(2)} = ${x[i].toFixed(4)}`,
            highlights: { rows: [i] }
        });
    }

    return { steps, solution: x, type: 'direct' };
};

// --- ITERATIVE METHOD: Jacobi Iteration ---
export const solveJacobi = (matrix, vector, tolerance = 0.001, maxIter = 50) => {
    let n = matrix.length;
    let x = new Array(n).fill(0); // Initial guess
    let steps = [];
    let errors = [];

    steps.push({
        matrix: matrix,
        vector: vector,
        xCurrent: [...x],
        description: "Initial Guess: All zeros",
        highlights: {}
    });

    for (let iter = 0; iter < maxIter; iter++) {
        let xNew = new Array(n).fill(0);
        
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                if (i !== j) sum += matrix[i][j] * x[j];
            }
            xNew[i] = (vector[i] - sum) / matrix[i][i];
        }

        // Calculate Error (Euclidean Norm)
        let errorSum = 0;
        for(let i=0; i<n; i++) errorSum += Math.pow(xNew[i] - x[i], 2);
        let error = Math.sqrt(errorSum);
        
        errors.push(error);
        steps.push({
            matrix: matrix,
            vector: vector,
            xCurrent: [...xNew],
            description: `Iteration ${iter + 1}: Error = ${error.toExponential(2)}`,
            highlights: {},
            errorHistory: [...errors]
        });

        x = [...xNew];

        if (error < tolerance) {
            return { steps, solution: x, converged: true, type: 'iterative' };
        }
    }

    return { steps, solution: x, converged: false, type: 'iterative' };
};

// --- DIRECT METHOD: Gauss Elimination with Partial Pivoting ---
export const solveGaussEliminationWithPivoting = (matrix, vector) => {
    let A = copyMatrix(matrix);
    let b = copyVector(vector);
    let n = A.length;
    let steps = [];

    steps.push({
        matrix: copyMatrix(A),
        vector: copyVector(b),
        description: "Gauss Elimination with PARTIAL PIVOTING - Search for largest pivot to improve stability",
        highlights: {}
    });

    // 1. Forward Elimination with Pivoting
    for (let k = 0; k < n; k++) {
        // Find pivot row
        let pivotRow = k;
        for (let i = k + 1; i < n; i++) {
            if (Math.abs(A[i][k]) > Math.abs(A[pivotRow][k])) {
                pivotRow = i;
            }
        }

        // Swap rows if necessary
        if (pivotRow !== k) {
            [A[k], A[pivotRow]] = [A[pivotRow], A[k]];
            [b[k], b[pivotRow]] = [b[pivotRow], b[k]];
            steps.push({
                matrix: copyMatrix(A),
                vector: copyVector(b),
                description: `[PIVOTING] Swap Row ${k} ↔ Row ${pivotRow} (found larger pivot: ${A[k][k].toFixed(2)})`,
                highlights: { rows: [k, pivotRow] }
            });
        }

        // Record step: Pivot Selection
        steps.push({
            matrix: copyMatrix(A),
            vector: copyVector(b),
            description: `[PIVOTING] Step ${k+1}: Selected pivot A[${k}][${k}] = ${A[k][k].toFixed(2)} (largest in column)`,
            highlights: { cells: [[k, k]] }
        });

        for (let i = k + 1; i < n; i++) {
            let factor = A[i][k] / A[k][k];
            
            steps.push({
                matrix: copyMatrix(A),
                vector: copyVector(b),
                description: `Eliminating Row ${i}: R${i} = R${i} - (${factor.toFixed(2)}) * R${k}`,
                highlights: { rows: [i, k], cells: [[i, k]] }
            });

            for (let j = k; j < n; j++) {
                A[i][j] = A[i][j] - factor * A[k][j];
            }
            b[i] = b[i] - factor * b[k];
        }
    }

    // 2. Back Substitution
    let x = new Array(n).fill(0);
    steps.push({
        matrix: copyMatrix(A),
        vector: copyVector(b),
        description: "Forward elimination complete. Starting Back Substitution.",
        highlights: {}
    });

    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += A[i][j] * x[j];
        }
        x[i] = (b[i] - sum) / A[i][i];
        
        steps.push({
            matrix: copyMatrix(A),
            vector: copyVector(b),
            description: `Solving x[${i}]: (${b[i].toFixed(2)} - ${sum.toFixed(2)}) / ${A[i][i].toFixed(2)} = ${x[i].toFixed(4)}`,
            highlights: { rows: [i] }
        });
    }

    return { steps, solution: x, type: 'direct' };
};

// --- DIRECT METHOD: Gauss-Jordan Elimination ---
export const solveGaussJordan = (matrix, vector) => {
    let A = copyMatrix(matrix);
    let b = copyVector(vector);
    let n = A.length;
    let steps = [];

    // 1. Forward and Backward Elimination (to RREF)
    for (let k = 0; k < n; k++) {
        // Find pivot row (partial pivoting for stability)
        let pivotRow = k;
        for (let i = k + 1; i < n; i++) {
            if (Math.abs(A[i][k]) > Math.abs(A[pivotRow][k])) {
                pivotRow = i;
            }
        }

        // Swap rows if necessary
        if (pivotRow !== k) {
            [A[k], A[pivotRow]] = [A[pivotRow], A[k]];
            [b[k], b[pivotRow]] = [b[pivotRow], b[k]];
            steps.push({
                matrix: copyMatrix(A),
                vector: copyVector(b),
                description: `Pivoting: Swap Row ${k} with Row ${pivotRow}`,
                highlights: { rows: [k, pivotRow] }
            });
        }

        // Record step: Pivot Selection
        steps.push({
            matrix: copyMatrix(A),
            vector: copyVector(b),
            description: `Step ${k+1}: Select pivot A[${k}][${k}] = ${A[k][k].toFixed(2)}`,
            highlights: { cells: [[k, k]] }
        });

        // Normalize pivot row
        let pivotValue = A[k][k];
        for (let j = k; j < n; j++) {
            A[k][j] = A[k][j] / pivotValue;
        }
        b[k] = b[k] / pivotValue;

        steps.push({
            matrix: copyMatrix(A),
            vector: copyVector(b),
            description: `Normalize Row ${k}: Divide by ${pivotValue.toFixed(2)}`,
            highlights: { rows: [k] }
        });

        // Eliminate column (both above and below pivot)
        for (let i = 0; i < n; i++) {
            if (i !== k) {
                let factor = A[i][k];
                
                steps.push({
                    matrix: copyMatrix(A),
                    vector: copyVector(b),
                    description: `Eliminating Row ${i}: R${i} = R${i} - (${factor.toFixed(2)}) * R${k}`,
                    highlights: { rows: [i, k], cells: [[i, k]] }
                });

                for (let j = k; j < n; j++) {
                    A[i][j] = A[i][j] - factor * A[k][j];
                }
                b[i] = b[i] - factor * b[k];
            }
        }
    }

    // 2. Extract solution (diagonal matrix form gives direct solution)
    let x = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        x[i] = b[i];
    }

    steps.push({
        matrix: copyMatrix(A),
        vector: copyVector(b),
        description: "Gauss-Jordan elimination complete. Matrix is in reduced row echelon form (RREF).",
        highlights: {}
    });

    return { steps, solution: x, type: 'direct' };
};

// --- ITERATIVE METHOD: Gauss-Seidel Iteration ---
export const solveGaussSeidel = (matrix, vector, tolerance = 0.001, maxIter = 50) => {
    let n = matrix.length;
    let x = new Array(n).fill(0); // Initial guess
    let steps = [];
    let errors = [];

    steps.push({
        matrix: matrix,
        vector: vector,
        xCurrent: [...x],
        description: "Initial Guess: All zeros",
        highlights: {}
    });

    for (let iter = 0; iter < maxIter; iter++) {
        let xNew = [...x];
        
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    if (j < i) {
                        sum += matrix[i][j] * xNew[j]; // Use updated values
                    } else {
                        sum += matrix[i][j] * x[j]; // Use old values
                    }
                }
            }
            xNew[i] = (vector[i] - sum) / matrix[i][i];
        }

        // Calculate Error (Euclidean Norm)
        let errorSum = 0;
        for(let i=0; i<n; i++) errorSum += Math.pow(xNew[i] - x[i], 2);
        let error = Math.sqrt(errorSum);
        
        errors.push(error);
        steps.push({
            matrix: matrix,
            vector: vector,
            xCurrent: [...xNew],
            description: `Iteration ${iter + 1}: Error = ${error.toExponential(2)}`,
            highlights: {},
            errorHistory: [...errors]
        });

        x = [...xNew];

        if (error < tolerance) {
            return { steps, solution: x, converged: true, type: 'iterative' };
        }
    }

    return { steps, solution: x, converged: false, type: 'iterative' };
};