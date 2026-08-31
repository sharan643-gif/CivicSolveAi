// Vercel Serverless Function Handler for Google Gemini AI endpoints
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
} from '../../server/geminiServerService.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { action } = req.query;
  // Vercel may send body as string — parse it if needed
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  try {
    switch (action) {
      case 'chat': {
        const reply = await generateCivicResponse(body.messages || []);
        return res.status(200).json({ success: true, reply });
      }
      case 'chat-stream': {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.status(200);
        try {
          const stream = await generateCivicResponseStream(body.messages || []);
          for await (const chunk of stream) {
            res.write(`data: ${JSON.stringify({ text: chunk.text, done: false })}\n\n`);
          }
          res.write(`data: ${JSON.stringify({ text: '', done: true })}\n\n`);
        } catch (err) {
          res.write(`data: ${JSON.stringify({ text: '', done: true, error: err.message })}\n\n`);
        }
        res.end();
        return;
      }
      case 'classify': {
        const classification = await classifyComplaint(body.title || '', body.description || '');
        return res.status(200).json({ success: true, classification });
      }
      case 'summarize': {
        const summary = await summarizeComplaint(body.description || '');
        return res.status(200).json({ success: true, summary });
      }
      case 'generate-complaint': {
        const draft = await generateComplaintDraft(body.prompt || '');
        return res.status(200).json({ success: true, draft });
      }
      case 'priority': {
        const priority = await analyzePriority(body.title || '', body.description || '', body.location || '');
        return res.status(200).json({ success: true, priority });
      }
      case 'explain-status': {
        const explanation = await explainStatus(body.status || 'reported');
        return res.status(200).json({ success: true, explanation });
      }
      case 'analyze-image': {
        const result = await analyzeImage(body.imageBase64 || '', body.imageType || 'image/jpeg');
        return res.status(200).json({ success: true, result });
      }
      case 'route-department': {
        const result = await routeDepartment(body.title || '', body.description || '', body.category || '', body.location || '');
        return res.status(200).json({ success: true, result });
      }
      case 'compare-evidence': {
        const result = await compareResolutionEvidence(body.beforeImage || '', body.afterImage || '', body.complaintDetails || {});
        return res.status(200).json({ success: true, result });
      }
      case 'explain-pending': {
        const explanation = await explainPendingStatus(body.complaintDetails || {}, body.bottleneck || '');
        return res.status(200).json({ success: true, explanation });
      }
      case 'analytics-query': {
        const result = await queryCivicAnalytics(body.query || '', body.contextData || {});
        return res.status(200).json({ success: true, result });
      }
      case 'deep-analyze': {
        const result = await deepAnalyzeComplaint(
          body.title || '', body.description || '', body.category || '', body.location || '', body.dbContext || {}
        );
        return res.status(200).json({ success: true, result });
      }
      case 'inspect-frame': {
        const { frameBase64 = '', conversationHistory = [], userMessage = '', mimeType = 'image/jpeg', voiceContext = null } = body;
        const result = await inspectFrame(frameBase64, conversationHistory, userMessage, mimeType, voiceContext);
        return res.status(200).json(result);
      }
      case 'generate-inspection-report': {
        const { observations = [], category = '', location = '', userNotes = '' } = body;
        const result = await generateInspectionReport({ observations, category, location, userNotes });
        return res.status(200).json(result);
      }
      default:
        return res.status(404).json({ success: false, error: `Unknown AI endpoint: ${action}` });
    }
  } catch (err) {
    console.error(`[Vercel Serverless AI] Error in /api/ai/${action}:`, err);
    return res.status(500).json({ success: false, error: err.message || 'Internal AI Server Error' });
  }
}
