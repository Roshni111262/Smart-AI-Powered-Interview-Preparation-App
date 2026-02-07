@echo off
echo ========================================
echo  Smart Interview Prep - Starting...
echo ========================================
echo.

cd /d "%~dp0"

if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    call npm install
    cd ..
)
if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    call npm install
    cd ..
)

echo.
echo Starting Backend (port 5000)...
start "Backend" cmd /k "cd /d %~dp0server && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend (port 5173)...
start "Frontend" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ========================================
echo  Servers starting!
echo  Open http://localhost:5173 in your browser
echo ========================================
