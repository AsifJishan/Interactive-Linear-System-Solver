# Interactive Linear System Solver

An interactive educational tool for visualizing and understanding numerical methods used to solve systems of linear equations. This application provides step-by-step visualization of different solving algorithms, making it perfect for students and educators learning numerical analysis.

## 🎯 Features

### Supported Methods

**Direct Methods:**
- **Gauss Elimination (Basic)** - Classic forward elimination with back substitution (no pivoting)
- **Gauss Elimination with Partial Pivoting** - Improved stability through row pivoting
- **Gauss-Jordan Elimination** - Complete elimination transforming matrix to reduced row echelon form (RREF)

**Iterative Methods:**
- **Jacobi Iteration** - Convergence-based iterative approach with error tracking
- **Gauss-Seidel Iteration** - Improved Jacobi method with faster convergence

### Interactive Visualization

- **Step-by-step animation** - Watch each operation unfold
- **Matrix highlighting** - Visual indicators for current pivot row, column, and cell operations
- **Playback controls** - Play, pause, skip forward/backward, and reset
- **Adjustable speed** - Control animation speed from 100ms to 2000ms per step
- **Live description** - Clear descriptions of each operation at every step
- **Real-time solution display** - Final solution shown at completion
- **Error convergence tracking** - For iterative methods, visualize error reduction

### Algorithm Comparison Tool

- **Compare All Methods** - Run all 5 algorithms simultaneously on the same system
- **Smart Recommendations** - AI-powered algorithm selection based on system characteristics
- **Performance Metrics** - Side-by-side comparison of:
  - Number of steps required
  - Convergence status
  - Time complexity
  - Efficiency ratings
- **Ranked Results** - Algorithms ranked by performance for the given input
- **Detailed Insights** - Analysis and recommendations for best algorithm choice

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Interactive-Linear-System-Solver
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 💻 Usage

### Single Method Solving

1. **Select a Method** - Choose from the dropdown menu (Direct or Iterative method)
2. **Input Matrix** - Enter the coefficient matrix A and vector b for your system Ax = b
3. **Adjust Size** - Select matrix size (2×2, 3×3, 4×4, etc.)
4. **Solve** - Click the "Solve System" button to generate step-by-step solution
5. **Visualize** - Use playback controls to step through the solution process
6. **Observe** - Watch matrix transformations, pivot selections, and row operations in real-time

### Comparing All Methods

1. **Input your system** - Set up matrix A and vector b
2. **Click "Compare All Methods"** - Purple button that runs all 5 algorithms
3. **Review Recommendation** - See which algorithm is best for your system
4. **Analyze Metrics** - View performance comparison table with:
   - Step count for each method
   - Convergence status
   - Efficiency ratings
   - Time complexity
5. **Explore Details** - Read detailed insights about top-performing methods
6. **Make Informed Choice** - Select algorithm based on recommendation and analysis

## 📁 Project Structure

```
src/
├── components/
│   ├── MatrixInput.jsx          # Matrix and vector input interface
│   └── Visualizer.jsx           # Step-by-step visualization display
├── utils/
│   ├── solverLogic.js           # Core numerical solver implementations
│   └── compareAlgorithms.js     # Algorithm comparison and ranking logic
├── App.jsx                      # Main application component
├── App.css                      # Application styles
├── index.css                    # Global styles
└── main.jsx                     # Application entry point
```

## 🔧 Technologies Used

- **React 18** - UI framework
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **PostCSS** - CSS transformation tool

## 📊 How It Works

### Direct Methods

These methods transform the augmented matrix [A|b] through row operations to reach:
- **Upper triangular form** (Gauss Elimination) - then back substitution
- **Reduced row echelon form** (Gauss-Jordan) - direct solution extraction

### Iterative Methods

These methods use an initial guess (usually zeros) and iteratively refine the solution:
- Calculate new approximation using current values
- Check convergence based on error tolerance
- Stop when error < tolerance or max iterations reached

### Comparison Metrics

The comparison tool evaluates algorithms using:

| Metric | Description |
|--------|-------------|
| **Steps** | Total operations/iterations to reach solution |
| **Type** | Direct (immediate) vs Iterative (convergence-based) |
| **Status** | Success indicator or convergence status |
| **Efficiency** | Relative performance score (0-100%) |
| **Complexity** | Big-O time complexity |
| **Advantage** | Special characteristics or best use cases |

## 📝 Example: Solving a 3×3 System

```
System: 
4x₁ - x₂        = 1
-x₁ + 4x₂ - x₃ = 2
      -x₂ + 3x₃ = 0

Matrix A:
[  4  -1   0 ]
[ -1   4  -1 ]
[  0  -1   3 ]

Vector b: [1, 2, 0]
```

**Workflow:**
1. Input the matrix and vector
2. Click "Compare All Methods" to see how each algorithm performs
3. The system recommends **Gauss Elimination with Pivoting** (fastest and most stable)
4. Select it from dropdown and click "Solve System" to watch step-by-step
5. Alternatively, select any method to see how it approaches the problem differently

**Comparison Results Example:**
- **Gauss Elimination:** 15 steps (basic, no pivoting)
- **Gauss with Pivoting:** 17 steps (safer, better stability)
- **Gauss-Jordan:** 21 steps (finds RREF, more operations)
- **Jacobi:** Converges in 12 iterations (iterative approach)
- **Gauss-Seidel:** Converges in 8 iterations (faster convergence)

## 🎓 Educational Value

- **Visual Learning** - See how each algorithm manipulates the matrix
- **Algorithm Comparison** - Compare different methods on the same system
- **Method Selection** - Learn which algorithm works best for different problem types
- **Numerical Stability** - Understand why pivoting matters
- **Convergence Analysis** - Watch iterative methods converge/diverge
- **Step Inspection** - Pause at any step to analyze operations
- **Performance Metrics** - Compare algorithms by steps, efficiency, and complexity

### Smart Recommendation System

The comparison tool automatically recommends the best algorithm based on:

**For Direct Methods:**
- Fewer steps = better efficiency
- Numerical stability considerations
- RREF computation requirements

**For Iterative Methods:**
- Convergence success
- Iteration count to convergence
- System diagonal dominance

**Selection Logic:**
- Direct methods generally preferred for smaller, well-conditioned systems
- Iterative methods better for large, sparse systems
- Recommends most efficient method for the specific input matrix

## 📋 Step Information Displayed

Each step includes:
- **Current Matrix** - State of the augmented matrix
- **Operation Description** - What calculation is being performed
- **Highlights** - Visual indicators for active rows/columns/cells
- **Multipliers/Factors** - Exact values used in row operations
- **Iteration Error** (iterative methods) - Convergence progress

## ⚙️ Configuration

### Solver Parameters

- **Tolerance** (iterative methods): Default 0.001
- **Max Iterations** (iterative methods): Default 50
- **Speed**: 100ms - 2000ms per step (adjustable in UI)

## 🐛 Troubleshooting

**Singular Matrix Error**: Ensure the coefficient matrix is non-singular (has an inverse)

**No Convergence**: For iterative methods, the system may not satisfy diagonal dominance conditions

**Unexpected Results**: Verify matrix input values and system format (Ax = b)

## 📖 References

- Burden & Faires - Numerical Analysis
- Chapra & Canale - Numerical Methods for Engineers
- Kincaid & Cheney - Numerical Analysis: Mathematics of Scientific Computing

## 👨‍💻 Contributing

Contributions are welcome! Feel free to:
- Report bugs and issues
- Suggest new numerical methods
- Improve visualization and UI
- Enhance documentation

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
