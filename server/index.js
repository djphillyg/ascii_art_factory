import express from 'express';
import apiRoutes from './api/index.js'

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// api - post to create a shape
app.use('/api', apiRoutes)


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
