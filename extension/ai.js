import { loadSettings } from './db.js';

async function getProvider(settings) {
  const s = settings || (await loadSettings());
  return s.provider || 'chrome_built_in';
}

// Check if Chrome Built-in AI is available
function isChromeAIAvailable() {
  return typeof self !== 'undefined' && self.ai?.languageModel;
}

// Utilities to call Chrome Built-in AI (Gemini Nano) or fallback provider
async function callPromptAPI({ systemPrompt, userPrompt, settings }) {
  const provider = await getProvider(settings);
  if (provider === 'chrome_built_in' && isChromeAIAvailable()) {
    try {
      // Use Chrome Built-in AI Prompt API (Gemini Nano)
      const session = await self.ai.languageModel.create({
        systemPrompt: systemPrompt || "You are a helpful legal assistant."
      });
      const result = await session.prompt(userPrompt);
      return result || '';
    } catch (error) {
      console.error('Chrome Built-in AI error:', error);
      throw new Error(`Chrome AI failed: ${error.message}`);
    }
  }
  // Remote fallback
  return await remoteGeminiComplete({ systemPrompt, userPrompt, settings });
}

async function callSummarizerAPI({ text, style, settings }) {
  const provider = await getProvider(settings);
  const systemPrompt = `Summarize the following text in a ${style || 'concise'} legal style. Focus on key points, obligations, and important clauses.`;
  
  if (provider === 'chrome_built_in' && isChromeAIAvailable()) {
    try {
      // Use Chrome Built-in AI Summarizer (via Prompt API)
      if (self.ai?.summarizer) {
        // If specialized Summarizer API is available
        const result = await self.ai.summarizer.summarize({
          text: text,
          format: style || 'concise'
        });
        return result || '';
      } else {
        // Fallback to Prompt API for summarization
        const session = await self.ai.languageModel.create({ systemPrompt });
        const result = await session.prompt(`Summarize this legal text:\n\n${text}`);
        return result || '';
      }
    } catch (error) {
      console.error('Summarizer error:', error);
      throw new Error(`Summarization failed: ${error.message}`);
    }
  }
  return await remoteGeminiComplete({ systemPrompt, userPrompt: text, settings });
}

