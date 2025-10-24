/* global LanguageModel, AIWriter, AIRewriter, AISummarizer */

import DOMPurify from 'dompurify';
import { marked } from 'marked';

const inputPrompt = document.body.querySelector('#input-prompt');
const operationMode = document.body.querySelector('#operation-mode');
const buttonPrompt = document.body.querySelector('#button-prompt');
const buttonReset = document.body.querySelector('#button-reset');
const buttonLoadSelection = document.body.querySelector('#button-load-selection');
const elementResponse = document.body.querySelector('#response');
const elementLoading = document.body.querySelector('#loading');
const elementError = document.body.querySelector('#error');
const elementCapabilities = document.body.querySelector('#capabilities-info');
const advancedSettings = document.body.querySelector('#advanced-settings');
const sliderTemperature = document.body.querySelector('#temperature');
const sliderTopK = document.body.querySelector('#top-k');
const labelTemperature = document.body.querySelector('#label-temperature');
const labelTopK = document.body.querySelector('#label-top-k');

let session;
let capabilities = {
  prompt: false,
  summarizer: false,
  writer: false,
  rewriter: false
};

// Check available AI capabilities
async function checkCapabilities() {
  const info = [];
  
  // Check Prompt API (LanguageModel)
  if ('LanguageModel' in self) {
    try {
      const status = await LanguageModel.capabilities();
      capabilities.prompt = status.available === 'readily' || status.available === 'after-download';
      info.push(`✓ Prompt API: ${status.available}`);
    } catch (e) {
      info.push('✗ Prompt API: unavailable');
    }
  } else {
    info.push('✗ Prompt API: not supported');
  }

  // Check Summarizer API
  if ('AISummarizer' in self) {
    try {
      const status = await AISummarizer.capabilities();
      capabilities.summarizer = status.available === 'readily' || status.available === 'after-download';
      info.push(`✓ Summarizer API: ${status.available}`);
    } catch (e) {
      info.push('✗ Summarizer API: unavailable');
    }
  } else {
    info.push('✗ Summarizer API: not supported');
  }

  // Check Writer API
  if ('AIWriter' in self) {
    try {
      const status = await AIWriter.capabilities();
      capabilities.writer = status.available === 'readily' || status.available === 'after-download';
      info.push(`✓ Writer API: ${status.available}`);
    } catch (e) {
      info.push('✗ Writer API: unavailable');
    }
  } else {
    info.push('✗ Writer API: not supported');
  }

  // Check Rewriter API
  if ('AIRewriter' in self) {
    try {
      const status = await AIRewriter.capabilities();
      capabilities.rewriter = status.available === 'readily' || status.available === 'after-download';
      info.push(`✓ Rewriter API: ${status.available}`);
    } catch (e) {
      info.push('✗ Rewriter API: unavailable');
    }
  } else {
    info.push('✗ Rewriter API: not supported');
  }

  // Display capabilities
  elementCapabilities.innerHTML = '<strong>Available AI Capabilities:</strong><br>' + info.join('<br>');
  show(elementCapabilities);

  return capabilities;
}


async function runPrompt(prompt, params) {
  try {
    if (!session) {
      session = await LanguageModel.create(params);
    }
    return session.prompt(prompt);
  } catch (e) {
    console.log('Prompt failed');
    console.error(e);
    console.log('Prompt:', prompt);
    // Reset session
    reset();
    throw e;
  }
}

async function runSummarizer(text, params) {
  try {
    const summarizer = await AISummarizer.create(params);
    const result = await summarizer.summarize(text);
    summarizer.destroy();
    return result;
  } catch (e) {
    console.log('Summarization failed');
    console.error(e);
    throw e;
  }
}

async function runWriter(prompt, params) {
  try {
    const writer = await AIWriter.create(params);
    const result = await writer.write(prompt);
    writer.destroy();
    return result;
  } catch (e) {
    console.log('Writing failed');
    console.error(e);
    throw e;
  }
}

async function runRewriter(text, params) {
  try {
    const rewriter = await AIRewriter.create(params);
    const result = await rewriter.rewrite(text);
    rewriter.destroy();
    return result;
  } catch (e) {
    console.log('Rewriting failed');
    console.error(e);
    throw e;
  }
}

async function reset() {
  if (session) {
    session.destroy();
  }
  session = null;
}

async function initDefaults() {
  // Check capabilities first
  await checkCapabilities();
  
  if (!capabilities.prompt) {
    showError('Gemini Nano is not available. Please ensure you are using Chrome 128+ with AI features enabled.');
    return;
  }
  
  const defaults = await LanguageModel.params();
  console.log('Model default:', defaults);
  
  sliderTemperature.value = defaults.defaultTemperature;
  // Pending https://issues.chromium.org/issues/367771112.
  // sliderTemperature.max = defaults.maxTemperature;
  if (defaults.defaultTopK > 3) {
    // limit default topK to 3
    sliderTopK.value = 3;
    labelTopK.textContent = 3;
  } else {
    sliderTopK.value = defaults.defaultTopK;
    labelTopK.textContent = defaults.defaultTopK;
  }
  sliderTopK.max = defaults.maxTopK;
  labelTemperature.textContent = defaults.defaultTemperature;
}

