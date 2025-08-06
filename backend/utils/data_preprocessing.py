import pandas as pd
import numpy as np
import re
import string
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score
import matplotlib.pyplot as plt
import seaborn as sns

def load_dataset(file_path):
    """Load and basic preprocessing of the spam/ham dataset"""
    try:
        df = pd.read_csv(file_path)
        
        # Basic data cleaning
        df = df.dropna()
        df = df.drop_duplicates()
        
        # Ensure we have the required columns
        required_cols = ['label', 'text', 'label_num']
        for col in required_cols:
            if col not in df.columns:
                raise ValueError(f"Missing required column: {col}")
        
        return df
        
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return None

def basic_text_stats(text):
    """Calculate basic statistics for text"""
    return {
        'char_count': len(text),
        'word_count': len(text.split()),
        'sentence_count': len(text.split('.')),
        'avg_word_length': np.mean([len(word) for word in text.split()]),
        'uppercase_ratio': sum(1 for c in text if c.isupper()) / len(text) if text else 0,
        'digit_ratio': sum(1 for c in text if c.isdigit()) / len(text) if text else 0,
        'special_char_ratio': sum(1 for c in text if c in string.punctuation) / len(text) if text else 0
    }

def extract_email_features(text):
    """Extract email-specific features"""
    features = {}
    
    # Count common spam indicators
    features['exclamation_count'] = text.count('!')
    features['question_count'] = text.count('?')
    features['dollar_count'] = text.count('$')
    features['url_count'] = len(re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text))
    features['email_count'] = len(re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text))
    
    # Spam keywords
    spam_keywords = ['free', 'win', 'winner', 'cash', 'prize', 'money', 'offer', 'deal', 'urgent', 'act now', 'limited time']
    features['spam_keyword_count'] = sum(1 for keyword in spam_keywords if keyword.lower() in text.lower())
    
    # ALL CAPS words
    words = text.split()
    features['caps_word_count'] = sum(1 for word in words if word.isupper() and len(word) > 1)
    features['caps_word_ratio'] = features['caps_word_count'] / len(words) if words else 0
    
    return features

def plot_data_distribution(df):
    """Plot the distribution of spam vs ham emails"""
    plt.figure(figsize=(10, 6))
    
    # Count plot
    plt.subplot(1, 2, 1)
    sns.countplot(data=df, x='label')
    plt.title('Distribution of Email Types')
    plt.xlabel('Email Type')
    plt.ylabel('Count')
    
    # Pie chart
    plt.subplot(1, 2, 2)
    df['label'].value_counts().plot(kind='pie', autopct='%1.1f%%')
    plt.title('Percentage Distribution')
    plt.ylabel('')
    
    plt.tight_layout()
    plt.show()

def plot_text_length_distribution(df):
    """Plot distribution of text lengths for spam vs ham"""
    df['text_length'] = df['text'].str.len()
    df['word_count'] = df['text'].str.split().str.len()
    
    plt.figure(figsize=(15, 5))
    
    # Character length distribution
    plt.subplot(1, 3, 1)
    for label in df['label'].unique():
        data = df[df['label'] == label]['text_length']
        plt.hist(data, alpha=0.7, label=label, bins=50)
    plt.xlabel('Character Length')
    plt.ylabel('Frequency')
    plt.title('Character Length Distribution')
    plt.legend()
    
    # Word count distribution
    plt.subplot(1, 3, 2)
    for label in df['label'].unique():
        data = df[df['label'] == label]['word_count']
        plt.hist(data, alpha=0.7, label=label, bins=50)
    plt.xlabel('Word Count')
    plt.ylabel('Frequency')
    plt.title('Word Count Distribution')
    plt.legend()
    
    # Box plot
    plt.subplot(1, 3, 3)
    sns.boxplot(data=df, x='label', y='word_count')
    plt.title('Word Count by Email Type')
    
    plt.tight_layout()
    plt.show()

def evaluate_model(y_true, y_pred, y_pred_proba=None):
    """Comprehensive model evaluation"""
    print("Classification Report:")
    print("=" * 50)
    print(classification_report(y_true, y_pred, target_names=['Ham', 'Spam']))
    
    print("\nConfusion Matrix:")
    print("=" * 50)
    cm = confusion_matrix(y_true, y_pred)
    print(cm)
    
    # Calculate additional metrics
    accuracy = accuracy_score(y_true, y_pred)
    print(f"\nAccuracy: {accuracy:.4f}")
    
    if y_pred_proba is not None:
        auc_score = roc_auc_score(y_true, y_pred_proba)
        print(f"AUC Score: {auc_score:.4f}")
    
    # Plot confusion matrix
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=['Ham', 'Spam'], 
                yticklabels=['Ham', 'Spam'])
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.show()
    
    return {
        'accuracy': accuracy,
        'confusion_matrix': cm,
        'auc_score': auc_score if y_pred_proba is not None else None
    }

def analyze_feature_importance(model, vectorizer, top_n=20):
    """Analyze and plot feature importance for logistic regression"""
    feature_names = vectorizer.get_feature_names_out()
    coefficients = model.coef_[0]
    
    # Get top positive (spam-indicating) features
    top_spam_indices = np.argsort(coefficients)[-top_n:]
    top_spam_features = [(feature_names[i], coefficients[i]) for i in top_spam_indices]
    
    # Get top negative (ham-indicating) features
    top_ham_indices = np.argsort(coefficients)[:top_n]
    top_ham_features = [(feature_names[i], coefficients[i]) for i in top_ham_indices]
    
    # Plot
    plt.figure(figsize=(15, 10))
    
    # Spam features
    plt.subplot(1, 2, 1)
    features, scores = zip(*top_spam_features)
    plt.barh(range(len(features)), scores, color='red', alpha=0.7)
    plt.yticks(range(len(features)), features)
    plt.title('Top Spam-Indicating Features')
    plt.xlabel('Coefficient Value')
    
    # Ham features
    plt.subplot(1, 2, 2)
    features, scores = zip(*top_ham_features)
    plt.barh(range(len(features)), scores, color='green', alpha=0.7)
    plt.yticks(range(len(features)), features)
    plt.title('Top Ham-Indicating Features')
    plt.xlabel('Coefficient Value')
    
    plt.tight_layout()
    plt.show()
    
    return {
        'top_spam_features': top_spam_features,
        'top_ham_features': top_ham_features
    }
