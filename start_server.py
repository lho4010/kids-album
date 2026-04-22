#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
성장 앨범 웹 서버
로컬 네트워크에서 접속 가능한 웹 서버를 실행합니다.
"""

import http.server
import socketserver
import socket
import webbrowser
import os
import sys
from socketserver import ThreadingMixIn

# 포트 번호 설정
PORT = 8080

# 멀티스레드 서버 클래스 (동시 요청 처리 가능)
class ThreadingHTTPServer(ThreadingMixIn, socketserver.TCPServer):
    # 포트 재사용 허용 (서버 재시작 시 포트 충돌 방지)
    allow_reuse_address = True
    # 데몬 스레드 사용 (메인 스레드 종료 시 자동 정리)
    daemon_threads = True

# 현재 디렉토리로 이동
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS 헤더 추가 (외부 접속 허용)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def log_message(self, format, *args):
        # 접속 로그 출력
        print(f"[접속] {self.address_string()} - {format % args}")

def get_local_ip():
    """로컬 IP 주소 가져오기"""
    try:
        # 임시 소켓을 만들어서 로컬 IP 확인
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

def main():
    # 포트가 이미 사용 중인지 확인
    try:
        with ThreadingHTTPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            local_ip = get_local_ip()
            
            print("=" * 70)
            print("[OK] 성장 앨범 웹 서버가 시작되었습니다!")
            print("=" * 70)
            print()
            print("[로컬] 이 컴퓨터에서 접속:")
            print(f"   http://localhost:{PORT}/album.html")
            print()
            print("[네트워크] 같은 네트워크의 다른 기기에서 접속:")
            print(f"   http://{local_ip}:{PORT}/album.html")
            print()
            print("[INFO] 사용 방법:")
            print("   1. 같은 Wi-Fi에 연결된 스마트폰, 태블릿에서 위 주소로 접속하세요")
            print("   2. 외부 인터넷에서 접속하려면 포트포워딩 또는 ngrok 사용이 필요합니다")
            print()
            print("[주의] 주의사항:")
            print("   - 방화벽에서 포트를 허용해야 할 수 있습니다")
            print("   - 서버를 종료하려면 Ctrl+C를 누르세요")
            print("=" * 70)
            print()
            
            # 브라우저 자동 열기
            try:
                webbrowser.open(f"http://localhost:{PORT}/album.html")
                print("[OK] 기본 브라우저가 자동으로 열렸습니다!")
            except:
                print("[주의] 브라우저를 수동으로 열어주세요")
            
            print()
            print("[실행중] 서버 실행 중... (종료하려면 Ctrl+C)")
            print()
            
            # 서버 실행
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 10048 or e.errno == 48:  # Address already in use
            print(f"[ERROR] 오류: 포트 {PORT}가 이미 사용 중입니다.")
            print(f"[INFO] 해결 방법:")
            print(f"   1. 다른 프로그램이 포트 {PORT}를 사용하고 있는지 확인하세요")
            print(f"   2. 또는 이 스크립트의 PORT 변수를 다른 번호로 변경하세요 (예: 8081, 8082)")
        else:
            print(f"[ERROR] 오류 발생: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n")
        print("=" * 70)
        print("[종료] 서버가 종료되었습니다. 안녕히 가세요!")
        print("=" * 70)
        sys.exit(0)

if __name__ == "__main__":
    main()
