// 성장 앨범 - 분할 버전
let currentPage = 0;
let loadedPosts = {};  // 캐시된 게시글
let currentThumbCount = parseInt(localStorage.getItem('thumbCount')) || 3;  // 썸네일 개수

// DOM 요소
const postContainer = document.getElementById('post-container');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const tocBtn = document.getElementById('tocBtn');
const currentPageEl = document.getElementById('currentPage');
const totalPagesEl = document.getElementById('totalPages');

// 라이트박스 관련
let lightboxImages = [];
let currentLightboxIndex = 0;

// 초기화
function init() {
    // 스크롤 초기화
    window.scrollTo(0, 0);
    
    // 모바일 뷰포트 설정
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    
    // 이벤트 리스너
    prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
    tocBtn.addEventListener('click', () => goToPage(0));
    
    // 키보드 네비게이션
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToPage(currentPage - 1);
        else if (e.key === 'ArrowRight') goToPage(currentPage + 1);
        else if (e.key === 'Home') goToPage(0);
        else if (e.key === 'End') goToPage(TOTAL_POSTS);
    });
    
    // 썸네일 옵션 초기화
    initThumbOptions();
    
    // 목차 클릭 이벤트
    initTocEvents();
    
    // 목차 페이지네이션
    initTocPagination();
    
    // 터치 스와이프
    initTouchSwipe();
    
    // 라이트박스 초기화
    initLightbox();
    
    // 첫 페이지 표시
    showPage(0);
}

// 뷰포트 높이 설정 (모바일)
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// 페이지 이동
async function goToPage(pageNum) {
    if (pageNum < 0 || pageNum > TOTAL_POSTS) return;
    
    currentPage = pageNum;
    await showPage(pageNum);
}

// 페이지 표시
async function showPage(pageNum) {
    window.scrollTo(0, 0);
    
    // 모든 페이지 비활성화
    document.querySelectorAll('.page-spread').forEach(p => p.classList.remove('active'));
    
    if (pageNum === 0) {
        // 표지/목차
        document.getElementById('page-0').classList.add('active');
    } else {
        // 게시글 로드
        await loadPost(pageNum);
        
        const postPage = document.getElementById(`page-${pageNum}`);
        if (postPage) {
            postPage.classList.add('active');
            
            // 약간의 지연 후 이미지 로드 (DOM 업데이트 보장)
            setTimeout(() => {
                loadPageImages(postPage);
                initPostPhotoControls(postPage);
                updatePhotoGridMode();
            }, 100);
        }
    }
    
    currentPageEl.textContent = pageNum;
    
    // 스크롤 초기화
    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
    });
}

// 게시글 로드 (캐시 사용)
async function loadPost(postId) {
    // 이미 로드됨?
    if (loadedPosts[postId]) return;
    
    // 이미 DOM에 있음?
    if (document.getElementById(`page-${postId}`)) {
        loadedPosts[postId] = true;
        return;
    }
    
    try {
        const response = await fetch(`posts/${String(postId).padStart(3, '0')}.html`);
        if (!response.ok) throw new Error('Failed to load post');
        
        const html = await response.text();
        
        // DOM에 추가
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        postContainer.appendChild(tempDiv.firstElementChild);
        
        loadedPosts[postId] = true;
    } catch (error) {
        console.error('Error loading post:', error);
    }
}

// 페이지 이미지 로드 (현재 슬라이드 + 다음 몇 개)
function loadPageImages(pageElement) {
    // 모든 이미지 찾기
    const allImages = pageElement.querySelectorAll('img[data-src]');
    
    if (allImages.length === 0) return;
    
    // 첫 5개 이미지 즉시 로드
    for (let i = 0; i < Math.min(5, allImages.length); i++) {
        const img = allImages[i];
        if (img.dataset.src && !img.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        }
    }
}

// 게시글 포토 컨트롤 초기화
function initPostPhotoControls(pageElement) {
    const slides = pageElement.querySelectorAll('.photo-slide');
    const prevBtn = pageElement.querySelector('.prev-photo');
    const nextBtn = pageElement.querySelector('.next-photo');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        slides.forEach((s, i) => {
            s.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
        
        // 현재 슬라이드 이미지 로드
        const currentImg = slides[index].querySelector('img');
        if (currentImg && currentImg.dataset.src && !currentImg.classList.contains('loaded')) {
            currentImg.src = currentImg.dataset.src;
            currentImg.classList.add('loaded');
        }
    }
    
    if (prevBtn) prevBtn.onclick = () => showSlide(currentSlide - 1);
    if (nextBtn) nextBtn.onclick = () => showSlide(currentSlide + 1);
    
    // 이미지 클릭 시 라이트박스
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            openLightbox(slides, index);
        });
    });
}

