# FAQ - Learning Notes 📚

A collection of concepts and explanations gathered while rebuilding system fluency.

---

## Node.js Module Systems 📦

### Why use ES Modules in the server?
*Added: 2025-10-02*

**Question:** Why is the server defined as an ES module and what are the benefits?

**Thinking:**
Node.js historically used CommonJS (`require`/`module.exports`) as its module system, but JavaScript evolved with ES Modules as the official standard. When you set `"type": "module"` in package.json, you're telling Node.js to interpret `.js` files using the modern ES module specification instead of the legacy CommonJS system. This is a fundamental choice that affects:
- How imports/exports work
- Whether you need file extensions
- What modern features are available
- How your code aligns with browser JavaScript

The question arose because you noticed `.js` extensions are required in server imports - this is a deliberate ES module requirement, not a bug!

**Explanation:**

The server uses `"type": "module"` in `package.json` to enable **ES Modules** (ESM) instead of the older **CommonJS** system.

**CommonJS (old default):**
```javascript
// No file extensions needed
const express = require('express');
const utils = require('./utils');

// Export with module.exports
module.exports = { app, start };
```

**ES Modules (modern, what you're using):**
```javascript
// File extensions REQUIRED for local imports
import express from 'express';
import { utils } from './utils.js';  // .js is mandatory

// Export with export keyword
export const app = express();
export function start() { }
```

**Example:**

Here's what changes with `"type": "module"`:

```javascript
// server/index.js with "type": "module"
import express from 'express';              // ✅ Works
import apiRoutes from './api/index.js';     // ✅ Works (note .js!)
await db.connect();                         // ✅ Top-level await works!

// ❌ These would ERROR with "type": "module"
const express = require('express');         // Can't use require
import apiRoutes from './api/index';        // Missing .js extension
```

**Without** `"type": "module"` (CommonJS default):
```javascript
// Would need to use require
const express = require('express');
const apiRoutes = require('./api/index');  // No .js needed

// ❌ These would ERROR without "type": "module"
import express from 'express';              // import not supported
await db.connect();                         // Top-level await not supported
```

**Impact:**

**Why This Matters:**
1. **Modern Standard** - ES modules are the official JavaScript standard, used in browsers and modern Node.js
2. **Top-level await** - You can use `await` at the module top level without wrapping in async functions
3. **Explicit imports** - Required `.js` extensions prevent ambiguity and make dependencies crystal clear
4. **Better tooling** - Tree-shaking (removing unused code) works better with ES modules
5. **Future-proof** - Node.js and the ecosystem are moving towards ESM as the standard

**Tradeoffs:**
- ✅ Modern syntax and features
- ✅ Better optimization potential
- ✅ Consistent with browser JavaScript
- ⚠️ Must include `.js` extensions (more verbose)
- ⚠️ Can't mix with CommonJS easily (require won't work)
- ⚠️ Some older packages may not support ESM

**Your Codebase:**
Both `/package.json` (CLI) and `/server/package.json` use `"type": "module"`, which is why all your imports need `.js` extensions and you can use modern features like top-level await throughout your project.

---

## Express & API Security 🔒

### What is express-rate-limit and why CORS for React dev?
*Added: 2025-10-02*

**Question:** What is express-rate-limit and why does the local React dev server need a CORS configuration on the server?

**Thinking:**
These are two fundamental backend concepts that come up when building APIs:

1. **Rate limiting** - When you expose an API, you need to protect it from abuse. Without limits, someone could hammer your server with thousands of requests, causing a DoS (Denial of Service) or running up costs on cloud services. express-rate-limit is the standard Express middleware for this.

2. **CORS (Cross-Origin Resource Sharing)** - This is about browser security. When your React dev server runs on `localhost:3000` and Express runs on `localhost:3001`, browsers see these as different "origins" (protocol + domain + port). By default, browsers block requests between different origins to prevent malicious websites from stealing data. You need to explicitly configure your server to allow cross-origin requests.

The CORS issue is especially confusing in development because it works fine in production (when React is served from the same origin as the API), but breaks in dev mode where they're separate servers.

**Explanation:**

### express-rate-limit 🛡️

`express-rate-limit` is middleware that limits how many requests a client can make to your API within a time window.

**What it does:**
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter); // Apply to all API routes
```

**Protection against:**
- DoS (Denial of Service) attacks
- Brute force login attempts
- API abuse / scraping
- Cost overruns on metered services

### CORS for React Dev 🌐

**The Problem:**

React dev server: `http://localhost:3000`
Express server: `http://localhost:3001`

These are **different origins** (different ports = different origin).

**Browser Same-Origin Policy:**
```
Origin = Protocol + Domain + Port

http://localhost:3000 ≠ http://localhost:3001
   ↑                         ↑
Different ports = Different origins = ❌ BLOCKED by browser
```

**Without CORS middleware:**
```javascript
// React app tries to fetch
fetch('http://localhost:3001/api/shapes')
  .then(res => res.json())
  .catch(err => console.error(err));

// ❌ Browser error:
// "Access to fetch at 'http://localhost:3001/api/shapes' from origin
// 'http://localhost:3000' has been blocked by CORS policy"
```

**With CORS middleware:**
```javascript
// server/index.js
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:3000', // Allow React dev server
  credentials: true // Allow cookies if needed
}));

// ✅ Now React can call your API!
```

**Example:**

**Development Setup:**
```javascript
// server/index.js
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

// CORS - Allow React dev server
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Rate limiting - Prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100 // 100 requests per 15 min per IP
});
app.use('/api/', limiter);

// Your routes
app.get('/api/shapes', (req, res) => {
  res.json({ shapes: [...] });
});

app.listen(3001);
```

**React App:**
```javascript
// Now this works! ✅
useEffect(() => {
  fetch('http://localhost:3001/api/shapes')
    .then(res => res.json())
    .then(data => setShapes(data.shapes));
}, []);
```

**Impact:**

**express-rate-limit:**
- **Production necessity** - Prevents API abuse and DoS attacks
- **Cost control** - Limits requests to prevent runaway cloud costs
- **Fair usage** - Ensures all clients get reasonable access
- **Configurable** - Set different limits per route (stricter for login, looser for public data)

**CORS Configuration:**
- **Development requirement** - React dev (port 3000) and Express (port 3001) are different origins
- **Browser security** - Same-Origin Policy prevents malicious cross-site requests
- **Production note** - If you serve React from the same origin as Express (e.g., `example.com` serves both), CORS isn't needed
- **Security consideration** - In production, only allow specific origins, never use `origin: '*'` (allows anyone)

**Configuration strategies:**
```javascript
// Development - Allow local React
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://myapp.com'  // Production domain
    : 'http://localhost:3000' // Dev React server
};
app.use(cors(corsOptions));
```

**Common gotcha:**
CORS errors only happen in the **browser**. Tools like `curl` or Postman don't enforce CORS (they're not browsers), so your API might work in Postman but fail in the React app. This is normal - it's a browser security feature, not an API bug!

---