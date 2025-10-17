#!/usr/bin/env node
// grab the arguments from the process arg thing
import { parseArgs } from './parser.js'
import { ShapeGenerator } from './shapes.js'
import { TextGenerator } from './text.js'
import { ValidationError, CLIError, ParseError } from './errors.js'
import { importShape } from './renderer.js'
import Transformer from './transformer.js'
import Grid from './grid.js'


const commands = {
  draw: {
    aliases: ['d'],
    description: 'This command will draw a shape of your choosing',
    usage: 'draw [options]',
    options: [
      '--shape=<shape> The type of shape that you want me to draw',
      '--width=<width> The width of the shape that you want me to draw',
      '--height=<height> The height of the shape that you want me to draw',
      'filled when this flag is on, it will fill the shape',
      '--fillPattern=<pattern> Optional fill pattern (supports: dots, gradient, diagonal, crosshatch)',
      '--direction=<direction> Direction for gradient (horizontal or vertical, default: horizontal)',
    ],
    examples: [
      'draw shape=rectangle width 5 height 7',
    ],
    validator: (options) => {
      const { flags } = options;

      // Check if shape is provided
      if (!flags.shape) {
        throw new ValidationError('Error: --shape is required. Please specify a shape to draw.');
      }

      // If shape is rectangle, validate width and height
      if (flags.shape === 'rectangle') {
        if (!flags.width) {
          throw new ValidationError('Error: --width is required when drawing a rectangle.');
        }
        if (!flags.height) {
          throw new ValidationError('Error: --height is required when drawing a rectangle.');
        }

        const width = Number(flags.width);
        const height = Number(flags.height);

        if (isNaN(width) || width <= 0) {
          throw new ValidationError('Error: --width must be a number greater than 0.');
        }
        if (isNaN(height) || height <= 0) {
          throw new ValidationError('Error: --height must be a number greater than 0.');
        }
      }

      // if shape is circle or polygon, validate radius
      if (flags.shape === 'circle' || flags.shape === 'polygon') {
         if (!flags.radius) {
          throw new ValidationError('Error: --radius is required when drawing a polygon or circle.');
        }

        const radius = Number(flags.radius);

        if (isNaN(radius) || radius <= 0) {
          throw new ValidationError('Error: --radius must be a number greater than 0.');
        }
      }

      //if a polygon, it must have a sides parameter > 3
      if (flags.shape === 'polygon') {
        if (!flags.sides) {
          throw new ValidationError('Error: --sides is required when drawing a polygon.');
        }

        const sides = Number(flags.sides);

        if (isNaN(sides) || sides <= 3) {
          throw new ValidationError('Error: --sides must be a number greater than 3.');
        }
      }

      // Validate fillPattern if provided (support both camelCase and kebab-case)
      const fillPattern = flags.fillPattern || flags['fill-pattern'];
      if (fillPattern) {
        const validFillPatterns = ['dots', 'gradient', 'diagonal', 'crosshatch'];
        if (!validFillPatterns.includes(fillPattern)) {
          throw new ValidationError('Error: --fillPattern must be one of: dots, gradient, diagonal, crosshatch');
        }

        // If gradient, validate width and height are available
        if (fillPattern === 'gradient') {
          // For rectangles, width and height are already validated
          // For circles and polygons, we need to ensure radius is provided (already validated above)

          // Validate direction if provided
          if (flags.direction) {
            const validDirections = ['horizontal', 'vertical'];
            if (!validDirections.includes(flags.direction)) {
              throw new ValidationError('Error: --direction must be one of: horizontal, vertical.');
            }
          }
        }
      }

    },
    handler: (options) => {
      const { flags, positional } = options
      console.log('these are the options', options)
      console.log(`Hi there!`);

      const append = !!positional.find(param => param === 'append')
      const fillPattern = flags.fillPattern || flags['fill-pattern'];

      // Pass all possible options - each shape extracts what it needs
      ShapeGenerator.create({
        shapeType: flags.shape,
        options: {
        width: Number(flags.width),
        height: Number(flags.height),
        radius: Number(flags.radius),
        sides: Number(flags.sides),
        filled: flags.filled,
        fillPattern,
        direction: flags.direction || 'horizontal',
        output: flags.output,
        append,
      }})
    }

  },
  transform: {
    aliases: ['t'],
    description: 'This command will transform existing ASCII art from a file',
    usage: 'transform [options]',
    options: [
      '--input=<file> Path to input file containing ASCII art (required)',
      '--rotate=<degrees> Rotate the shape (90, 180, or 270 degrees)',
      '--mirror=<axis> Mirror the shape (horizontal or vertical)',
      '--scale=<factor> Scale the shape (0.5 to shrink, 2 to enlarge)',
      '--output=<file> Optional file to save output (prints to console if not specified)',
      'Note: You can chain transformations - they will be applied in order: rotate → mirror → scale',
    ],
    examples: [
      'transform --input=shape.txt --rotate=90',
      'transform --input=shape.txt --mirror=horizontal --output=mirrored.txt',
      'transform --input=shape.txt --rotate=90 --mirror=vertical --scale=2',
      'transform --input=circle.txt --scale=0.5 --output=small-circle.txt',
    ],
    validator: (options) => {
      const { flags } = options;

      // Check if input file is provided
      if (!flags.input) {
        throw new ValidationError('Error: --input is required. Please specify an input file path.');
      }

      // At least one transformation must be specified
      if (!flags.rotate && !flags.mirror && !flags.scale) {
        throw new ValidationError('Error: At least one transformation is required. Use --rotate, --mirror, or --scale.');
      }

      // Validate rotate parameter if provided
      if (flags.rotate) {
        const rotate = Number(flags.rotate);
        const validRotations = [90, 180, 270];

        if (isNaN(rotate)) {
          throw new ValidationError('Error: --rotate must be a number.');
        }

        if (!validRotations.includes(rotate)) {
          throw new ValidationError('Error: --rotate must be one of: 90, 180, 270.');
        }
      }

      // Validate mirror parameter if provided
      if (flags.mirror) {
        const validAxes = ['horizontal', 'vertical'];

        if (!validAxes.includes(flags.mirror)) {
          throw new ValidationError('Error: --mirror must be one of: horizontal, vertical.');
        }
      }

      // Validate scale parameter if provided
      if (flags.scale) {
        const scale = Number(flags.scale);
        const validScales = [0.5, 2];

        if (isNaN(scale)) {
          throw new ValidationError('Error: --scale must be a number.');
        }

        if (!validScales.includes(scale)) {
          throw new ValidationError('Error: --scale must be one of: 0.5 (shrink), 2 (enlarge).');
        }
      }

      // Validate output path if provided (basic check - not empty)
      if (flags.output && flags.output.trim().length === 0) {
        throw new ValidationError('Error: --output cannot be an empty string.');
      }
    },
    handler: (options) => {
      const { flags, positional } = options;

      // TODO: Implement transformation pipeline
      // 1. Read input file from flags.input using fs.readFileSync
      // 2. Parse file content into Grid instance (Grid.fromString() or similar)
      // 3. Apply transformations in order:
      //    - If flags.rotate exists: grid = grid.rotate(Number(flags.rotate))
      //    - If flags.mirror exists: grid = grid.mirror(flags.mirror)
      //    - If flags.scale exists: grid = grid.scale(Number(flags.scale))
      // 4. Convert final grid to string: output = grid.toString()
      // 5. If flags.output exists:
      //      - Write output to file using exportShape from renderer.js
      //    Else:
      //      - Print output to console
      // 6. Handle errors:
      //    - File not found
      //    - Invalid file format
      //    - Transformation errors

      console.log('Transform command called with:', flags);
      console.log('Input file:', flags.input);
      console.log('Transformations to apply:');

      if (flags.rotate) console.log('  - Rotate:', flags.rotate, 'degrees');
      if (flags.mirror) console.log('  - Mirror:', flags.mirror);
      if (flags.scale) console.log('  - Scale:', flags.scale);

      // parse the file
      const stringOutputFromFile = importShape(flags.input)
      const newGrid = new Grid({content: stringOutputFromFile})

      const transformArray = []
      if (flags.rotate) {
        transformArray.push({
          type: 'rotate',
          params: {
            degrees: Number(flags.rotate)
          }
        })
      }
      if (flags.mirror) {
        transformArray.push({
          type: 'mirror',
          params: {
            axis: flags.mirror,
          }
        })
      }
      if (flags.scale) {
        transformArray.push({
          type: 'scale',
          params: {
            factor: Number(flags.scale),
          }
        })
      }
      Transformer.transform({
        grid: newGrid,
        transformations: transformArray,
        options: {
          output: flags.output,
          append: !!positional.find(param => param === 'append')
        }
      })
    }
  },
  banner: {
    aliases: ['b'],
    description: 'This command will generate ASCII art text banners',
    usage: 'banner [options]',
    options: [
      '--text=<text> The text to render (A-Z, a-z, 0-9, /, \\, space, ^)',
      '--fillPattern=<pattern> Optional fill pattern (supports: dots, gradient, diagonal, crosshatch, crosshatch)',
      '--width=<width> Width for gradient pattern (required for gradient)',
      '--height=<height> Height for gradient pattern (required for gradient)',
      '--direction=<direction> Direction for gradient (horizontal or vertical, default: horizontal)',
      '--output=<file> Optional file to save output',
    ],
    examples: [
      'banner --text=HELLO',
      'banner --text=CODE123',
      'banner --text=HELLO --fillPattern=dots',
      'banner --text=HELLO --fillPattern=gradient --width=5 --height=5',
      'banner --text=HELLO --fillPattern=gradient --width=5 --height=5 --direction=vertical',
    ],
    validator: (options) => {
      const { flags } = options;

      // Check if text is provided
      if (!flags.text) {
        throw new ValidationError('Error: --text is required. Please specify text to render.');
      }

      // Validate text contains only A-Z, a-z, 0-9, /, \, space, and ^
      const validPattern = /^[A-Za-z0-9/\\ ^]+$/;
      if (!validPattern.test(flags.text)) {
        throw new ValidationError('Error: --text must contain only letters (A-Z, a-z), numbers (0-9), /, \\, space, and ^.');
      }

      // Validate fillPattern if provided (support both camelCase and kebab-case)
      const fillPattern = flags.fillPattern || flags['fill-pattern'];
      if (fillPattern) {
        const validFillPatterns = ['dots', 'gradient', 'diagonal', 'crosshatch'];
        if (!validFillPatterns.includes(fillPattern)) {
          throw new ValidationError('Error: --fillPattern must be one of: dots, gradient, diagonal, crosshatch');
        }

        // If gradient, validate width and height
        if (fillPattern === 'gradient') {
          if (!flags.width) {
            throw new ValidationError('Error: --width is required when using gradient fillPattern.');
          }
          if (!flags.height) {
            throw new ValidationError('Error: --height is required when using gradient fillPattern.');
          }

          const width = Number(flags.width);
          const height = Number(flags.height);

          if (isNaN(width) || width <= 0) {
            throw new ValidationError('Error: --width must be a number greater than 0.');
          }
          if (isNaN(height) || height <= 0) {
            throw new ValidationError('Error: --height must be a number greater than 0.');
          }

          // Validate direction if provided
          if (flags.direction) {
            const validDirections = ['horizontal', 'vertical'];
            if (!validDirections.includes(flags.direction)) {
              throw new ValidationError('Error: --direction must be one of: horizontal, vertical.');
            }
          }
        }
      }
    },
    handler: (options) => {
      const { flags, positional } = options
      console.log('these are the options', options)
      console.log(`Hi there!`);

      const append = !!positional.find(param => param === 'append')
      const fillPattern = flags.fillPattern || flags['fill-pattern'];
      TextGenerator.create({
        text: flags.text,
        fillPattern,
        width: Number(flags.width),
        height: Number(flags.height),
        direction: flags.direction || 'horizontal',
        output: flags.output,
        append: !!append,
      })
    }
  },
};


