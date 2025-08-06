from flask import Flask, request, jsonify
from flask_cors import CORS
from models.spam_detector import SpamDetector
from models.email_summarizer import EmailSummarizer
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize models
spam_detector = None
email_summarizer = None

def initialize_models():
    """Initialize ML models on startup"""
    global spam_detector, email_summarizer
    
    try:
        logger.info("Initializing spam detector...")
        spam_detector = SpamDetector()
        
        logger.info("Initializing email summarizer...")
        email_summarizer = EmailSummarizer()
        
        logger.info("Models initialized successfully!")
    except Exception as e:
        logger.error(f"Error initializing models: {str(e)}")
        raise e

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Email Spam Detection & Summarization API is running'
    })

@app.route('/predict', methods=['POST'])
def predict_spam():
    """Predict if an email is spam or ham"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Email text is required'}), 400
        
        email_text = data['text']
        
        if not email_text.strip():
            return jsonify({'error': 'Email text cannot be empty'}), 400
        
        # Get prediction
        prediction = spam_detector.predict(email_text)
        confidence = spam_detector.get_confidence(email_text)
        
        return jsonify({
            'prediction': prediction,
            'confidence': float(confidence),
            'is_spam': prediction == 'spam'
        })
        
    except Exception as e:
        logger.error(f"Error in spam prediction: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/summarize', methods=['POST'])
def summarize_email():
    """Summarize email content"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Email text is required'}), 400
        
        email_text = data['text']
        max_length = data.get('max_length', 50)
        min_length = data.get('min_length', 10)
        
        if not email_text.strip():
            return jsonify({'error': 'Email text cannot be empty'}), 400
        
        # Get summary
        summary = email_summarizer.summarize(email_text, max_length, min_length)
        
        return jsonify({
            'summary': summary,
            'original_length': len(email_text.split()),
            'summary_length': len(summary.split())
        })
        
    except Exception as e:
        logger.error(f"Error in email summarization: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/analyze', methods=['POST'])
def analyze_email():
    """Analyze email for both spam detection and summarization"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Email text is required'}), 400
        
        email_text = data['text']
        max_length = data.get('max_length', 50)
        min_length = data.get('min_length', 10)
        
        if not email_text.strip():
            return jsonify({'error': 'Email text cannot be empty'}), 400
        
        # Get spam prediction
        prediction = spam_detector.predict(email_text)
        confidence = spam_detector.get_confidence(email_text)
        
        # Get summary only if it's not spam (or if user specifically wants it)
        summary = None
        if prediction == 'ham' or data.get('force_summary', False):
            summary = email_summarizer.summarize(email_text, max_length, min_length)
        
        return jsonify({
            'spam_detection': {
                'prediction': prediction,
                'confidence': float(confidence),
                'is_spam': prediction == 'spam'
            },
            'summarization': {
                'summary': summary,
                'original_length': len(email_text.split()),
                'summary_length': len(summary.split()) if summary else 0
            }
        })
        
    except Exception as e:
        logger.error(f"Error in email analysis: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Initialize models before starting the server
    initialize_models()
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
