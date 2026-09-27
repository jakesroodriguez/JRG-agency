@echo off
title Servidor Web - JRG Estudio
color 0b
echo ====================================================
echo           INICIANDO PAGINA WEB JRG ESTUDIO
echo ====================================================
echo.
echo Abriendo tu web en el navegador (http://localhost:5173)...
echo (No cierres esta ventanita negra mientras estes trabajando)
echo.
timeout /t 2 >nul
start http://localhost:5173
cmd /c "npm run dev"
pause
