// 썸네일 개수 관리
let currentThumbCount = parseInt(localStorage.getItem('thumbCount')) || 3;

document.addEventListener('DOMContentLoaded', function() {
    // 썸네일 옵션 버튼 초기화
    initThumbnailOptions();
    
    // 썸네일 그리드 생성
    generateThumbnailGrids();
    
    // 타임라인 애니메이션
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
});

function initThumbnailOptions() {
    const optionButtons = document.querySelectorAll('.thumb-option');
    
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
            
            // 썸네일 그리드 업데이트
            generateThumbnailGrids();
        });
    });
}

function generateThumbnailGrids() {
    const thumbnails = document.querySelectorAll('.post-thumbnail');
    
    thumbnails.forEach(thumbnail => {
        const img = thumbnail.querySelector('img');
        if (!img) return;
        
        const imgSrc = img.getAttribute('src');
        const imgAlt = img.getAttribute('alt') || '';
        
        // 이미지 경로에서 기본 경로 추출
        const basePath = imgSrc.replace(/image_\d+\.(jpg|jpeg|png|gif)$/i, '');
        const extension = imgSrc.match(/\.(jpg|jpeg|png|gif)$/i)?.[0] || '.jpg';
        
        // 상위 카드에서 총 이미지 개수 추출
        const postCard = thumbnail.closest('.post-card');
        const imageCountEl = postCard?.querySelector('.image-count');
        let totalImages = 50; // 기본값
        
        if (imageCountEl) {
            const match = imageCountEl.textContent.match(/(\d+)/);
            if (match) {
                totalImages = parseInt(match[1]);
            }
        }
        
        // 그리드 클래스 설정
        thumbnail.className = 'post-thumbnail grid-' + currentThumbCount;
        
        // 기존 내용 초기화
        thumbnail.innerHTML = '';
        
        // 표시할 이미지 개수 결정
        const displayCount = Math.min(currentThumbCount, totalImages);
        
        // 이미지 생성
        for (let i = 1; i <= currentThumbCount; i++) {
            const thumbDiv = document.createElement('div');
            thumbDiv.className = 'thumb-img';
            
            if (i <= displayCount) {
                const newImg = document.createElement('img');
                newImg.src = basePath + 'image_' + i + extension;
                newImg.alt = imgAlt + ' ' + i;
                newImg.loading = 'lazy';
                newImg.onerror = function() {
                    // 이미지 로드 실패 시 첫 번째 이미지로 대체
                    this.src = basePath + 'image_1' + extension;
                    this.onerror = function() {
                        this.parentElement.classList.add('placeholder');
                        this.style.display = 'none';
                    };
                };
                thumbDiv.appendChild(newImg);
            } else {
                thumbDiv.classList.add('placeholder');
            }
            
            thumbnail.appendChild(thumbDiv);
        }
    });
}

// 라이트박스 기능
if (document.querySelector('.gallery-item')) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentIndex = index;
            showLightbox();
        });
    });
    
    function showLightbox() {
        const currentItem = galleryItems[currentIndex];
        const img = currentItem.querySelector('img');
        lightboxImg.src = img.src;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // 닫기 버튼
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    
    // 이전 이미지
    document.querySelector('.lightbox-prev').addEventListener('click', function(e) {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        showLightbox();
    });
    
    // 다음 이미지
    document.querySelector('.lightbox-next').addEventListener('click', function(e) {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % galleryItems.length;
        showLightbox();
    });
    
    // 배경 클릭 시 닫기
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // 키보드 단축키
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                showLightbox();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % galleryItems.length;
                showLightbox();
            }
        }
    });
}

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
