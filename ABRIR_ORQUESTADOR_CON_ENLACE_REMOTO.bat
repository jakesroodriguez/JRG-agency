@echo off
chcp 65001 >nul
title Orquestador JRG Agency - Modo Enlace Remoto
color 0b
echo ====================================================
echo   ⚡ JRG AGENCY — ORQUESTADOR 3D CON ENLACE REMOTO ⚡
echo ====================================================
echo.
echo 1. Iniciando servidor local en http://localhost:3000...
echo 2. Generando tunel publico seguro HTTPS (Cloudflare)...
echo.

cd /d "%~dp05-Orquestador_Agentes_3D"

:: Iniciar el servidor Next.js y el Gateway en segundo plano
start "JRG Servidor Local" /min cmd /c "node server/index.js --dev"

timeout /t 5 >nul

echo.
echo ====================================================
echo   TU ENLACE REMOTO HTTPS SE MUESTRA A CONTINUACION:
echo   (Abre la direccion https://...trycloudflare.com en tu movil)
echo ====================================================
echo.

npx cloudflared tunnel --url http://localhost:3000
pause
