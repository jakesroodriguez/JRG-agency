@echo off
chcp 65001 >nul
title Servidor Web - JRG Agency
color 0b
echo ====================================================
echo           INICIANDO PAGINA WEB - JRG AGENCY
echo ====================================================
echo.
echo Abriendo tu web en el navegador (http://localhost:5173)...
echo (No cierres esta ventanita negra mientras estes trabajando)
echo.
for /d %%D in ("%~dp0*Codigo_Web*") do cd /d "%%D"
timeout /t 2 >nul
start http://localhost:5173
cmd /c "npm run dev"
pause