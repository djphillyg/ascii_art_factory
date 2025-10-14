import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import rateLimit from 'express-rate-limit'
import apiRoutes from './api/index.js'
import aiRoutes from './ai/index.js'
import { initSocket } from './socket/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const NODE_ENV = process.env.NODE_ENV || 'development'
const server = http.createServer(app)
initSocket(server, PORT)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS - Allow frontend URL in development, or same origin in production
app.use(
  cors({
    origin: NODE_ENV === 'production' ? true : FRONTEND_URL,
    credentials: true,
  })
)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

app.use('/api/', limiter)

// API Routes (must come before static files)
app.use('/api', apiRoutes)
app.use('/api/ai', aiRoutes)

// Serve static files from frontend build in production
if (NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist')
  app.use(express.static(frontendPath))

  // Catch-all route - serve index.html for client-side routing
  // Express 5 requires /* instead of * for wildcards
  app.get('/*', (_req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'))
  })
} else {
  // Development mode - just API endpoint
  app.get('/', (_req, res) => {
    res.json({ message: 'Server is running in development mode' })
  })
}
