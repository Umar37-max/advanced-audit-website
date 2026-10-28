@echo off
cd /d "%~dp0"
echo.
echo Starting BEST Audit Services...
echo.
call "C:\Program Files\nodejs\npm.cmd" install
if errorlevel 1 (
    echo Failed to install dependencies.
    pause
    exit /b 1
)
call "C:\Program Files\nodejs\npm.cmd" run dev
if errorlevel 1 (
    echo Failed to start the development server.
    pause
    exit /b 1
)
