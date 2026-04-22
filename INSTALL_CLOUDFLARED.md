# 🚀 Cloudflare Tunnel 설치 가이드

## ⚡ 가장 쉬운 방법 (5분!)

### 1단계: 다운로드

아래 링크를 **Ctrl+클릭**하여 다운로드:

**Windows 64-bit MSI 설치 파일:**
```
https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.msi
```

또는 브라우저에서:
1. https://github.com/cloudflare/cloudflared/releases/latest 접속
2. **cloudflared-windows-amd64.msi** 클릭
3. 다운로드 완료!

### 2단계: 설치

1. 다운로드한 **cloudflared-windows-amd64.msi** 파일 더블클릭
2. "다음" 클릭 (기본 설정으로)
3. 설치 완료!

### 3단계: PowerShell 재시작

**중요!** 설치 후 모든 PowerShell 창을 닫고 새로 열어야 합니다!

### 4단계: 확인

새 PowerShell에서:
```powershell
cloudflared --version
```

버전이 표시되면 성공! ✅

### 5단계: 실행

```powershell
cd C:\Users\lho40\OneDrive\Desktop\kids\photo_album\kids-album
python start_server.py

# 새 PowerShell 창
cloudflared tunnel --url http://localhost:8080
```

---

## 💡 대안: ngrok 사용

Cloudflared가 안 되면 ngrok을 사용하세요!

### ngrok 다운로드

```
https://ngrok.com/download
```

1. Windows 64-bit 다운로드
2. ZIP 압축 해제
3. ngrok.exe를 kids-album 폴더에 복사

### ngrok 사용

```powershell
# 1. 회원가입: https://dashboard.ngrok.com/signup
# 2. 토큰 복사: https://dashboard.ngrok.com/get-started/your-authtoken

# 3. 토큰 설정 (한 번만)
.\ngrok config add-authtoken YOUR_TOKEN_HERE

# 4. 서버 시작
python start_server.py

# 5. ngrok 시작 (새 창)
.\ngrok http 8080
```

---

## ✅ 어느 것이 더 나을까?

| | Cloudflared | ngrok |
|---|---|---|
| **설치** | MSI 설치 | ZIP 압축 해제 |
| **회원가입** | 불필요 | 필요 |
| **URL 변경** | 매번 | 매번 (무료) |
| **속도** | 매우 빠름 | 빠름 |

**둘 다 좋습니다!** 설치가 쉬운 것을 선택하세요.

---

## 🎉 설치 완료 후

**start_external_access.bat** 더블클릭만 하면 됩니다!
