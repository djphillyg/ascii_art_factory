/**
 * Parser module - handles CLI argument parsing
 */

/**
 * Parses command line arguments into positional and flag arguments
 * @param {string[]} args - Array of command line arguments
 * @returns {{positional: string[], flags: Object}} Parsed arguments object
 */
export function parseArgs(args) {
  const parsed = {
    positional: [],
    flags: {},
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      if (value !== undefined) {
        // Handle --key=value format
        parsed.flags[key] = value;
      } else {
        // Handle --key value format (check next argument)
        const nextArg = args[i + 1];
        if (nextArg && !nextArg.startsWith('-')) {
          parsed.flags[key] = nextArg;
          i++; // Skip the next argument since we consumed it
        } else {
          parsed.flags[key] = true;
        }
      }
    } else if (arg.startsWith('-')) {
      // Handle single dash flags like -v, -h
      const key = arg.slice(1);
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith('-')) {
        parsed.flags[key] = nextArg;
        i++; // Skip the next argument since we consumed it
      } else {
        parsed.flags[key] = true;
      }
    } else {
      parsed.positional.push(arg);
    }
  }

  return parsed;
}

/**
 * Validates argument format and structure
 * @param {string[]} args - Raw command line arguments
 * @returns {string} The command name
 * @throws {Error} If validation fails
 */
export function validateArguments(args) {
  // Check if no arguments provided at all
  if (args.length === 0) {
    const error = new Error('No command provided.');
    error.code = 'NO_COMMAND';
    throw error;
  }

  // Check if they just want help
  if (args.length === 1 && args[0] === '--help') {
    const error = new Error('Help requested');
    error.code = 'HELP_REQUESTED';
    throw error;
  }

  const [commandName] = args;

  // Check if command name is malformed (starts with -)
  if (commandName && commandName.startsWith('-')) {
    const error = new Error('Invalid command format. Commands cannot start with dashes.');
    error.code = 'INVALID_COMMAND_FORMAT';
    throw error;
  }

  // Validate flag format - check for malformed flags
  const remainingArgs = args.slice(1);
  for (const arg of remainingArgs) {
    if (arg.startsWith('--') && arg.length === 2) {
      const error = new Error('Invalid flag format. Empty flag "--" is not allowed.');
      error.code = 'INVALID_FLAG_FORMAT';
      throw error;
    }
    if (arg.startsWith('-') && arg.length === 1) {
      const error = new Error('Invalid flag format. Empty flag "-" is not allowed.');
      error.code = 'INVALID_FLAG_FORMAT';
      throw error;
    }
    if (arg.startsWith('---')) {
      const error = new Error('Invalid flag format. Flags cannot start with "---".');
      error.code = 'INVALID_FLAG_FORMAT';
      throw error;
    }
  }

  return commandName;
}