/**
 * Text module - handles text generation using ASCII art characters
 */
import { exportShape } from './renderer.js'
import { getGridCharMap } from './char_mapping.js'
import { fillGrid } from './decorator.js'

/**
 * Generates ASCII art text from a string
 * @param {Object} options - Text configuration
 * @param {string} options.text - The text to render
 * @returns {string[][]} 2D array representing the text
 */
function generateText({ text }) {
  // turn text in array
  // validate proper regex text in validator
  const textArray = text.split('')
  const charMapArray = []
  const gridCharMap = getGridCharMap()

  for (let i = 0; i < textArray.length; i += 1) {
    charMapArray.push(gridCharMap[textArray[i]])
  }
  // init first char as grid
  let [textGrid] = charMapArray;
  for (let i = 1; i < textArray.length; i += 1) {
    textGrid = textGrid.rightAppend(charMapArray[i]);
  }
  return textGrid;
}

/**
 * Text factory class for creating ASCII art text
 */
export class TextGenerator {
  /**
   * Creates ASCII art text based on the provided options
   * @param {Object} options - Text-specific options
   * @param {string} options.text - The text to render
   * @param {string} options.output - Optional file path for output
   * @param {boolean} options.append - Whether to append to existing file
   * @returns {string[][]} 2D array representing the text
   */
  static create(options) {
    let textGrid = generateText(options);
    // if it has a fill pattern that needs to applied do it here
    if (options.fillPattern) {
      textGrid = fillGrid({
        grid: textGrid,
        fillPattern: options.fillPattern,
        ...options,
      });
    }

    const textOutput = textGrid.toString();
    // if it goes to a file send it out, if not just output it
    if (options.output) {
      exportShape({
        shapeOutput: textOutput,
        fileName: options.output,
        appendFile: options.append,
      });
    } else {
      console.log(textOutput);
    }

    return {
      grid: textGrid,
      output: textOutput,
    };
  }
}
