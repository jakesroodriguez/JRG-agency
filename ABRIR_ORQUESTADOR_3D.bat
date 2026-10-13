@echo off
chcp 65001 >nul
title Orquestador de Agentes 3D - JRG Agency
color 0b
echo ====================================================
echo      ⚡ JRG AGENCY — ORQUESTADOR DE AGENTES 3D ⚡
echo ====================================================
echo.
echo Iniciando Gateway de Agentes y Oficina Virtual 3D...
echo Abriendo Dashboard en http://localhost:3000
echo.
echo Equipo de Agentes JRG activo:
echo   - Aitor (Director de Operaciones & Orquestador)
echo   - Maider (Lead Scout & Prospección B2B)
echo   - Iker (Ventas & WhatsApp Outreach)
echo   - Unai (Arquitecto Web & Demos IA 3D)
echo   - Elena (Despliegue & Delivery a Clientes)
echo.
echo (No cierres esta ventana mientras trabajes con el orquestador)
echo.

cd /d "%~dp05-Orquestador_Agentes_3D"

timeout /t 3 >nul
start http://localhost:3000

cmd /c "node server/index.js --dev"
pause
