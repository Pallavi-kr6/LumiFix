@echo off
cd /d "%~dp0"
if not exist "node_modules" (
  echo Installing dependencies...
  npm install
)
echo.
echo Starting LumiFix AI Frontend...
echo Open: http://localhost:5173
echo.
npm run dev

