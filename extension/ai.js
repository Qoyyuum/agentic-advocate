import { loadSettings } from './db.js';

async function getProvider(settings) {
  const s = settings || (await loadSettings());
  return s.provider || 'chrome_built_in';
}

// Check if Chrome Built-in AI is available
function isChromeAIAvailable() {
  try {
    // Check in different contexts (popup, service worker, window)
    if (typeof self !== 'undefined' && self.ai) {
      // Check for languageModel specifically
      if (self.ai.languageModel) {
        return true;
      }
      // Check for any AI API
      if (self.ai.writer || self.ai.rewriter || self.ai.proofreader || self.ai.translator || self.ai.summarizer) {
        return true;
      }
    }
    if (typeof window !== 'undefined' && window.ai) {
      if (window.ai.languageModel) {
        return true;
      }
      if (window.ai.writer || window.ai.rewriter || window.ai.proofreader || window.ai.translator || window.ai.summarizer) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking Chrome AI availability:', error);
    return false;
  }
}

// Get AI object from available context
function getAIObj() {
  if (typeof self !== 'undefined' && self.ai) return self.ai;
  if (typeof window !== 'undefined' && window.ai) return window.ai;
  return null;
}

// Utilities to call Chrome Built-in AI (Gemini Nano) or fallback provider
async function callPromptAPI({ systemPrompt, userPrompt, settings }) {
  const provider = await getProvider(settings);
  
  // If explicitly set to remote, use remote API directly
  if (provider === 'gemini_remote') {
    return await remoteGeminiComplete({ systemPrompt, userPrompt, settings });
  }
  
  // Try Chrome Built-in AI first if available
  if (provider === 'chrome_built_in') {
    if (!isChromeAIAvailable()) {
      console.warn('Chrome Built-in AI not available. Available APIs:', {
        hasAI: !!(getAIObj()),
        context: typeof self !== 'undefined' ? 'service-worker' : (typeof window !== 'undefined' ? 'window' : 'unknown')
      });
    } else {
      try {
        // Use Chrome Built-in AI Prompt API (Gemini Nano)
        const ai = getAIObj();
        if (!ai) {
          throw new Error('Chrome AI object not found');
        }
        if (!ai.languageModel) {
          throw new Error('Chrome AI languageModel not available. Available: ' + Object.keys(ai).join(', '));
        }
        const session = await ai.languageModel.create({
          systemPrompt: systemPrompt || "You are a helpful legal assistant."
        });
        const result = await session.prompt(userPrompt);
        if (result) {
          return result;
        }
        throw new Error('Chrome AI returned empty result');
      } catch (error) {
        console.error('Chrome Built-in AI error:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          aiAvailable: isChromeAIAvailable(),
          aiObj: getAIObj() ? Object.keys(getAIObj()) : null
        });
        // Don't throw - fall back to remote API or demo
        console.warn('Falling back to remote API or demo mode');
      }
    }
  }
  // Remote fallback
  return await remoteGeminiComplete({ systemPrompt, userPrompt, settings });
}

async function callSummarizerAPI({ text, style, settings }) {
  const provider = await getProvider(settings);
  const systemPrompt = `Summarize the following text in a ${style || 'concise'} legal style. Focus on key points, obligations, and important clauses.`;
  
  // If explicitly set to remote, use remote API directly
  if (provider === 'gemini_remote') {
    return await remoteGeminiComplete({ systemPrompt, userPrompt: text, settings });
  }
  
  if (provider === 'chrome_built_in' && isChromeAIAvailable()) {
    try {
      const ai = getAIObj();
      // Use Chrome Built-in AI Summarizer (via Prompt API)
      if (ai?.summarizer) {
        // If specialized Summarizer API is available
        const result = await ai.summarizer.summarize({
          text: text,
          format: style || 'concise'
        });
        return result || '';
      } else if (ai?.languageModel) {
        // Fallback to Prompt API for summarization
        const session = await ai.languageModel.create({ systemPrompt });
        const result = await session.prompt(`Summarize this legal text:\n\n${text}`);
        return result || '';
      }
      throw new Error('Chrome AI not available');
    } catch (error) {
      console.error('Summarizer error:', error);
      console.warn('Falling back to remote API or demo mode');
    }
  }
  return await remoteGeminiComplete({ systemPrompt, userPrompt: text, settings });
}

