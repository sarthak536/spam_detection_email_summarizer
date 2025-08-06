#!/bin/bash

# Deploy script for GitHub Pages

echo "🚀 Starting GitHub Pages deployment..."

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Navigate to frontend
cd frontend

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building for GitHub Pages..."
npm run build:github

echo "📤 Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "✅ Deployment complete!"
echo "🌐 Your app will be available at: https://yourusername.github.io/spam_detection_email_summarizer/"
echo "⏰ Note: It may take a few minutes for changes to appear"
