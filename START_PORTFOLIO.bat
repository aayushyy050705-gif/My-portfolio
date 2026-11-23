@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Please install Node.js from https://nodejs.org/ first. & pause & exit /b 1)
if not exist node_modules (
  echo Installing project dependencies (first run only)...
  call npm install || (echo Install failed. Check your internet connection. & pause & exit /b 1)
)
echo Starting your portfolio + GrowthOS for laptop and phone...
echo On this laptop: http://localhost:5173
echo On your phone: use your laptop's Wi-Fi IPv4 address, for example http://192.168.1.5:5173
echo Keep this window open while using the site.
call npm run dev -- --host 0.0.0.0 --open
pause
