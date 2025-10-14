# ASCII Art Factory

A full-stack ASCII art generation system demonstrating modern JavaScript development practices, AI integration, and real-time WebSocket communication.

**Project Timeline:** 3 weeks (October 2025)
**Tech Stack:** Node.js, React, Redux, Express, WebSocket, Anthropic Claude API

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Context](#project-context)
- [Planning & Workflow](#planning--workflow)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [CLI Tool](#cli-tool)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)

---

## 🎯 Overview

This project is a comprehensive ASCII art generation system that demonstrates:

**Core Capabilities:**

- **🤖 AI-Powered Generation**: Natural language ASCII art creation using Claude API
- **🖥️ CLI Tool**: Standalone command-line interface for shape generation
- **🌐 Full-Stack Web App**: React frontend with Express backend and real-time WebSocket streaming
- **🔄 Advanced Transformations**: Rotate, mirror, scale operations on generated shapes
- **📜 Shape Composition**: Multi-step recipe execution system for complex ASCII art

**Technical Highlights:**

- Modern ES Modules throughout
- Redux Toolkit state management
- Real-time streaming with Socket.IO
- Modular architecture with code reuse (server imports CLI modules)
- Comprehensive input validation and error handling
- Feature-based frontend structure

---

## 📚 Project Context

### Background & Motivation

After taking a year off from working, I wanted to:

1. **Refresh my coding skills** before entering conversations with AI companies
2. **Learn the state of AI-assisted development** and modern tooling
3. **Build a substantial portfolio project** showcasing full-stack capabilities

I completed Anthropic's 8-hour Claude API course (covering tool use, prompt engineering, agents, and workflows) and decided to build this project to demonstrate what I learned while sharpening my JavaScript/TypeScript fundamentals.

---

## 🗓️ Planning & Workflow

### Structured Learning Approach

Rather than diving in blindly, I created a **12-day structured syllabus** (3 hours/day) to methodically build this project:

#### **Phase 1: Foundation (Days 1-4)**

- Analyzed interview requirements for CLI tools
- Broke down the project into Priority 1 (Critical), Priority 2 (Important), and Priority 3 (Nice to Have)
- Focused on:
  - Command-line argument parsing
  - Basic shape generation algorithms (rectangles, circles)
  - Error handling and validation
  - Code architecture and separation of concerns

#### **Phase 2: Expansion (Days 5-8)**

- Added advanced shapes (polygons, text banners)
- Implemented transformation pipeline (rotate, mirror, scale)
- Built Express backend with WebSocket support
- Created real-time streaming system for progressive rendering

#### **Phase 3: Full-Stack Integration (Days 9-12)**

- Developed React frontend with Redux state management
- Integrated Anthropic Claude API for natural language generation
- Built recipe execution engine for multi-step shape compositions
- Polished UI/UX with Chakra UI terminal theme

### Key Development Principles

**1. Pseudocode Objectives First**
Each day started with crystal-clear objectives written in pseudocode or test-case format. For example:

```
OBJECTIVE: Implement circle generation using distance formula
TEST CASE: generateCircle({ radius: 5 }) should produce symmetric circle
EDGE CASES: Handle radius = 0, radius > 50, ensure pixel-perfect rendering
```

**2. AI as a Refresher, Not a Writer**
I intentionally **did not let AI write my code**. Instead, I used Claude Code to:

- Explain algorithms (distance formula for circles, Bresenham-like line drawing)
- Review my code for best practices
- Suggest architectural patterns (EventEmitter for streaming, Redux slices)
- Debug issues when stuck

This approach ensured I truly refreshed my skills rather than just generating code.

**3. Adaptive Planning**
After each day, I evaluated progress and adjusted objectives:

- **Days 1-2**: Slower than expected on CLI parsing → extended to Day 3
- **Day 5**: Faster on shapes → added fill patterns (dots, gradient, crosshatch)
- **Days 9-10**: WebSocket integration complex → carved out extra time for debugging

### Workflow Tools & Organization

**Daily Structure:**

1. **Morning (1 hour)**: Review previous day's code, read objectives
2. **Midday (1.5 hours)**: Core implementation work
3. **Afternoon (0.5 hours)**: Testing, git commits, update syllabus

**Documentation:**

- `CLAUDE.md`: Comprehensive guidance for AI-assisted development
- `syllabus_prompt.md`: Master syllabus with themes and motivational quotes

**Version Control:**

- Frequent commits with descriptive messages
- Feature branches for major additions (AI integration, transformations)
- Used Claude Code for commit message generation

---

## 📁 Project Structure

```
ascii_art_factory/
├── cli/                     # Standalone CLI tool
│   ├── grid.js             # Core Grid class (reused by server)
│   ├── shapes.js           # Shape generation algorithms
│   ├── text.js             # ASCII text banners
│   ├── decorator.js        # Fill patterns (gradient, dots, crosshatch)
│   ├── transformer.js      # Transformation pipeline
│   └── index.js            # CLI entry point
│
├── server/                  # Express backend
│   ├── index.js            # Server & WebSocket setup
│   ├── ai/                 # AI integration
│   │   ├── claudeService.js       # Anthropic API client
│   │   ├── recipeExecutor.js     # Recipe execution engine
│   │   └── ascii_prompt.md       # System prompt for Claude
│   └── socket/handlers/    # WebSocket event handlers
│
├── frontend/                # React application
│   ├── src/
│   │   ├── app/            # Redux store
│   │   ├── features/       # Feature-based modules
│   │   │   ├── shapeGenerator/   # Manual mode UI
│   │   │   ├── aiInput/          # AI mode UI
│   │   │   ├── history/          # Shape history
│   │   │   └── mode/             # Mode toggle
│   │   └── hooks/          # useWebSocket hook
│
└── tests/                   # Vitest test suites
```

---

## 🏗️ Architecture

### System Design

```
┌─────────────────┐
│   CLI Tool      │ ← Direct file/console output
└─────────────────┘

┌─────────────────┐      WebSocket      ┌─────────────────┐
│  React Frontend │ ◄──────────────────► │  Express Server │
│  (Port 5173)    │      HTTP API       │  (Port 3001)    │
└─────────────────┘                      └─────────────────┘
        │                                         │
        ▼                                         ▼
   Redux Store                            Grid Generator
   - Shape State                          - Reuses CLI modules
   - UI State                             - Real-time streaming
   - History State                        - AI recipe execution
```

### Code Reuse Pattern

**Critical Design Decision:** The server imports CLI modules directly, eliminating code duplication:

```javascript
// server/socket/handlers/shapeHandler.js
import Grid from '../../../cli/grid.js' // Reuses CLI Grid class

// Changes to CLI immediately apply to web interface
```

### Real-Time Streaming

Progressive rendering using EventEmitter pattern:

1. Grid emits `rowCompleted` events during generation
2. Server relays events via WebSocket
3. Frontend progressively builds ASCII display
4. Smooth animations with configurable delays

---

## ✨ Key Features

### 1. AI-Powered Natural Language Generation

Describe ASCII art in plain English:

```
"Create a house with a rectangle for the body and a triangle roof"
"Draw a snowman using three circles stacked vertically"
"Make a pentagon and rotate it 90 degrees"
```

**How it works:**

- Claude API parses prompt into structured JSON recipe
- Recipe executor generates and composes shapes step-by-step
- Results stream in real-time to frontend

### 2. Manual Shape Generation

Precise control over shape parameters:

- Rectangles (width, height, filled/hollow)
- Circles (radius, filled/hollow)
- Polygons (sides, radius)
- Text banners (custom text, fill patterns)

### 3. Transformation Pipeline

Apply sequential transformations:

- **Rotate**: 90°, 180°, 270° clockwise
- **Mirror**: Horizontal or vertical reflection
- **Scale**: 0.5x (shrink) or 2x (enlarge)

### 4. Fill Patterns

Customize ASCII appearance:

- **Solid**: Standard `*` characters
- **Dots**: Sparse `.` pattern
- **Gradient**: Character density gradient (` .:-=+*#%@`)
- **Diagonal/Crosshatch**: Directional patterns

### 5. Production-Ready UX

- AI mode disabled in production (prevents API token drainage)
- Tooltip explanation for recruiters
- Comprehensive error handling
- Input validation at every layer

---

## 🖥️ CLI Tool

### Purpose

Standalone command-line ASCII art generator with file output support.

### Key Algorithms

**Circle Generation** (`shapes.js`):

```javascript
// Distance formula with squared distances (optimization)
for each point (x, y):
  distance² = (x - centerX)² + (y - centerY)²
  if |distance² - radius²| < tolerance:
    mark as edge
```

**Polygon Generation** (`shapes.js`):

```javascript
// Vertex calculation using polar coordinates
for i from 0 to sides-1:
  angle = (2π × i) / sides
  vertexX = centerX + radius × cos(angle)
  vertexY = centerY + radius × sin(angle)
// Connect vertices with line drawing algorithm
```

**Line Drawing** (`shapes.js`):

```javascript
// Linear interpolation (Bresenham-like)
steps = max(|x2 - x1|, |y2 - y1|)
for i from 0 to steps:
  currentX = x1 + i × (x2 - x1) / steps
  currentY = y1 + i × (y2 - y1) / steps
```

### Core Modules

- **grid.js**: 2D grid data structure with EventEmitter for streaming
- **shapes.js**: Shape generation algorithms
- **text.js**: ASCII text rendering with 5x5 character grids
- **decorator.js**: Fill pattern implementations
- **transformer.js**: Transformation pipeline processor
- **renderer.js**: File I/O and output formatting

### Usage Examples

```bash
# Install globally
npm link

# Generate shapes
mycli draw --shape=rectangle --width=10 --height=5 --filled
mycli draw --shape=circle --radius=8 --fillPattern=gradient
mycli draw --shape=polygon --sides=5 --radius=6

# Text banners
mycli banner --text=HELLO --fillPattern=dots

# File output
mycli draw --shape=circle --radius=5 --output=shape.txt
```

---

## 🛠️ Technology Stack

### Frontend

- **React 18**: Component-based UI
- **Redux Toolkit**: State management with feature-based slices
- **Chakra UI v3**: Terminal-themed component library
- **Socket.IO Client**: Real-time WebSocket communication
- **Vite**: Fast build tool and dev server

### Backend

- **Express.js**: Web server framework
- **Socket.IO**: WebSocket server for streaming
- **Anthropic SDK**: Claude AI API integration
- **Joi**: Schema validation for recipes and inputs

### CLI

- **Node.js 18+**: Runtime environment
- **ES Modules**: Modern import/export throughout
- **Custom Argument Parser**: Hand-built CLI parsing
- **EventEmitter**: Real-time streaming support

### Development Tools

- **ESLint + Prettier**: Code quality and formatting
- **Vitest**: Fast Jest-compatible testing
- **Concurrently**: Run multiple dev servers
- **dotenv**: Environment variable management

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Anthropic API key (for AI features)

### Quick Start

```bash
# Clone and install
git clone https://github.com/djphillyg/ascii_art_factory.git
cd ascii_art_factory
npm install

# Install dependencies for server and frontend
cd server && npm install && cd ..
cd frontend && npm install && cd ..

# Set up environment variables (optional, for AI features)
cd server
echo "ANTHROPIC_API_KEY=your_key_here" > .env
echo "ANTHROPIC_MODEL=claude-3-5-sonnet-20241022" >> .env
cd ..

# Run full stack
npm run dev:all
```

**Access:**

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### CLI Usage

```bash
# Link globally (optional)
npm link

# Generate shapes
mycli draw --shape=circle --radius=10
```

---

## 📝 Development Scripts

```bash
# Full stack development
npm run dev:all           # Run server + frontend concurrently

# Individual services
npm run dev:server        # Backend with hot reload
npm run dev:frontend      # Frontend dev server
node cli/index.js         # CLI tool

# Code quality
npm run lint              # ESLint check
npm run lint:fix          # Auto-fix issues
npm run format            # Prettier formatting
npm run format:check      # Check formatting

# Testing
npm test                  # All tests
npm run test:cli          # CLI tests
npm run test:server       # Server tests
```

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Phillip Goldberg**

Created as a portfolio project to demonstrate full-stack development skills and modern AI integration.

Repository: https://github.com/djphillyg/ascii_art_factory

---

## 📚 Additional Documentation

- **CLAUDE.md**: Comprehensive development guide for AI-assisted coding
- **README-gen.md**: Full technical documentation with detailed API references

---

**Note:** This project showcases a methodical approach to learning and building, emphasizing clean architecture, separation of concerns, and production-ready code quality. For recruiters: AI mode is intentionally disabled in production builds to demonstrate thoughtful security considerations.
