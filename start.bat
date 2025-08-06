@echo off
echo ====================================
echo Email Spam Detection & Summarizer
echo ====================================
echo.

echo Starting backend server...
cd backend
start "Backend Server" cmd /k "python app.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting frontend development server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ====================================
echo Both servers are starting up!
echo ====================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