async function callTranslatorAPI({ text, targetLanguage, settings }) {
  const provider = await getProvider(settings);
  const systemPrompt = `Translate the following text to ${targetLanguage}. Keep legal terminology precise and maintain formal tone.`;
  
  // If explicitly set to remote, use remote API directly
  if (provider === 'gemini_remote') {
    return await remoteGeminiComplete({ systemPrompt, userPrompt: text, settings });
  }
  
  if (provider === 'chrome_built_in' && isChromeAIAvailable()) {
    try {
      const ai = getAIObj();
      // Use Chrome Built-in AI Translator (via Prompt API)
      if (ai?.translator) {
        // If specialized Translator API is available
        const result = await ai.translator.translate({
          text: text,
          targetLanguage: targetLanguage
        });
        return result || '';
      } else if (ai?.languageModel) {
        // Fallback to Prompt API for translation
        const session = await ai.languageModel.create({ systemPrompt });
        const result = await session.prompt(`Translate this text to ${targetLanguage}:\n\n${text}`);
        return result || '';
      }
      throw new Error('Chrome AI not available');
    } catch (error) {
      console.error('Translator error:', error);
      console.warn('Falling back to remote API or demo mode');
    }
  }
  return await remoteGeminiComplete({ systemPrompt, userPrompt: text, settings });
}

async function callWriterAPI({ docType, context, settings }) {
  const provider = await getProvider(settings);
  const systemPrompt = `You are a legal document writer. Create a ${docType} with clear sections, definitions, and obligations. Include placeholders for parties, dates, jurisdiction, and signatures.`;
  
  // If explicitly set to remote, use remote API directly
  if (provider === 'gemini_remote') {
    return await remoteGeminiComplete({ systemPrompt, userPrompt: context || '', settings });
  }
  
  if (provider === 'chrome_built_in' && isChromeAIAvailable()) {
    try {
      const ai = getAIObj();
      // Use Chrome Built-in AI Writer API
      if (ai?.writer) {
        // If specialized Writer API is available
        const result = await ai.writer.write({
          prompt: context || `Create a ${docType}`,
          format: docType
        });
        return result || '';
      } else if (ai?.languageModel) {
        // Fallback to Prompt API for writing
        const session = await ai.languageModel.create({ systemPrompt });
        const result = await session.prompt(context || `Create a ${docType}`);
        return result || '';
      }
      throw new Error('Chrome AI not available');
    } catch (error) {
      console.error('Writer error:', error);
      console.warn('Falling back to remote API or demo mode');
    }
  }
  return await remoteGeminiComplete({ systemPrompt, userPrompt: context || '', settings });
}

async function callRewriterAPI({ text, goal, settings }) {
  const provider = await getProvider(settings);
  const systemPrompt = `Rewrite the text to meet the goal: ${goal}. Preserve legal meaning; improve structure and readability.`;
  
  // If explicitly set to remote, use remote API directly
  if (provider === 'gemini_remote') {
    return await remoteGeminiComplete({ systemPrompt, userPrompt: text, settings });
  }
  
  if (provider === 'chrome_built_in' && isChromeAIAvailable()) {
    try {
      const ai = getAIObj();
      // Use Chrome Built-in AI Rewriter API
      if (ai?.rewriter) {
        // If specialized Rewriter API is available
        const result = await ai.rewriter.rewrite({
          text: text,
          goal: goal
        });
        return result || '';
      } else if (ai?.languageModel) {
        // Fallback to Prompt API for rewriting
        const session = await ai.languageModel.create({ systemPrompt });
        const result = await session.prompt(`Rewrite this text to achieve: ${goal}\n\n${text}`);
        return result || '';
      }
      throw new Error('Chrome AI not available');
    } catch (error) {
      console.error('Rewriter error:', error);
      console.warn('Falling back to remote API or demo mode');
    }
  }
  return await remoteGeminiComplete({ systemPrompt, userPrompt: text, settings });
}

