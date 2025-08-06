#!/usr/bin/env python3
"""
Training script for spam detection model
Run this script to train the model with the spam_ham_dataset.csv
"""

import os
import sys
import pandas as pd
from models.spam_detector import SpamDetector
from utils.data_preprocessing import load_dataset, evaluate_model, analyze_feature_importance
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Main training function"""
    print("=" * 60)
    print("EMAIL SPAM DETECTION MODEL TRAINING")
    print("=" * 60)
    
    # Check if dataset exists
    dataset_path = '../spam_ham_dataset.csv'
    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}")
        print("Please ensure the spam_ham_dataset.csv file is in the parent directory.")
        return
    
    try:
        # Load and analyze dataset
        print("\n1. Loading dataset...")
        df = load_dataset(dataset_path)
        
        if df is None:
            print("Failed to load dataset. Please check the file format.")
            return
        
        print(f"Dataset loaded successfully!")
        print(f"Total emails: {len(df)}")
        print(f"Spam emails: {len(df[df['label'] == 'spam'])}")
        print(f"Ham emails: {len(df[df['label'] == 'ham'])}")
        
        # Initialize and train the spam detector
        print("\n2. Training spam detection model...")
        detector = SpamDetector()
        
        # The model trains automatically during initialization
        print("Model training completed!")
        
        # Test the model with sample emails
        print("\n3. Testing model with sample emails...")
        test_emails = [
            "Hello, how are you doing today? Let's meet for coffee.",
            "WIN BIG MONEY NOW! CLICK HERE FOR FREE PRIZES! LIMITED TIME OFFER!",
            "Meeting scheduled for tomorrow at 2 PM in conference room A.",
            "URGENT: Your account will be closed! Act now to prevent suspension!",
            "Thank you for your email. I'll review the document and get back to you.",
            "Free gift! Claim your prize now by calling this number immediately!"
        ]
        
        print("\nSample Predictions:")
        print("-" * 50)
        for email in test_emails:
            prediction = detector.predict(email)
            confidence = detector.get_confidence(email)
            print(f"Email: {email[:50]}...")
            print(f"Prediction: {prediction.upper()} (Confidence: {confidence:.2f})")
            print("-" * 50)
        
        print("\n4. Model training and testing completed successfully!")
        print("\nModel files saved:")
        print("- spam_model.pkl")
        print("- tfidf_vectorizer.pkl")
        print("\nYou can now run the Flask app with: python app.py")
        
    except Exception as e:
        logger.error(f"Error during training: {str(e)}")
        print(f"Training failed: {str(e)}")

if __name__ == "__main__":
    main()
