# AI Mastery Challenge

A full-stack ASCII art generation system with CLI tool, Express backend server, and React frontend with real-time WebSocket communication.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [CLI Tool](#cli-tool)
- [Backend Server](#backend-server)
- [Frontend Application](#frontend-application)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Testing](#testing)
- [Technology Stack](#technology-stack)

---

## 🎯 Overview

This project is a comprehensive ASCII art generation system that allows users to:
- Generate ASCII art shapes (rectangles, circles, polygons) via CLI or web interface
- Create ASCII text banners with customizable fill patterns
- Transform shapes with rotate, mirror, and scale operations
- View real-time shape generation and transformation through WebSocket connections
- Manage shape history and persistence
- Export shapes to files

The project demonstrates modern JavaScript development practices including:
- ES Modules (import/export)
- Redux state management
- WebSocket real-time communication
- Comprehensive input validation
- Modular architecture with separation of concerns

---

## 📁 Project Structure

```
ai_mastery_challenge/
├── cli/                        # Command-line interface tool
│   ├── index.js               # CLI entry point & command router
│   ├── parser.js              # Argument parsing logic
│   ├── shapes.js              # Shape generation algorithms
│   ├── text.js                # ASCII text banner generation
│   ├── char_mapping.js        # Character mappings for text
│   ├── decorator.js           # Fill pattern implementations
│   ├── renderer.js            # Output rendering & file I/O
│   ├── generator.js           # Unified generation interface
│   ├── serializer.js          # Output format serialization
│   ├── grid.js                # Grid data structure with transformations
│   ├── transformer.js         # Transformation pipeline processor
│   ├── errors.js              # Custom error classes
│   └── README.md              # CLI documentation
│
├── server/                     # Express backend server
│   ├── index.js               # Server entry point & WebSocket setup
│   └── package.json           # Server dependencies
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── app/               # Redux store configuration
│   │   ├── features/          # Feature-based modules
│   │   │   ├── shapeGenerator/   # Shape generation UI
│   │   │   ├── shapes/          # Shape list & management
│   │   │   ├── history/         # Shape history tracking
│   │   │   └── ui/              # UI state management
│   │   ├── components/        # Shared UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── theme/             # Chakra UI theme config
│   │   └── main.jsx           # React app entry point
│   └── package.json           # Frontend dependencies
│
├── tests/                      # Test suites
│   ├── cli/                   # CLI tests
│   └── server/                # Server tests
│       ├── unit/              # Unit tests
│       └── integration/       # Integration tests
│
└── package.json               # Root package configuration
```

---

## 🏗️ Architecture

### System Components

```
┌─────────────────┐
│   CLI Tool      │ ← Direct file/console output
└─────────────────┘

┌─────────────────┐      WebSocket      ┌─────────────────┐
│  React Frontend │ ◄──────────────────► │  Express Server │
│  (Port 5173)    │      HTTP API       │  (Port 3001)    │
└─────────────────┘ ◄──────────────────► └─────────────────┘
        │                                         │
        │                                         │
        ▼                                         ▼
   Redux Store                           Shape Generator
   - Shape State                         - Uses CLI modules
   - UI State                            - Real-time streaming
   - History State
```

### Data Flow

1. **CLI Mode**: Direct command → Parser → Validator → Generator → Renderer → Output
2. **Web Mode**:
   - User Input → React Component → Redux Action → WebSocket Message
   - Server → Shape Generator → Stream Results → WebSocket → Redux Store → UI Update

---

## 🖥️ CLI Tool

### Purpose
Command-line tool for generating ASCII art shapes and text banners with various fill patterns.

### Core Modules

#### **index.js** - Command Router & Validation
- Entry point for the CLI application
- Command registration and routing (`draw`, `banner`)
- Argument validation and error handling
- Help system implementation
- Supports command aliases (`d` for draw, `b` for banner)

#### **parser.js** - Argument Parser
- Parses CLI arguments into structured format
- Handles multiple flag formats:
  - `--key=value` (equals syntax)
  - `--key value` (space-separated)
  - `-k value` (short flags)
- Distinguishes between flags and positional arguments
- Handles negative number values correctly

#### **shapes.js** - Shape Generation
Core shape generation algorithms:

**`generateRectangle({ width, height, char, filled })`**
- Creates rectangular ASCII art
- Supports hollow or filled rendering
- Uses nested loops for row/column iteration

**`generateCircle({ radius, isFilled })`**
- Circle generation using distance formula
- Algorithm: `sqrt((x - centerX)² + (y - centerY)²) ≈ radius`
- Tolerance-based edge detection (within 0.5 units)
- Optimization: Uses squared distances to avoid sqrt

**`generatePolygon({ sides, radius })`**
- Regular polygon generation
- Vertex calculation: `x = centerX + radius * cos(angle)`, `y = centerY + radius * sin(angle)`
- Line drawing between consecutive vertices using linear interpolation
- Bresenham-like algorithm for edge rendering

**`drawLine(grid, start, end)`**
- Linear interpolation between two points
- Calculates steps and increments for smooth lines

#### **text.js** - ASCII Text Generation
- Converts text strings to ASCII art
- Uses character mapping from `char_mapping.js`
- Supports uppercase A-Z and numbers 0-9
- 5x5 character grid for each letter
- Automatic spacing between characters

#### **decorator.js** - Fill Patterns
Implements four fill pattern types:

1. **Dots**: Replaces empty spaces with `.`
2. **Gradient**: Character density gradient
   - Uses density string: ` .:-=+*#%@`
   - Direction: horizontal or vertical
   - Position-based character selection
3. **Diagonal**: Alternating `/` pattern (checkerboard-style)
4. **Crosshatch**: Alternating `/` and `\` pattern

#### **renderer.js** - Output Rendering
- `gridOutputToString(gridArray)`: Converts 2D arrays to strings
- `exportShape({ shapeOutput, fileName, appendFile })`:
  - File path resolution
  - Directory creation (recursive)
  - UUID-based file naming
  - Append mode support
  - Comprehensive error handling

#### **generator.js** - Unified Interface
- Factory pattern for shape/text generation
- Abstracts shape type selection
- Single entry point for all generation

#### **serializer.js** - Output Formats
- `OutputSerializer` class
- Multiple output formats:
  - JSON (with metadata & timestamp)
  - ASCII (plain text)
  - HTML (with span wrapping)

#### **grid.js** - Grid Data Structure
- 2D grid abstraction for character storage
- Initialization:
  - `constructor({ width, height })`: Initialize empty grid
  - `constructor({ content })`: Initialize from string content
- Accessors:
  - `set(x, y, char)`: Set character at position
  - `get(x, y)`: Get character at position
  - `toArray()`: Convert to 2D array
  - `toString()`: Convert to string
- Transformations:
  - `rotate(degrees)`: Rotate grid (90°, 180°, 270°)
  - `mirror(axis)`: Mirror horizontally or vertically
  - `scale(factor)`: Scale by 0.5x or 2x
- Bounds checking for safe operations

#### **transformer.js** - Transformation Pipeline
- `Transformer.transform({ grid, transformations, options })`: Apply transformation pipeline
- Supports chaining multiple transformations:
  - **Rotate**: 90°, 180°, 270° clockwise rotation
  - **Mirror**: Horizontal or vertical reflection
  - **Scale**: 0.5x (shrink) or 2x (enlarge)
- Pipeline execution with reducer pattern
- File output support for transformed shapes

#### **errors.js** - Error Handling
Custom error classes for better debugging:
- `CLIError`: General CLI errors
- `ValidationError`: Input validation failures
- `ParseError`: Argument parsing errors
- `ShapeError`: Shape generation errors
- `RenderError`: Rendering failures
- `IOError`: File I/O errors

### CLI Usage Examples

```bash
# Draw shapes
mycli draw --shape=rectangle --width=10 --height=5 --filled
mycli draw --shape=circle --radius=8 --fillPattern=gradient --direction=vertical
mycli draw --shape=polygon --radius=6 --sides=5 --filled --output=shape.txt

# Generate text banners
mycli banner --text=HELLO --fillPattern=dots
mycli banner --text=CODE123 --fillPattern=gradient --width=10 --height=5

# File operations
mycli draw --shape=circle --radius=5 --output=myshape.txt
mycli draw --shape=rectangle --width=8 --height=4 --output=shapes.txt append
```

---

## 🔧 Backend Server

### Purpose
Express.js server with Socket.IO for real-time ASCII art generation and streaming.

### Core Components

#### **index.js** - Server Entry Point
- Express app setup with middleware
- Socket.IO WebSocket integration
- CORS configuration for frontend communication
- Real-time shape generation streaming

### Key Features

**WebSocket Events:**

*Client → Server:*
- `generateShape`: Request shape generation with `{ type, options }`
- `transformShape`: Request shape transformation with `{ shape, transformation }`
- `cancel-generation`: Cancel ongoing generation

*Server → Client (Generation):*
- `generateStart`: Signals generation start with `{ totalRows, shape }`
- `generateRow`: Streams each row with `{ rowIndex, data, progress }`
- `generateComplete`: Signals completion with `{ totalRows }`
- `generateError`: Reports errors with `{ message }`

*Server → Client (Transformation):*
- `transformRow`: Streams transformed output row-by-row
- `transformComplete`: Signals transformation completion
- `transformError`: Reports transformation errors

**Real-time Streaming Architecture:**

The server implements row-by-row streaming for real-time visualization:

1. **Grid Event System**: The `Grid` class extends `EventEmitter` to emit events during generation
   - `rowCompleted`: Emitted for each completed row with `{ rowIndex, data, total }`
   - `complete`: Emitted when all rows are generated

2. **Streaming Flow**:
   ```javascript
   // Server-side streaming
   grid.on('rowCompleted', ({ rowIndex, data, total }) => {
     socket.emit('generateRow', {
       rowIndex,
       data,
       progress: ((rowIndex + 1) / total) * 100
     })
   })
   grid.streamRowsV1() // Triggers row-by-row emission
   ```

3. **Frontend Reception**:
   - Listens for `generateRow` events
   - Progressively builds the shape display
   - Updates progress indicators in real-time

**Shape Generation & Transformation:**
- Imports CLI generator and transformer modules for reuse
- Supports all CLI shape types and options
- Applies transformations (rotate, mirror, scale) to existing shapes

**API Endpoints:**
- `/api/transform`: REST endpoint for shape transformations
- Health check endpoint (future expansion)

### Server Configuration
- **Port**: 3001
- **CORS Origin**: http://localhost:5173 (Vite dev server)
- **WebSocket**: Socket.IO v4.x

---

## ⚛️ Frontend Application

### Purpose
React-based web interface for ASCII art generation with real-time preview and state management.

### Architecture Pattern
**Feature-Based Structure** with Redux Toolkit for state management.

### Core Features

#### **Shape Generator** (`features/shapeGenerator/`)
React components and Redux slice for shape generation UI.

**Components:**
- `ShapeSelector.jsx`: Dropdown for shape type selection
- `OptionsPanel.jsx`: Dynamic options based on shape type
- `RectangleOptions.jsx`: Width/height inputs
- `CircleOptions.jsx`: Radius input
- `PolygonOptions.jsx`: Radius and sides inputs
- `TextOptions.jsx`: Text input with validation
- `GenerateButton.jsx`: Generation trigger
- `AsciiDisplay.jsx`: Real-time ASCII output display
- `TransformPanel.jsx`: Shape transformation controls (rotate, mirror, scale)

**Input Components** (`inputs/`):
- `NumberInput.jsx`: Number input with validation
- `TextInput.jsx`: Text input with pattern validation
- `SelectInput.jsx`: Dropdown select
- `CheckboxInput.jsx`: Boolean checkbox
- `ButtonInput.jsx`: Action button
- `SharedOptions.jsx`: Fill pattern options

**Validation** (`validation/`):
- `shapeValidationRules.js`: Validation rules per shape
- `useShapeValidation.js`: Custom validation hook

**State Management** (`shapeGeneratorSlice.js`):
```javascript
State: {
  currentShapeType: string | null,
  shapeOutput: string,
  options: {
    rectangle: { width, height, filled, fillPattern },
    circle: { radius, filled, fillPattern },
    polygon: { radius, sides, filled, fillPattern },
    text: { text, fillPattern, width, height }
  },
  isGenerating: boolean,
  isTransforming: boolean,
  error: string | null,
  transformError: string | null
}

Actions:
- setShape(shapeType)
- setOptions({ shapeType, options })
- clearCurrentShape()
- generateShape()
- generationComplete()
- generationError(error)
- transformShapeAsync({ transformations })
- transformComplete()
- transformError(error)
- syncTransformStart()
- syncTransformChunk(chunk)
- syncTransformComplete(output)
```

#### **Shapes Management** (`features/shapes/`)
Shape list display and management.

**Components:**
- `ShapesList.jsx`: Displays available shapes

**State** (`shapesSlice.js`):
```javascript
State: {
  availableTypes: string[],
  loading: boolean,
  error: string | null
}

Async Actions:
- fetchShapes(): Fetches available shape types from server
```

#### **History Tracking** (`features/history/`)
**State** (`shapesHistorySlice.js`):
```javascript
State: {
  history: Array<{
    id: string,
    shapeType: string,
    options: object,
    output: string,
    timestamp: string
  }>
}

Actions:
- addToHistory(shape)
- clearHistory()
```

#### **UI State** (`features/ui/`)
**State** (`uiSlice.js`):
```javascript
State: {
  sidebarCollapsed: boolean,
  theme: 'light' | 'dark'
}

Actions:
- toggleSidebar()
- setTheme(theme)
```

#### **WebSocket Hook** (`hooks/useWebSocket.js`)
Custom React hook for Socket.IO connection:
- Automatic connection management
- Event listener registration/cleanup
- Connection state tracking
- Message emission helpers

#### **Theme** (`theme/terminal.js`)
Chakra UI terminal-style theme:
- Monospace fonts
- Terminal color palette (green, cyan, yellow)
- Dark mode optimization
- Retro ASCII aesthetic

#### **Redux Store** (`app/store.js`)
Central state management:
```javascript
combineReducers({
  shapeGenerator: shapeGeneratorReducer,
  shapes: shapesReducer,
  history: historyReducer,
  ui: uiReducer
})
```

### Frontend Tech Stack
- **React 18**: UI framework
- **Redux Toolkit**: State management
- **Chakra UI v3**: Component library
- **Socket.IO Client**: WebSocket communication
- **Vite**: Build tool and dev server

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/djphillyg/ai_mastery_challenge.git
cd ai_mastery_challenge
```

2. **Install root dependencies**
```bash
npm install
```

3. **Install server dependencies**
```bash
cd server
npm install
cd ..
```

4. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

5. **Link CLI tool globally** (optional)
```bash
npm link
```

---

## 💻 Development

### Running the Full Stack

**All services (recommended):**
```bash
npm run dev:all
```
This starts both server (port 3001) and frontend (port 5173) concurrently.

**Individual services:**
```bash
# Backend server only
npm run dev:server

# Frontend only
npm run dev:frontend

# CLI tool
node cli/index.js <command>
# or (if globally linked)
mycli <command>
```

### Development Scripts

**Root package.json:**
```bash
npm run dev:all        # Run server + frontend concurrently
npm run dev:server     # Run backend server with hot reload
npm run dev:frontend   # Run frontend dev server
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix linting issues
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
npm test               # Run all tests
npm run test:cli       # Run CLI tests only
npm run test:server    # Run server tests only
```

**CLI usage:**
```bash
npm start              # Run CLI
npm run dev            # Run CLI with watch mode
```

---

## 🧪 Testing

### Test Structure
```
tests/
├── cli/                 # CLI unit tests
│   └── cli.test.js
└── server/
    ├── unit/           # Server unit tests
    └── integration/    # Integration tests
```

### Running Tests
```bash
npm test                      # All tests
npm run test:cli             # CLI tests
npm run test:server          # Server tests
npm run test:server:unit     # Server unit tests only
npm run test:server:integration  # Server integration tests
```

### Test Framework
- **Vitest**: Fast test runner with Jest-compatible API

---

## 🛠️ Technology Stack

### Core Technologies
- **JavaScript (ES2022+)**: Modern ECMAScript features
- **Node.js (>=18)**: Runtime environment
- **ES Modules**: Import/export syntax throughout

### Frontend
- **React 18**: Component-based UI
- **Redux Toolkit**: State management with slices
- **Chakra UI v3**: Component library
- **Socket.IO Client**: Real-time WebSocket
- **Vite**: Fast build tool and dev server

### Backend
- **Express.js**: Web server framework
- **Socket.IO**: WebSocket server
- **CORS**: Cross-origin resource sharing

### CLI
- **Custom argument parser**: Hand-built CLI argument handling
- **File System API**: Node.js fs module
- **UUID**: Unique file naming

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Vitest**: Testing framework
- **Concurrently**: Run multiple processes
- **dotenv**: Environment variables

### Code Quality
- **ES7+ features**: Async/await, destructuring, spread operators
- **Modular architecture**: Single responsibility principle
- **Error handling**: Custom error classes
- **Input validation**: Comprehensive validation layer
- **Type safety**: JSDoc annotations

---

## 📝 Key Algorithms

### Circle Generation
```
For each point (x, y) in grid:
  distance² = (x - centerX)² + (y - centerY)²
  if |distance² - radius²| < tolerance:
    mark as edge
  if filled && distance² < radius²:
    mark as filled
```

### Polygon Generation
```
For each vertex i from 0 to sides-1:
  angle = (2π × i) / sides
  vertexX = centerX + radius × cos(angle)
  vertexY = centerY + radius × sin(angle)

For each consecutive vertex pair:
  drawLine(vertex[i], vertex[i+1])
```

### Line Drawing (Linear Interpolation)
```
steps = max(|x2 - x1|, |y2 - y1|)
xIncrement = (x2 - x1) / steps
yIncrement = (y2 - y1) / steps

For i from 0 to steps:
  currentX = x1 + i × xIncrement
  currentY = y1 + i × yIncrement
  mark grid[round(currentX)][round(currentY)]
```

---

## 🎯 Future Enhancements

- [ ] More shape types (triangles, stars, hearts)
- [ ] Animation support (rotating shapes)
- [ ] Color support (ANSI colors in CLI)
- [ ] Shape composition (combine multiple shapes)
- [ ] Import/export shape definitions
- [ ] User authentication
- [ ] Shape gallery and sharing
- [ ] Performance optimizations for large shapes
- [ ] Mobile-responsive frontend
- [ ] Dark/light theme toggle

---

## 📄 License

ISC License

---

## 👨‍💻 Author

Created as part of the AI Mastery Challenge

Repository: https://github.com/djphillyg/ai_mastery_challenge

---

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

---

**Note**: This project demonstrates modern full-stack JavaScript development with emphasis on:
- Clean architecture
- Separation of concerns
- Real-time communication
- State management patterns
- Comprehensive validation
- Error handling
- Code reusability (CLI modules used in backend)