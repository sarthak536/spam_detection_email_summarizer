// Enhanced API service with automatic fallback to mock when server is unavailable
// Mock responses match the exact format of the real backend

// Mock spam detection using keyword-based approach (similar to real model)
const spamKeywords = [
  'win', 'winner', 'won', 'congratulations', 'lottery', 'prize', 'claim', 'urgent', 
  'limited time', 'act fast', 'call now', 'free money', 'exclusive', 'guaranteed',
  'risk free', 'earn money', 'work from home', 'click here', 'offer expires',
  'viagra', 'casino', 'debt', 'credit repair', 'lose weight', 'investment'
];

// Simple text preprocessing (mimics real preprocessing)
const preprocessText = (text) => {
  return text
    .toLowerCase()
    .replace(/http\S+|www\.\S+/g, '')
    .replace(/\S+@\S+/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Mock spam prediction (matches real backend response format exactly)
const mockPredictSpam = (emailText) => {
  const cleanText = preprocessText(emailText);
  let spamScore = 0;
  
  // Count spam keywords
  spamKeywords.forEach(keyword => {
    if (cleanText.includes(keyword)) {
      spamScore += 1;
    }
  });
  
  // Additional spam indicators
  const hasExcessiveExclamations = (emailText.match(/!/g) || []).length > 3;
  const hasAllCaps = emailText.match(/[A-Z]{4,}/g);
  const hasNumbers = emailText.match(/\$\d+|\d+%/g);
  
  if (hasExcessiveExclamations) spamScore += 2;
  if (hasAllCaps) spamScore += 1;
  if (hasNumbers) spamScore += 1;
  
  // Determine spam/ham (threshold similar to real model)
  const isSpam = spamScore >= 3;
  const prediction = isSpam ? 'spam' : 'ham';
  
  // Calculate confidence (similar to real model probability)
  const baseConfidence = Math.min(0.95, Math.max(0.55, 0.5 + (spamScore * 0.08)));
  const confidence = parseFloat(baseConfidence.toFixed(2));
  
  return {
    prediction: prediction,
    confidence: confidence,
    is_spam: isSpam
  };
};

// Mock email summarization (extractive approach)
const mockSummarizeEmail = (emailText, maxLength = 50, minLength = 10) => {
  // Clean text for summarization
  let cleanText = emailText
    .replace(/^(To|From|Subject|Date|CC|BCC):\s*.*$/gm, '')
    .replace(/\n--\s*\n.*$/s, '')
    .replace(/\n(Best regards|Sincerely|Thanks|Kind regards).*$/si, '')
    .replace(/http\S+|www\.\S+/g, '')
    .replace(/\S+@\S+/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  if (sentences.length === 0 || cleanText.length < 20) {
    return "Email content too short to summarize.";
  }
  
  // Simple extractive summarization - take key sentences
  const targetWords = Math.min(maxLength, Math.max(minLength, Math.floor(cleanText.split(' ').length * 0.3)));
  const maxSentences = Math.max(1, Math.floor(targetWords / 8));
  
  let summary = sentences.slice(0, maxSentences).join('. ').trim();
  
  // Ensure proper ending
  if (summary && !summary.endsWith('.')) {
    summary += '.';
  }
  
  return summary || "Unable to generate meaningful summary.";
};

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API that matches real backend responses exactly
const mockEmailService = {
  healthCheck: async () => {
    await delay(300);
    return {
      status: 'healthy',
      message: 'Email Spam Detection & Summarization API is running'
    };
  },

  predictSpam: async (emailText) => {
    await delay(800 + Math.random() * 400);
    return mockPredictSpam(emailText);
  },

  summarizeEmail: async (emailText, maxLength = 50, minLength = 10) => {
    await delay(1200 + Math.random() * 600);
    const summary = mockSummarizeEmail(emailText, maxLength, minLength);
    
    return {
      summary: summary,
      original_length: emailText.split(' ').length,
      summary_length: summary.split(' ').length
    };
  },

  analyzeEmail: async (emailText, maxLength = 50, minLength = 10, forceSummary = false) => {
    await delay(1500 + Math.random() * 500);
    
    const spamResult = mockPredictSpam(emailText);
    let summary = null;
    
    // Only summarize if not spam or if forced
    if (!spamResult.is_spam || forceSummary) {
      summary = mockSummarizeEmail(emailText, maxLength, minLength);
    }
    
    return {
      spam_detection: spamResult,
      summarization: {
        summary: summary,
        original_length: emailText.split(' ').length,
        summary_length: summary ? summary.split(' ').length : 0
      }
    };
  }
};

export default mockEmailService;
