@echo off
chcp 65001 >nul
title نظام إدارة مركز التدريب المهني - Vocational Training Center System
echo =================================================================
echo   تشغيل نظام إدارة مركز التدريب المهني (VTC Management System)
echo =================================================================
echo جاري بدء خادم الويب المحلي وفتح المتصفح...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 8080
pause
