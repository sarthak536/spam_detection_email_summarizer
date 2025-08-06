import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle
import os
import re
import string
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import nltk

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class SpamDetector:
    def __init__(self, model_path='spam_model.pkl', vectorizer_path='tfidf_vectorizer.pkl'):
        self.model_path = model_path
        self.vectorizer_path = vectorizer_path
        self.model = None
        self.vectorizer = None
        self.stemmer = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))
        
        # Load existing model or train new one
        if os.path.exists(model_path) and os.path.exists(vectorizer_path):
            self.load_model()
        else:
            self.train_model()
    
    def preprocess_text(self, text):
        """Clean and preprocess text data"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www.\S+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove numbers
        text = re.sub(r'\d+', '', text)
        
        # Remove punctuation
        text = text.translate(str.maketrans('', '', string.punctuation))
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Tokenize and remove stopwords
        words = text.split()
        words = [self.stemmer.stem(word) for word in words if word not in self.stop_words and len(word) > 2]
        
        return ' '.join(words)
    
    def load_data(self):
        """Load and preprocess the spam/ham dataset"""
        try:
            # Load the dataset
            df = pd.read_csv('../spam_ham_dataset.csv')
            
            # Clean the data
            df = df.dropna()
            df = df.drop_duplicates()
            
            # Preprocess text
            df['clean_text'] = df['text'].apply(self.preprocess_text)
            
            # Filter out empty texts after preprocessing
            df = df[df['clean_text'].str.len() > 0]
            
            return df
            
        except Exception as e:
            print(f"Error loading data: {e}")
            # Return sample data if file not found
            return pd.DataFrame({
                'label': ['ham', 'spam', 'ham', 'spam'],
                'clean_text': ['hello how are you', 'win money now click here', 
                             'meeting tomorrow at 2pm', 'free gift claim now'],
                'label_num': [0, 1, 0, 1]
            })
    
    def train_model(self):
        """Train the spam detection model"""
        print("Training spam detection model...")
        
        # Load and preprocess data
        df = self.load_data()
        
        # Split the data
        X = df['clean_text']
        y = df['label_num']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Create TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            max_df=0.95,
            min_df=2
        )
        
        # Fit and transform the training data
        X_train_tfidf = self.vectorizer.fit_transform(X_train)
        X_test_tfidf = self.vectorizer.transform(X_test)
        
        # Train logistic regression model
        self.model = LogisticRegression(
            random_state=42,
            max_iter=1000,
            C=1.0
        )
        
        self.model.fit(X_train_tfidf, y_train)
        
        # Evaluate the model
        y_pred = self.model.predict(X_test_tfidf)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Model Accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=['Ham', 'Spam']))
        
        # Save the model and vectorizer
        self.save_model()
        
        return accuracy
    
    def save_model(self):
        """Save the trained model and vectorizer"""
        try:
            with open(self.model_path, 'wb') as f:
                pickle.dump(self.model, f)
            
            with open(self.vectorizer_path, 'wb') as f:
                pickle.dump(self.vectorizer, f)
                
            print("Model and vectorizer saved successfully!")
            
        except Exception as e:
            print(f"Error saving model: {e}")
    
    def load_model(self):
        """Load the trained model and vectorizer"""
        try:
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            with open(self.vectorizer_path, 'rb') as f:
                self.vectorizer = pickle.load(f)
                
            print("Model and vectorizer loaded successfully!")
            
        except Exception as e:
            print(f"Error loading model: {e}")
            self.train_model()
    
    def predict(self, text):
        """Predict if a text is spam or ham"""
        if self.model is None or self.vectorizer is None:
            raise ValueError("Model not trained or loaded")
        
        # Preprocess the text
        clean_text = self.preprocess_text(text)
        
        if not clean_text:
            return 'ham'  # Default to ham for empty text
        
        # Transform text using TF-IDF
        text_tfidf = self.vectorizer.transform([clean_text])
        
        # Make prediction
        prediction = self.model.predict(text_tfidf)[0]
        
        return 'spam' if prediction == 1 else 'ham'
    
    def get_confidence(self, text):
        """Get prediction confidence score"""
        if self.model is None or self.vectorizer is None:
            raise ValueError("Model not trained or loaded")
        
        # Preprocess the text
        clean_text = self.preprocess_text(text)
        
        if not clean_text:
            return 0.5  # Neutral confidence for empty text
        
        # Transform text using TF-IDF
        text_tfidf = self.vectorizer.transform([clean_text])
        
        # Get prediction probabilities
        probabilities = self.model.predict_proba(text_tfidf)[0]
        
        # Return the maximum probability as confidence
        return max(probabilities)
    
    def get_feature_importance(self, text, top_n=10):
        """Get the most important features for a prediction"""
        if self.model is None or self.vectorizer is None:
            raise ValueError("Model not trained or loaded")
        
        # Preprocess the text
        clean_text = self.preprocess_text(text)
        
        if not clean_text:
            return []
        
        # Transform text using TF-IDF
        text_tfidf = self.vectorizer.transform([clean_text])
        
        # Get feature names
        feature_names = self.vectorizer.get_feature_names_out()
        
        # Get TF-IDF scores
        tfidf_scores = text_tfidf.toarray()[0]
        
        # Get model coefficients
        coef = self.model.coef_[0]
        
        # Calculate feature importance (TF-IDF * coefficient)
        importance_scores = tfidf_scores * coef
        
        # Get top features
        top_indices = np.argsort(np.abs(importance_scores))[-top_n:][::-1]
        
        top_features = []
        for idx in top_indices:
            if tfidf_scores[idx] > 0:  # Only include features present in the text
                top_features.append({
                    'feature': feature_names[idx],
                    'importance': float(importance_scores[idx]),
                    'tfidf_score': float(tfidf_scores[idx])
                })
        
        return top_features

# Test the model if run directly
if __name__ == "__main__":
    detector = SpamDetector()
    
    # Test emails
    test_emails = [
        "Hello, how are you doing today?",
        "WIN BIG MONEY NOW! CLICK HERE FOR FREE PRIZES!",
        "Meeting scheduled for tomorrow at 2 PM",
        "URGENT: Your account will be closed! Act now!"
    ]
    
    for email in test_emails:
        prediction = detector.predict(email)
        confidence = detector.get_confidence(email)
        print(f"Email: {email}")
        print(f"Prediction: {prediction} (Confidence: {confidence:.2f})")
        print("-" * 50)
