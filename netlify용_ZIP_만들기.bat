@echo off
chcp 65001 > nul
echo.
echo ============================================================
echo   Netlify 배포용 ZIP 파일 생성
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/3] 임시 폴더 생성 중...
if exist "netlify-temp" rmdir /s /q "netlify-temp"
mkdir "netlify-temp"

echo [2/3] 필요한 파일 복사 중...
copy "album.html" "netlify-temp\" > nul
copy "album.css" "netlify-temp\" > nul
copy "album.js" "netlify-temp\" > nul
xcopy "data" "netlify-temp\data\" /E /I /H /Y > nul

echo [3/3] ZIP 파일 생성 중...
powershell -Command "Compress-Archive -Path 'netlify-temp\*' -DestinationPath '..\kids-album-netlify.zip' -Force"

echo.
echo ============================================================
echo   완료!
echo ============================================================
echo.
echo ZIP 파일 위치:
echo %~dp0\..\kids-album-netlify.zip
echo.
echo 이 ZIP 파일을 Netlify에 업로드하세요!
echo.

rmdir /s /q "netlify-temp"

pause
