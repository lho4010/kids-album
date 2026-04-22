# 📘 GitHub Pages로 성장 앨범 무료 호스팅하기

완전 무료로 인터넷에 영구적으로 올리는 방법입니다!
컴퓨터를 끄더라도 24시간 접속 가능합니다.

---

## 🎯 준비물

- GitHub 계정 (없으면 5분 안에 무료 가입)
- photo_album 폴더
- 인터넷 브라우저

---

## 📋 단계별 가이드

### 1단계: GitHub 계정 만들기 (이미 있으면 건너뛰기)

1. **https://github.com** 접속
2. 오른쪽 위 **Sign up** 클릭
3. 정보 입력:
   - Email: 이메일 주소 입력
   - Password: 비밀번호 생성
   - Username: 사용자 이름 (영문, 숫자만 가능)
4. 이메일 인증 완료
5. ✅ 가입 완료!

---

### 2단계: 새 저장소(Repository) 만들기

1. GitHub 로그인 후 우측 상단 **+** 버튼 클릭
2. **New repository** 선택
3. 저장소 설정:
   ```
   Repository name: kids-growth-album
   (원하는 이름으로 변경 가능, 영문/숫자/하이픈만 사용)
   
   Description: 우리 아이 성장 앨범 (선택사항)
   
   ⭐ Public 선택 (무료 호스팅은 Public만 가능)
   
   ✅ Add a README file 체크
   ```
4. **Create repository** 버튼 클릭
5. ✅ 저장소 생성 완료!

---

### 3단계: 파일 업로드하기

#### 방법 A: 웹에서 직접 업로드 (초보자 추천)

1. 생성된 저장소 페이지에서 **Add file** → **Upload files** 클릭

2. **파일 준비하기**
   - 탐색기에서 `photo_album` 폴더 열기
   - 다음 파일들을 선택:
     ```
     ✅ album.html
     ✅ album.css
     ✅ album.js
     ✅ data 폴더 (전체)
     ```

3. **드래그 앤 드롭**
   - 선택한 파일들을 GitHub 페이지로 드래그
   - 또는 "choose your files" 클릭해서 선택

4. **업로드 완료**
   - 하단에 "Commit changes" 입력란에:
     ```
     Upload album files
     ```
   - **Commit changes** 버튼 클릭

5. ⚠️ **중요: data 폴더가 너무 클 수 있습니다!**
   - GitHub는 파일당 25MB, 저장소당 1GB 제한
   - data 폴더를 여러 번에 나눠서 업로드할 수 있습니다

#### 방법 B: GitHub Desktop 사용 (대용량 파일 추천)

1. **GitHub Desktop 설치**
   - https://desktop.github.com 에서 다운로드
   - 설치 후 GitHub 계정으로 로그인

2. **저장소 클론**
   - File → Clone repository
   - 방금 만든 `kids-growth-album` 선택
   - Local Path: 저장할 위치 선택 (예: C:\GitHub)
   - Clone 클릭

3. **파일 복사**
   - 탐색기에서 `photo_album` 폴더의 모든 파일을
   - 클론한 폴더로 복사
   ```
   복사할 파일:
   - album.html
   - album.css
   - album.js
   - data 폴더 (전체)
   - README.md (선택)
   ```

4. **커밋 & 푸시**
   - GitHub Desktop으로 돌아가기
   - 왼쪽에 변경된 파일 목록 표시됨
   - 왼쪽 하단 Summary에 입력:
     ```
     Add growth album website
     ```
   - **Commit to main** 버튼 클릭
   - 상단 **Push origin** 버튼 클릭
   - ✅ 업로드 완료!

---

### 4단계: GitHub Pages 활성화

1. 저장소 페이지 상단의 **Settings** 클릭

2. 왼쪽 메뉴에서 **Pages** 클릭

3. **Source** 섹션에서:
   ```
   Branch: main 선택
   Folder: / (root) 선택
   ```

4. **Save** 버튼 클릭

5. 잠시 기다리면 (1-2분) 상단에 초록색 박스 표시:
   ```
   ✅ Your site is published at https://USERNAME.github.io/kids-growth-album/
   ```

6. ✅ 호스팅 완료!

---

### 5단계: 접속하기

1. **주소 확인**
   ```
   https://USERNAME.github.io/kids-growth-album/album.html
   
   USERNAME = 본인의 GitHub 사용자명
   ```

2. **주소 복사해서 공유**
   - 가족, 친구에게 이 주소를 보내면 됩니다
   - 비밀번호 없이 누구나 접속 가능 (Public 저장소)

