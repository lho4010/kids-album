# 🔒 비밀번호 보호 설정 가이드

간단한 비밀번호로 앨범을 보호하는 방법입니다.

---

## ⚠️ 중요 사항

이 방법은 **간단한 보호**만 제공합니다.
- ✅ 일반 사용자는 비밀번호 없이 접근 불가
- ❌ 기술적으로 우회 가능 (개발자 도구 사용 시)
- ✅ 가족, 친구 공유용으로는 충분

**완벽한 보안이 필요하면**: 
- Private 저장소 + GitHub Pro ($4/월)
- 또는 Netlify/Vercel의 비밀번호 보호 기능 사용

---

## 📋 설정 방법

### 1단계: 비밀번호 설정

1. **add_password.html 파일 열기**
   - 메모장 또는 코드 에디터로 열기

2. **비밀번호 변경**
   - 39번째 줄 찾기:
   ```javascript
   const CORRECT_PASSWORD = '1234';  // ← 원하는 비밀번호로 변경
   ```
   
   - 원하는 비밀번호로 변경:
   ```javascript
   const CORRECT_PASSWORD = 'mypassword123';
   ```

3. **저장**

### 2단계: 파일 이름 변경

GitHub에 업로드할 때:

```
원래 파일명 → 새 파일명
album.html → album_protected.html
add_password.html → album.html (또는 index.html)
```

이렇게 하면 사용자가 처음 접속 시 비밀번호 페이지가 표시됩니다.

### 3단계: GitHub 업로드

1. **파일 구조**:
   ```
   kids-growth-album/
   ├── index.html (add_password.html 이름 변경)
   ├── album_protected.html (album.html 이름 변경)
   ├── album.css
   ├── album.js
   └── data/
   ```

2. **업로드**
   - 모든 파일 GitHub에 업로드
   - Pages 활성화

3. **접속**
   ```
   https://USERNAME.github.io/kids-growth-album/
   ```
   - 자동으로 비밀번호 페이지 표시
   - 비밀번호 입력 후 앨범 접근

---

## 🎨 비밀번호 페이지 커스터마이즈

### 제목 변경
```html
<h1>성장 앨범</h1>
<!-- 원하는 제목으로 변경 -->
<h1>우리 아이 앨범</h1>
```

### 힌트 변경
```html
<div class="hint">
    💡 힌트: 관리자에게 문의하세요
</div>
<!-- 원하는 힌트로 변경 -->
<div class="hint">
    💡 힌트: 아기 생일 6자리
</div>
```

### 색상 변경
CSS에서 색상 코드 변경:
```css
/* 핑크 → 파란색 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
border-color: #667eea;
```

---

## 🔐 보안 강화 팁

### 1. 세션 시간 제한
JavaScript 수정:
```javascript
// 30분 후 자동 로그아웃
setTimeout(() => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
}, 30 * 60 * 1000);
```

### 2. 비밀번호 해시화
더 안전하게 (기본 지식 필요):
```javascript
// SHA-256 해시 사용
async function checkPassword(password) {
    const hash = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(password)
    );
    const hashHex = Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    
    // 미리 계산된 해시와 비교
    return hashHex === 'YOUR_HASH_HERE';
}
```

### 3. 로그인 시도 제한
```javascript
let attempts = 0;
const MAX_ATTEMPTS = 5;

if (attempts >= MAX_ATTEMPTS) {
    alert('너무 많은 시도! 5분 후 다시 시도하세요.');
    setTimeout(() => attempts = 0, 5 * 60 * 1000);
}
```

---

## 🌐 더 강력한 보호 방법

### Netlify 사용 (무료)

1. **Netlify 가입**
   - https://netlify.com
   - GitHub 연동

2. **사이트 생성**
   - GitHub 저장소 선택
   - 자동 배포

3. **비밀번호 설정**
   - Site settings → Access control
   - Password protection 활성화
   - 비밀번호 설정

4. **완료!**
   - Netlify가 제공하는 강력한 보안
   - 우회 불가능

### Vercel 사용 (무료)

1. **Vercel 가입**
   - https://vercel.com
   - GitHub 연동

2. **프로젝트 임포트**
   - Add New → Project
   - GitHub 저장소 선택

3. **환경 변수로 비밀번호 설정**
   - Settings → Environment Variables
   - PASSWORD 변수 추가

4. **API로 인증 구현**
   - Vercel Serverless Functions 사용

---

## 📱 모바일 접속

비밀번호 페이지는 모바일에서도 잘 작동합니다:
- 터치 친화적 큰 버튼
- 자동 포커스
- 반응형 디자인

---

## 🔄 비밀번호 변경

1. **add_password.html (또는 index.html) 수정**
2. **새 비밀번호로 변경**
3. **GitHub에 커밋 & 푸시**
4. **1-2분 후 자동 적용**

---

## ❓ FAQ

**Q: 비밀번호를 잊어버렸어요!**
A: GitHub 저장소의 파일을 확인하면 볼 수 있습니다.

**Q: 여러 개의 비밀번호를 만들 수 있나요?**
A: 가능합니다. JavaScript 수정 필요:
```javascript
const PASSWORDS = ['password1', 'password2', 'password3'];
if (PASSWORDS.includes(password)) {
    // 로그인 성공
}
```

**Q: 완벽한 보안이 필요해요**
A: Netlify/Vercel의 비밀번호 보호 기능을 사용하거나, Private 저장소 + GitHub Pro를 구독하세요.

**Q: 비밀번호 없이도 보고 싶어요**
A: 원래대로 album.html을 index.html로 사용하세요.

---

## 🎁 보너스 기능

### QR 코드 생성
주소를 QR 코드로 만들어서 공유:
- https://www.qr-code-generator.com/
- 주소 입력 → QR 코드 다운로드
- 인쇄해서 나눠주기

### 공유 메시지 템플릿
```
📖 [아기 이름] 성장 앨범

우리 아이의 소중한 순간들을 
담은 앨범입니다 💕

🔗 주소: https://xxx.github.io/album/
🔐 비밀번호: [비밀번호]

💡 PC, 스마트폰 모두 가능
📱 사진 클릭하면 크게 볼 수 있어요!
```

---

✅ **설정 완료 체크리스트**

```
□ add_password.html에서 비밀번호 변경
□ 파일명 변경 (album.html → album_protected.html)
□ 파일명 변경 (add_password.html → index.html)
□ GitHub에 업로드
□ 비밀번호 테스트
□ 가족/친구에게 비밀번호 공유
```

🎉 완료!
