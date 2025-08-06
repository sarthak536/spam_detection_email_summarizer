import axios from 'axios';
import mockEmailService from './mockApi';

const API_BASE_URL = 'http://localhost:5000';

// Flag to track if we're in mock mode
let isMockMode = false;
let mockModeReason = '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Don't switch to mock mode here, let individual methods handle it
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw new Error(data?.error || `Server error: ${status}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// Helper function to try real API and fallback to mock
const tryRealApiOrFallback = async (realApiCall, mockApiCall, operationName) => {
  // If already in mock mode, use mock directly
  if (isMockMode) {
    console.log(`Using mock API for ${operationName} (reason: ${mockModeReason})`);
    return await mockApiCall();
  }
  
  try {
    // Try real API first
    return await realApiCall();
  } catch (error) {
    // Switch to mock mode for this session
    isMockMode = true;
    mockModeReason = error.message;
    console.log(`Switching to mock mode for ${operationName}. Reason: ${error.message}`);
    
    // Use mock API
    return await mockApiCall();
  }
};

export const emailService = {
  // Health check with automatic fallback
  healthCheck: async () => {
    return await tryRealApiOrFallback(
      async () => {
        const response = await api.get('/health');
        return response.data;
      },
      async () => {
        return await mockEmailService.healthCheck();
      },
      'health check'
    );
  },

  // Get mock mode status
  isMockMode: () => isMockMode,
  getMockModeReason: () => mockModeReason,

  // Predict spam/ham with automatic fallback
  predictSpam: async (emailText) => {
    return await tryRealApiOrFallback(
      async () => {
        const response = await api.post('/predict', {
          text: emailText
        });
        return response.data;
      },
      async () => {
        return await mockEmailService.predictSpam(emailText);
      },
      'spam prediction'
    );
  },

  // Summarize email with automatic fallback
  summarizeEmail: async (emailText, maxLength = 50, minLength = 10) => {
    return await tryRealApiOrFallback(
      async () => {
        const response = await api.post('/summarize', {
          text: emailText,
          max_length: maxLength,
          min_length: minLength
        });
        return response.data;
      },
      async () => {
        return await mockEmailService.summarizeEmail(emailText, maxLength, minLength);
      },
      'email summarization'
    );
  },

  // Analyze email (both spam detection and summarization) with automatic fallback
  analyzeEmail: async (emailText, maxLength = 50, minLength = 10, forceSummary = false) => {
    return await tryRealApiOrFallback(
      async () => {
        const response = await api.post('/analyze', {
          text: emailText,
          max_length: maxLength,
          min_length: minLength,
          force_summary: forceSummary
        });
        return response.data;
      },
      async () => {
        return await mockEmailService.analyzeEmail(emailText, maxLength, minLength, forceSummary);
      },
      'email analysis'
    );
  }
};

export default api;
