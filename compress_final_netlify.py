#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Netlify 최종 압축 스크립트
목표: 1GB → 500~600MB
"""

import os
from pathlib import Path
from PIL import Image

# 최종 압축 설정
MAX_SIZE = 600          # 최대 600px
JPEG_QUALITY = 60       # 품질 60%

def compress_image(img_path):
    """이미지 압축"""
    try:
        original_size = img_path.stat().st_size
        
        with Image.open(img_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            width, height = img.size
            
            # 600px 이하로 리사이즈
            if width > MAX_SIZE or height > MAX_SIZE:
                if width > height:
                    new_size = (MAX_SIZE, int(height * MAX_SIZE / width))
                else:
                    new_size = (int(width * MAX_SIZE / height), MAX_SIZE)
                
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # 저장
            img.save(img_path, 'JPEG', quality=JPEG_QUALITY, optimize=True, progressive=True)
        
        new_size = img_path.stat().st_size
        return "ok", original_size, new_size
        
    except Exception as e:
        return "error", 0, 0

def main():
    data_dir = Path("data")
    
    print("=" * 70)
    print("[Netlify 최종 압축]")
    print("=" * 70)
    print(f"설정: 최대 {MAX_SIZE}px, 품질 {JPEG_QUALITY}%")
    print(f"목표: 1GB → 500~600MB")
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
    
    for i, img_path in enumerate(all_images, 1):
        status, orig_size, new_size = compress_image(img_path)
        
        if status == "ok":
            processed += 1
            total_original += orig_size
            total_new += new_size
        
        # 100개마다 진행상황
        if i % 100 == 0:
            reduction = ((total_original - total_new) / total_original * 100) if total_original > 0 else 0
            print(f"  진행: {i}/{total} ({i*100//total}%) | 절감률: {reduction:.1f}%")
    
    print()
    print("=" * 70)
    print("[완료]")
    print("=" * 70)
    print(f"처리: {processed}개")
    print(f"\n원본: {total_original/(1024**3):.2f} GB")
    print(f"압축 후: {total_new/(1024**3):.2f} GB")
    print(f"절감: {((total_original-total_new)/total_original)*100:.1f}%")
    print("=" * 70)

if __name__ == "__main__":
    main()