async function callProofreaderAPI({ text, dialect, settings }) {
  const provider = await getProvider(settings);
  const systemPrompt = `Proofread for grammar, punctuation, and legal style (${dialect || 'en-US'}). Return corrected text only.`;
  
  // If explicitly set to remote, use remote API directly
  if (provider === 'gemini_remote') {
    return await remoteGeminiComplete({ systemPrompt, userPrompt: text, settings });
  }
  
  if (provider === 'chrome_built_in' && isChromeAIAvailable()) {
    try {
      const ai = getAIObj();
      // Use Chrome Built-in AI Proofreader API
      if (ai?.proofreader) {
        // If specialized Proofreader API is available
        const result = await ai.proofreader.proofread({
          text: text,
          dialect: dialect || 'en-US'
        });
        return result || '';
      } else if (ai?.languageModel) {
        // Fallback to Prompt API for proofreading
        const session = await ai.languageModel.create({ systemPrompt });
        const result = await session.prompt(`Proofread this text for grammar, punctuation, and legal style:\n\n${text}`);
        return result || '';
      }
      throw new Error('Chrome AI not available');
    } catch (error) {
      console.error('Proofreader error:', error);
      console.warn('Falling back to remote API or demo mode');
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
  const apiKey = (settings?.apiKey || '').trim();
  if (!apiKey) {
    // Return demo mode output with clear instructions
    return getDemoOutput(systemPrompt, userPrompt, 'NO_API_KEY');
  }
  
  try {
    // First, try to list available models to see what we can use
    let availableModels = null;
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`;
      const listResponse = await fetch(listUrl);
      if (listResponse.ok) {
        const listData = await listResponse.json();
        availableModels = listData.models?.map(m => m.name?.replace('models/', '')) || [];
        console.log('Available Gemini models:', availableModels);
      }
    } catch (e) {
      console.warn('Could not list available models:', e);
    }
    
    // Try multiple model endpoints - prioritize ones that support generateContent
    const models = [
      'v1beta/models/gemini-1.5-flash',
      'v1/models/gemini-1.5-flash',
      'v1beta/models/gemini-1.5-pro',
      'v1/models/gemini-1.5-pro',
      'v1beta/models/gemini-pro',
      'v1/models/gemini-pro',
      // Try alternative names
      'v1beta/models/gemini-1.5-flash-002',
      'v1beta/models/gemini-1.5-pro-002',
      'v1beta/models/gemini-pro-002'
    ];
    
    // If we got available models, prioritize those
    if (availableModels && availableModels.length > 0) {
      const preferred = availableModels.filter(m => 
        m.includes('flash') || m.includes('pro') || m.includes('gemini')
      );
      if (preferred.length > 0) {
        // Add preferred models to the front of the list
        models.unshift(...preferred.map(m => `v1beta/models/${m}`));
      }
    }
    
    let lastError = null;
    
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        
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
        
        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0];
          
          if (candidate) {
            const text = candidate.content?.parts?.[0]?.text;
            
            if (text) {
              return text;
            }
            
            // Check finish reason
            if (candidate.finishReason === 'SAFETY') {
              throw new Error('Response blocked by safety filters. Try rephrasing your prompt.');
            } else if (candidate.finishReason && candidate.finishReason !== 'STOP') {
              throw new Error(`Generation stopped: ${candidate.finishReason}`);
            }
          }
          // If response is ok but no text, continue to next model
          lastError = 'Response OK but no text content';
        } else if (response.status !== 404) {
          // For non-404 errors, get error details and throw
          let errorText = '';
          try {
            const errorData = await response.json();
            errorText = errorData.error?.message || JSON.stringify(errorData);
          } catch {
            errorText = await response.text().catch(() => 'Unknown error');
          }
          
          // Handle specific error codes
          if (response.status === 400) {
            throw new Error(`Invalid API request: ${errorText}`);
          } else if (response.status === 401 || response.status === 403) {
            throw new Error(`API key invalid or expired: ${errorText}`);
          } else if (response.status === 429) {
            throw new Error(`Rate limit exceeded. Please wait and try again.`);
          } else {
            throw new Error(`API error (${response.status}): ${errorText}`);
          }
        }
        // For 404, try next model
        lastError = `Model ${model} not found (404)`;
      } catch (error) {
        lastError = error.message;
        // Continue to next model
      }
    }
    
    // If all models failed, provide helpful error message
    const errorMsg = `All Gemini API model endpoints failed (404).\n\n` +
      `This usually means:\n` +
      `1. Your API key might not have access to these models\n` +
      `2. The API key might be invalid or expired\n` +
      `3. The models require specific API access permissions\n\n` +
      `Last attempted: ${lastError || 'unknown'}\n\n` +
      `SOLUTIONS:\n` +
      `1. Verify your API key:\n` +
      `   - Go to https://aistudio.google.com/apikey\n` +
      `   - Create a new API key if needed\n` +
      `   - Copy the full key (should start with "AIza")\n\n` +
      `2. Check API key permissions:\n` +
      `   - Ensure Gemini API is enabled for your Google Cloud project\n` +
      `   - Go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com\n\n` +
      `3. Try Chrome Built-in AI instead:\n` +
      `   - Click ⚙️ Settings\n` +
      `   - Select "Chrome Built-in AI"\n` +
      `   - Requires Chrome Canary 127+ with flags enabled\n\n` +
      `Check console for available models list (if detected).`;
    
    throw new Error(errorMsg);
    
  } catch (error) {
    console.error('Remote Gemini API error:', error);
    // Return error message in demo output format with troubleshooting
    return getDemoOutput(systemPrompt, userPrompt, 'API_ERROR', error.message);
  }
}

// Diagnostic: Check Chrome AI availability
export async function checkChromeAIAvailability() {
  // Check in current context
  const localCheck = {
    available: isChromeAIAvailable(),
    hasLanguageModel: !!(getAIObj()?.languageModel),
    context: typeof self !== 'undefined' ? 'service-worker' : (typeof window !== 'undefined' ? 'window' : 'unknown')
  };
  
  // Also check in background context via message
  try {
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'AA_CHECK_AI_AVAILABLE' }, resolve);
    });
    return { ...localCheck, background: response };
  } catch (error) {
    return { ...localCheck, background: { error: error.message } };
  }
}

