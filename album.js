// 모바일 뷰포트 높이 계산 (주소창 문제 해결)
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// 초기 설정 및 리사이즈 시 업데이트
setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// 앨범 데이터
const totalPages = 135;
let currentPage = 0;

// 목차 페이지네이션
let tocItemsPerPage = 20;
let currentTocPage = 1;
let totalTocPages = 1;
let allTocItems = [];

// DOM 요소
const pages = document.querySelectorAll('.page-spread');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const tocBtn = document.getElementById('tocBtn');
const currentPageEl = document.getElementById('currentPage');
const totalPagesEl = document.getElementById('totalPages');

// 초기화
function init() {
    // 즉시 스크롤 초기화
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // 모바일 감지 및 클래스 추가
    if (window.innerWidth <= 768) {
        document.documentElement.classList.add('mobile-view');
    }
    
    totalPagesEl.textContent = totalPages;
    
    // 이미지 Lazy Loading 초기화
    initLazyLoading();
    
    // 목차 페이지네이션 초기화
    initTocPagination();
    
    showPage(0);
    
    // 이벤트 리스너
    prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
    tocBtn.addEventListener('click', () => {
        goToPage(0);
        scrollToTop();
    });
    
    // 키보드 네비게이션
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToPage(currentPage - 1);
        } else if (e.key === 'ArrowRight') {
            goToPage(currentPage + 1);
        } else if (e.key === 'Home') {
            goToPage(0);
        } else if (e.key === 'End') {
            goToPage(totalPages);
        }
    });
    
    // 사진 컨트롤 초기화
    initPhotoControls();
    
    // 터치 스와이프 (모바일)
    initTouchSwipe();
}

// 목차 페이지네이션 초기화
function initTocPagination() {
    // 모든 목차 항목 수집
    allTocItems = Array.from(document.querySelectorAll('.toc-item'));
    
    // 페이지네이션 버튼 이벤트
    document.querySelectorAll('.toc-page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.toc-page-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tocItemsPerPage = parseInt(btn.dataset.items);
            currentTocPage = 1;
            updateTocDisplay();
        });
    });
    
    // 목차 네비게이션
    const prevTocBtn = document.getElementById('prevTocBtn');
    const nextTocBtn = document.getElementById('nextTocBtn');
    
    if (prevTocBtn) {
        prevTocBtn.addEventListener('click', () => {
            if (currentTocPage > 1) {
                currentTocPage--;
                updateTocDisplay();
                scrollTocToTop();
            }
        });
    }
    
    if (nextTocBtn) {
        nextTocBtn.addEventListener('click', () => {
            if (currentTocPage < totalTocPages) {
                currentTocPage++;
                updateTocDisplay();
                scrollTocToTop();
            }
        });
    }
    
    // 목차 항목 클릭 이벤트
    allTocItems.forEach(item => {
        item.addEventListener('click', () => {
            // 즉시 스크롤 초기화
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            
            const pageNum = parseInt(item.dataset.page);
            goToPage(pageNum);
            
            // 추가 보장
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }, 100);
        });
    });
    
    // 초기 표시
    updateTocDisplay();
}

// 목차 표시 업데이트
function updateTocDisplay() {
    totalTocPages = Math.ceil(allTocItems.length / tocItemsPerPage);
    
    const startIndex = (currentTocPage - 1) * tocItemsPerPage;
    const endIndex = startIndex + tocItemsPerPage;
    
    // 모든 항목 숨기기
    allTocItems.forEach((item, index) => {
        if (index >= startIndex && index < endIndex) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
    
    // 페이지 정보 업데이트
    const tocCurrentPage = document.getElementById('tocCurrentPage');
    const tocTotalPages = document.getElementById('tocTotalPages');
    const prevTocBtn = document.getElementById('prevTocBtn');
    const nextTocBtn = document.getElementById('nextTocBtn');
    
    if (tocCurrentPage) tocCurrentPage.textContent = currentTocPage;
    if (tocTotalPages) tocTotalPages.textContent = totalTocPages;
    if (prevTocBtn) prevTocBtn.disabled = currentTocPage === 1;
    if (nextTocBtn) nextTocBtn.disabled = currentTocPage === totalTocPages;
}

// 목차 스크롤 최상단으로
function scrollTocToTop() {
    const tocList = document.querySelector('.toc-list');
    if (tocList) {
        tocList.scrollTop = 0;
    }
}

// 전체 페이지 스크롤 최상단으로
function scrollToTop() {
    // 전체 페이지 스크롤 (즉시)
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // 활성 페이지 내부 스크롤
    const activePage = document.querySelector('.page-spread.active');
    if (activePage) {
        activePage.scrollTop = 0;
        const pageElements = activePage.querySelectorAll('.page');
        pageElements.forEach(pageEl => {
            pageEl.scrollTop = 0;
        });
    }
}

// 터치 스와이프 기능
function initTouchSwipe() {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // 수평 스와이프가 수직 스와이프보다 클 때만 페이지 넘김
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // 오른쪽 스와이프 - 이전 페이지
                goToPage(currentPage - 1);
            } else {
                // 왼쪽 스와이프 - 다음 페이지
                goToPage(currentPage + 1);
            }
        }
    }
}

