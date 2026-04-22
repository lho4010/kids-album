# 🚀 빠른 시작 가이드

## 5분 안에 GitHub Pages로 배포하기!

---

## 📌 체크리스트 (따라하세요!)

### ✅ 1단계: GitHub 계정 (5분)

```
□ https://github.com 접속
□ Sign up 클릭
□ 이메일, 비밀번호, 사용자명 입력
□ 이메일 인증 완료
```

---

### ✅ 2단계: 저장소 만들기 (2분)

```
□ 오른쪽 위 + 버튼 클릭
□ New repository 선택
□ Repository name: kids-album (또는 원하는 이름)
□ Public 선택 ⭐ 중요!
□ Add a README file 체크
□ Create repository 클릭
```

---

### ✅ 3단계: 파일 업로드 (10-30분, 인터넷 속도에 따라)

#### 🔴 중요: 용량 체크 먼저!

**data 폴더 크기 확인**:
```powershell
# photo_album 폴더에서 실행
Get-ChildItem data -Recurse | Measure-Object -Property Length -Sum
```

**1GB 초과하면**: 이미지 압축 필요!
```powershell
# Pillow 설치 (처음 한 번만)
pip install Pillow

# 이미지 압축 실행
python compress_images.py
```

#### 업로드 방법 선택

**A. 웹 업로드 (간단, 소용량)**
```
□ Add file → Upload files 클릭
□ 파일 드래그 앤 드롭:
  - album.html
  - album.css
  - album.js
  - data 폴더 전체 (또는 data_compressed)
□ Commit changes 클릭
```

**B. GitHub Desktop (권장, 대용량)**
```
□ https://desktop.github.com 다운로드
□ 설치 후 GitHub 계정 로그인
□ File → Clone repository
□ kids-album 선택 후 Clone
□ 탐색기에서 파일 복사
□ GitHub Desktop에서 Commit to main
□ Push origin 클릭
```

---

### ✅ 4단계: GitHub Pages 활성화 (1분)

```
□ 저장소 페이지에서 Settings 클릭
□ 왼쪽 메뉴 Pages 클릭
□ Source: main 선택
□ Folder: / (root) 선택
□ Save 클릭
□ 1-2분 대기
□ 초록색 "Your site is published at..." 확인
```

---

### ✅ 5단계: 접속 테스트 (1분)

```
□ 주소 복사:
  https://사용자명.github.io/kids-album/album.html

□ 새 탭에서 열기
□ 앨범 정상 작동 확인
□ 사진 클릭해서 크게 보기 테스트
```

---

## 🎉 완료! 이제 공유하세요!

### 카카오톡 메시지 템플릿
```
📖 우리 아이 성장 앨범

소중한 추억들을 모아뒀어요 💕

🔗 https://사용자명.github.io/kids-album/album.html

💡 사진을 클릭하면 크게 볼 수 있어요!
```

---

## 🔧 문제 해결

### ❌ 404 에러
- 5분 더 기다려보세요 (GitHub Pages 빌드 중)
- 주소 끝에 `/album.html` 있는지 확인
- Settings → Pages에서 상태 확인

### ❌ 사진이 안 보여요
- data 폴더가 업로드됐는지 확인
- 브라우저 새로고침 (Ctrl + F5)

### ❌ 용량 초과 에러
```powershell
# 이미지 압축
pip install Pillow
python compress_images.py --quality 70

# 압축된 폴더 사용
# data_compressed를 data로 이름 변경 후 업로드
```

---

## 🎁 추가 기능

### 🔒 비밀번호 추가하기
```
1. PASSWORD_SETUP.md 파일 참고
2. add_password.html 수정
3. 파일명 변경 후 업로드
```

### 🌐 더 쉬운 외부 접속
```
1. Netlify/Vercel 사용
2. GitHub 저장소 연동
3. 자동 배포
4. 강력한 비밀번호 보호 제공
```

### 📱 QR 코드 만들기
```
1. https://www.qr-code-generator.com 접속
2. 앨범 주소 입력
3. QR 코드 다운로드
4. 인쇄해서 공유
```

---

## 📞 더 자세한 가이드

- **GitHub Pages 상세 가이드**: `GITHUB_PAGES_GUIDE.md`
- **비밀번호 설정**: `PASSWORD_SETUP.md`
- **일반 사용법**: `README.md`

---

## ⏱️ 예상 소요 시간

```
□ GitHub 가입: 5분
□ 저장소 생성: 2분
□ 파일 업로드: 10-30분 (용량에 따라)
□ Pages 활성화: 1분
□ 빌드 대기: 2분
---
총 20-40분
```

---

## 💰 비용

**완전 무료!**
- GitHub Pages: 무료
- 저장 공간: 1GB 무료
- 트래픽: 월 100GB 무료
- 도메인: 선택사항 (연 1-2만원)

---

## 🎯 다음 단계

배포 성공 후:
1. ✅ 가족, 친구와 주소 공유
2. ✅ 비밀번호 추가 (선택)
3. ✅ 커스텀 도메인 연결 (선택)
4. ✅ Google Analytics 추가 (선택)

---

**도움이 필요하면**:
- 상세 가이드: `GITHUB_PAGES_GUIDE.md` 참고
- GitHub 공식 문서: https://docs.github.com/pages
- YouTube: "GitHub Pages 사용법" 검색

---

행운을 빕니다! 🍀
