#!/usr/bin/env node
// grab the arguments from the process arg thing

const commands = {
  draw: {
    aliases: ['d'],
    description: 'This command will draw a shape of your choosing',
    usage: 'draw [options]',
    options: [
      '--shape=<shape> The type of shape that you want me to draw',
      '--width=<width> The width of the shape that you want me to draw',
      '--height=<height> The height of the shape that you want me to draw'
    ],
    examples: [
      'draw shape=rectangle width 5 height 7',
    ],
    validator: (options) => {
      const { flags } = options;

      // Check if shape is provided
      if (!flags.shape) {
        throw new Error('Error: --shape is required. Please specify a shape to draw.');
      }

      if (flags.shape !== 'rectangle') {
        throw new Error('Error: shapes other than rectangle have not been implemented yet. Please specify a shape to draw.')
      }

      // If shape is rectangle, validate width and height
      if (flags.shape === 'rectangle') {
        if (!flags.width) {
          throw new Error('Error: --width is required when drawing a rectangle.');
        }
        if (!flags.height) {
          throw new Error('Error: --height is required when drawing a rectangle.');
        }

        const width = parseFloat(flags.width);
        const height = parseFloat(flags.height);

        if (isNaN(width) || width <= 0) {
          throw new Error('Error: --width must be a number greater than 0.');
        }
        if (isNaN(height) || height <= 0) {
          throw new Error('Error: --height must be a number greater than 0.');
        }
      }
    },
    handler: (options) => {
      console.log('these are the options', options)
     // const name = options._[0];
      console.log(`Hi there!`);
    }
  },
};

function parseArgs(args) {
  /**
   * the parsed has 2 things happening
   * - positional arguments
   * - and flag argumetns
   *  the `_` represents the positional arguments like create myfile becomes `create` `myfile`
   * - and the flag arguments are like `--force`-> { force: true }
   *
   */
  const parsed = {
    positional: [],
    flags: {},
  }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=')
      if (value !== undefined) {
        // Handle --key=value format
        parsed.flags[key] = value
      } else {
        // Handle --key value format (check next argument)
        const nextArg = args[i + 1]
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.flags[key] = nextArg
          i++ // Skip the next argument since we consumed it
        } else {
          parsed.flags[key] = true
        }
      }
    } else if (arg.startsWith('-')) {
      // Handle single dash flags like -v, -h
      const key = arg.slice(1)
      const nextArg = args[i + 1]
      if (nextArg && !nextArg.startsWith('-')) {
        parsed.flags[key] = nextArg
        i++ // Skip the next argument since we consumed it
      } else {
        parsed.flags[key] = true
      }
    } else {
      parsed.positional.push(arg)
    }
  }
  return parsed
}

function findCommand(commandName) {
  if (!commandName) return null;

  // Check direct command name
  if (commands[commandName]) {
    return commands[commandName];
  }

  // Check aliases
  for (const [_name, cmd] of Object.entries(commands)) {
    if (cmd.aliases && cmd.aliases.includes(commandName)) {
      return cmd;
    }
  }

  return null;
}

function main() {
  const args = process.argv.slice(2)
  // we need to check if they just want help
  console.log(args, 'these are the args')
  if (args.length === 1 && args[0] === '--help') {
    showGeneralHelp()
    process.exit(1)
  }
  const [commandName] = args
  const options = parseArgs(args.slice(1))
  console.log(options, 'these are the options in main')
  const command = findCommand(commandName)
  if (!command) {
    console.error(`Unknown command: ${commandName}`)
    showGeneralHelp()
    process.exit(1)
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