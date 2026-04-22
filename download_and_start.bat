@echo off
chcp 65001 > nul
echo.
echo ============================================================
echo    🌐 외부 접속 설정 도우미
echo ============================================================
echo.
echo Cloudflared가 설치되지 않았거나 인식되지 않습니다.
echo.
echo 📥 설치 방법:
echo.
echo 1. 아래 링크에서 다운로드:
echo    https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.msi
echo.
echo 2. 다운로드한 MSI 파일 실행
echo.
echo 3. 설치 완료 후 이 창을 닫고 다시 실행
echo.
echo ============================================================
echo.
echo 💡 대안: ngrok 사용
echo    https://ngrok.com/download
echo.
echo ============================================================
echo.

choice /C YN /M "지금 다운로드 페이지를 여시겠습니까?"

if errorlevel 2 goto END
if errorlevel 1 goto OPEN

:OPEN
start https://github.com/cloudflare/cloudflared/releases/latest
echo.
echo ✅ 브라우저가 열렸습니다!
echo    cloudflared-windows-amd64.msi 를 다운로드하세요.
echo.

:END
pause
