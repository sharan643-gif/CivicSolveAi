// Vite plugin registering secure server-side API middleware for Groq AI
// Ensures GROQ_API_KEY is executed exclusively on Node.js server and NEVER exposed to client.

import { 
  generateCivicResponse, 
  classifyComplaint, 
  summarizeComplaint, 
  generateComplaintDraft, 
  analyzePriority, 
  explainStatus, 
  analyzeImage 
} from './groqServerService.js';

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJsonResponse(res, data, statusCode = 200) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function createGroqMiddleware() {
  return async (req, res, next) => {
    const url = req.url ? req.url.split('?')[0] : '';
    
    // Only handle POST requests under /api/ai/
    if (req.method !== 'POST' || !url.startsWith('/api/ai/')) {
      return next();
    }

    try {
      const body = await parseRequestBody(req);

      if (url === '/api/ai/chat') {
        const messages = Array.isArray(body.messages) ? body.messages : [{ role: 'user', content: body.question || 'Hello' }];
        const response = await generateCivicResponse(messages);
        return sendJsonResponse(res, { success: true, reply: response });
      }

      if (url === '/api/ai/classify') {
        const { title = '', description = '' } = body;
        const classification = await classifyComplaint(title, description);
        return sendJsonResponse(res, { success: true, classification });
      }

      if (url === '/api/ai/summarize') {
        const { description = '' } = body;
        const summary = await summarizeComplaint(description);
        return sendJsonResponse(res, { success: true, summary });
      }

      if (url === '/api/ai/generate-complaint') {
        const { prompt = '' } = body;
        const draft = await generateComplaintDraft(prompt);
        return sendJsonResponse(res, { success: true, draft });
      }

      if (url === '/api/ai/priority') {
        const { title = '', description = '', location = '' } = body;
        const priority = await analyzePriority(title, description, location);
        return sendJsonResponse(res, { success: true, priority });
      }

      if (url === '/api/ai/explain-status') {
        const { status = '' } = body;
        const explanation = await explainStatus(status);
        return sendJsonResponse(res, { success: true, explanation });
      }

      if (url === '/api/ai/analyze-image') {
        const { imageBase64 = '', imageType = 'image/jpeg' } = body;
        const result = await analyzeImage(imageBase64, imageType);
        return sendJsonResponse(res, { success: true, result });
      }

      return sendJsonResponse(res, { error: 'Endpoint not found' }, 404);
    } catch (err) {
      console.error('[ViteGroqApiPlugin] Middleware error:', err.message);
      return sendJsonResponse(res, { 
        success: false, 
        error: 'AI assistance is temporarily unavailable. Please try again.' 
      }, 500);
    }
  };
}

export default function viteGroqApiPlugin() {
  const middleware = createGroqMiddleware();
  return {
    name: 'vite-groq-api-plugin',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    }
  };
}
