// Vite plugin registering secure server-side API middleware for Google Gemini AI
// Ensures GEMINI_API_KEY is executed exclusively on Node.js server and NEVER exposed to client.

import { 
  generateCivicResponse, 
  generateCivicResponseStream,
  classifyComplaint, 
  summarizeComplaint,
  generateComplaintDraft,
  analyzePriority,
  explainStatus,
  analyzeImage,
  routeDepartment,
  compareResolutionEvidence,
  explainPendingStatus,
  queryCivicAnalytics,
  inspectFrame,
  generateInspectionReport,
  deepAnalyzeComplaint
} from './geminiServerService.js';

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

function createGeminiMiddleware() {
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

      if (url === '/api/ai/chat-stream') {
        const messages = Array.isArray(body.messages) ? body.messages : [{ role: 'user', content: body.question || 'Hello' }];
        
        // SSE streaming response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        try {
          const stream = await generateCivicResponseStream(messages);
          for await (const chunk of stream) {
            const data = JSON.stringify({ text: chunk.text, done: false });
            res.write(`data: ${data}\n\n`);
          }
          res.write(`data: ${JSON.stringify({ text: '', done: true })}\n\n`);
        } catch (err) {
          res.write(`data: ${JSON.stringify({ text: '', done: true, error: err.message })}\n\n`);
        }
        res.end();
        return;
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

      if (url === '/api/ai/route-department') {
        const { title = '', description = '', category = '', location = '' } = body;
        const result = await routeDepartment(title, description, category, location);
        return sendJsonResponse(res, { success: true, result });
      }

      if (url === '/api/ai/compare-evidence') {
        const { beforeImage = '', afterImage = '', complaintDetails = {} } = body;
        const result = await compareResolutionEvidence(beforeImage, afterImage, complaintDetails);
        return sendJsonResponse(res, { success: true, result });
      }

      if (url === '/api/ai/explain-pending') {
        const { complaintDetails = {}, bottleneck = '' } = body;
        const explanation = await explainPendingStatus(complaintDetails, bottleneck);
        return sendJsonResponse(res, { success: true, explanation });
      }

      if (url === '/api/ai/analytics-query') {
        const { query = '', contextData = {} } = body;
        const result = await queryCivicAnalytics(query, contextData);
        return sendJsonResponse(res, { success: true, result });
      }

      if (url === '/api/ai/deep-analyze') {
        const { title = '', description = '', category = '', location = '', dbContext = {} } = body;
        const result = await deepAnalyzeComplaint(title, description, category, location, dbContext);
        return sendJsonResponse(res, { success: true, result });
      }

      if (url === '/api/ai/inspect-frame') {
        const { frameBase64 = '', conversationHistory = [], userMessage = '', mimeType = 'image/jpeg', voiceContext = null } = body;
        const result = await inspectFrame(frameBase64, conversationHistory, userMessage, mimeType, voiceContext);
        return sendJsonResponse(res, result);
      }

      if (url === '/api/ai/generate-inspection-report') {
        const { observations = [], category = '', location = '', userNotes = '' } = body;
        const result = await generateInspectionReport({ observations, category, location, userNotes });
        return sendJsonResponse(res, result);
      }

      return sendJsonResponse(res, { error: 'Endpoint not found' }, 404);
    } catch (err) {
      console.error('[ViteGeminiApiPlugin] Middleware error:', err.message);
      return sendJsonResponse(res, { 
        success: false, 
        error: 'AI assistance is temporarily unavailable. Please try again.' 
      }, 500);
    }
  };
}

export default function viteGeminiApiPlugin() {
  const middleware = createGeminiMiddleware();
  return {
    name: 'vite-gemini-api-plugin',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    }
  };
}
