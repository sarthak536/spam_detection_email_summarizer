#!/bin/bash

echo "======================================"
echo "Email Spam Detection & Summarizer"
echo "======================================"
echo ""

echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt

echo ""
echo "Training models (if needed)..."
python train_models.py

echo ""
echo "Starting Flask backend server..."
python app.py &

echo ""
echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "Starting React frontend..."
npm run dev

echo ""
echo "======================================"
echo "Application is running!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000" 
echo "======================================="
