// Vercel Serverless Function Handler for Groq AI endpoints
import {
  generateCivicResponse,
  classifyComplaint,
  summarizeComplaint,
  generateComplaintDraft,
  analyzePriority,
  explainStatus,
  analyzeImage
} from '../../server/groqServerService.js';

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
  const body = req.body || {};

  try {
    switch (action) {
      case 'chat': {
        const reply = await generateCivicResponse(body.messages || []);
        return res.status(200).json({ success: true, reply });
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
      default:
        return res.status(404).json({ success: false, error: `Unknown AI endpoint: ${action}` });
    }
  } catch (err) {
    console.error(`[Vercel Serverless AI] Error in /api/ai/${action}:`, err);
    return res.status(500).json({ success: false, error: err.message || 'Internal AI Server Error' });
  }
}
