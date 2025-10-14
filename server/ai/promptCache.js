import crypto from 'crypto'

class PromptCache {
  constructor(options = {}) {
    this.cache = new Map()
    this.maxSize = options.maxSize || 100
    this.ttl = options.ttl || 3600000 // 1 hour default
  }

  /**
   * Get cached recipe for prompt
   * @param {string} prompt - Natural language prompt
   * @returns {Object|null} Cached recipe or null
   */
  get(prompt) {
    const key = this.hashPrompt(prompt)
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    console.log(`Cache hit for prompt: "${prompt}"`)
    return entry.value
  }

  /**
   * Store recipe in cache
   * @param {string} prompt - Natural language prompt
   * @param {Object} recipe - Recipe to cache
   */
  set(prompt, recipe) {
    // Enforce size limit (FIFO eviction)
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    const key = this.hashPrompt(prompt)
    this.cache.set(key, {
      value: recipe,
      timestamp: Date.now(),
    })

    console.log(`Cache set for prompt: "${prompt}"`)
  }

  /**
   * Hash prompt for cache key
   * @param {string} prompt - Prompt to hash
   * @returns {string} Hash key
   */
  hashPrompt(prompt) {
    // Normalize prompt
    const normalized = prompt.toLowerCase().trim().replace(/\s+/g, ' ')

    // Create hash
    return crypto
      .createHash('sha256')
      .update(normalized)
      .digest('hex')
      .substring(0, 16)
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear()
    console.log('Cache cleared')
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        age: Date.now() - value.timestamp,
      })),
    }
  }
}

export default PromptCache