initDefaults();

// Event listeners
operationMode.addEventListener('change', () => {
  const mode = operationMode.value;
  
  // Show/hide advanced settings based on mode
  if (mode === 'prompt') {
    show(advancedSettings);
  } else {
    hide(advancedSettings);
  }
  
  // Update placeholder text
  const placeholders = {
    prompt: 'Type something, e.g. "Write a haiku about Chrome Extensions"',
    summarize: 'Paste text to summarize...',
    write: 'Enter a writing prompt, e.g. "Write a professional email about..."',
    rewrite: 'Paste text to rewrite...'
  };
  inputPrompt.placeholder = placeholders[mode];
  
  reset();
});

buttonReset.addEventListener('click', () => {
  hide(elementLoading);
  hide(elementError);
  hide(elementResponse);
  reset();
  buttonReset.setAttribute('disabled', '');
});

sliderTemperature.addEventListener('input', (event) => {
  labelTemperature.textContent = event.target.value;
  reset();
});

sliderTopK.addEventListener('input', (event) => {
  labelTopK.textContent = event.target.value;
  reset();
});

inputPrompt.addEventListener('input', () => {
  if (inputPrompt.value.trim()) {
    buttonPrompt.removeAttribute('disabled');
  } else {
    buttonPrompt.setAttribute('disabled', '');
  }
});

// Load selected text from the active tab
buttonLoadSelection.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' });
    
    if (response && response.text) {
      inputPrompt.value = response.text;
      buttonPrompt.removeAttribute('disabled');
      
      // Auto-select appropriate mode based on text length
      if (response.text.length > 500) {
        operationMode.value = 'summarize';
        operationMode.dispatchEvent(new Event('change'));
      }
    } else {
      showError('No text selected on the page. Please select some text first.');
    }
  } catch (e) {
    showError('Could not load selected text. Make sure you have selected text on the page.');
    console.error(e);
  }
});

buttonPrompt.addEventListener('click', async () => {
  const prompt = inputPrompt.value.trim();
  const mode = operationMode.value;
  
  showLoading();
  
  try {
    let response;
    
    switch (mode) {
      case 'prompt': {
        if (!capabilities.prompt) {
          throw new Error('Prompt API is not available');
        }
        const params = {
          initialPrompts: [
            { role: 'system', content: 'You are a helpful and friendly assistant.' }
          ],
          temperature: sliderTemperature.value,
          topK: sliderTopK.value,
          expectedInputs: [
            { type: 'text', languages: ['en'] }
          ],
          expectedOutputs: [
            { type: 'text', languages: ['en'] }
          ]
        };
        response = await runPrompt(prompt, params);
        break;
      }
      
      case 'summarize': {
        if (!capabilities.summarizer) {
          throw new Error('Summarizer API is not available. This feature requires Chrome with AI Summarizer support.');
        }
        const params = {
          type: 'key-points',
          format: 'markdown',
          length: 'medium'
        };
        response = await runSummarizer(prompt, params);
        break;
      }
      
      case 'write': {
        if (!capabilities.writer) {
          throw new Error('Writer API is not available. This feature requires Chrome with AI Writer support.');
        }
        const params = {
          tone: 'neutral',
          format: 'markdown',
          length: 'medium'
        };
        response = await runWriter(prompt, params);
        break;
      }
      
      case 'rewrite': {
        if (!capabilities.rewriter) {
          throw new Error('Rewriter API is not available. This feature requires Chrome with AI Rewriter support.');
        }
        const params = {
          tone: 'as-is',
          format: 'as-is',
          length: 'as-is'
        };
        response = await runRewriter(prompt, params);
        break;
      }
      
      default:
        throw new Error('Unknown operation mode');
    }
    
    showResponse(response);
  } catch (e) {
    showError(e.message || e);
  }
});

function showLoading() {
  buttonReset.removeAttribute('disabled');
  hide(elementResponse);
  hide(elementError);
  show(elementLoading);
}

function showResponse(response) {
  hide(elementLoading);
  show(elementResponse);
  elementResponse.innerHTML = DOMPurify.sanitize(marked.parse(response));
}

function showError(error) {
  show(elementError);
  hide(elementResponse);
  hide(elementLoading);
  elementError.textContent = error;
}

function show(element) {
  element.removeAttribute('hidden');
}

function hide(element) {
  element.setAttribute('hidden', '');
}
