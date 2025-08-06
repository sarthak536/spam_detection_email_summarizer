import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmailInput from './components/EmailInput';
import SpamDetection from './components/SpamDetection';
import EmailSummary from './components/EmailSummary';
import { emailService } from './services/api';
import { MdEmail, MdSecurity, MdSummarize } from 'react-icons/md';

function App() {
  const [emailText, setEmailText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [spamResult, setSpamResult] = useState(null);
  const [summaryResult, setSummaryResult] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');

  // Check server health on component mount
  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      await emailService.healthCheck();
      setServerStatus('connected');
      
      // Show different message based on mode
      if (emailService.isMockMode()) {
        toast.info('Using demo mode - simulating backend responses', {
          position: 'top-right',
          autoClose: 4000,
        });
      } else {
        toast.success('Connected to server successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      setServerStatus('disconnected');
      toast.error('Unable to initialize application. Please refresh the page.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  const handleAnalyzeEmail = async (text, options = {}) => {
    if (!text.trim()) {
      toast.error('Please enter some email text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setSpamResult(null);
    setSummaryResult(null);

    try {
      const result = await emailService.analyzeEmail(
        text,
        options.maxLength || 50,
        options.minLength || 10,
        options.forceSummary || false
      );

      setSpamResult(result.spam_detection);
      setSummaryResult(result.summarization);

      // Show success toast
      const spamStatus = result.spam_detection.is_spam ? 'SPAM' : 'HAM';
      toast.success(`Email analyzed successfully! Detected as: ${spamStatus}`, {
        position: 'top-right',
        autoClose: 3000,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(`Analysis failed: ${error.message}`, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePredictSpam = async (text) => {
    if (!text.trim()) {
      toast.error('Please enter some email text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setSpamResult(null);

    try {
      const result = await emailService.predictSpam(text);
      setSpamResult(result);

      const spamStatus = result.is_spam ? 'SPAM' : 'HAM';
      toast.success(`Spam detection complete! Detected as: ${spamStatus}`, {
        position: 'top-right',
        autoClose: 3000,
      });

    } catch (error) {
      console.error('Spam prediction error:', error);
      toast.error(`Spam detection failed: ${error.message}`, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSummarizeEmail = async (text, options = {}) => {
    if (!text.trim()) {
      toast.error('Please enter some email text to summarize');
      return;
    }

    setIsAnalyzing(true);
    setSummaryResult(null);

    try {
      const result = await emailService.summarizeEmail(
        text,
        options.maxLength || 50,
        options.minLength || 10
      );
      setSummaryResult(result);

      toast.success('Email summarized successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });

    } catch (error) {
      console.error('Summarization error:', error);
      toast.error(`Summarization failed: ${error.message}`, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResults = () => {
    setSpamResult(null);
    setSummaryResult(null);
    setEmailText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <MdEmail className="text-4xl text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">
              Email Spam Detector & Summarizer
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Analyze your emails for spam detection and get intelligent summaries using 
            advanced machine learning models.
          </p>
          
          {/* Server Status Indicator */}
          <div className="mt-4 flex justify-center">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              serverStatus === 'connected' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : serverStatus === 'disconnected'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              {serverStatus === 'connected' && (emailService.isMockMode() ? '🚧 Demo Mode' : '🟢 Server Connected')}
              {serverStatus === 'disconnected' && '🔴 Unavailable'}
              {serverStatus === 'checking' && '🟡 Loading...'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Input */}
            <div className="space-y-6">
              <EmailInput
                emailText={emailText}
                setEmailText={setEmailText}
                onAnalyze={handleAnalyzeEmail}
                onPredictSpam={handlePredictSpam}
                onSummarize={handleSummarizeEmail}
                onClear={clearResults}
                isAnalyzing={isAnalyzing}
                serverConnected={serverStatus === 'connected'}
              />
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {/* Spam Detection Results */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <MdSecurity className="text-2xl text-red-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Spam Detection
                  </h2>
                </div>
                <SpamDetection result={spamResult} isLoading={isAnalyzing} />
              </div>

              {/* Email Summary Results */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <MdSummarize className="text-2xl text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Email Summary
                  </h2>
                </div>
                <EmailSummary result={summaryResult} isLoading={isAnalyzing} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center text-gray-500">
            <p className="text-sm">
              Built with React, Flask, scikit-learn, and HuggingFace Transformers
            </p>
            <p className="text-xs mt-1">
              Spam Detection: Logistic Regression + TF-IDF | 
              Summarization: T5-small Transformer
            </p>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
