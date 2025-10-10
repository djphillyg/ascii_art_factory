# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack ASCII art generation system with three integrated components:
1. **CLI tool** (`cli/`) - Standalone command-line ASCII art generator
2. **Express backend** (`server/`) - WebSocket server that reuses CLI modules for real-time generation
3. **React frontend** (`frontend/`) - Web UI with Redux state management and real-time streaming

The key architectural principle is **code reuse**: the server imports and uses the CLI's generator and Grid modules directly, ensuring consistent ASCII generation logic across CLI and web interfaces.

## Common Commands

### Development Workflow

```bash
# Run full stack (recommended for web development)
npm run dev:all              # Runs both server (3001) and frontend (5173)

# Run components individually
npm run dev:server           # Backend only with --watch
npm run dev:frontend         # Frontend only with Vite
node cli/index.js            # Run CLI directly

# Code quality
npm run lint                 # ESLint check
npm run lint:fix            # Auto-fix linting issues
npm run format              # Format with Prettier
npm run format:check        # Check formatting

# Testing
npm test                     # All tests (Vitest)
npm run test:cli            # CLI tests only
npm run test:server         # Server tests only
npm run test:server:unit    # Server unit tests
npm run test:server:integration  # Integration tests
```

### CLI Usage

```bash
# Link globally first (optional)
npm link

# Then use directly
mycli draw --shape=rectangle --width=10 --height=5 --filled
mycli draw --shape=circle --radius=8 --fillPattern=gradient
mycli draw --shape=polygon --sides=5 --radius=6
mycli banner --text=HELLO --fillPattern=dots

# With file output
mycli draw --shape=circle --radius=5 --output=shape.txt
mycli draw --shape=rectangle --width=8 --height=4 --output=shapes.txt append
```

## Architecture & Key Concepts

### Grid Class - The Foundation

The `Grid` class (`cli/grid.js`) is the core data structure used throughout the system:

- **Dual initialization modes**:
  - `new Grid({ width, height })` - Create empty grid
  - `new Grid({ content: string })` - Parse from string (newline-separated)

- **EventEmitter integration**: Extends `EventEmitter` for real-time streaming
  - Emits `rowCompleted` events during generation for WebSocket streaming
  - Emits `cellUpdated` when individual cells change
  - `streamRowsV1()` triggers post-generation row-by-row emission
  - `streamRowsWithDelay(delayMs)` adds animation delays

- **Coordinate system**: Uses `(row, col)` consistently
  - `row` = vertical position (y-axis)
  - `col` = horizontal position (x-axis)
  - Grid is stored as `grid[row][col]`

- **Static generator methods**: `Grid.generateCircle()`, `Grid.generateRectangle()`, `Grid.generatePolygon()`, `Grid.createText()` return new Grid instances

- **Transformation methods**: `rotate(degrees)`, `mirror(axis)`, `scale(factor)` return transformed Grid instances

### Real-time Streaming Architecture

The server implements row-by-row streaming for progressive rendering:

1. **Generation flow**:
   ```
   Client → 'generateShape' event → Server creates Grid
   → Grid.streamRowsV1() emits rowCompleted events
   → Server relays as 'generateRow' events → Client progressively renders
   ```

2. **WebSocket event patterns**:
   - **Client → Server**: `generateShape`, `transformShape`, `cancel-generation`
   - **Server → Client (generation)**: `generateStart`, `generateRow`, `generateComplete`, `generateError`
   - **Server → Client (transformation)**: `transformRow`, `transformComplete`, `transformError`

3. **Handler organization** (`server/socket/handlers/`):
   - `shapeHandler.js` - Shape generation WebSocket logic
   - `transformHandler.js` - Transformation WebSocket logic
   - Each handler imports CLI modules directly (no duplication)

### Code Reuse Pattern

**Critical**: Server imports CLI modules directly:
```javascript
// server/socket/handlers/shapeHandler.js
import Grid from '../../../cli/grid.js'  // Reuses CLI Grid class
```

When modifying shape generation logic:
- Edit `cli/grid.js` or related CLI modules
- Changes automatically apply to both CLI and web interface
- No need to duplicate logic in server code

### Frontend State Management

Redux Toolkit with feature-based slices:

- **`shapeGenerator/`**: Current shape being generated, options per shape type, generation state
- **`shapes/`**: Available shape types list
- **`history/`**: Generated shapes history with timestamps
- **`ui/`**: Sidebar collapse, theme settings

Key pattern: Options are stored per shape type, so switching shapes preserves previous settings:
```javascript
options: {
  rectangle: { width: 10, height: 5, filled: true, fillPattern: 'solid' },
  circle: { radius: 8, filled: false, fillPattern: 'gradient' },
  // ... persisted separately
}
```

### Transformation Pipeline

Transformations are applied sequentially to Grid instances:

