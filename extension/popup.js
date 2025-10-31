import { loadSettings } from './db.js';
import { translateText, summarizeText, promptModel, writeLegalDoc, rewriteText, proofreadText } from './ai.js';

const els = {};
let isProcessing = false;

function setStatus(message, type = '') {
  const status = document.getElementById('status');
  if (!status) return;
  status.textContent = message || '';
  status.className = 'status ' + type;
}

function setOutput(element, content, isError = false) {
  if (!element) return;
  element.className = isError ? 'output-box error' : 'output-box has-content';
  element.textContent = content;
}

function setError(element, message) {
  setOutput(element, `❌ Error: ${message}`, true);
}

function showLoading(element) {
  if (!element) return;
  element.className = 'output-box loading';
  element.innerHTML = '<div style="text-align: center; margin-top: 30px;"><div style="animation: pulse 2s infinite;">⏳ Processing...</div></div>';
}

async function init() {
  // Get all elements
  els.openOptions = document.getElementById('openOptions');
  els.quickPrompt = document.getElementById('quickPrompt');
  els.btnQuickSend = document.getElementById('btnQuickSend');
  els.docType = document.getElementById('docType');
  els.btnGenerateDoc = document.getElementById('btnGenerateDoc');
  els.quickOutput = document.getElementById('quickOutput');
  els.btnAnalyzePage = document.getElementById('btnAnalyzePage');
  els.btnSummarizeInput = document.getElementById('btnSummarizeInput');
  els.reviewInput = document.getElementById('reviewInput');
  els.reviewOutput = document.getElementById('reviewOutput');
  els.status = document.getElementById('status');
  els.helpLink = document.getElementById('helpLink');

  // Event listeners
  els.openOptions?.addEventListener('click', () => chrome.runtime.openOptionsPage());
  els.helpLink?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  els.btnQuickSend?.addEventListener('click', onQuickSend);
  els.btnGenerateDoc?.addEventListener('click', onGenerateDoc);
  els.btnAnalyzePage?.addEventListener('click', onAnalyzePage);
  els.btnSummarizeInput?.addEventListener('click', onSummarizeInput);

  setStatus('Ready');
}

async function onQuickSend() {
  if (isProcessing) return;
  
  const userPrompt = (els.quickPrompt?.value || '').trim();
  if (!userPrompt) {
    setError(els.quickOutput, 'Please enter a prompt first');
    return;
  }

  isProcessing = true;
  setStatus('Thinking…', 'processing');
  showLoading(els.quickOutput);
  els.btnQuickSend.disabled = true;

  try {
    const settings = await loadSettings();
    const systemPrompt = `You are a legal assistant. Be precise, neutral, and cite sections when helpful.`;
    const response = await promptModel({ systemPrompt, userPrompt, settings });
    setOutput(els.quickOutput, response || 'No response generated');
    setStatus('Ready', 'success');
  } catch (e) {
    console.error('QuickSend error:', e);
    const errorMsg = e?.message || String(e);
    setError(els.quickOutput, errorMsg);
    setStatus('Error occurred', 'error');
  } finally {
    isProcessing = false;
    els.btnQuickSend.disabled = false;
  }
}

async function onGenerateDoc() {
  if (isProcessing) return;
  
  const docType = els.docType?.value || 'contract';
  const context = (els.quickPrompt?.value || '').trim();
  
  if (!context) {
    setError(els.quickOutput, 'Please enter a description of the document you want to create');
    return;
  }

  isProcessing = true;
  setStatus('Generating document…', 'processing');
  showLoading(els.quickOutput);
  els.btnGenerateDoc.disabled = true;

  try {
    const settings = await loadSettings();
    
    setStatus('Writing document…', 'processing');
    const draft = await writeLegalDoc({ docType, context, settings });
    
    setStatus('Refining document…', 'processing');
    const refined = await rewriteText({ 
      text: draft, 
      settings, 
      goal: 'Improve clarity, structure, and enforce formal legal tone.' 
    });
    
    setStatus('Proofreading…', 'processing');
    const proofed = await proofreadText({ 
      text: refined, 
      settings, 
      dialect: settings.language || 'en' 
    });
    
    setOutput(els.quickOutput, proofed);
    setStatus('Document ready!', 'success');
  } catch (e) {
    console.error('GenerateDoc error:', e);
    const errorMsg = e?.message || String(e);
    
    // Provide helpful message if API key is missing
    if (errorMsg.includes('API key') || errorMsg.includes('apiKey')) {
      setError(els.quickOutput, 'API key required. Please click settings (⚙️) and configure your API provider.');
    } else {
      setError(els.quickOutput, errorMsg);
    }
    
    setStatus('Generation failed', 'error');
  } finally {
    isProcessing = false;
    els.btnGenerateDoc.disabled = false;
  }
}

async function onAnalyzePage() {
  if (isProcessing) return;
  
  isProcessing = true;
  setStatus('Analyzing page…', 'processing');
  showLoading(els.reviewOutput);
  els.btnAnalyzePage.disabled = true;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      throw new Error('Cannot analyze Chrome internal pages. Please navigate to a regular webpage.');
    }
    
    const result = await chrome.tabs.sendMessage(tab.id, { type: 'AA_EXTRACT_PAGE' });
    
    if (!result?.ok) {
      throw new Error(result?.error || 'Failed to extract page content');
    }
    
    setStatus('Summarizing…', 'processing');
    const settings = await loadSettings();
    
    let text = result.text || '';
    if (settings.language && settings.language !== 'en') {
      text = await translateText({ text, targetLanguage: 'en', settings });
    }
    
    const summary = await summarizeText({ text, settings, style: 'legal' });
    setOutput(els.reviewOutput, summary);
    setStatus('Analysis complete!', 'success');
  } catch (e) {
    console.error('AnalyzePage error:', e);
    const errorMsg = e?.message || String(e);
    
    if (errorMsg.includes('Receiving end does not exist')) {
      setError(els.reviewOutput, 'Cannot analyze this page. Try refreshing the page and try again.');
    } else {
      setError(els.reviewOutput, errorMsg);
    }
    
    setStatus('Analysis failed', 'error');
  } finally {
    isProcessing = false;
    els.btnAnalyzePage.disabled = false;
  }
}

async function onSummarizeInput() {
  if (isProcessing) return;
  
  const text = (els.reviewInput?.value || '').trim();
  if (!text) {
    setError(els.reviewOutput, 'Please paste some text to summarize first');
    return;
  }

  isProcessing = true;
  setStatus('Summarizing…', 'processing');
  showLoading(els.reviewOutput);
  els.btnSummarizeInput.disabled = true;

  try {
    const settings = await loadSettings();
    
    let processedText = text;
    if (settings.language && settings.language !== 'en') {
      processedText = await translateText({ text, targetLanguage: 'en', settings });
    }
    
    const summary = await summarizeText({ text: processedText, settings, style: 'legal' });
    setOutput(els.reviewOutput, summary);
    setStatus('Summary ready!', 'success');
  } catch (e) {
    console.error('SummarizeInput error:', e);
    const errorMsg = e?.message || String(e);
    setError(els.reviewOutput, errorMsg);
    setStatus('Summarization failed', 'error');
  } finally {
    isProcessing = false;
    els.btnSummarizeInput.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', init);
