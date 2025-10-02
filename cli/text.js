/**
 * Text module - handles text generation using ASCII art characters
 */
import { gridOutputToString, exportShape } from './renderer.js'
import charMap from './char_mapping.js'
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

  for (let i = 0; i < textArray.length; i+=1) {
    charMapArray.push(charMap[textArray[i]])
  }

  /**
   * so now we have a char array 
   * in our new array we need to go through and cut the first element off
   * since we assume these are all 5x5 we just need to iterate through every single array 5 times
   */

  // our grid output is just grid[5][5*i] <- for number of characters

  const gridRows = 5

  // create 2d array/grid filled with spaces
  const grid = Array.from({ length: gridRows }, () => [])

  for(let rowCount = 0; rowCount < 5; rowCount++) {
    charMapArray.forEach((char) => {
      // extract the section
      const sectionArray = char[rowCount]
      // splice the section into the grid
      grid[rowCount].push(...sectionArray)
      // we should also add a a space as well between the characters
      grid[rowCount].push(' ')
    })
  }
  // handle spaces after but this should be good
  console.log(grid)

  return grid
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
    let textGrid = generateText(options)
    // if it has a fill pattern that needs to applied do it here
    if (options.fillPattern) {
      textGrid = fillGrid({
        grid: textGrid,
        fillPattern: options.fillPattern,
        ...options
      })
    }

    const textOutput = gridOutputToString(textGrid)
    // if it goes to a file send it out, if not just output it
    if (options.output) {
      exportShape({
        shapeOutput: textOutput,
        fileName: options.output,
        appendFile: options.append,
      })
    } else {
      console.log(textOutput)
    }

    return {
      grid: textGrid,
      output: textOutput,
    }
  }
}