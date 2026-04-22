#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
이미지 최적화 스크립트
- 큰 이미지 리사이즈
- JPEG 품질 최적화
- 빠른 처리를 위한 멀티프로세싱
"""

import os
from pathlib import Path
from PIL import Image
import shutil
from concurrent.futures import ProcessPoolExecutor, as_completed
import sys

# 설정
MAX_SIZE = 1200  # 최대 가로/세로 크기 (픽셀)
JPEG_QUALITY = 85  # JPEG 품질 (85%는 육안으로 거의 차이 없음)
MIN_FILE_SIZE = 300 * 1024  # 300KB 이상인 파일만 압축

def compress_image(img_path):
    """단일 이미지 압축"""
    try:
        # 파일 크기 확인
        original_size = img_path.stat().st_size
        
        # 300KB 이하면 스킵
        if original_size < MIN_FILE_SIZE:
            return img_path.name, original_size, original_size, "skip"
        
        # 백업 폴더 생성
        backup_dir = img_path.parent.parent / "images_backup"
        backup_dir.mkdir(exist_ok=True)
        
        # 원본 백업 (첫 번째만)
        backup_path = backup_dir / img_path.name
        if not backup_path.exists():
            shutil.copy2(img_path, backup_path)
        
        # 이미지 열기
        img = Image.open(img_path)
        
        # RGB로 변환 (RGBA, P 등 처리)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # 리사이즈 (긴 쪽이 MAX_SIZE보다 크면)
        width, height = img.size
        if width > MAX_SIZE or height > MAX_SIZE:
            if width > height:
                new_width = MAX_SIZE
                new_height = int(height * MAX_SIZE / width)
            else:
                new_height = MAX_SIZE
                new_width = int(width * MAX_SIZE / height)
            
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # 저장 (최적화 옵션 적용)
        img.save(
            img_path,
            'JPEG',
            quality=JPEG_QUALITY,
            optimize=True,
            progressive=True  # Progressive JPEG (웹 로딩 빠름)
        )
        
        new_size = img_path.stat().st_size
        reduction = ((original_size - new_size) / original_size) * 100
        
        return img_path.name, original_size, new_size, f"ok:{reduction:.1f}%"
        
    except Exception as e:
        return img_path.name, 0, 0, f"error:{str(e)}"

def main():
    data_dir = Path("data")
    
    # 모든 이미지 파일 수집
    all_images = []
    for post_dir in data_dir.iterdir():
        if not post_dir.is_dir():
            continue
        
        images_dir = post_dir / "images"
        if images_dir.exists():
            all_images.extend(list(images_dir.glob("*.jpg")))
    
    print("=" * 70)
    print("[이미지 최적화 시작]")
    print("=" * 70)
    print(f"전체 이미지: {len(all_images):,}개")
    print(f"설정: 최대 크기 {MAX_SIZE}px, 품질 {JPEG_QUALITY}%")
    print(f"최소 파일 크기: {MIN_FILE_SIZE // 1024}KB 이상만 압축")
    print()
    print("처리 중...")
    print()
    
    # 멀티프로세싱으로 빠르게 처리
    processed = 0
    skipped = 0
    errors = 0
    total_original = 0
    total_new = 0
    
    with ProcessPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(compress_image, img): img for img in all_images}
        
        for future in as_completed(futures):
            name, orig_size, new_size, status = future.result()
            processed += 1
            
            if status == "skip":
                skipped += 1
            elif status.startswith("error"):
                errors += 1
                print(f"[ERROR] {name}: {status}")
            else:
                total_original += orig_size
                total_new += new_size
            
            # 진행률 표시
            if processed % 100 == 0:
                progress = (processed / len(all_images)) * 100
                print(f"  진행: {processed:,}/{len(all_images):,} ({progress:.1f}%)")
    
    # 최종 결과
    print()
    print("=" * 70)
    print("[압축 완료]")
    print("=" * 70)
    print(f"처리됨: {processed - skipped - errors:,}개")
    print(f"스킵: {skipped:,}개 (300KB 이하)")
    print(f"에러: {errors}개")
    
    if total_original > 0:
        print()
        print(f"원본 크기: {total_original / (1024**3):.2f} GB")
        print(f"압축 후: {total_new / (1024**3):.2f} GB")
        print(f"절감: {((total_original - total_new) / total_original) * 100:.1f}%")
    
    print()
    print("[주의] 원본 이미지는 각 폴더의 'images_backup'에 저장되었습니다")
    print("=" * 70)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n[중단됨] 사용자가 작업을 중단했습니다")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] {e}")
        sys.exit(1)