```javascript
// In transformer.js or Grid.applyTransformation()
const transforms = [
  { type: 'rotate', params: { degrees: 90 } },
  { type: 'mirror', params: { axis: 'horizontal' } },
  { type: 'scale', params: { factor: 2.0 } }
]
// Each transformation creates a new Grid from the previous result
```

Allowed values:
- **rotate**: `90`, `180`, `270` (degrees clockwise)
- **mirror**: `'horizontal'` or `'vertical'`
- **scale**: `0.5` (shrink) or `2.0` (enlarge)

## Important Implementation Details

### Shape Generation Algorithms

**Circle** (`Grid.generateCircle`):
- Uses distance formula: `(col - centerCol)² + (row - centerRow)² ≈ radius²`
- Tolerance of 0.5 for edge detection
- Optimization: compares squared distances to avoid `Math.sqrt()`

**Polygon** (`Grid.generatePolygon`):
- Calculates vertices using polar coordinates: `x = centerX + radius × cos(angle)`
- Connects consecutive vertices with `drawLine()` using linear interpolation
- Bresenham-like algorithm for smooth edge rendering

**Rectangle** (`Grid.generateRectangle`):
- Simple row iteration with edge detection
- Hollow mode: only first/last rows and first/last columns filled

**Text** (`Grid.createText`):
- Uses 5x5 character grids from `char_mapping.js`
- Supports A-Z and 0-9
- Horizontally concatenates character grids with spacing via `rightAppend()`

### Fill Patterns (`decorator.js`)

Applied after base shape generation:
- **dots**: Replace spaces with `.`
- **gradient**: Position-based character density (` .:-=+*#%@`)
- **diagonal**: Checkerboard-style `/` pattern
- **crosshatch**: Alternating `/` and `\`

### Validation

- CLI validation happens in `cli/index.js` (command router)
- Server validation uses Joi schemas (`server/validation/`)
- Frontend validation via `features/shapeGenerator/validation/shapeValidationRules.js`

### Error Handling

Custom error classes in `cli/errors.js`:
- `CLIError`, `ValidationError`, `ParseError`
- `ShapeError`, `RenderError`, `IOError`

Use these for clear error categorization when adding features.

## Testing Approach

- **Vitest** as test runner (Jest-compatible API)
- Test structure: `tests/cli/`, `tests/server/unit/`, `tests/server/integration/`
- When modifying Grid or generators, add corresponding tests in `tests/cli/`
- Integration tests should verify WebSocket event flows

## Configuration

- **Environment variables**: Root `.env` for global, `server/.env` and `frontend/.env` for component-specific
- **CORS**: Server allows `http://localhost:5173` (Vite dev server)
- **Ports**: Server runs on 3001, frontend on 5173
- **ES Modules**: All code uses `import/export` (not `require`)

## Code Style & Patterns

- **Coordinate naming**: Always use `row, col` (not `x, y`) for grid positions to match internal storage
- **Immutability**: Transformation methods return new Grid instances rather than mutating
- **Factory pattern**: `generator.js` provides unified interface for shape creation
- **Event-driven**: Grid emits events for streaming; handlers listen and relay to clients
- **Lodash**: Used sparingly (e.g., `_.zipWith` in `Grid.rightAppend`)

## When Adding Features

1. **New shape type**:
   - Add static generator method to `Grid` class
   - Add validation rules in CLI, server, and frontend
   - Add option components in `frontend/src/features/shapeGenerator/inputs/`
   - Update `shapeGeneratorSlice.js` with default options

2. **New transformation**:
   - Add method to `Grid` class (e.g., `grid.flip()`)
   - Update `Grid.applyTransformation()` switch statement
   - Update `Grid.allowed_*` static arrays
   - Add UI controls in `TransformPanel.jsx`

3. **New fill pattern**:
   - Add function to `decorator.js`
   - Update validation in all three layers
   - Add option to `SharedOptions.jsx`

## File Organization Logic

- **`cli/`**: All CLI-specific logic (parsing, rendering, file I/O)
  - `grid.js`: Core Grid class with generators and transformations (reused by server)
  - `generator.js`, `shapes.js`, `text.js`: Higher-level generation interfaces
  - `decorator.js`: Fill pattern implementations

- **`server/socket/handlers/`**: WebSocket event handlers that import CLI modules

- **`frontend/src/features/`**: Feature-based structure (not component-based)
  - Each feature has its own slice, components, and hooks
  - Shared components in `frontend/src/components/`

## Common Gotchas

- **Grid coordinates**: Remember `grid[row][col]`, not `grid[x][y]`
- **Streaming timing**: Use `streamRowsV1()` for immediate emission, `streamRowsWithDelay()` for animation
- **Transformation order matters**: Rotate then mirror produces different results than mirror then rotate
- **Import paths**: Server imports from CLI use relative paths like `'../../../cli/grid.js'`
- **WebSocket events**: Always emit `generateStart` before streaming rows, and `generateComplete` at end