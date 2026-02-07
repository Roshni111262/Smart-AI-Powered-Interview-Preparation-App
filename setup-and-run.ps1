# Smart Interview Prep - Full Setup and Run
# Run this in PowerShell (Right-click -> Run with PowerShell) or from terminal

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Smart Interview Prep - Setup & Run" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
$nodePath = $null
try {
    $nodePath = Get-Command node -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
} catch {}

if (-not $nodePath) {
    Write-Host "Node.js not found. Installing via winget..." -ForegroundColor Yellow
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    Write-Host ""
    Write-Host "Node.js installed! Please CLOSE and REOPEN this window, then run this script again." -ForegroundColor Green
    Write-Host "Or run: cd server; npm install; npm run dev" -ForegroundColor Gray
    pause
    exit 0
}

Write-Host "Node.js found: $nodePath" -ForegroundColor Green

# Install server deps
Write-Host ""
Write-Host "Installing server dependencies..." -ForegroundColor Yellow
Set-Location "$projectRoot\server"
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "Server install failed" -ForegroundColor Red; pause; exit 1 }

# Install client deps
Write-Host ""
Write-Host "Installing client dependencies..." -ForegroundColor Yellow
Set-Location "$projectRoot\client"
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "Client install failed" -ForegroundColor Red; pause; exit 1 }

Set-Location $projectRoot

# Start backend
Write-Host ""
Write-Host "Starting backend server (port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\server'; npm run dev"

Start-Sleep -Seconds 4

# Start frontend
Write-Host "Starting frontend (port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\client'; npm run dev"

Start-Sleep -Seconds 3

# Open browser
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " Opening http://localhost:5173" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "App is running! Close the 2 PowerShell windows to stop servers." -ForegroundColor Cyan
