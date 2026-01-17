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

1. **Select a Method** - Choose from the dropdown menu (Direct or Iterative method)
2. **Input Matrix** - Enter the coefficient matrix A and vector b for your system Ax = b
3. **Adjust Size** - Select matrix size (2×2, 3×3, 4×4, etc.)
4. **Solve** - Click the "Solve System" button to generate step-by-step solution
5. **Visualize** - Use playback controls to step through the solution process
6. **Observe** - Watch matrix transformations, pivot selections, and row operations in real-time

## 📁 Project Structure

```
src/
├── components/
│   ├── MatrixInput.jsx      # Matrix and vector input interface
│   └── Visualizer.jsx       # Step-by-step visualization display
├── utils/
│   └── solverLogic.js       # Core numerical solver implementations
├── App.jsx                  # Main application component
├── App.css                  # Application styles
├── index.css                # Global styles
└── main.jsx                 # Application entry point
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

Select any method, input these values, and watch the algorithm solve it step-by-step!

## 🎓 Educational Value

- **Visual Learning** - See how each algorithm manipulates the matrix
- **Algorithm Comparison** - Compare different methods on the same system
- **Numerical Stability** - Understand why pivoting matters
- **Convergence Analysis** - Watch iterative methods converge/diverge
- **Step Inspection** - Pause at any step to analyze operations

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

This project is open source and available under the MIT License.

## 🙋 Support

For questions or issues, please open an issue on the repository or contact the development team.
