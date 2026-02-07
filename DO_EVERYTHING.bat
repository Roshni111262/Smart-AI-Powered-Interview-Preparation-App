@echo off
title Smart Interview Prep - Setup
cd /d "%~dp0"

echo ========================================
echo   Smart Interview Prep - Full Setup
echo ========================================
echo.

set "NODEPATH=C:\Program Files\nodejs"
if exist "%NODEPATH%\node.exe" set "PATH=%NODEPATH%;%PATH%"
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js not found. Installing...
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    echo.
    echo Node.js installed! Close this window, open a NEW terminal,
    echo then double-click DO_EVERYTHING.bat again.
    pause
    exit /b 0
)

echo Node.js found.
echo.

if not exist "server\node_modules" (
    echo [1/4] Installing server dependencies...
    cd server
    call npm install
    if errorlevel 1 goto error
    cd ..
    echo Done.
) else (
    echo [1/4] Server deps already installed.
)

if not exist "client\node_modules" (
    echo [2/4] Installing client dependencies...
    cd client
    call npm install
    if errorlevel 1 goto error
    cd ..
    echo Done.
) else (
    echo [2/4] Client deps already installed.
)

echo [3/4] Starting backend...
start "Backend - Port 5000" cmd /k "set PATH=%NODEPATH%;%PATH% && cd /d %~dp0server && npm run dev"

echo Waiting for backend...
timeout /t 4 /nobreak >nul

echo [4/4] Starting frontend...
start "Frontend - Port 5173" cmd /k "set PATH=%NODEPATH%;%PATH% && cd /d %~dp0client && npm run dev"

echo.
echo Waiting for frontend to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   Opening browser at http://localhost:5173
echo ========================================
start http://localhost:5173

echo.
echo DONE! Your app is running.
echo Close the 2 black windows to stop the servers.
pause
exit /b 0

:error
echo.
echo Installation failed. Make sure Node.js is installed from nodejs.org
pause
exit /b 1