// 썸네일 옵션 초기화
function initThumbOptions() {
    const optionButtons = document.querySelectorAll('.thumb-option-btn');
    
    // 저장된 값으로 활성 버튼 설정
    optionButtons.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.count) === currentThumbCount) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', function() {
            const count = parseInt(this.dataset.count);
            currentThumbCount = count;
            localStorage.setItem('thumbCount', count);
            
            // 버튼 활성화 상태 변경
            optionButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 현재 페이지의 사진 뷰어 업데이트
            updatePhotoGridMode();
        });
    });
}

// 사진 그리드 모드 업데이트
function updatePhotoGridMode() {
    const activePage = document.querySelector('.page-spread.active');
    if (!activePage) return;
    
    const photoSlides = activePage.querySelector('.photo-slides');
    if (!photoSlides) return;
    
    // 기존 그리드 클래스 제거
    photoSlides.classList.remove('grid-mode', 'grid-1', 'grid-3', 'grid-6', 'grid-9');
    
    // 새 그리드 모드 적용
    photoSlides.classList.add('grid-mode', `grid-${currentThumbCount}`);
    
    // 모든 슬라이드 가져오기
    const allSlides = photoSlides.querySelectorAll('.photo-slide');
    
    // 표시할 슬라이드 수 제한
    allSlides.forEach((slide, index) => {
        if (index < currentThumbCount) {
            slide.style.display = 'flex';
            // 이미지 로드
            const img = slide.querySelector('img');
            if (img && img.dataset.src && !img.classList.contains('loaded')) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            }
        } else {
            slide.style.display = 'none';
        }
    });
    
    // 그리드 모드에서 이미지 클릭 시 라이트박스 열기 (전체 이미지로)
    allSlides.forEach((slide, index) => {
        slide.onclick = () => {
            openLightbox(allSlides, index);
        };
    });
}

// 목차 이벤트
function initTocEvents() {
    document.querySelectorAll('.toc-item').forEach(item => {
        item.addEventListener('click', () => {
            const pageNum = parseInt(item.dataset.page);
            goToPage(pageNum);
        });
    });
}

// 목차 페이지네이션
let tocItemsPerPage = 20;
let currentTocPage = 0;
let allTocItems = [];

function initTocPagination() {
    allTocItems = Array.from(document.querySelectorAll('.toc-item'));
    
    document.querySelectorAll('.toc-page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.toc-page-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tocItemsPerPage = parseInt(btn.dataset.items);
            currentTocPage = 0;
            updateTocDisplay();
        });
    });
    
    document.getElementById('prevTocBtn').addEventListener('click', () => {
        if (currentTocPage > 0) {
            currentTocPage--;
            updateTocDisplay();
        }
    });
    
    document.getElementById('nextTocBtn').addEventListener('click', () => {
        const totalPages = Math.ceil(allTocItems.length / tocItemsPerPage);
        if (currentTocPage < totalPages - 1) {
            currentTocPage++;
            updateTocDisplay();
        }
    });
    
    updateTocDisplay();
}

function updateTocDisplay() {
    const totalPages = Math.ceil(allTocItems.length / tocItemsPerPage);
    const start = currentTocPage * tocItemsPerPage;
    const end = start + tocItemsPerPage;
    
    allTocItems.forEach((item, i) => {
        item.style.display = (i >= start && i < end) ? 'flex' : 'none';
    });
    
    document.getElementById('tocCurrentPage').textContent = currentTocPage + 1;
    document.getElementById('tocTotalPages').textContent = totalPages;
    
    document.getElementById('prevTocBtn').disabled = currentTocPage === 0;
    document.getElementById('nextTocBtn').disabled = currentTocPage >= totalPages - 1;
}

// 터치 스와이프
function initTouchSwipe() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToPage(currentPage + 1);
            else goToPage(currentPage - 1);
        }
    }
}

// 라이트박스
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    prevBtn.addEventListener('click', () => showLightboxImage(currentLightboxIndex - 1));
    nextBtn.addEventListener('click', () => showLightboxImage(currentLightboxIndex + 1));
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') showLightboxImage(currentLightboxIndex - 1);
        else if (e.key === 'ArrowRight') showLightboxImage(currentLightboxIndex + 1);
    });
}

function openLightbox(slides, startIndex) {
    const lightbox = document.getElementById('lightbox');
    
    lightboxImages = [];
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            lightboxImages.push({
                src: img.dataset.fullsize || img.dataset.src || img.src,
                alt: img.alt || '사진'
            });
        }
    });
    
    currentLightboxIndex = startIndex;
    showLightboxImage(startIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showLightboxImage(index) {
    if (index < 0) index = lightboxImages.length - 1;
    if (index >= lightboxImages.length) index = 0;
    
    currentLightboxIndex = index;
    
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    
    img.src = lightboxImages[index].src;
    caption.textContent = `${index + 1} / ${lightboxImages.length}`;
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
