import ClaudeService from '../../ai/claudeService.js'
import RecipeExecutor from '../../ai/recipeExecutor.js'

class AIHandler {
  constructor(io) {
    this.io = io
    this.claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY)
    this.recipeExecutor = new RecipeExecutor()
  }

  /**
   * Handle 'generateAIShape' event
   */
  handleGenerateAIShape(socket, data) {
    const { prompt } = data

    console.log(`AI generation requested: "${prompt}"`)

    // Use async wrapper to handle streaming
    this.generateWithStreaming(socket, prompt)
  }

  /**
   * Generate and stream result row-by-row
   */
  async generateWithStreaming(socket, prompt) {
    try {
      // 1. Parse prompt with Claude
      socket.emit('aiGenerateStart', { status: 'Thinking...' })

      const recipe = await this.claudeService.parseShapePrompt(prompt)

      socket.emit('aiGenerateStart', {
        status: 'Generating...',
        recipe,
      })

      // 2. Execute recipe
      const grid = this.recipeExecutor.execute(recipe)

      // 3. Stream rows
      grid.on('rowCompleted', rowData => {
        socket.emit('aiGenerateRow', rowData)
      })

      grid.on('complete', () => {
        socket.emit('aiGenerateComplete', {
          width: grid.width,
          height: grid.height,
          recipe,
        })
      })

      // Trigger streaming
      grid.streamRowsV1()
    } catch (error) {
      console.error('AI streaming error:', error)
      socket.emit('aiGenerateError', {
        message: error.message,
        suggestion: 'Try rephrasing your prompt',
      })
    }
  }

  /**
   * Register all AI-related socket handlers
   */
  register(socket) {
    socket.on('generateAIShape', data =>
      this.handleGenerateAIShape(socket, data)
    )
  }
}

export default AIHandler
