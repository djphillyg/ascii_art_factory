import ClaudeService from '../../ai/claudeService.js'
import RecipeExecutor from '../../ai/recipeExecutor.js'

// Create service instances at module level
const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY)
const recipeExecutor = new RecipeExecutor()

export const aiHandler = (socket) => {
  socket.on('generateAIShape', async (data) => {
    try {
      const { prompt } = data

      console.log(`AI generation requested: "${prompt}"`)

      // 1. Parse prompt with Claude
      socket.emit('aiGenerateStart', { status: 'Thinking...' })

      const recipe = await claudeService.parseShapePrompt(prompt)

      socket.emit('aiGenerateStart', {
        status: 'Generating...',
        recipe,
      })

      // 2. Execute recipe
      const grid = recipeExecutor.execute(recipe)

      // 3. Attach event listeners BEFORE streaming
      grid.on('rowCompleted', ({ rowIndex, data, total }) => {
        socket.emit('aiGenerateRow', {
          rowIndex,
          data,
          progress: ((rowIndex + 1) / total) * 100,
        })
      })

      grid.on('complete', ({ total }) => {
        console.log('🏁 Server emitting aiGenerateComplete to socket:', socket.id)
        socket.emit('aiGenerateComplete', {
          totalRows: total,
          width: grid.width,
          height: grid.height,
          recipe,
        })
        console.log('✅ aiGenerateComplete emitted successfully')
      })

      // 4. Trigger streaming with delay for animation (50ms between rows)
      await grid.streamRowsWithDelay(50)
    } catch (error) {
      console.error('AI streaming error:', error)
      socket.emit('aiGenerateError', {
        message: error.message,
        suggestion: 'Try rephrasing your prompt',
      })
    }
  })
}
