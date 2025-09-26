#!/usr/bin/env node
/* eslint-disable */
// grab the arguments from the process arg thing
const args = process.argv.slice(2)

const [command] = args

const options = args.slice(1)

const commands = {
  create: {
    aliases: ['c'],
    description: 'Create a new item',
    handler: (options) => {
      const name = options._[0];
      console.log(`Creating ${name}`);
    }
  },
  
  // delete: {
  //   aliases: ['d', 'remove'],
  //   description: 'Delete an item',
  //   handler: (options) => {
  //     const name = options._[0];
  //     console.log(`Deleting ${name}`);
  //   }
  // },
  
  // list: {
  //   aliases: ['ls'],
  //   description: 'List all items',
  //   handler: (options) => {
  //     console.log('Listing items');
  //   }
  // }
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
  const parsed = { _: [] }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=')
      parsed[key] = value || true
    } else if (arg.startsWith('-')) {
      parsed[args.slice(1)] = true
    } else {
      parsed._.push(arg)
    }
  }
  return parsed
}

function main() {
  console.log('Hello World', args); // eslint-disable-line no-console
}

function showHelp() {
  console.log('Available commands')
  Object.entries(commands).forEach(([name, cmd]) => {
    const aliases = cmd.aliases.length ? `(${cmd.aliases.join(', ')})` : ''
    console.log(` ${name}${aliases} - ${cmd.description}`)
  })
}


main();