/**
 * Helper function that shows help before throwing an error
 * @param {Error} error - The error to throw
 * @param {boolean} showHelp - Whether to show help (default: true)
 */
function throwWithHelp(error, showHelp = true) {
  console.error(error.message);
  if (showHelp) {
    showGeneralHelp();
  }
  process.exit(1);
}

function findCommand(commandName) {
  if (!commandName) return null;

  // Check direct command name
  if (commands[commandName]) {
    return commands[commandName];
  }

  // Check aliases
  for (const [, cmd] of Object.entries(commands)) {
    if (cmd.aliases && cmd.aliases.includes(commandName)) {
      return cmd;
    }
  }

  return null;
}

function validateArguments(args) {
  // Check if no arguments provided at all
  if (args.length === 0) {
    throwWithHelp(new CLIError('Error: No command provided.'));
  }

  // Check if they just want help
  if (args.length === 1 && args[0] === '--help') {
    showGeneralHelp()
    process.exit(1)
  }

  const [commandName] = args

  // Check if command name is malformed (starts with -)
  if (commandName && commandName.startsWith('-')) {
    throwWithHelp(new ParseError('Error: Invalid command format. Commands cannot start with dashes.'));
  }

  // Validate flag format - check for malformed flags
  const remainingArgs = args.slice(1);
  for (const arg of remainingArgs) {
    if (arg.startsWith('--') && arg.length === 2) {
      throwWithHelp(new ParseError('Error: Invalid flag format. Empty flag "--" is not allowed.'));
    }
    if (arg.startsWith('-') && arg.length === 1) {
      throwWithHelp(new ParseError('Error: Invalid flag format. Empty flag "-" is not allowed.'));
    }
    if (arg.startsWith('---')) {
      throwWithHelp(new ParseError('Error: Invalid flag format. Flags cannot start with "---".'));
    }
  }

  return commandName
}

