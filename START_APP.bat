@echo off
title Smart Interview Prep
cd /d "%~dp0"

set "NODEPATH=C:\Program Files\nodejs"
if exist "%NODEPATH%\node.exe" set "PATH=%NODEPATH%;%PATH%"

echo ========================================
echo   Smart Interview Prep - Starting
echo ========================================
echo.

if not exist "server\node_modules" (
    echo Installing server dependencies first...
    cd server
    call npm install
    cd ..
)

if not exist "client\node_modules" (
    echo Installing client dependencies first...
    cd client
    call npm install
    cd ..
)

echo Starting backend (port 5000)...
start "Backend" cmd /k "set PATH=%NODEPATH%;%PATH% && cd /d %~dp0server && npm run dev"

timeout /t 4 /nobreak >nul

echo Starting frontend (port 5173)...
start "Frontend" cmd /k "set PATH=%NODEPATH%;%PATH% && cd /d %~dp0client && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo Opening http://localhost:5173
start http://localhost:5173

echo.
echo App is running! Close the 2 black windows to stop.
pause
