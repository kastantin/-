@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Bot Kostya
node --env-file-if-exists=.env src/index.js
echo.
echo Bot stopped. Press any key to close.
pause >nul
