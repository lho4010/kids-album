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

// 썸네일 설정
let currentThumbCount = parseInt(localStorage.getItem('thumbCount')) || 3;

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
    
    // 썸네일 옵션 버튼 초기화
    initThumbOptions();
    
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
    
    // 이전 페이지의 이미지 언로드 (메모리 절약)
    const previousActivePage = document.querySelector('.page-spread.active');
    if (previousActivePage) {
        unloadPageImages(previousActivePage);
    }
    
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

// 페이지별 이미지 로드 - 현재 보이는 것만 (최대 10개 제한)
function loadPageImages(pageElement) {
    const images = pageElement.querySelectorAll('img[data-src]:not(.loaded)');
    
    // 최대 10개까지만 로드 (대역폭 절약)
    const maxLoad = 10;
    const loadCount = Math.min(maxLoad, images.length);
    
    // 처음 3개만 즉시 로드 (빠른 표시)
    const initialLoad = 3;
    for (let i = 0; i < Math.min(initialLoad, loadCount); i++) {
        const img = images[i];
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        }
    }
    
    // 나머지 7개는 Intersection Observer로 (최대 10개까지만)
    if (loadCount > initialLoad && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src && !img.classList.contains('loaded')) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'  // 뷰포트 50px 전에 미리 로드
        });
        
        // 최대 10개까지만 관찰
        for (let i = initialLoad; i < loadCount; i++) {
            imageObserver.observe(images[i]);
        }
    }
    
    // 나머지 이미지는 "더 보기" 버튼으로 수동 로드
    if (images.length > maxLoad) {
        addLoadMoreButton(pageElement, images, maxLoad);
    }
}

// "더 보기" 버튼 추가
function addLoadMoreButton(pageElement, images, startIndex) {
    // 기존 버튼 제거
    const existingBtn = pageElement.querySelector('.load-more-btn');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // 새 버튼 생성
    const photoViewer = pageElement.querySelector('.photo-viewer');
    if (!photoViewer) return;
    
    const btn = document.createElement('button');
    btn.className = 'load-more-btn';
    btn.textContent = `나머지 ${images.length - startIndex}개 사진 더 보기`;
    btn.style.cssText = 'position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); padding: 10px 20px; background: #ff69b4; color: white; border: none; border-radius: 20px; cursor: pointer; font-size: 14px; z-index: 100;';
    
    btn.onclick = () => {
        // 나머지 이미지 모두 로드
        for (let i = startIndex; i < images.length; i++) {
            const img = images[i];
            if (img.dataset.src && !img.classList.contains('loaded')) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            }
        }
        btn.remove();
    };
    
    photoViewer.appendChild(btn);
}

// 페이지 언로드 - 메모리 절약
function unloadPageImages(pageElement) {
    const images = pageElement.querySelectorAll('img.loaded');
    images.forEach(img => {
        if (img.dataset.src) {
            img.removeAttribute('src');
            img.classList.remove('loaded');
        }
    });
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
    
    // 모든 이미지 수집 (고화질 버전 사용)
    lightboxImages = [];
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            lightboxImages.push({
                src: img.dataset.fullsize || img.src,  // 고화질 또는 원본
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
    // 아무것도 하지 않음 (HTML에서 이미 data-src로 설정됨)
    // 페이지별로 필요할 때만 로드
}

// 썸네일 옵션 초기화
function initThumbOptions() {
    const thumbBtns = document.querySelectorAll('.thumb-btn');
    
    // 저장된 값으로 활성 버튼 설정
    thumbBtns.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.count) === currentThumbCount) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => {
            const count = parseInt(btn.dataset.count);
            currentThumbCount = count;
            localStorage.setItem('thumbCount', count);
            
            // 버튼 활성화 상태 변경
            thumbBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 썸네일 업데이트
            generateTocThumbnails();
        });
    });
    
    // 초기 썸네일 생성
    generateTocThumbnails();
}

// 목차 썸네일 생성
function generateTocThumbnails() {
    allTocItems.forEach(item => {
        const dateEl = item.querySelector('.toc-date');
        const titleEl = item.querySelector('.toc-title-text');
        
        if (!dateEl || !titleEl) return;
        
        const dateCode = dateEl.textContent.trim();
        const title = titleEl.textContent.trim();
        const folderName = dateCode + '_' + title;
        
        // 기존 썸네일 제거
        const existingThumbs = item.querySelector('.toc-thumbnails');
        if (existingThumbs) {
            existingThumbs.remove();
        }
        
        // 썸네일 0개면 스킵
        if (currentThumbCount === 0) return;
        
        // 썸네일 컨테이너 생성
        const thumbContainer = document.createElement('div');
        thumbContainer.className = 'toc-thumbnails grid-' + currentThumbCount;
        
        // 이미지 생성
        for (let i = 1; i <= currentThumbCount; i++) {
            const img = document.createElement('img');
            img.src = 'data/thumbnails/' + folderName + '/images/image_' + i + '.jpg';
            img.alt = title + ' - ' + i;
            img.loading = 'lazy';
            img.onerror = function() {
                // 로드 실패 시 첫 번째 이미지로 대체 시도
                if (i !== 1) {
                    this.src = 'data/thumbnails/' + folderName + '/images/image_1.jpg';
                }
                this.onerror = function() {
                    this.style.display = 'none';
                };
            };
            thumbContainer.appendChild(img);
        }
        
        // 목차 아이템 맨 앞에 삽입
        item.insertBefore(thumbContainer, item.firstChild);
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
