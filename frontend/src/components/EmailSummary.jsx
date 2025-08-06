import React from 'react';
import { MdSummarize, MdWarning, MdContentCopy } from 'react-icons/md';
import { toast } from 'react-toastify';

const EmailSummary = ({ result, isLoading }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Summary copied to clipboard!', {
        position: 'bottom-right',
        autoClose: 2000,
      });
    }).catch(() => {
      toast.error('Failed to copy to clipboard', {
        position: 'bottom-right',
        autoClose: 2000,
      });
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="loading-dots mb-4">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className="text-gray-600">Generating email summary...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MdWarning className="text-4xl mx-auto mb-2 text-gray-400" />
        <p>No summary results yet.</p>
        <p className="text-sm">Enter an email and click "Summarize" or "Analyze Email".</p>
      </div>
    );
  }

  const { summary, original_length, summary_length } = result;

  // Calculate compression ratio
  const compressionRatio = original_length > 0 ? (summary_length / original_length) : 0;
  const reductionPercentage = ((1 - compressionRatio) * 100).toFixed(1);

  return (
    <div className="animate-fadeIn">
      {/* Summary Result */}
      {summary ? (
        <div>
          {/* Main Summary */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <MdSummarize className="text-2xl text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-blue-800">Generated Summary</h3>
              </div>
              <button
                onClick={() => copyToClipboard(summary)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                title="Copy summary to clipboard"
              >
                <MdContentCopy className="text-lg" />
              </button>
            </div>
            
            <div className="bg-white p-4 rounded border border-blue-200">
              <p className="text-gray-800 leading-relaxed text-sm">
                {summary}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-800">{original_length}</div>
              <div className="text-sm text-gray-600">Original Words</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{summary_length}</div>
              <div className="text-sm text-gray-600">Summary Words</div>
            </div>
          </div>

          {/* Compression Visualization */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Compression Ratio</span>
              <span className="text-sm text-gray-600">{reductionPercentage}% reduction</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(compressionRatio * 100, 5)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>More compressed</span>
              <span>Less compressed</span>
            </div>
          </div>

          {/* Quality Assessment */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Summary Quality Assessment:</h4>
            <div className="text-sm text-green-700 space-y-1">
              {summary_length >= 10 && summary_length <= 100 && (
                <p>✅ Good length for readability</p>
              )}
              {reductionPercentage > 50 && (
                <p>✅ Significant content reduction achieved</p>
              )}
              {reductionPercentage < 20 && original_length > 20 && (
                <p>⚠️ Limited compression - original text may already be concise</p>
              )}
              {original_length < 20 && (
                <p>ℹ️ Original text was already quite short</p>
              )}
            </div>
          </div>

          {/* Technical Details */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <details className="cursor-pointer">
              <summary className="text-sm font-medium text-blue-800 hover:text-blue-900">
                Technical Details
              </summary>
              <div className="mt-2 text-xs text-blue-700 space-y-1">
                <p><strong>Model:</strong> T5-small (Text-to-Text Transfer Transformer)</p>
                <p><strong>Original Length:</strong> {original_length} words</p>
                <p><strong>Summary Length:</strong> {summary_length} words</p>
                <p><strong>Compression Ratio:</strong> {(compressionRatio * 100).toFixed(1)}%</p>
                <p><strong>Reduction:</strong> {reductionPercentage}%</p>
              </div>
            </details>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <MdWarning className="text-4xl mx-auto mb-2 text-yellow-500" />
          <p className="text-gray-600 mb-2">No summary generated</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>This might happen if:</p>
            <p>• The email was detected as spam (summaries are skipped for spam)</p>
            <p>• The email content was too short to summarize</p>
            <p>• There was an error during summarization</p>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              💡 Tip: Enable "Force summary even for spam emails" option to summarize all emails.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailSummary;
