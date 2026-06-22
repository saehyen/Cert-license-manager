# ⚡ 빠른 시작 가이드

## 🪟 Windows에서 실행 (추천)

### 빠른 시작

```powershell
# 1. 자동 설정
cd c:\kiro\cert-license-manager
.\setup-windows.ps1

# 2. 실행
.\start-windows.ps1
```

📖 상세 가이드: [WINDOWS_SETUP_GUIDE.md](./WINDOWS_SETUP_GUIDE.md)

---

## 🎯 클라우드 리눅스 서버 배포 (프로덕션)

### 준비물
- ✅ Ubuntu 20.04+ 리눅스 서버
- ✅ 루트 권한
- ✅ 도메인 (선택사항)

### 3분 만에 배포하기

```bash
# 1. 필수 패키지 설치
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs mysql-server nginx git

# 2. MySQL 설정
sudo mysql_secure_installation
sudo mysql -e "CREATE USER 'certmanager'@'localhost' IDENTIFIED BY 'StrongPassword123!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON cert_license_db.* TO 'certmanager'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 3. 프로젝트 다운로드
cd /var/www
sudo mkdir cert-license-manager
sudo chown -R $USER:$USER cert-license-manager
cd cert-license-manager
# 여기에 프로젝트 파일 업로드

# 4. 데이터베이스 초기화
mysql -u root -p < backend/init-db.sql

# 5. 백엔드 설정
cd backend
npm install
cp .env.example .env
nano .env  # DB 비밀번호 입력

# 6. 프론트엔드 빌드
cd ..
npm install
npm run build

# 7. PM2로 백엔드 실행
sudo npm install -g pm2
cd backend
pm2 start server.js --name cert-manager
pm2 startup
pm2 save

# 8. Nginx 설정
sudo nano /etc/nginx/sites-available/cert-manager
# (아래 Nginx 설정 복사)
sudo ln -s /etc/nginx/sites-available/cert-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 9. 방화벽 설정
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Nginx 설정 (복사하세요)
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 또는 서버 IP

    location / {
        root /var/www/cert-license-manager/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 완료! 🎉
브라우저에서 `http://서버IP` 접속

---

## 💻 로컬 개발 환경 (테스트용)

### Windows/Mac 모두 동일

```bash
# 1. MySQL 설치
# Windows: https://dev.mysql.com/downloads/mysql/
# Mac: brew install mysql

# 2. 데이터베이스 초기화
mysql -u root -p < backend/init-db.sql

# 3. 백엔드 실행 (터미널 1)
cd backend
npm install
cp .env.example .env
# .env 파일에서 DB 비밀번호 설정
npm run dev

# 4. 프론트엔드 실행 (터미널 2)
cd ..
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 자동으로 열림

---

## 🐳 Docker로 간편 실행 (개발용)

```bash
# docker-compose.yml이 있는 경우
docker-compose up -d
```

브라우저에서 `http://localhost` 접속

---

## 📝 .env 파일 예시

### 백엔드 (backend/.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=certmanager
DB_PASSWORD=StrongPassword123!
DB_NAME=cert_license_db
```

### 프론트엔드 (.env)
```env
# 개발 환경
VITE_API_URL=http://localhost:5000/api

# 프로덕션 환경
VITE_API_URL=http://your-domain.com/api
```

---

## 🔧 자주 사용하는 명령어

```bash
# PM2 관리
pm2 status                    # 상태 확인
pm2 logs cert-manager         # 로그 보기
pm2 restart cert-manager      # 재시작
pm2 stop cert-manager         # 중지

# MySQL
sudo systemctl status mysql   # 상태 확인
mysql -u root -p              # 접속

# Nginx
sudo nginx -t                 # 설정 테스트
sudo systemctl restart nginx  # 재시작

# 백업
mysqldump -u root -p cert_license_db > backup.sql
```

---

## ⚠️ 트러블슈팅

### "백엔드 연결 실패"
1. 백엔드가 실행 중인지 확인: `pm2 status`
2. 로그 확인: `pm2 logs`
3. MySQL 실행 확인: `sudo systemctl status mysql`

### "MySQL 연결 오류"
```bash
# MySQL 재시작
sudo systemctl restart mysql

# 비밀번호 재설정
sudo mysql
ALTER USER 'certmanager'@'localhost' IDENTIFIED BY 'NewPassword123!';
FLUSH PRIVILEGES;
```

### "Nginx 502 Bad Gateway"
```bash
# 백엔드 실행 확인
pm2 status

# Nginx 로그 확인
sudo tail -f /var/log/nginx/error.log
```

---

## 📚 더 자세한 문서

- **전체 배포 가이드**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **데이터베이스 선택**: [DATABASE_CHOICE.md](./DATABASE_CHOICE.md)
- **기능 설명**: [README.md](./README.md)

---

## 💡 팁

### SSL 인증서 설치 (무료)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 자동 백업 설정
```bash
sudo crontab -e
# 매일 새벽 2시 백업
0 2 * * * mysqldump -u certmanager -p'YourPassword' cert_license_db > /var/backups/db_$(date +\%Y\%m\%d).sql
```

### 모니터링 대시보드
```bash
pm2 install pm2-logrotate
pm2 monit
```

---

## 🚀 프로덕션 체크리스트

- [ ] MySQL 강력한 비밀번호 설정
- [ ] .env 파일 보안 설정 (권한 600)
- [ ] 방화벽 설정 (MySQL 포트 외부 차단)
- [ ] SSL 인증서 설치 (HTTPS)
- [ ] PM2 자동 시작 설정
- [ ] 백업 자동화 설정
- [ ] Nginx 로그 로테이션 설정
- [ ] 서버 모니터링 설정

---

## 🎯 빠른 테스트

배포 후 다음을 확인하세요:

1. ✅ 웹페이지 열림: `http://서버IP`
2. ✅ API 응답: `http://서버IP/api/health`
3. ✅ 인증서 목록 조회됨
4. ✅ 인증서 추가/수정/삭제 동작
5. ✅ 라이센스 관리 동작
6. ✅ 다크모드 전환 동작
7. ✅ 검색 및 정렬 동작

---

**문제가 있나요?** 
- 로그 확인: `pm2 logs`
- MySQL 확인: `sudo systemctl status mysql`
- Nginx 확인: `sudo nginx -t`

**모든 것이 정상이라면 축하합니다! 🎉**
