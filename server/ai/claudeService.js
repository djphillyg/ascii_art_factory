import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ValidationError, ParseError } from '../../cli/errors.js'

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load system prompt from file (once at module load time)
let cachedSystemPrompt = null

function loadSystemPrompt() {
  if (cachedSystemPrompt) {
    return cachedSystemPrompt
  }

  const promptPath = path.join(__dirname, 'ascii_prompt.md')
  try {
    cachedSystemPrompt = fs.readFileSync(promptPath, 'utf-8')
    return cachedSystemPrompt
  } catch (error) {
    throw new ValidationError(
      `Failed to load system prompt from ${promptPath}: ${error.message}`
    )
  }
}

class ClaudeService {
  constructor(apiKey, options = {}) {
    this.client = new Anthropic({ apiKey })
    this.model = options.model || process.env.ANTHROPIC_MODEL
    this.maxTokens = Number(
      options.maxTokens || process.env.ANTHROPIC_MAX_TOKENS
    )
    this.systemPrompt = this.buildSystemPrompt()
  }

  /**
   * Parse natural language into shape recipe
   * @param {string} prompt - natural lnaguage description
   * @returns {Promise<Object>} - recipe configuration
   */
  async parseShapePrompt(prompt) {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        system: this.systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      return this.extractRecipe(response)
    } catch (error) {
      throw new ValidationError(`Claude API error: ${error.message}`)
    }
  }

  extractRecipe(response) {
    const content = response.content[0].text

    try {
      // try to parse the response as json directly
      const recipe = JSON.parse(content)
      return recipe
    } catch (error) {
      // fallback, see if you can extract from mixed content
      const jsonMatch =
        content.match(/```json\n?([\s\S]*?)\n?```/) ||
        content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        return JSON.parse(jsonStr)
      }

      // if the fallback couldnt be reached, throw error
      throw new ParseError(
        `Could not extract recipe from claude response ${error.message}`
      )
    }
  }

  /**
   * Build system prompt that teaches Claude about recipes
   * @returns {string} System prompt
   */
  buildSystemPrompt() {
    return loadSystemPrompt()
  }
}

export default ClaudeService
