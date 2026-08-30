// CivicSolve AI - Gemini AI Endpoints Verification Script
import {
  generateCivicResponse,
  classifyComplaint,
  summarizeComplaint,
  generateComplaintDraft,
  analyzePriority,
  explainStatus,
  analyzeImage,
  routeDepartment,
  GEMINI_MODEL,
  GEMINI_FALLBACK_MODEL
} from './geminiServerService.js';

async function runVerification() {
  console.log('====================================================');
  console.log('   Google Gemini AI Integration Verification Test   ');
  console.log('====================================================');
  console.log(`Primary Model Configured:  ${GEMINI_MODEL}`);
  console.log(`Fallback Model Configured: ${GEMINI_FALLBACK_MODEL}`);
  console.log('----------------------------------------------------');

  let passed = 0;
  let total = 0;

  // Test 1: Chatbot response
  total++;
  try {
    console.log('\n[Test 1] Testing generateCivicResponse (Chatbot query)...');
    const reply = await generateCivicResponse([
      { role: 'user', content: 'There is a massive water pipe burst on MG Road flooding homes.' }
    ]);
    console.log('Reply received:', reply.slice(0, 140) + '...');
    if (reply && reply.length > 10) {
      console.log('✓ Test 1 PASSED');
      passed++;
    } else {
      console.error('✗ Test 1 FAILED: Empty reply');
    }
  } catch (err) {
    console.error('✗ Test 1 FAILED with error:', err.message);
  }

  // Test 2: Voice Assistant JSON Extraction
  total++;
  try {
    console.log('\n[Test 2] Testing generateCivicResponse (Voice Assistant JSON Prompt)...');
    const voicePrompt = `You are a civic issue report assistant. Based on the following conversation answers, extract and return a valid JSON object ONLY with no surrounding text or markdown ticks:
User's answers:
- Problem description: "Road collapsed near school after heavy rain"
- Location: "Sikaripara, Dumka"
- Who is affected: "School children and local commuters"
- Affected population: "2500"
- Duration: "1 week"

Return JSON:
{
  "title": "Clear concise 5-8 word problem title",
  "description": "Well-structured 2-3 sentence problem statement",
  "category": "Infrastructure",
  "district": "Dumka",
  "location": "Sikaripara",
  "severity": "high",
  "affected_population": 2500,
  "who_affected": "School children and local commuters",
  "duration": "1 week",
  "spoken_summary": "Short friendly confirmation"
}`;

    const rawVoiceAi = await generateCivicResponse([
      { role: 'system', content: 'You are JanSetu Voice AI parser. Output strict JSON only.' },
      { role: 'user', content: voicePrompt }
    ]);
    console.log('Voice Output:', rawVoiceAi.slice(0, 140) + '...');
    const match = rawVoiceAi.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (parsed.title && parsed.category) {
        console.log('Parsed successfully:', { title: parsed.title, category: parsed.category, severity: parsed.severity });
        console.log('✓ Test 2 PASSED');
        passed++;
      } else {
        console.error('✗ Test 2 FAILED: Missing fields in parsed voice JSON');
      }
    } else {
      console.error('✗ Test 2 FAILED: No JSON detected');
    }
  } catch (err) {
    console.error('✗ Test 2 FAILED with error:', err.message);
  }

  // Test 3: Complaint Classification
  total++;
  try {
    console.log('\n[Test 3] Testing classifyComplaint (Structured JSON)...');
    const classification = await classifyComplaint(
      'Dangerous Open High-Voltage Transformer',
      'An open electrical transformer near residential apartments with exposed wires sparking during rain.'
    );
    console.log('Classification Result:', classification);
    if (classification && classification.category && classification.priority_score) {
      console.log('✓ Test 3 PASSED');
      passed++;
    } else {
      console.error('✗ Test 3 FAILED: Invalid classification output');
    }
  } catch (err) {
    console.error('✗ Test 3 FAILED with error:', err.message);
  }

  // Test 4: Complaint Summarization
  total++;
  try {
    console.log('\n[Test 4] Testing summarizeComplaint...');
    const summary = await summarizeComplaint(
      'Municipal water pipeline broken at Main Market intersection causing severe flooding and potable water contamination for 3000 residents for past 5 days.'
    );
    console.log('Summary:', summary);
    if (summary && summary.length > 5) {
      console.log('✓ Test 4 PASSED');
      passed++;
    } else {
      console.error('✗ Test 4 FAILED: Empty summary');
    }
  } catch (err) {
    console.error('✗ Test 4 FAILED with error:', err.message);
  }

  // Test 5: Draft Complaint Generator
  total++;
  try {
    console.log('\n[Test 5] Testing generateComplaintDraft...');
    const draft = await generateComplaintDraft('Garbage dumping ground overflowing on Main Road near hospital');
    console.log('Generated Draft:', draft);
    if (draft && draft.title && draft.description && draft.department) {
      console.log('✓ Test 5 PASSED');
      passed++;
    } else {
      console.error('✗ Test 5 FAILED: Incomplete draft');
    }
  } catch (err) {
    console.error('✗ Test 5 FAILED with error:', err.message);
  }

  // Test 6: Priority & Risk Detection
  total++;
  try {
    console.log('\n[Test 6] Testing analyzePriority...');
    const priority = await analyzePriority('Collapsed Footover Bridge', 'Pedestrians forced to cross high-speed railway tracks', 'Ranchi Junction');
    console.log('Priority Analysis:', priority);
    if (priority && priority.priority_level && priority.priority_score) {
      console.log('✓ Test 6 PASSED');
      passed++;
    } else {
      console.error('✗ Test 6 FAILED: Invalid priority output');
    }
  } catch (err) {
    console.error('✗ Test 6 FAILED with error:', err.message);
  }

  // Test 7: Status Explanation
  total++;
  try {
    console.log('\n[Test 7] Testing explainStatus...');
    const exp1 = await explainStatus('validated');
    const exp2 = await explainStatus('active_development');
    console.log('Validated explanation:', exp1);
    console.log('Active development explanation:', exp2);
    if (exp1 && exp2) {
      console.log('✓ Test 7 PASSED');
      passed++;
    } else {
      console.error('✗ Test 7 FAILED');
    }
  } catch (err) {
    console.error('✗ Test 7 FAILED with error:', err.message);
  }

  // Test 8: Multimodal Image Analysis
  total++;
  try {
    console.log('\n[Test 8] Testing analyzeImage (Multimodal Vision Fallback/Processing)...');
    // Sample 1x1 transparent PNG base64 for test
    const sampleBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const imgResult = await analyzeImage(sampleBase64, 'image/png');
    console.log('Image Analysis Result:', imgResult);
    if (imgResult && imgResult.detected_issue && imgResult.confidence) {
      console.log('✓ Test 8 PASSED');
      passed++;
    } else {
      console.error('✗ Test 8 FAILED: Incomplete image analysis');
    }
  } catch (err) {
    console.error('✗ Test 8 FAILED with error:', err.message);
  }

  // Test 9: AI Department Routing & Accountability
  total++;
  try {
    console.log('\n[Test 9] Testing routeDepartment (Automated Department Routing)...');
    const routeResult = await routeDepartment(
      'Live high-tension wire snapped near marketplace',
      'High voltage cable fell across street, sparking danger for pedestrians',
      'Energy & Power',
      'Main Road, Ranchi'
    );
    console.log('Routing Result:', routeResult);
    if (routeResult && routeResult.department_id && routeResult.sla_days && routeResult.confidence) {
      console.log('✓ Test 9 PASSED');
      passed++;
    } else {
      console.error('✗ Test 9 FAILED: Incomplete routing result');
    }
  } catch (err) {
    console.error('✗ Test 9 FAILED with error:', err.message);
  }

  console.log('\n====================================================');
  console.log(`Results: ${passed}/${total} Tests Passed`);
  console.log('====================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runVerification();