async function callTranslatorAPI({ text, targetLanguage, settings }) {
  const provider = await getProvider(settings);
  const systemPrompt = `Translate the following text to ${targetLanguage}. Keep legal terminology precise and maintain formal tone.`;
  
  if (provider === 'chrome_built_in' && isChromeAIAvailable()) {
    try {
      // Use Chrome Built-in AI Translator (via Prompt API)
      if (self.ai?.translator) {
        // If specialized Translator API is available
        const result = await self.ai.translator.translate({
          text: text,
          targetLanguage: targetLanguage
        });
        return result || '';
      } else {
        // Fallback to Prompt API for translation
        const session = await self.ai.languageModel.create({ systemPrompt });
        const result = await session.prompt(`Translate this text:\n\n${text}`);
        return result || '';
      }
    } catch (error) {
      console.error('Translator error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }
  return await remoteGeminiComplete({ systemPrompt, userPrompt: text, settings });
}

async function callWriterAPI({ docType, context, settings }) {
  const provider = await getProvider(settings);
  const systemPrompt = `You are a legal document writer. Create a ${docType} with clear sections, definitions, and obligations. Include placeholders for parties, dates, jurisdiction, and signatures.`;
  
  if (provider === 'chrome_built_in' && isChromeAIAvailable()) {
    try {
      // Use Chrome Built-in AI Writer API
      if (self.ai?.writer) {
        // If specialized Writer API is available
        const result = await self.ai.writer.write({
          prompt: context || `Create a ${docType}`,
          format: docType
        });
        return result || '';
      } else {
        // Fallback to Prompt API for writing
        const session = await self.ai.languageModel.create({ systemPrompt });
        const result = await session.prompt(context || `Create a ${docType}`);
        return result || '';
      }
    } catch (error) {
      console.error('Writer error:', error);
      throw new Error(`Document writing failed: ${error.message}`);
    }
  }
  return await remoteGeminiComplete({ systemPrompt, userPrompt: context || '', settings });
}

async function callRewriterAPI({ text, goal, settings }) {
  const provider = await getProvider(settings);
  const systemPrompt = `Rewrite the text to meet the goal: ${goal}. Preserve legal meaning; improve structure and readability.`;
  
  if (provider === 'chrome_built_in' && isChromeAIAvailable()) {
    try {
      // Use Chrome Built-in AI Rewriter API
      if (self.ai?.rewriter) {
        // If specialized Rewriter API is available
        const result = await self.ai.rewriter.rewrite({
          text: text,
          goal: goal
        });
        return result || '';
      } else {
        // Fallback to Prompt API for rewriting
        const session = await self.ai.languageModel.create({ systemPrompt });
        const result = await session.prompt(`Rewrite this text:\n\n${text}`);
        return result || '';
      }
    } catch (error) {
      console.error('Rewriter error:', error);
      throw new Error(`Rewriting failed: ${error.message}`);
    }
  }
  return await remoteGeminiComplete({ systemPrompt, userPrompt: text, settings });
}

async function callProofreaderAPI({ text, dialect, settings }) {
  const provider = await getProvider(settings);
  const systemPrompt = `Proofread for grammar, punctuation, and legal style (${dialect || 'en-US'}). Return corrected text only.`;
  
  if (provider === 'chrome_built_in' && isChromeAIAvailable()) {
    try {
      // Use Chrome Built-in AI Proofreader API
      if (self.ai?.proofreader) {
        // If specialized Proofreader API is available
        const result = await self.ai.proofreader.proofread({
          text: text,
          dialect: dialect || 'en-US'
        });
        return result || '';
      } else {
        // Fallback to Prompt API for proofreading
        const session = await self.ai.languageModel.create({ systemPrompt });
        const result = await session.prompt(`Proofread this text:\n\n${text}`);
        return result || '';
      }
    } catch (error) {
      console.error('Proofreader error:', error);
      throw new Error(`Proofreading failed: ${error.message}`);
    }
  }
  return await remoteGeminiComplete({ systemPrompt, userPrompt: text, settings });
}

// Public API used by popup
export async function promptModel({ systemPrompt, userPrompt, settings }) {
  return await callPromptAPI({ systemPrompt, userPrompt, settings });
}

export async function summarizeText({ text, style = 'concise', settings }) {
  return await callSummarizerAPI({ text, style, settings });
}

export async function translateText({ text, targetLanguage, settings }) {
  return await callTranslatorAPI({ text, targetLanguage, settings });
}

export async function writeLegalDoc({ docType, context, settings }) {
  return await callWriterAPI({ docType, context, settings });
}

export async function rewriteText({ text, goal, settings }) {
  return await callRewriterAPI({ text, goal, settings });
}

export async function proofreadText({ text, dialect, settings }) {
  return await callProofreaderAPI({ text, dialect, settings });
}

// Remote Gemini API fallback (for when Chrome Built-in AI is unavailable)
async function remoteGeminiComplete({ systemPrompt, userPrompt, settings }) {
  const apiKey = settings?.apiKey || '';
  if (!apiKey) {
    // Return demo mode output instead of throwing error
    return getDemoOutput(systemPrompt, userPrompt);
  }
  
  try {
    // Use Gemini Developer API (Gemini 1.5 Flash recommended for speed)
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;
    
    const body = {
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\n${userPrompt}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${error}`);
    }
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No text in Gemini API response');
    }
    
    return text;
  } catch (error) {
    console.error('Remote Gemini API error:', error);
    // Fall back to demo mode if API fails
    return getDemoOutput(systemPrompt, userPrompt);
  }
}

// Demo mode output for testing without API
function getDemoOutput(systemPrompt, userPrompt) {
  const lowerPrompt = userPrompt.toLowerCase();
  
  // Smart detection based on prompt content
  if (lowerPrompt.includes('nda') || lowerPrompt.includes('non-disclosure')) {
    return `NON-DISCLOSURE AGREEMENT

📋 DEMO MODE OUTPUT
This is a sample output to demonstrate the extension. To use real AI features:
1. Click ⚙️ (Settings)
2. Enable Chrome Built-in AI or add API key

═══════════════════════════════════════════════

This Non-Disclosure Agreement ("Agreement") is entered into between:

[PARTY A NAME]
[ADDRESS]

[PARTY B NAME]  
[ADDRESS]

1. CONFIDENTIAL INFORMATION
All proprietary data, trade secrets, and business information shared 
between parties shall be considered confidential.

2. OBLIGATIONS
- Maintain strict confidentiality
- Use only for intended business purpose
- No disclosure to third parties
- Implement security measures

3. DURATION
This Agreement remains in effect for 3 years from execution date.

4. TERMINATION
Either party may terminate with 30 days written notice.

═══════════════════════════════════════════════

[Signature blocks here]

⚠️ This is demo output. Enable Chrome Built-in AI for real results!`;
  }
  
  if (lowerPrompt.includes('invoice')) {
    return `PROFESSIONAL INVOICE

📋 DEMO MODE OUTPUT
Enable Chrome Built-in AI for real AI-generated invoices!

═══════════════════════════════════════════════

INVOICE #: INV-2025-${Math.floor(Math.random() * 10000)}
DATE: ${new Date().toLocaleDateString()}
DUE DATE: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}

BILL TO:
[Client Name]
[Company]
[Address]

SERVICES:
──────────────────────────────────────────────────
Item                     Qty    Rate      Amount
──────────────────────────────────────────────────
Web Development          40     $75/hr    $3,000
Consultation             5      $150/hr   $750
──────────────────────────────────────────────────
Subtotal                                    $3,750
Tax (10%)                                   $375
──────────────────────────────────────────────────
TOTAL                                     $4,125

Payment Terms: Net 30

⚠️ Demo output - Enable AI for production use!`;
  }
  
  if (lowerPrompt.includes('contract') || lowerPrompt.includes('agreement')) {
    return `SERVICE AGREEMENT

📋 DEMO MODE OUTPUT
This is a sample contract. Configure AI for real generation!

═══════════════════════════════════════════════

This Service Agreement is made effective as of ${new Date().toLocaleDateString()} 
between:

[SERVICE PROVIDER]
[Address]

AND

[CLIENT]
[Address]

1. SCOPE OF SERVICES
Provider shall deliver professional services including:
- Strategic consulting
- Implementation support
- Project management

2. COMPENSATION
Client shall pay $[RATE]/hour, payable within 30 days of invoice.

3. TERM
This Agreement commences on execution date and continues for 12 months.

4. TERMINATION
Either party may terminate with 30 days written notice.

[Additional standard clauses...]

⚠️ Demo output - Add API key or enable Chrome AI for real results!`;
  }
  
  // Default demo output
  return `📋 DEMO MODE

This is a sample output demonstrating the extension's capabilities.

TO ENABLE REAL AI FEATURES:

Option 1: Chrome Built-in AI (Recommended)
1. Install Chrome Canary 127+
2. Enable flags at chrome://flags:
   - #prompt-api-for-gemini-nano
   - #optimization-guide-on-device-model
3. Download model at chrome://components
4. Restart Chrome

Option 2: Remote API
1. Click ⚙️ (Settings)
2. Select "Gemini Developer API"
3. Add API key from https://aistudio.google.com/apikey

Your prompt: "${userPrompt.substring(0, 100)}..."

🔧 Configure settings to generate real AI responses!`;
}


