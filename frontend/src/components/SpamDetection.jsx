import React from 'react';
import { MdCheckCircle, MdError, MdWarning } from 'react-icons/md';

const SpamDetection = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="loading-dots mb-4">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className="text-gray-600">Analyzing email for spam...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MdWarning className="text-4xl mx-auto mb-2 text-gray-400" />
        <p>No spam detection results yet.</p>
        <p className="text-sm">Enter an email and click "Detect Spam" or "Analyze Email".</p>
      </div>
    );
  }

  const { prediction, confidence, is_spam } = result;

  const getConfidenceColor = (conf) => {
    if (conf >= 0.8) return 'text-green-600';
    if (conf >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (conf) => {
    if (conf >= 0.8) return 'High Confidence';
    if (conf >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="animate-fadeIn">
      {/* Main Result */}
      <div className={`p-6 rounded-lg border-2 mb-4 ${
        is_spam 
          ? 'bg-red-50 border-red-200' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {is_spam ? (
              <MdError className="text-3xl text-red-600 mr-3" />
            ) : (
              <MdCheckCircle className="text-3xl text-green-600 mr-3" />
            )}
            <div>
              <h3 className={`text-xl font-bold ${
                is_spam ? 'text-red-800' : 'text-green-800'
              }`}>
                {is_spam ? 'SPAM DETECTED' : 'LEGITIMATE EMAIL'}
              </h3>
              <p className={`text-sm ${
                is_spam ? 'text-red-600' : 'text-green-600'
              }`}>
                Classification: {prediction.toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-2xl font-bold ${getConfidenceColor(confidence)}`}>
              {(confidence * 100).toFixed(1)}%
            </div>
            <div className={`text-xs ${getConfidenceColor(confidence)}`}>
              {getConfidenceLabel(confidence)}
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Meter */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Confidence Level</span>
          <span className="text-sm text-gray-600">{(confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              confidence >= 0.8 
                ? 'bg-green-500' 
                : confidence >= 0.6 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
            }`}
            style={{ width: `${confidence * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Interpretation:</h4>
        {is_spam ? (
          <div className="text-sm text-gray-700 space-y-2">
            <p>🚨 This email has been classified as <strong>SPAM</strong>.</p>
            <p>• The content contains patterns commonly found in spam emails</p>
            <p>• Consider deleting or moving to spam folder</p>
            <p>• Do not click on any links or provide personal information</p>
          </div>
        ) : (
          <div className="text-sm text-gray-700 space-y-2">
            <p>✅ This email appears to be <strong>LEGITIMATE</strong>.</p>
            <p>• The content follows normal email communication patterns</p>
            <p>• Safe to read and respond to</p>
            <p>• However, always verify sender identity for sensitive requests</p>
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            <strong>Note:</strong> Confidence level of {getConfidenceLabel(confidence).toLowerCase()} 
            means the model is {confidence >= 0.8 ? 'very sure' : confidence >= 0.6 ? 'moderately sure' : 'less certain'} 
            about this classification.
          </p>
        </div>
      </div>

      {/* Technical Details */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <details className="cursor-pointer">
          <summary className="text-sm font-medium text-blue-800 hover:text-blue-900">
            Technical Details
          </summary>
          <div className="mt-2 text-xs text-blue-700 space-y-1">
            <p><strong>Model:</strong> Logistic Regression with TF-IDF vectorization</p>
            <p><strong>Prediction:</strong> {prediction}</p>
            <p><strong>Confidence Score:</strong> {confidence.toFixed(4)}</p>
            <p><strong>Binary Classification:</strong> {is_spam ? '1 (Spam)' : '0 (Ham)'}</p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default SpamDetection;
