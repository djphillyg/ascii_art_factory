import express from 'express'
import ClaudeService from './claudeService.js'
import RecipeExecutor from './recipeExecutor.js'
import Joi from 'joi'
import { ValidationError } from '../../cli/errors.js'

const router = express.Router()

// Initialize services
const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY, {
  model: process.env.ANTHROPIC_MODEL,
  maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '2048'),
})

const recipeExecutor = new RecipeExecutor()

// Validation schema for generate request
const generateSchema = Joi.object({
  prompt: Joi.string().min(3).max(500).required(),
})

// Validation schema for recipe execution
const executeRecipeSchema = Joi.object({
  recipe: Joi.object({
    recipe: Joi.array().required(),
    output: Joi.string().required(),
  }).required(),
})

/**
 * POST /api/ai/generate
 * Generate ASCII art from natural language
 */
router.post('/generate', async (req, res) => {
  try {
    // 1. Validate request
    const { error, value } = generateSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.details[0].message,
      })
    }

    const { prompt } = value

    // 2. Parse prompt with Claude
    console.log(`Parsing prompt: "${prompt}"`)
    const recipe = await claudeService.parseShapePrompt(prompt)
    console.log('Recipe received:', JSON.stringify(recipe, null, 2))

    // 3. Execute recipe
    const grid = recipeExecutor.execute(recipe)
    console.log(`Grid generated: ${grid.width}x${grid.height}`)

    // 4. Return result
    res.json({
      success: true,
      grid: grid.toString(),
      recipe,
      metadata: {
        width: grid.width,
        height: grid.height,
        operations: recipe.recipe.length,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('AI generation error:', error)
    handleAIError(error, res)
  }
})

/**
 * POST /api/ai/execute-recipe
 * Execute a recipe directly without AI prompt parsing
 */
router.post('/execute-recipe', async (req, res) => {
  try {
    // 1. Validate request
    const { error, value } = executeRecipeSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.details[0].message,
      })
    }

    const { recipe } = value

    // 2. Execute recipe
    console.log('Executing recipe:', JSON.stringify(recipe, null, 2))
    const grid = recipeExecutor.execute(recipe)
    console.log(`Grid generated: ${grid.width}x${grid.height}`)

    // 3. Return result
    res.json({
      success: true,
      grid: grid.toString(),
      recipe,
      metadata: {
        width: grid.width,
        height: grid.height,
        operations: recipe.recipe.length,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Recipe execution error:', error)
    handleAIError(error, res)
  }
})

/**
 * POST /api/ai/suggest
 * Suggest improvements for existing shape
 */
router.post('/suggest', async (req, res) => {
  try {
    const { currentGrid, feedback } = req.body

    if (!currentGrid || !feedback) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Both currentGrid and feedback are required',
      })
    }

    // Build context-aware prompt
    const prompt = `Current ASCII art:\n${currentGrid}\n\nUser feedback: ${feedback}\n\nProvide a recipe to improve this art.`

    const recipe = await claudeService.parseShapePrompt(prompt)
    const grid = recipeExecutor.execute(recipe)

    res.json({
      success: true,
      grid: grid.toString(),
      recipe,
      metadata: {
        width: grid.width,
        height: grid.height,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('AI suggestion error:', error)
    handleAIError(error, res)
  }
})

/**
 * Error handler for AI-related errors
 */
function handleAIError(error, res) {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: error.message,
      suggestion: 'Try rephrasing your prompt with more specific details',
    })
  }

  if (error.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      message: 'Too many AI requests. Please try again in a moment.',
    })
  }

  if (error.message?.includes('API key')) {
    return res.status(500).json({
      success: false,
      error: 'Configuration error',
      message: 'AI service is not properly configured',
    })
  }

  // Generic fallback
  return res.status(500).json({
    success: false,
    error: 'AI generation failed',
    message: error.message || 'Could not generate shape from prompt',
    suggestion: 'Try using the manual shape generator instead',
  })
}

export default router
