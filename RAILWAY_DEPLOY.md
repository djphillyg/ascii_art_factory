# Railway Deployment Guide

## Single-Service Deployment (Backend serves Frontend)

This app is configured for **single-service deployment** where the Express backend serves the built React frontend.

### Deployment Steps

1. **Create a new Railway project**
   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Build Settings**
   Railway will auto-detect Node.js. Configure as follows:

   **Build Command:**
   ```bash
   npm run build
   ```

   **Start Command:**
   ```bash
   npm start
   ```

   **Root Directory:** (leave blank to use project root)

3. **Set Environment Variables**
   In Railway dashboard, add these variables:

   ```env
   NODE_ENV=production
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
   ANTHROPIC_MAX_TOKENS=4096
   PORT=3001
   ```

4. **Deploy**
   - Railway will automatically build and deploy
   - The build process:
     1. Installs root dependencies
     2. Installs frontend dependencies
     3. Builds React app to `frontend/dist`
     4. Installs server dependencies
     5. Starts Express server serving both API and frontend

5. **Access Your App**
   - Railway will provide a URL like `https://your-app.railway.app`
   - The app will be available at that URL

### How It Works

**Build Process** (`npm run build`):
```bash
cd frontend && npm install && npm run build && cd ../server && npm install
```

**Production Startup** (`npm start`):
```bash
cd server && node index.js
```

**In Production Mode:**
- Frontend is served from `/frontend/dist`
- API endpoints are available at `/api/*`
- WebSocket connects to same origin
- No CORS issues (same origin)

**URL Configuration:**
- Frontend automatically uses `window.location.origin` in production
- No need to set `VITE_BACKEND_URL` or `FRONTEND_URL` in Railway
- Works seamlessly with Railway's assigned domain

### Testing Locally

To test production build locally:

```bash
# Build the app
npm run build

# Set NODE_ENV and start
NODE_ENV=production npm start
```

Then visit `http://localhost:3001`

### Troubleshooting

**If WebSocket doesn't connect:**
- Check Railway logs: `railway logs`
- Ensure `NODE_ENV=production` is set
- Verify server is listening on the correct PORT

**If AI features don't work:**
- Verify `ANTHROPIC_API_KEY` is set in Railway environment variables
- Check Railway logs for API errors

**If frontend doesn't load:**
- Verify `npm run build` completed successfully
- Check that `frontend/dist` directory exists
- Ensure `NODE_ENV=production` is set

### Alternative: Two-Service Deployment

If you prefer separate services for frontend and backend:

1. **Backend Service:**
   - Root directory: `/server`
   - Start command: `npm start`
   - Set env vars: `ANTHROPIC_API_KEY`, `FRONTEND_URL` (with frontend Railway URL)

2. **Frontend Service:**
   - Root directory: `/frontend`
   - Railway auto-detects Vite
   - Set env var: `VITE_BACKEND_URL` (with backend Railway URL)

### Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `ANTHROPIC_API_KEY` | Yes | Claude API key | `sk-ant-...` |
| `ANTHROPIC_MODEL` | No | Claude model version | `claude-3-5-sonnet-20241022` |
| `ANTHROPIC_MAX_TOKENS` | No | Max tokens per request | `4096` |
| `PORT` | No | Server port (Railway sets automatically) | `3001` |
| `VITE_BACKEND_URL` | No | Backend URL (only needed for two-service deployment) | `https://backend.railway.app` |
| `FRONTEND_URL` | No | Frontend URL (only needed for two-service deployment) | `https://frontend.railway.app` |