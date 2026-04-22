#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
이미지 크기 확인 스크립트
"""

import os
from pathlib import Path

def check_image_sizes():
    data_dir = Path("data")
    
    total_size = 0
    image_count = 0
    large_images = []
    
    # 모든 이미지 파일 확인
    for post_dir in data_dir.iterdir():
        if not post_dir.is_dir():
            continue
            
        images_dir = post_dir / "images"
        if not images_dir.exists():
            continue
            
        for img_file in images_dir.glob("*.jpg"):
            size = img_file.stat().st_size
            total_size += size
            image_count += 1
            
            # 1MB 이상인 큰 이미지 기록
            if size > 1 * 1024 * 1024:
                large_images.append((img_file, size))
    
    # 결과 출력
    print("=" * 70)
    print("이미지 분석 결과")
    print("=" * 70)
    print(f"전체 이미지 개수: {image_count:,}개")
    print(f"전체 용량: {total_size / (1024**3):.2f} GB")
    print(f"평균 크기: {total_size / image_count / (1024**2):.2f} MB")
    print()
    print(f"1MB 이상 큰 이미지: {len(large_images):,}개")
    
    if large_images:
        print("\n가장 큰 이미지 10개:")
        large_images.sort(key=lambda x: x[1], reverse=True)
        for img_path, size in large_images[:10]:
            print(f"  {size / (1024**2):.2f} MB - {img_path.name}")
    
    print("=" * 70)
    
    return image_count, total_size, len(large_images)

if __name__ == "__main__":
    try:
        check_image_sizes()
    except Exception as e:
        print(f"[ERROR] {e}")
