#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
이미지 압축 스크립트
GitHub 업로드를 위해 이미지 파일 크기를 줄입니다.
"""

import os
from pathlib import Path
from PIL import Image
import shutil

def compress_image(image_path, output_path, quality=85, max_size=(1920, 1920)):
    """이미지 압축"""
    try:
        with Image.open(image_path) as img:
            # EXIF 정보 유지
            exif = img.info.get('exif', None)
            
            # RGB 모드로 변환
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # 크기 조정 (비율 유지)
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # 저장
            save_kwargs = {'quality': quality, 'optimize': True}
            if exif:
                save_kwargs['exif'] = exif
            
            img.save(output_path, **save_kwargs)
            return True
    except Exception as e:
        print(f"오류 발생 ({image_path}): {e}")
        return False

def get_folder_size(folder_path):
    """폴더 크기 계산 (MB)"""
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(folder_path):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            if os.path.exists(filepath):
                total_size += os.path.getsize(filepath)
    return total_size / (1024 * 1024)  # MB로 변환

def compress_album_images(data_dir='data', output_dir='data_compressed', quality=85):
    """앨범의 모든 이미지 압축"""
    
    data_path = Path(data_dir)
    output_path = Path(output_dir)
    
    if not data_path.exists():
        print(f"오류: '{data_dir}' 폴더를 찾을 수 없습니다.")
        return
    
    print("=" * 70)
    print("📸 이미지 압축 시작")
    print("=" * 70)
    print()
    
    # 원본 크기 확인
    original_size = get_folder_size(data_path)
    print(f"📊 원본 폴더 크기: {original_size:.2f} MB")
    print()
    
    # 출력 폴더 생성
    if output_path.exists():
        print("⚠️  압축 폴더가 이미 존재합니다. 삭제하고 다시 생성합니다...")
        shutil.rmtree(output_path)
    
    total_images = 0
    compressed_images = 0
    failed_images = 0
    
    # 모든 게시글 폴더 순회
    for post_dir in sorted(data_path.iterdir()):
        if not post_dir.is_dir():
            continue
        
        # 출력 폴더 구조 생성
        output_post_dir = output_path / post_dir.name
        output_post_dir.mkdir(parents=True, exist_ok=True)
        
        # article.txt 복사
        article_file = post_dir / 'article.txt'
        if article_file.exists():
            shutil.copy2(article_file, output_post_dir / 'article.txt')
        
        # screenshot.png 복사 (있으면)
        screenshot_file = post_dir / 'screenshot.png'
        if screenshot_file.exists():
            shutil.copy2(screenshot_file, output_post_dir / 'screenshot.png')
        
        # images 폴더 처리
        images_dir = post_dir / 'images'
        if images_dir.exists():
            output_images_dir = output_post_dir / 'images'
            output_images_dir.mkdir(exist_ok=True)
            
            for img_file in images_dir.iterdir():
                if img_file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif']:
                    total_images += 1
                    output_img_path = output_images_dir / img_file.name
                    
                    # PNG는 JPG로 변환
                    if img_file.suffix.lower() == '.png':
                        output_img_path = output_images_dir / f"{img_file.stem}.jpg"
                    
                    if compress_image(img_file, output_img_path, quality=quality):
                        compressed_images += 1
                        
                        # 크기 비교
                        original = os.path.getsize(img_file) / 1024
                        compressed = os.path.getsize(output_img_path) / 1024
                        reduction = ((original - compressed) / original) * 100
                        
                        if compressed_images % 50 == 0:
                            print(f"처리 중... {compressed_images}/{total_images} 완료")
                    else:
                        failed_images += 1
    
    # 압축 후 크기 확인
    compressed_size = get_folder_size(output_path)
    
    print()
    print("=" * 70)
    print("✅ 압축 완료!")
    print("=" * 70)
    print()
    print(f"📊 통계:")
    print(f"  - 총 이미지 수: {total_images}개")
    print(f"  - 성공: {compressed_images}개")
    print(f"  - 실패: {failed_images}개")
    print()
    print(f"💾 크기 변화:")
    print(f"  - 압축 전: {original_size:.2f} MB")
    print(f"  - 압축 후: {compressed_size:.2f} MB")
    print(f"  - 절감: {original_size - compressed_size:.2f} MB ({((original_size - compressed_size) / original_size * 100):.1f}%)")
    print()
    print(f"📁 압축된 파일 위치: {output_path.absolute()}")
    print()
    
    if compressed_size > 1000:
        print("⚠️  경고: 압축 후에도 1GB를 초과합니다!")
        print("   더 낮은 품질로 다시 압축하거나 일부 사진을 제거하세요.")
        print(f"   예: python compress_images.py --quality 70")
    elif compressed_size > 900:
        print("⚠️  주의: 압축 후 크기가 900MB 이상입니다.")
        print("   GitHub 제한(1GB)에 근접했습니다.")
    else:
        print("✅ GitHub 업로드 가능! (1GB 이하)")
    
    print()
    print("📌 다음 단계:")
    print("  1. data 폴더 대신 data_compressed 폴더를 GitHub에 업로드하세요")
    print("  2. album.html에서 data를 data_compressed로 변경하거나")
    print("  3. data_compressed를 data로 이름 변경 후 업로드하세요")
    print()

if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='앨범 이미지 압축')
    parser.add_argument('--quality', type=int, default=85, 
                        help='이미지 품질 (1-100, 기본값: 85, 낮을수록 파일 작음)')
    parser.add_argument('--input', default='data', 
                        help='입력 폴더 (기본값: data)')
    parser.add_argument('--output', default='data_compressed', 
                        help='출력 폴더 (기본값: data_compressed)')
    
    args = parser.parse_args()
    
    # PIL 설치 확인
    try:
        from PIL import Image
    except ImportError:
        print("❌ Pillow 라이브러리가 설치되지 않았습니다.")
        print("다음 명령으로 설치하세요:")
        print("  pip install Pillow")
        exit(1)
    
    compress_album_images(args.input, args.output, args.quality)