// Demo mode output for testing without API
function getDemoOutput(systemPrompt, userPrompt, reason = 'NOT_AVAILABLE', apiError = '') {
  const lowerPrompt = (userPrompt || '').toLowerCase();
  
  // Custom error message if API failed
  if (reason === 'API_ERROR') {
    return `❌ GEMINI API ERROR

${apiError || 'Unknown API error occurred'}

TROUBLESHOOTING:
1. Verify your API key is correct at https://aistudio.google.com/apikey
2. Check if your API key has proper permissions
3. Ensure you haven't exceeded rate limits
4. Verify your internet connection

To fix:
1. Click ⚙️ Settings
2. Check your API key is entered correctly
3. Make sure "Gemini Developer API" is selected as provider
4. Click Save and try again

If problems persist, check the browser console (F12) for detailed error messages.

Your prompt: "${(userPrompt || '').substring(0, 100)}..."`;
  }
  
  if (reason === 'NO_API_KEY') {
    return `🔑 API KEY REQUIRED

To use the Remote Gemini API, you need to configure an API key.

QUICK SETUP:
1. Get API key: https://aistudio.google.com/apikey
2. Click ⚙️ Settings button
3. Select "Gemini Developer API" as provider
4. Paste your API key
5. Click Save

Your prompt: "${(userPrompt || '').substring(0, 100)}..."`;
  }
  
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
  const diagnostics = `\n\n🔍 DIAGNOSTICS:\n- Chrome AI detected: ${isChromeAIAvailable() ? 'YES ✅' : 'NO ❌'}\n- Check console for detailed availability info`;
  
  return `📋 DEMO MODE

This is a sample output demonstrating the extension's capabilities.

⚠️ WHY YOU'RE SEEING THIS:
The extension cannot access Chrome Built-in AI or a remote API key.

TO ENABLE REAL AI FEATURES:

Option 1: Chrome Built-in AI (Recommended - Free & Private)
✅ REQUIRES: Chrome Canary 127+ (NOT regular Chrome)
1. Download Chrome Canary: https://www.google.com/chrome/canary/
2. Enable flags at chrome://flags:
   - Search for: prompt-api-for-gemini-nano → Enable
   - Search for: optimization-guide-on-device-model → Enable
3. Download model at chrome://components:
   - Scroll to find "On-Device Model" (should appear after enabling flags)
   - Click "Check for update" (downloads ~2-3 GB)
4. RESTART Chrome completely (close all windows)

⚠️ NOTE: If you don't see "On-Device Model" in chrome://components:
- You're not on Chrome Canary 127+
- Flags are not enabled
- Try restarting Chrome after enabling flags

Option 2: Remote Gemini API (Requires API Key) ⭐ EASIER
1. Get API key: https://aistudio.google.com/apikey (free, requires Google account)
2. Click ⚙️ (Settings button in extension)
3. Select "Gemini Developer API" as provider
4. Paste your API key
5. Click Save
6. Try again!

Your prompt: "${(userPrompt || '').substring(0, 100)}..."${diagnostics}

💡 TIP: Open DevTools Console (F12) to see detailed diagnostics!`;
}


