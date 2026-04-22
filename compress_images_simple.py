#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
간단한 이미지 압축 스크립트
"""

import os
from pathlib import Path
from PIL import Image
import shutil

# 설정
MAX_SIZE = 1200
JPEG_QUALITY = 85
MIN_FILE_SIZE = 300 * 1024

def compress_image(img_path):
    """단일 이미지 압축"""
    try:
        original_size = img_path.stat().st_size
        
        # 300KB 이하면 스킵
        if original_size < MIN_FILE_SIZE:
            return "skip", original_size, original_size
        
        # 백업
        backup_dir = img_path.parent.parent / "images_backup"
        backup_dir.mkdir(exist_ok=True)
        backup_path = backup_dir / img_path.name
        
        if not backup_path.exists():
            shutil.copy2(img_path, backup_path)
        
        # 이미지 처리
        with Image.open(img_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            width, height = img.size
            if width > MAX_SIZE or height > MAX_SIZE:
                if width > height:
                    new_size = (MAX_SIZE, int(height * MAX_SIZE / width))
                else:
                    new_size = (int(width * MAX_SIZE / height), MAX_SIZE)
                
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            img.save(img_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)
        
        new_size = img_path.stat().st_size
        return "ok", original_size, new_size
        
    except Exception as e:
        return f"error:{e}", 0, 0

def main():
    data_dir = Path("data")
    
    print("=" * 70)
    print("[이미지 압축 시작]")
    print("=" * 70)
    
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
    skipped = 0
    errors = 0
    total_original = 0
    total_new = 0
    
    for i, img_path in enumerate(all_images, 1):
        status, orig_size, new_size = compress_image(img_path)
        
        if status == "skip":
            skipped += 1
        elif status == "ok":
            processed += 1
            total_original += orig_size
            total_new += new_size
        else:
            errors += 1
        
        # 100개마다 진행상황 출력
        if i % 100 == 0:
            print(f"  진행: {i}/{total} ({i*100//total}%)")
    
    print()
    print("=" * 70)
    print("[압축 완료]")
    print("=" * 70)
    print(f"압축됨: {processed}개")
    print(f"스킵: {skipped}개")
    print(f"에러: {errors}개")
    
    if total_original > 0:
        print(f"\n원본: {total_original/(1024**3):.2f} GB")
        print(f"압축 후: {total_new/(1024**3):.2f} GB")
        print(f"절감: {((total_original-total_new)/total_original)*100:.1f}%")
    
    print("\n원본은 각 폴더의 'images_backup'에 저장됨")
    print("=" * 70)

if __name__ == "__main__":
    main()
