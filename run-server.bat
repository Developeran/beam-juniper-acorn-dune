@echo off
chcp 65001 >nul
title Market Monitor Server (Port 8082)
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

echo ========================================================
echo  Market Monitor (beam-juniper-acorn-dune) - Сервер запущен
echo  Адрес в браузере: http://localhost:8082
echo ========================================================
echo.

REM Открываем браузер с приложением
start "" "http://localhost:8082"

npm run dev
pause
