// src/utils/compareAlgorithms.js
import { solveGaussElimination, solveGaussEliminationWithPivoting, solveGaussJordan, solveJacobi, solveGaussSeidel } from './solverLogic';

// --- COMPARISON FUNCTION: Run all methods and compare ---
export const compareAllMethods = (matrix, vector) => {
    const results = {};
    
    // Run all methods
    results.gauss = solveGaussElimination(matrix, vector);
    results.pivoting = solveGaussEliminationWithPivoting(matrix, vector);
    results.gaussJordan = solveGaussJordan(matrix, vector);
    results.jacobi = solveJacobi(matrix, vector);
    results.seidel = solveGaussSeidel(matrix, vector);
    
    // Calculate metrics for each method
    const metrics = {};
    
    // Direct methods comparison
    metrics.gauss = {
        key: 'gauss',
        name: "Gauss Elimination",
        type: "direct",
        steps: results.gauss.steps.length,
        solution: results.gauss.solution,
        timeComplexity: "O(n³)",
        efficiency: 1.0,
        description: "Basic elimination without pivoting"
    };
    
    metrics.pivoting = {
        key: 'pivoting',
        name: "Gauss with Pivoting",
        type: "direct",
        steps: results.pivoting.steps.length,
        solution: results.pivoting.solution,
        timeComplexity: "O(n³)",
        efficiency: 0.95,
        advantage: "Better numerical stability",
        description: "Elimination with row pivoting for improved stability"
    };
    
    metrics.gaussJordan = {
        key: 'gaussJordan',
        name: "Gauss-Jordan",
        type: "direct",
        steps: results.gaussJordan.steps.length,
        solution: results.gaussJordan.solution,
        timeComplexity: "O(n³)",
        efficiency: 0.85,
        advantage: "Finds RREF, useful for matrix inverse",
        description: "Complete elimination to reduced row echelon form"
    };
    
    metrics.jacobi = {
        key: 'jacobi',
        name: "Jacobi Iteration",
        type: "iterative",
        steps: results.jacobi.steps.length,
        solution: results.jacobi.solution,
        converged: results.jacobi.converged,
        timeComplexity: "O(n²) per iteration",
        efficiency: results.jacobi.converged ? 0.7 : 0.0,
        advantage: "Easy parallelization",
        description: "Iterative method using Jacobi approach"
    };
    
    metrics.seidel = {
        key: 'seidel',
        name: "Gauss-Seidel",
        type: "iterative",
        steps: results.seidel.steps.length,
        solution: results.seidel.solution,
        converged: results.seidel.converged,
        timeComplexity: "O(n²) per iteration",
        efficiency: results.seidel.converged ? 0.8 : 0.0,
        advantage: "Faster convergence than Jacobi",
        description: "Iterative method with improved convergence"
    };
    
    // Determine best method
    let bestMethod = null;
    let bestScore = -1;
    let bestReason = "";
    
    // Score direct methods (prefer fewer steps)
    const directMethods = ['gauss', 'pivoting', 'gaussJordan'];
    for (let m of directMethods) {
        const score = 1000 / (metrics[m].steps + 1);
        if (score > bestScore) {
            bestScore = score;
            bestMethod = m;
        }
    }
    
    // Compare with iterative methods (prefer convergence and fewer steps)
    const iterativeMethods = ['jacobi', 'seidel'];
    for (let m of iterativeMethods) {
        let score = 0;
        if (metrics[m].converged) {
            score = 500 / (metrics[m].steps + 1);
        }
        if (score > bestScore) {
            bestScore = score;
            bestMethod = m;
        }
    }
    
    // Get recommendation reason
    bestReason = getReason(bestMethod, metrics);
    
    // Overall recommendation logic
    let recommendation = {
        bestMethod: bestMethod,
        reason: bestReason,
        allMetrics: metrics,
        results: results
    };
    
    return recommendation;
};

// Helper function to get recommendation reason
const getReason = (methodKey, metrics) => {
    if (!methodKey) return "Unable to determine best method.";
    
    const method = metrics[methodKey];
    
    if (method.type === 'direct') {
        if (methodKey === 'gauss') {
            return "✓ Best for well-conditioned systems. Simple and fastest.";
        } else if (methodKey === 'pivoting') {
            return "✓ RECOMMENDED! Better stability with minimal overhead.";
        } else if (methodKey === 'gaussJordan') {
            return "✓ Good for finding inverse or RREF. More operations required.";
        }
    } else {
        if (metrics[methodKey].converged) {
            if (methodKey === 'seidel') {
                return `✓ RECOMMENDED for iterative! Converged in ${metrics[methodKey].steps} steps. Faster convergence.`;
            } else {
                return `✓ Converged in ${metrics[methodKey].steps} steps. Good for sparse systems.`;
            }
        } else {
            return "✗ Did not converge. Try direct methods or check diagonal dominance.";
        }
    }
};

// Get efficiency ranking
export const getRanking = (metrics) => {
    const ranking = Object.entries(metrics)
        .map(([key, metric]) => ({
            ...metric,
            score: calculateScore(metric)
        }))
        .sort((a, b) => b.score - a.score);
    
    return ranking;
};

// Calculate performance score
const calculateScore = (metric) => {
    if (metric.type === 'direct') {
        return metric.efficiency * (1000 / (metric.steps + 1));
    } else {
        if (metric.converged) {
            return metric.efficiency * (500 / (metric.steps + 1));
        } else {
            return 0;
        }
    }
};
