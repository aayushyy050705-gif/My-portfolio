#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Please install Node.js from https://nodejs.org/ and run this file again."
  read -r -p "Press Enter to close..."
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "Installing project dependencies (first run only)..."
  npm install || { echo "Install failed. Check your internet connection."; read -r; exit 1; }
fi
echo "Starting your portfolio + GrowthOS for laptop and phone..."
echo "On this laptop: http://localhost:5173"
echo "On your phone: use your laptop's Wi-Fi IPv4 address, for example http://192.168.1.5:5173"
echo "Keep this Terminal window open while using the site."
npm run dev -- --host 0.0.0.0 --open
