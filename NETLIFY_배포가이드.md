# 🚀 Netlify 배포 가이드

## 📊 현재 상태
- 전체 크기: **240MB** ✅
- Netlify 무료 플랜: **500MB 이하 권장** ✅
- 배포 준비 완료!

---

## 방법 1: 드래그 앤 드롭 배포 (가장 쉬움!) ⭐

### 1단계: Netlify 회원가입
1. https://app.netlify.com/signup 접속
2. GitHub / GitLab / Bitbucket / Email 중 선택
3. 무료 계정 생성

### 2단계: 사이트 생성
1. Netlify 대시보드에서 **"Sites"** 탭 클릭
2. **"Add new site"** → **"Deploy manually"** 클릭

### 3단계: 폴더 업로드
1. 다음 폴더를 **압축(ZIP)** 파일로 만들기:
   ```
   C:\Users\lho40\OneDrive\Desktop\kids\photo_album\kids-album
   ```
   
   **포함할 파일:**
   - `album.html`
   - `album.css`
   - `album.js`
   - `data/` 폴더 전체
   
   **제외할 파일:**
   - `*.py` (Python 스크립트)
   - `*.bat` (배치 파일)
   - `*.md` (가이드 문서)
   - `start_server.py`
   - `cloudflared.exe`

2. 또는 Netlify 사이트로 **폴더를 직접 드래그 앤 드롭**

### 4단계: 배포 완료!
- 자동으로 배포가 시작됩니다
- 약 5~10분 소요
- 배포 완료 후 **URL 발급**: `https://random-name-123.netlify.app`

---

## 방법 2: Netlify CLI 사용 (고급)

### 1단계: Netlify CLI 설치
```bash
npm install -g netlify-cli
```

### 2단계: 로그인
```bash
netlify login
```

### 3단계: 배포
```bash
cd C:\Users\lho40\OneDrive\Desktop\kids\photo_album\kids-album
netlify deploy --prod
```

### 4단계: 배포 디렉토리 선택
- 프롬프트에서 `.` (현재 디렉토리) 입력

---

## 🎯 배포 후 확인사항

### ✅ 접속 테스트
1. 발급받은 URL로 접속: `https://your-site.netlify.app/album.html`
2. 모든 기능 테스트:
   - 목차 작동
   - 페이지 넘기기
   - 사진 보기
   - 모바일에서도 테스트

### ✅ 커스텀 도메인 (선택사항)
1. Netlify 대시보드 → **Domain settings**
2. **Add custom domain** 클릭
3. 원하는 도메인 입력 (예: `my-kids-album.netlify.app`)

---

## ⚙️ 설정 파일 (선택사항)

더 나은 배포를 위해 `netlify.toml` 파일 생성:

```toml
[build]
  publish = "."
  
[[redirects]]
  from = "/"
  to = "/album.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"
    
[[headers]]
  for = "/data/*/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

이 파일을 `kids-album` 폴더에 저장하세요.

---

## 🔐 비밀번호 보호 (선택사항)

### Netlify Identity 사용
1. Netlify 대시보드 → **Identity** 탭
2. **Enable Identity** 클릭
3. **Settings** → **Registration** → **Invite only** 선택
4. 가족 이메일 초대

---

## 💰 무료 플랜 제한

```
✅ 100GB/월 대역폭
✅ 300분/월 빌드 시간
✅ 무제한 사이트
✅ HTTPS 자동
✅ 커스텀 도메인
```

### 대역폭 계산
- 앨범 크기: 240MB
- 100GB ÷ 240MB = **약 400회 완전 로딩/월**
- 캐시 덕분에 실제로는 **수천 회 접속 가능**

---

## ❓ 문제 해결

### 배포가 실패해요
- 파일 크기 확인: 500MB 이하여야 함
- 파일명에 특수문자 제거
- `.gitignore`에 불필요한 파일 추가

### 이미지가 안 보여요
- 경로 확인: `data/` 폴더가 제대로 업로드 되었는지
- 브라우저 캐시 삭제 후 새로고침

### 느려요
- 이미지 Lazy Loading이 적용되어 있음 (정상)
- 첫 방문은 느릴 수 있음
- 두 번째 방문부터는 캐시로 빠름

---

## 🎉 완료!

배포가 완료되면:
- ✅ PC를 꺼도 접속 가능
- ✅ 고정된 URL
- ✅ HTTPS 자동 적용
- ✅ 빠른 속도
- ✅ 전 세계 어디서든 접속

**질문이 있으시면 언제든 물어보세요!** 💕