function main() {
  const args = process.argv.slice(2)
  const commandName = validateArguments(args)
  const options = parseArgs(args.slice(1))
  console.log(args, 'these are the args')
  console.log(options, 'these are the options in main')

  const command = findCommand(commandName)
  if (!command) {
    throwWithHelp(new CLIError(`Error: Unknown command: ${commandName}`));
  }
  // if there is a valid command and theyre just looking for help
  // show the command help and exit the function
  if (command && options.flags.help) {
    showCommandHelp(commandName)
    process.exit(1)
  }

  // Run validator if it exists
  try {
    if (command.validator) {
      command.validator(options);
    }

    // if no help is needed and validation passes
    command.handler(options)
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}


function showGeneralHelp() {
    console.log(`
    Usage: mycli <command> [options]

    Commands:`);

    Object.entries(commands).forEach(([name, cmd]) => {
      const aliases = cmd.aliases.length ? ` (${cmd.aliases.join(', ')})` : '';
      console.log(`  ${name}${aliases.padEnd(20 - name.length)} ${cmd.description}`);

      // Show examples if they exist
      if (cmd.examples && cmd.examples.length > 0) {
        console.log(`    Examples:`);
        cmd.examples.forEach(example => {
          console.log(`      mycli ${example}`);
        });
        console.log(''); // Add spacing after examples
      }
    });

    console.log(`    Global Options:
      --help, -h           Show help for command

    Use "mycli <command> --help" for more information about a command.`);
}

function showCommandHelp(commandName) {
  const command = findCommand(commandName)
  if (!command) {
    console.error(`Unknown command: ${commandName}`)
    return
  }
  console.log(`
    Usage: mycli ${command.usage}

    ${command.description}
    `)
    if (command.options.length > 0) {
      console.log('Options')
      command.options.forEach(option => {
        console.log(`   ${option}`)
      })
      console.log('')
    }
}



main();