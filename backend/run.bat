@echo off
cd /d "%~dp0"
if not exist "uploads" mkdir uploads
if not exist "venv" (
  echo Creating virtual environment...
  python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing/updating dependencies...
pip install --upgrade pip
pip install -r requirements.txt
echo.
echo Starting LumiFix AI Backend...
echo Test: http://localhost:5000/health
echo.
python app.py
pause

