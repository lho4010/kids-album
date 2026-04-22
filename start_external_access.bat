@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo.
echo ============================================================
echo    🌐 외부 접속 시작
echo ============================================================
echo.
echo [1/2] 웹 서버 시작 중...
start "Growth Album Server" python start_server.py

timeout /t 3 /nobreak > nul

echo [2/2] Cloudflare Tunnel 시작 중...
echo.
start "Cloudflare Tunnel" powershell -NoExit -Command "cd '%~dp0'; Write-Host '=================================='; Write-Host '   Cloudflare Tunnel'; Write-Host '=================================='; Write-Host ''; Write-Host '아래 URL을 복사하세요!'; Write-Host '앨범 주소: [URL]/album.html'; Write-Host ''; .\cloudflared.exe tunnel --url http://127.0.0.1:8080"

timeout /t 2 /nobreak > nul

echo.
echo ============================================================
echo ✅ 완료!
echo ============================================================
echo.
echo 💡 새로 열린 PowerShell 창에서 URL을 확인하세요!
echo.
echo 📱 앨범 주소 만들기:
echo    표시된 URL 뒤에 /album.html 추가
echo    예: https://abc-123.trycloudflare.com/album.html
echo.
echo ⚠️  두 창을 모두 열어두어야 접속 가능합니다!
echo.
pause
