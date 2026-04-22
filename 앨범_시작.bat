@echo off
chcp 65001 > nul
color 0A
title 성장 앨범 서버 시작

echo ======================================================================
echo                        성장 앨범 서버 시작
echo ======================================================================
echo.

:: 현재 디렉토리로 이동
cd /d "%~dp0"

:: 기존 프로세스 종료
echo [1/4] 기존 서버 종료 중...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM cloudflared.exe 2>nul
timeout /t 2 /nobreak > nul

:: Python 서버 시작
echo [2/4] Python 웹 서버 시작 중...
start "앨범 웹 서버" /MIN python start_server.py
timeout /t 3 /nobreak > nul

:: Cloudflare Tunnel 시작
echo [3/4] Cloudflare Tunnel 시작 중...
start "Cloudflare Tunnel" /MIN cloudflared.exe tunnel --url http://127.0.0.1:8080
timeout /t 5 /nobreak > nul

:: 브라우저 열기
echo [4/4] 브라우저 열기...
start http://localhost:8080/album.html

echo.
echo ======================================================================
echo                            시작 완료!
echo ======================================================================
echo.
echo   로컬 접속: http://localhost:8080/album.html
echo.
echo   외부 접속 URL 확인하기:
echo   1. 작업 표시줄에서 "Cloudflare Tunnel" 창 찾기
echo   2. https://...trycloudflare.com 주소 찾기
echo   3. 뒤에 /album.html 붙여서 접속
echo.
echo   예시: https://abc-xyz.trycloudflare.com/album.html
echo.
echo ======================================================================
echo   주의: 이 창을 닫으면 서버가 종료됩니다!
echo ======================================================================
echo.
pause
