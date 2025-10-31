// Gemini Developer API Helper
// Provides API key management, model auto-detection, and content generation

class GeminiAPI {
  constructor() {
    this.apiKey = null;
    this.model = 'gemini-2.0-flash'; // Default model, will be auto-detected
    this.baseURL = 'https://generativelanguage.googleapis.com/v1';
  }

  // Check if API key is configured
  async hasApiKey() {
    if (this.apiKey) return true;
    
    const stored = await chrome.storage.local.get(['geminiApiKey']);
    if (stored.geminiApiKey) {
      this.apiKey = stored.geminiApiKey;
      return true;
    }
    return false;
  }

  // Set and store API key
  async setApiKey(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('API key cannot be empty');
    }
    
    this.apiKey = apiKey.trim();
    await chrome.storage.local.set({ geminiApiKey: this.apiKey });
    
    // Auto-detect best available model
    await this.detectBestModel();
    
    console.log('Gemini API key configured successfully');
    console.log('Selected model:', this.model);
    
    return true;
  }

  // Auto-detect the best available model
  async detectBestModel() {
    try {
      console.log('Detecting available Gemini models...');
      
      const response = await fetch(`${this.baseURL}/models?key=${this.apiKey}`);
      
      if (!response.ok) {
        console.warn('Could not fetch models list, using default model:', this.model);
        return;
      }
      
      const data = await response.json();
      const models = data.models || [];
      
      console.log('Available models:', models.map(m => m.name));
      
      // Filter models that support generateContent
      const compatibleModels = models.filter(model => 
        model.supportedGenerationMethods && 
        model.supportedGenerationMethods.includes('generateContent')
      );
      
      if (compatibleModels.length === 0) {
        console.warn('No compatible models found, using default:', this.model);
        return;
      }
      
      // Preferred models in order (fastest to most capable)
      const preferred = [
        'models/gemini-1.5-flash',
        'models/gemini-1.5-flash-latest',
        'models/gemini-1.5-pro',
        'models/gemini-1.5-pro-latest',
        'models/gemini-pro',
        'models/gemini-1.0-pro'
      ];
      
      // Find first preferred model that's available
      for (const preferredModel of preferred) {
        const found = compatibleModels.find(m => m.name === preferredModel);
        if (found) {
          // Extract just the model name (remove 'models/' prefix)
          this.model = found.name.replace('models/', '');
          await chrome.storage.local.set({ selectedModel: this.model });
          console.log(' Auto-selected model:', this.model);
          return;
        }
      }
      
      // If no preferred model found, use first compatible one
      const fallbackModel = compatibleModels[0].name.replace('models/', '');
      this.model = fallbackModel;
      await chrome.storage.local.set({ selectedModel: this.model });
      console.log(' Using fallback model:', this.model);
      
    } catch (error) {
      console.error('Model detection failed:', error);
      console.log('Using default model:', this.model);
    }
  }

  // Generate content using Gemini API (supports text and images)
  async generateContent(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    // Load saved model preference if available
    if (!options.model) {
      const stored = await chrome.storage.local.get(['selectedModel']);
      if (stored.selectedModel) {
        this.model = stored.selectedModel;
      }
    }

    const model = options.model || this.model;
    const url = `${this.baseURL}/models/${model}:generateContent?key=${this.apiKey}`;

    // Build parts array - support for text and images
    const parts = [];
    
    // Add text prompt
    if (typeof prompt === 'string') {
      parts.push({ text: prompt });
    }
    
    // Add image if provided
    if (options.image) {
      // Extract base64 data and mime type from data URL
      const imageData = options.image.split(',')[1];
      const mimeType = options.image.match(/data:([^;]+);/)[1];
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: imageData
        }
      });
    }

    const requestBody = {
      contents: [{
        parts: parts
      }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        topK: options.topK || 40,
        topP: options.topP || 0.95,
        maxOutputTokens: options.maxOutputTokens || 2048,
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || 'Unknown error';
        throw new Error(`Gemini API Error: ${errorMessage}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated');
      }

      const text = data.candidates[0].content.parts[0].text;
      return text;

    } catch (error) {
      console.error('Gemini API request failed:', error);
      throw error;
    }
  }

  // Analyze image for legal context
  async analyzeImage(imageData, filename, analysisType = 'general') {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    // Legal-specific prompts based on analysis type
    const prompts = {
      general: `You are a legal assistant analyzing an image. Please:
1. Describe what type of legal document or image this is
2. Extract any visible text (OCR)
3. Identify key legal elements (signatures, dates, stamps, clauses)
4. Highlight any important legal information
5. Note any potential concerns or missing elements

Provide a structured analysis in a clear, professional format.`,

      contract: `You are a legal contract analyst. Analyze this contract image and:
1. Identify the type of contract
2. Extract key parties involved
3. List main obligations and terms
4. Identify important dates (effective date, expiration, deadlines)
5. Note any red flags or unusual clauses
6. Summarize rights and responsibilities

Provide a comprehensive contract summary.`,

      document: `You are a legal document specialist. Analyze this document image and:
1. Identify the document type (court order, notice, affidavit, etc.)
2. Extract all visible text accurately
3. Identify key dates, case numbers, and references
4. Note signatures, seals, or official markings
5. Summarize the document's purpose and key points

Provide a detailed document analysis.`,

      form: `You are a legal form assistant. Analyze this form image and:
1. Identify the form type and purpose
2. List all fields and their values (if filled)
3. Note any empty required fields
4. Identify any errors or inconsistencies
5. Provide guidance on completing missing sections

Help the user understand and complete this form.`,

      evidence: `You are a legal evidence analyst. Analyze this image as potential evidence and:
1. Describe what the image shows objectively
2. Note any dates, timestamps, or identifying information
3. Identify relevant details that could be legally significant
4. Note image quality and clarity issues
5. Suggest what additional documentation might be needed

Provide an objective evidence assessment.`,

      id: `You are a legal ID verification assistant. Analyze this identification document and:
1. Identify the type of ID (driver's license, passport, etc.)
2. Extract visible information (name, ID number, dates)
3. Note expiration dates and validity
4. Check for security features (if visible)
5. Identify any discrepancies or concerns

Provide a structured ID analysis. Note: This is for informational purposes only.`
    };

    const prompt = prompts[analysisType] || prompts.general;

    try {
      const response = await this.generateContent(prompt, {
        image: imageData,
        temperature: 0.3, // Lower temperature for more factual analysis
        maxOutputTokens: 2048
      });

      return response;
    } catch (error) {
      console.error('Image analysis failed:', error);
      throw error;
    }
  }

  // List all available models
  async listModels() {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    const url = `${this.baseURL}/models?key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch models list');
      }

      const data = await response.json();
      return data.models || [];

    } catch (error) {
      console.error('Failed to list models:', error);
      throw error;
    }
  }
}

// Make available to background script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GeminiAPI;
}