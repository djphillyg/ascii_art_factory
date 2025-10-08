import 'dotenv/config'

import express from 'express';
import cors from 'cors'
import http from 'http'
import rateLimit from 'express-rate-limit'
import apiRoutes from './api/index.js'
import { initSocket } from './socket/index.js';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const server = http.createServer(app);
initSocket(server, PORT)

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: FRONTEND_URL,
}))

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
})

app.use('/api/', limiter)

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// api - post to create a shape
app.use('/api', apiRoutes)