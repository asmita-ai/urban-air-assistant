@echo off
echo Pushing VayuMitra Urban Air Quality Assistant to https://github.com/asmita-ai/urban-air-assistant ...
cd /d "%~dp0"
git remote remove origin 2>nul
git remote add origin https://github.com/asmita-ai/urban-air-assistant.git
git branch -M main
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================
    echo SUCCESS: Repository successfully pushed to GitHub!
    echo URL: https://github.com/asmita-ai/urban-air-assistant
    echo ===================================================
) else (
    echo ===================================================
    echo NOTE: If you saw 'Repository not found', please make sure
    echo you have created the empty repository 'urban-air-assistant'
    echo on https://github.com/new as a PUBLIC repository.
    echo Then run this script again!
    echo ===================================================
)
pause
