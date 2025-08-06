from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
import re
import os

class EmailSummarizer:
    def __init__(self, model_name='t5-small'):
        self.model_name = model_name
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Load model and tokenizer
        self.load_model()
    
    def load_model(self):
        """Load the T5 model and tokenizer"""
        try:
            print(f"Loading {self.model_name} model...")
            self.tokenizer = T5Tokenizer.from_pretrained(self.model_name)
            self.model = T5ForConditionalGeneration.from_pretrained(self.model_name)
            self.model.to(self.device)
            print("Model loaded successfully!")
            
        except Exception as e:
            print(f"Error loading model: {e}")
            raise e
    
    def preprocess_email(self, text):
        """Clean and preprocess email text for summarization"""
        # Remove email headers pattern (To:, From:, Subject:, etc.)
        text = re.sub(r'^(To|From|Subject|Date|CC|BCC):\s*.*$', '', text, flags=re.MULTILINE)
        
        # Remove email signatures (common patterns)
        text = re.sub(r'\n--\s*\n.*', '', text, flags=re.DOTALL)
        text = re.sub(r'\nBest regards.*', '', text, flags=re.DOTALL)
        text = re.sub(r'\nSincerely.*', '', text, flags=re.DOTALL)
        text = re.sub(r'\nThanks.*', '', text, flags=re.DOTALL)
        
        # Remove URLs
        text = re.sub(r'http\S+|www\.\S+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove excessive whitespace and newlines
        text = re.sub(r'\n+', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s.,!?-]', '', text)
        
        return text.strip()
    
    def extract_subject(self, text):
        """Extract subject line from email text"""
        subject_match = re.search(r'Subject:\s*(.+)', text, re.IGNORECASE)
        if subject_match:
            return subject_match.group(1).strip()
        return None
    
    def summarize(self, text, max_length=50, min_length=10):
        """Generate summary of email text"""
        try:
            # Extract subject if available
            subject = self.extract_subject(text)
            
            # Preprocess the email text
            clean_text = self.preprocess_email(text)
            
            # If text is too short, return as is
            if len(clean_text.split()) <= min_length:
                return clean_text if clean_text else "Email content too short to summarize."
            
            # Prepare input for T5 (T5 requires task prefix)
            input_text = f"summarize: {clean_text}"
            
            # Tokenize input
            inputs = self.tokenizer.encode(
                input_text,
                return_tensors='pt',
                max_length=512,
                truncation=True
            ).to(self.device)
            
            # Generate summary
            with torch.no_grad():
                summary_ids = self.model.generate(
                    inputs,
                    max_length=max_length + 10,  # Add buffer for decoding
                    min_length=min_length,
                    num_beams=4,
                    length_penalty=2.0,
                    early_stopping=True,
                    no_repeat_ngram_size=2
                )
            
            # Decode summary
            summary = self.tokenizer.decode(summary_ids[0], skip_special_tokens=True)
            
            # Post-process summary
            summary = self.post_process_summary(summary, subject)
            
            return summary
            
        except Exception as e:
            print(f"Error in summarization: {e}")
            return "Error generating summary."
    
    def post_process_summary(self, summary, subject=None):
        """Post-process the generated summary"""
        # Remove common T5 artifacts
        summary = summary.replace('<pad>', '').replace('</s>', '').strip()
        
        # Capitalize first letter
        if summary:
            summary = summary[0].upper() + summary[1:] if len(summary) > 1 else summary.upper()
        
        # Add period if missing
        if summary and not summary.endswith(('.', '!', '?')):
            summary += '.'
        
        # If summary is very short and we have a subject, include it
        if len(summary.split()) < 5 and subject:
            summary = f"Email about: {subject}. {summary}"
        
        return summary
    
    def batch_summarize(self, texts, max_length=50, min_length=10):
        """Summarize multiple emails at once"""
        summaries = []
        
        for text in texts:
            summary = self.summarize(text, max_length, min_length)
            summaries.append(summary)
        
        return summaries
    
    def get_summary_stats(self, original_text, summary):
        """Get statistics about the summarization"""
        original_words = len(original_text.split())
        summary_words = len(summary.split())
        
        compression_ratio = summary_words / original_words if original_words > 0 else 0
        
        return {
            'original_words': original_words,
            'summary_words': summary_words,
            'compression_ratio': compression_ratio,
            'reduction_percentage': (1 - compression_ratio) * 100
        }

# Test the summarizer if run directly
if __name__ == "__main__":
    summarizer = EmailSummarizer()
    
    # Test email
    test_email = """
    Subject: Team Meeting Tomorrow
    
    Hi everyone,
    
    I wanted to remind you about our team meeting scheduled for tomorrow at 2 PM in conference room A. 
    We'll be discussing the quarterly results, upcoming projects, and budget allocations for next quarter.
    
    Please bring your laptops and any relevant documents. If you can't attend, please let me know in advance.
    
    Best regards,
    John Smith
    Project Manager
    """
    
    summary = summarizer.summarize(test_email)
    stats = summarizer.get_summary_stats(test_email, summary)
    
    print("Original Email:")
    print(test_email)
    print("\nSummary:")
    print(summary)
    print(f"\nStats: {stats}")
