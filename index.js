#!/usr/bin/env node
// grab the arguments from the process arg thing
import { parseArgs } from './parser.js'
import { ShapeGenerator } from './shapes.js'
import { ValidationError, CLIError, ParseError } from './errors.js'


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

      if (flags.shape !== 'rectangle') {
        throw new ValidationError('Error: shapes other than rectangle have not been implemented yet. Please specify a shape to draw.')
      }

      // If shape is rectangle, validate width and height
      if (flags.shape === 'rectangle') {
        if (!flags.width) {
          throw new ValidationError('Error: --width is required when drawing a rectangle.');
        }
        if (!flags.height) {
          throw new ValidationError('Error: --height is required when drawing a rectangle.');
        }

        const width = parseFloat(flags.width);
        const height = parseFloat(flags.height);

        if (isNaN(width) || width <= 0) {
          throw new ValidationError('Error: --width must be a number greater than 0.');
        }
        if (isNaN(height) || height <= 0) {
          throw new ValidationError('Error: --height must be a number greater than 0.');
        }
      }

    },
    handler: (options) => {
      const { flags } = options
      console.log('these are the options', options)
      console.log(`Hi there!`);

      // we know from validator that flags have been checked, just extract them
      const width = parseFloat(flags.width);
      const height = parseFloat(flags.height);

      ShapeGenerator.create(flags.shape, {
        width,
        height,
        isFilled: flags.filled,
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
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  // if no help is needed and validation passes
  command.handler(options)
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