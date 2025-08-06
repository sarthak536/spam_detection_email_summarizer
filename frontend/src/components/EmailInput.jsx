import React, { useState } from 'react';
import { MdSend, MdClear, MdAnalytics, MdSecurity, MdSummarize } from 'react-icons/md';

const EmailInput = ({ 
  emailText, 
  setEmailText, 
  onAnalyze, 
  onPredictSpam, 
  onSummarize, 
  onClear,
  isAnalyzing,
  serverConnected 
}) => {
  const [summaryOptions, setSummaryOptions] = useState({
    maxLength: 50,
    minLength: 10,
    forceSummary: false
  });

  const handleAnalyze = () => {
    onAnalyze(emailText, summaryOptions);
  };

  const handlePredictSpam = () => {
    onPredictSpam(emailText);
  };

  const handleSummarize = () => {
    onSummarize(emailText, summaryOptions);
  };

  const handleClear = () => {
    setEmailText('');
    onClear();
  };

  const sampleEmails = [
    {
      label: "Sample Ham Email",
      text: "Hi John,\n\nI hope you're doing well. I wanted to follow up on our meeting yesterday regarding the quarterly budget review. Could you please send me the updated financial reports by Friday?\n\nAlso, don't forget about the team lunch next week. Looking forward to it!\n\nBest regards,\nSarah"
    },
    {
      label: "Sample Spam Email",
      text: "CONGRATULATIONS!!! You have WON $1,000,000 in our EXCLUSIVE lottery! CLAIM your prize NOW by clicking the link below. This offer expires in 24 HOURS! Don't miss this LIMITED TIME opportunity to become RICH! Act FAST before it's too late! Call 1-800-WIN-CASH immediately!"
    },
    {
      label: "Business Email",
      text: "Subject: Project Update Meeting\n\nDear Team,\n\nI'm writing to schedule our monthly project review meeting for next Wednesday at 2 PM in Conference Room B. We'll be discussing:\n\n1. Q3 milestone achievements\n2. Budget allocation for Q4\n3. Resource planning for upcoming projects\n4. Timeline adjustments\n\nPlease prepare your department reports and bring any relevant documentation. If you cannot attend, please send a representative or your updates via email.\n\nRegards,\nProject Manager"
    }
  ];

  const loadSampleEmail = (email) => {
    setEmailText(email.text);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <MdSend className="mr-2 text-blue-600" />
        Email Input
      </h2>
      
      {/* Sample Emails */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Start - Load Sample Email:
        </label>
        <div className="flex flex-wrap gap-2">
          {sampleEmails.map((email, index) => (
            <button
              key={index}
              onClick={() => loadSampleEmail(email)}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
              disabled={isAnalyzing}
            >
              {email.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email Text Area */}
      <div className="mb-4">
        <label htmlFor="email-text" className="block text-sm font-medium text-gray-700 mb-2">
          Email Content:
        </label>
        <textarea
          id="email-text"
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          placeholder="Paste your email content here..."
          className="w-full h-64 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
          disabled={isAnalyzing}
        />
        <div className="text-sm text-gray-500 mt-1">
          Characters: {emailText.length} | Words: {emailText.split(/\s+/).filter(word => word.length > 0).length}
        </div>
      </div>

      {/* Summary Options */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Summary Options:</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Max Length (words):</label>
            <input
              type="number"
              min="10"
              max="100"
              value={summaryOptions.maxLength}
              onChange={(e) => setSummaryOptions(prev => ({ ...prev, maxLength: parseInt(e.target.value) }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              disabled={isAnalyzing}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Min Length (words):</label>
            <input
              type="number"
              min="5"
              max="50"
              value={summaryOptions.minLength}
              onChange={(e) => setSummaryOptions(prev => ({ ...prev, minLength: parseInt(e.target.value) }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              disabled={isAnalyzing}
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="flex items-center text-xs text-gray-600">
            <input
              type="checkbox"
              checked={summaryOptions.forceSummary}
              onChange={(e) => setSummaryOptions(prev => ({ ...prev, forceSummary: e.target.checked }))}
              className="mr-2"
              disabled={isAnalyzing}
            />
            Force summary even for spam emails
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Analyze All Button */}
        <button
          onClick={handleAnalyze}
          disabled={!emailText.trim() || isAnalyzing || !serverConnected}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isAnalyzing ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </div>
          ) : (
            <div className="flex items-center">
              <MdAnalytics className="mr-2" />
              Analyze Email (Spam + Summary)
            </div>
          )}
        </button>

        {/* Individual Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handlePredictSpam}
            disabled={!emailText.trim() || isAnalyzing || !serverConnected}
            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <MdSecurity className="mr-1" />
            Detect Spam
          </button>
          
          <button
            onClick={handleSummarize}
            disabled={!emailText.trim() || isAnalyzing || !serverConnected}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <MdSummarize className="mr-1" />
            Summarize
          </button>
        </div>

        {/* Clear Button */}
        <button
          onClick={handleClear}
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <MdClear className="mr-2" />
          Clear All
        </button>
      </div>

      {/* Connection Status */}
      {!serverConnected && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">
            ⚠️ Backend server is not connected. Please ensure the Flask server is running on port 5000.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailInput;
