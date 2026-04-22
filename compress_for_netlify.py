#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Netlify용 강력한 이미지 압축 스크립트
- 목표: 4.77GB → 1GB 이하
- 전략: 모든 이미지 리사이즈 + 품질 낮춤
"""

import os
from pathlib import Path
from PIL import Image
import shutil

# Netlify용 공격적 설정
MAX_SIZE = 800          # 최대 800px (더 작게)
JPEG_QUALITY = 70       # 품질 70% (더 낮게)
SKIP_THRESHOLD = 0      # 모든 이미지 압축

def compress_image(img_path):
    """단일 이미지 압축"""
    try:
        original_size = img_path.stat().st_size
        
        # 백업
        backup_dir = img_path.parent.parent / "images_original_backup"
        backup_dir.mkdir(exist_ok=True)
        backup_path = backup_dir / img_path.name
        
        if not backup_path.exists():
            shutil.copy2(img_path, backup_path)
        
        # 이미지 처리
        with Image.open(img_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            width, height = img.size
            
            # 항상 리사이즈 (모든 이미지를 800px 이하로)
            if width > MAX_SIZE or height > MAX_SIZE:
                if width > height:
                    new_size = (MAX_SIZE, int(height * MAX_SIZE / width))
                else:
                    new_size = (int(width * MAX_SIZE / height), MAX_SIZE)
                
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # 저장
            img.save(img_path, 'JPEG', quality=JPEG_QUALITY, optimize=True, progressive=True)
        
        new_size = img_path.stat().st_size
        reduction = ((original_size - new_size) / original_size) * 100 if original_size > 0 else 0
        return "ok", original_size, new_size, reduction
        
    except Exception as e:
        return f"error", 0, 0, 0

def main():
    data_dir = Path("data")
    
    print("=" * 70)
    print("[Netlify용 강력 압축 시작]")
    print("=" * 70)
    print("설정: 최대 800px, 품질 70%")
    print("목표: 4.77GB → 1GB 이하")
    print()
    
    # 이미지 수집
    all_images = []
    for post_dir in data_dir.iterdir():
        if post_dir.is_dir():
            images_dir = post_dir / "images"
            if images_dir.exists():
                all_images.extend(list(images_dir.glob("*.jpg")))
    
    total = len(all_images)
    print(f"전체 이미지: {total}개\n")
    
    processed = 0
    total_original = 0
    total_new = 0
    errors = 0
    
    for i, img_path in enumerate(all_images, 1):
        status, orig_size, new_size, reduction = compress_image(img_path)
        
        if status == "ok":
            processed += 1
            total_original += orig_size
            total_new += new_size
        else:
            errors += 1
        
        # 100개마다 진행상황 출력
        if i % 100 == 0:
            current_reduction = ((total_original - total_new) / total_original * 100) if total_original > 0 else 0
            print(f"  진행: {i}/{total} ({i*100//total}%) | 현재 절감률: {current_reduction:.1f}%")
    
    print()
    print("=" * 70)
    print("[압축 완료]")
    print("=" * 70)
    print(f"처리: {processed}개")
    print(f"에러: {errors}개")
    
    if total_original > 0:
        print(f"\n원본: {total_original/(1024**3):.2f} GB")
        print(f"압축 후: {total_new/(1024**3):.2f} GB")
        print(f"절감: {((total_original-total_new)/total_original)*100:.1f}%")
        print(f"\n예상 최종 크기: {(4.77 * (total_new/total_original)):.2f} GB")
    
    print("\n원본은 'images_original_backup'에 저장됨")
    print("=" * 70)

if __name__ == "__main__":
    main()