3. **테스트**
   - 브라우저에서 주소 입력
   - 앨범이 정상적으로 보이는지 확인

---

## 🔧 문제 해결

### 1. 페이지가 404 에러 표시
**원인**: GitHub Pages가 아직 빌드 중이거나 파일 경로 문제

**해결**:
- 5분 정도 기다린 후 다시 시도
- Settings → Pages에서 상태 확인
- 주소 끝에 `/album.html` 추가했는지 확인

### 2. 사진이 안 보임
**원인**: data 폴더가 업로드 안 됨

**해결**:
- 저장소에서 data 폴더 확인
- 없으면 다시 업로드
- 파일 경로가 `data/게시글폴더/images/사진.jpg` 형태인지 확인

### 3. 파일 용량 초과 에러
**원인**: 파일이 너무 큼 (GitHub 제한: 파일당 100MB, 저장소당 1GB)

**해결법 1**: 사진 압축
```powershell
# photo_album 폴더에서 실행
python compress_images.py
```

**해결법 2**: Git LFS 사용 (대용량 파일)
```bash
git lfs install
git lfs track "*.jpg"
git lfs track "*.png"
git add .gitattributes
git add .
git commit -m "Add images with LFS"
git push
```

**해결법 3**: 여러 저장소로 분리
- 사진만 따로 다른 저장소에 업로드
- CDN 서비스 사용 (imgur, cloudinary 등)

### 4. 업로드가 너무 느림
**원인**: 인터넷 속도 또는 파일 크기

**해결**:
- 사진 압축 후 업로드
- 밤 시간대에 업로드 (트래픽 적을 때)
- GitHub Desktop 사용 (웹보다 안정적)

---

## 🔒 비공개로 만들기 (Pro 버전 필요)

무료 GitHub Pages는 Public만 가능하지만,
비공개로 하려면:

### 방법 1: GitHub Pro 구독 ($4/월)
- Private 저장소에서도 Pages 사용 가능

### 방법 2: 비밀번호 추가 (무료)
- 앨범에 간단한 비밀번호 기능 추가 가능
- JavaScript로 구현 (완벽한 보안은 아님)

### 방법 3: Netlify/Vercel 사용 (무료)
- GitHub과 연동 가능
- 비밀번호 보호 기능 제공
- 더 빠른 속도

---

## 📱 업데이트 방법

나중에 내용을 수정하고 싶을 때:

### 웹에서 수정
1. GitHub 저장소 접속
2. 수정할 파일 클릭
3. 연필 아이콘 (Edit) 클릭
4. 내용 수정 후 Commit changes

### GitHub Desktop 사용
1. 로컬에서 파일 수정
2. GitHub Desktop에서 변경사항 확인
3. Commit & Push

---

## 🎁 추가 기능

### 커스텀 도메인 연결
자신만의 도메인 사용 가능! (예: album.myname.com)

1. 도메인 구매 (연간 1-2만원)
2. Settings → Pages → Custom domain에 도메인 입력
3. DNS 설정에서 CNAME 레코드 추가

### Google Analytics 추가
방문자 통계 확인:

1. Google Analytics 계정 생성
2. Tracking ID 발급
3. album.html에 코드 추가

---

## 💰 비용

- ✅ **완전 무료!**
- GitHub Pages: 무료
- 저장 공간: 1GB 무료
- 트래픽: 월 100GB 무료
- 도메인: 선택사항 (연간 1-2만원)

---

## 📞 도움이 필요하면

1. **GitHub 공식 문서**
   - https://docs.github.com/pages

2. **GitHub Pages 튜토리얼**
   - https://pages.github.com

3. **YouTube 검색**
   - "GitHub Pages 사용법"
   - "GitHub Pages tutorial"

---

## ✅ 체크리스트

업로드 전 확인사항:

```
□ GitHub 계정 생성 완료
□ 저장소 생성 완료 (Public)
□ album.html 업로드
□ album.css 업로드
□ album.js 업로드
□ data 폴더 업로드
□ Settings → Pages 활성화
□ 주소로 접속 테스트 완료
□ 가족/친구와 주소 공유
```

---

## 🎉 완료!

이제 여러분의 성장 앨범이 전 세계 어디서든 접속 가능합니다!

주소를 카카오톡, 문자로 공유하세요:
```
우리 아이 성장 앨범 📖
https://USERNAME.github.io/kids-growth-album/album.html
```

**축하합니다!** 🎊
