# ASCII Art CLI Tool

A command-line interface for generating ASCII art shapes and text banners with various fill patterns.

## Installation

```bash
npm install
npm link  # Makes the 'mycli' command available globally
```

## Commands

### `draw` - Generate ASCII Art Shapes

Generate ASCII art geometric shapes (rectangles, circles, polygons) with customizable dimensions and fill patterns.

**Usage:**
```bash
mycli draw --shape=<shape> [options]
```

**Aliases:** `d`

**Required Options:**
- `--shape=<shape>` - Type of shape to draw
  - `rectangle` - Requires `--width` and `--height`
  - `circle` - Requires `--radius`
  - `polygon` - Requires `--radius` and `--sides` (must be > 3)

**Shape-Specific Options:**
- `--width=<number>` - Width of the shape (rectangles only, must be > 0)
- `--height=<number>` - Height of the shape (rectangles only, must be > 0)
- `--radius=<number>` - Radius of the shape (circles and polygons, must be > 0)
- `--sides=<number>` - Number of sides (polygons only, must be > 3)

**Fill Options:**
- `--filled` - Fill the shape (boolean flag)
- `--fillPattern=<pattern>` - Fill pattern to use
  - `dots` - Dotted fill pattern
  - `gradient` - Gradient fill pattern
  - `diagonal` - Diagonal line pattern
  - `crosshatch` - Crosshatch pattern
- `--direction=<direction>` - Direction for gradient (only with `--fillPattern=gradient`)
  - `horizontal` (default)
  - `vertical`

**Output Options:**
- `--output=<file>` - Save output to file
- `append` - Append to file instead of overwriting (positional argument)

**Examples:**

```bash
# Draw a basic rectangle
mycli draw --shape=rectangle --width=5 --height=7

# Draw a filled circle
mycli draw --shape=circle --radius=10 --filled

# Draw a polygon with gradient fill
mycli draw --shape=polygon --radius=8 --sides=6 --filled --fillPattern=gradient --direction=vertical

# Draw a rectangle with crosshatch pattern and save to file
mycli draw --shape=rectangle --width=10 --height=8 --filled --fillPattern=crosshatch --output=shape.txt

# Append a shape to existing file
mycli draw --shape=circle --radius=5 --filled --output=shapes.txt append
```

---

### `banner` - Generate ASCII Text Banners

Generate ASCII art text banners with customizable fill patterns. Supports uppercase letters (A-Z) and numbers (0-9).

**Usage:**
```bash
mycli banner --text=<text> [options]
```

**Aliases:** `b`

**Required Options:**
- `--text=<text>` - Text to render (A-Z and 0-9 only, uppercase)

**Fill Options:**
- `--fillPattern=<pattern>` - Fill pattern to use
  - `dots` - Dotted fill pattern
  - `gradient` - Gradient fill pattern (requires `--width` and `--height`)
  - `diagonal` - Diagonal line pattern
  - `crosshatch` - Crosshatch pattern

**Gradient Options (required for `--fillPattern=gradient`):**
- `--width=<number>` - Width for gradient pattern (must be > 0)
- `--height=<number>` - Height for gradient pattern (must be > 0)
- `--direction=<direction>` - Direction for gradient
  - `horizontal` (default)
  - `vertical`

**Output Options:**
- `--output=<file>` - Save output to file
- `append` - Append to file instead of overwriting (positional argument)

**Examples:**

```bash
# Basic text banner
mycli banner --text=HELLO

# Text banner with numbers
mycli banner --text=CODE123

# Text banner with dots pattern
mycli banner --text=HELLO --fillPattern=dots

# Text banner with horizontal gradient
mycli banner --text=HELLO --fillPattern=gradient --width=5 --height=5

# Text banner with vertical gradient
mycli banner --text=HELLO --fillPattern=gradient --width=5 --height=5 --direction=vertical

# Save banner to file
mycli banner --text=WELCOME --fillPattern=diagonal --output=banner.txt

# Append banner to existing file
mycli banner --text=HELLO --output=banners.txt append
```

---

## Global Options

- `--help`, `-h` - Show help for command

**Examples:**
```bash
# Show general help
mycli --help

# Show help for draw command
mycli draw --help

# Show help for banner command
mycli banner --help
```

---

## Error Handling

The CLI provides clear error messages for:

- Missing required options
- Invalid option values
- Malformed flags
- Invalid text characters (banner command)
- Invalid fill patterns
- Missing dimensions for gradient patterns

**Example Error Messages:**
```bash
# Missing required option
$ mycli draw
Error: --shape is required. Please specify a shape to draw.

# Invalid shape dimension
$ mycli draw --shape=rectangle --width=0 --height=5
Error: --width must be a number greater than 0.

# Invalid text characters
$ mycli banner --text=hello
Error: --text must contain only uppercase letters (A-Z) and numbers (0-9).

# Invalid fill pattern
$ mycli draw --shape=circle --radius=5 --fillPattern=invalid
Error: --fillPattern must be one of: dots, gradient, diagonal, crosshatch
```

---

## Architecture

The CLI is built with a modular architecture:

- **`index.js`** - Main entry point, command router, validation, and help system
- **`parser.js`** - Argument parser for flags and positional arguments
- **`shapes.js`** - Shape generation logic (rectangles, circles, polygons)
- **`text.js`** - ASCII text banner generation
- **`errors.js`** - Custom error types (ValidationError, CLIError, ParseError)

---

## Development

**Run from source:**
```bash
node cli/index.js draw --shape=circle --radius=10
```

**Link for global usage:**
```bash
npm link
mycli draw --shape=circle --radius=10
```

**Unlink:**
```bash
npm unlink -g mycli
```

---

## Features

✅ Multiple shape types (rectangle, circle, polygon)
✅ Four fill patterns (dots, gradient, diagonal, crosshatch)
✅ ASCII text banner generation (A-Z, 0-9)
✅ Gradient direction control (horizontal/vertical)
✅ File output with append support
✅ Comprehensive input validation
✅ Command aliases for quick access
✅ Built-in help system
✅ Clear error messages

---

## Requirements

- Node.js (ES Modules support required)
- The CLI uses ES Modules (`import`/`export`), ensure your `package.json` has `"type": "module"`

---

## License

[Your license here]