// 페이지 이동
function goToPage(pageNum) {
    if (pageNum < 0 || pageNum > totalPages) return;
    
    // 즉시 스크롤 최상단으로 (여러 방법 동시 사용)
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    currentPage = pageNum;
    showPage(pageNum);
    updateNavButtons();
    
    // 추가 보장
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 50);
}

// 페이지 표시
function showPage(pageNum) {
    // 즉시 스크롤 초기화 (페이지 전환 전)
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    pages.forEach((page, index) => {
        if (index === pageNum) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
    
    currentPageEl.textContent = pageNum;
    
    // 추가 스크롤 초기화
    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // 활성 페이지 내부도 초기화
        const activePage = document.querySelector('.page-spread.active');
        if (activePage) {
            const pageElements = activePage.querySelectorAll('.page');
            pageElements.forEach(pageEl => {
                pageEl.scrollTop = 0;
            });
            
            // 현재 페이지의 이미지만 로드
            loadPageImages(activePage);
        }
    });
}

// 페이지별 이미지 로드 - 필요할 때만
function loadPageImages(pageElement) {
    const images = pageElement.querySelectorAll('img[data-src]:not(.loaded)');
    
    // 한 번에 5개씩 로드 (서버 부하 방지)
    let loadedCount = 0;
    const batchSize = 5;
    
    function loadBatch(startIndex) {
        const endIndex = Math.min(startIndex + batchSize, images.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const img = images[i];
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                loadedCount++;
            }
        }
        
        // 더 로드할 이미지가 있으면 100ms 후에 다음 배치 로드
        if (endIndex < images.length) {
            setTimeout(() => loadBatch(endIndex), 100);
        }
    }
    
    loadBatch(0);
}

// 네비게이션 버튼 업데이트
function updateNavButtons() {
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages;
}

// 사진 컨트롤 초기화
function initPhotoControls() {
    const photoPages = document.querySelectorAll('.photo-page');
    
    photoPages.forEach(photoPage => {
        const slides = photoPage.querySelectorAll('.photo-slide');
        const prevPhotoBtn = photoPage.querySelector('.prev-photo');
        const nextPhotoBtn = photoPage.querySelector('.next-photo');
        
        if (!prevPhotoBtn || !nextPhotoBtn) return;
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        function showSlide(slideNum) {
            slides.forEach((slide, index) => {
                if (index === slideNum) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        }
        
        prevPhotoBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        });
        
        nextPhotoBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        });
        
        // 사진 클릭으로 라이트박스 열기
        slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img) {
                img.style.cursor = 'pointer';
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openLightbox(img.src, slides, index);
                });
            }
        });
        
        // 스와이프 지원 (터치)
        let touchStartX = 0;
        let touchEndX = 0;
        
        photoPage.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        photoPage.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                // 왼쪽 스와이프 - 다음 사진
                currentSlide = (currentSlide + 1) % totalSlides;
                showSlide(currentSlide);
            }
            if (touchEndX > touchStartX + 50) {
                // 오른쪽 스와이프 - 이전 사진
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                showSlide(currentSlide);
            }
        }
    });
}

// 라이트박스 기능
let lightboxImages = [];
let currentLightboxIndex = 0;

function openLightbox(imageSrc, slides, startIndex) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    // 모든 이미지 수집
    lightboxImages = [];
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            lightboxImages.push({
                src: img.src,
                alt: img.alt || '사진'
            });
        }
    });
    
    currentLightboxIndex = startIndex;
    showLightboxImage();
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showLightboxImage() {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    if (lightboxImages.length > 0) {
        const currentImage = lightboxImages[currentLightboxIndex];
        lightboxImg.src = currentImage.src;
        lightboxImg.alt = currentImage.alt;
        lightboxCaption.textContent = `${currentLightboxIndex + 1} / ${lightboxImages.length}`;
    }
}

function nextLightboxImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    showLightboxImage();
}

function prevLightboxImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    showLightboxImage();
}

// 라이트박스 이벤트 리스너
document.addEventListener('DOMContentLoaded', () => {
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightbox = document.getElementById('lightbox');
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            prevLightboxImage();
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            nextLightboxImage();
        });
    }
    
    // 배경 클릭 시 닫기
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // 키보드 단축키
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevLightboxImage();
            } else if (e.key === 'ArrowRight') {
                nextLightboxImage();
            }
        }
    });
});

// 이미지 Lazy Loading - 현재 페이지만 로드
function initLazyLoading() {
    const images = document.querySelectorAll('img');
    
    // 모든 이미지에 loading="lazy" 속성 추가하고 src 제거
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // 원본 src를 data 속성에 저장하고 src 제거 (로드 방지)
        if (img.src && !img.dataset.src) {
            img.dataset.src = img.src;
            img.removeAttribute('src');  // 즉시 로드 방지
        }
    });
}

// 초기화 실행
document.addEventListener('DOMContentLoaded', init);

// 페이지 로드 시 스크롤 최상단 보장
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
});

// 페이지 표시/숨김 시에도 스크롤 초기화
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
});
