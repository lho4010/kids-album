@echo off
chcp 65001 > nul
color 0B
title 외부 접속 주소 확인

echo ======================================================================
echo                      외부 접속 주소 확인
echo ======================================================================
echo.

:: Cloudflare 프로세스 확인
tasklist /FI "IMAGENAME eq cloudflared.exe" 2>nul | find /I /N "cloudflared.exe">nul
if "%ERRORLEVEL%"=="0" (
    echo [확인] Cloudflare Tunnel이 실행 중입니다.
    echo.
    echo 외부 접속 주소를 확인하려면:
    echo 1. 작업 표시줄 하단에서 "Cloudflare Tunnel" 창을 찾습니다
    echo 2. https://...trycloudflare.com 형태의 주소를 찾습니다
    echo 3. 주소 뒤에 /album.html을 붙입니다
    echo.
    echo 예시: https://abc-xyz.trycloudflare.com/album.html
) else (
    echo [에러] Cloudflare Tunnel이 실행되지 않았습니다.
    echo "앨범_시작.bat" 파일을 먼저 실행하세요.
)

echo.
echo ======================================================================
pause
