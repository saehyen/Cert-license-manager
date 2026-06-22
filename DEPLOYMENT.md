# 클라우드 리눅스 서버 배포 가이드

이 가이드는 클라우드 리눅스 서버에 SSL 인증서 & 라이센스 관리 시스템을 배포하는 방법을 설명합니다.

## 📋 사전 요구사항

- Ubuntu 20.04+ 또는 CentOS 7+ 리눅스 서버
- 루트 또는 sudo 권한
- 도메인 (선택사항, 없으면 IP로 접근)

## 🚀 배포 순서

### 1단계: 서버 기본 설정

```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# 필수 패키지 설치
sudo apt install -y curl git nginx
```

### 2단계: Node.js 설치

```bash
# Node.js 20.x 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 설치 확인
node --version
npm --version
```

### 3단계: MySQL 설치 및 설정

```bash
# MySQL 설치
sudo apt install -y mysql-server

# MySQL 보안 설정
sudo mysql_secure_installation

# MySQL 접속
sudo mysql

# MySQL 명령어 (MySQL 프롬프트에서 실행)
CREATE USER 'certmanager'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON cert_license_db.* TO 'certmanager'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4단계: 애플리케이션 배포

```bash
# 작업 디렉토리 생성
sudo mkdir -p /var/www/cert-license-manager
sudo chown -R $USER:$USER /var/www/cert-license-manager
cd /var/www/cert-license-manager

# 프로젝트 파일 업로드 (SCP 또는 Git 사용)
# 방법 1: Git 사용
git clone <your-repository-url> .

# 방법 2: SCP로 로컬에서 서버로 업로드
# 로컬 PC에서 실행:
# scp -r cert-license-manager/* user@server-ip:/var/www/cert-license-manager/
```

### 5단계: 데이터베이스 초기화

```bash
# init-db.sql 실행
mysql -u root -p < /var/www/cert-license-manager/backend/init-db.sql
```

### 6단계: 백엔드 설정

```bash
# 백엔드 디렉토리로 이동
cd /var/www/cert-license-manager/backend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
nano .env

# .env 파일 내용 (실제 값으로 수정):
# PORT=5000
# DB_HOST=localhost
# DB_USER=certmanager
# DB_PASSWORD=your_strong_password
# DB_NAME=cert_license_db
```

### 7단계: 프론트엔드 빌드

```bash
# 프론트엔드 디렉토리로 이동
cd /var/www/cert-license-manager

# 환경 변수 설정
cp .env.example .env
nano .env

# .env 파일 내용 (서버 IP 또는 도메인으로 수정):
# VITE_API_URL=http://your-server-ip:11050/api
# 또는
# VITE_API_URL=http://your-domain.com/api

# 의존성 설치
npm install

# 프로덕션 빌드
npm run build
```

### 8단계: PM2로 백엔드 실행 (프로세스 관리)

```bash
# PM2 전역 설치
sudo npm install -g pm2

# 백엔드 시작
cd /var/www/cert-license-manager/backend
pm2 start server.js --name cert-license-backend

# PM2 자동 시작 설정
pm2 startup
pm2 save

# PM2 상태 확인
pm2 status
pm2 logs cert-license-backend
```

### 9단계: Nginx 웹 서버 설정

```bash
# Nginx 설정 파일 생성
sudo nano /etc/nginx/sites-available/cert-license-manager
```

**Nginx 설정 파일 내용:**

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 또는 서버 IP

    # Frontend (React 빌드 파일)
    location / {
        root /var/www/cert-license-manager/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:11050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Nginx 활성화:**

```bash
# 설정 파일 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/cert-license-manager /etc/nginx/sites-enabled/

# 기본 설정 제거 (선택사항)
sudo rm /etc/nginx/sites-enabled/default

# Nginx 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

### 10단계: 방화벽 설정

```bash
# UFW 방화벽 설정 (Ubuntu)
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```

### 11단계: SSL 인증서 설치 (HTTPS - 선택사항)

```bash
# Certbot 설치
sudo apt install -y certbot python3-certbot-nginx

# SSL 인증서 발급 및 자동 설정
sudo certbot --nginx -d your-domain.com

# 자동 갱신 테스트
sudo certbot renew --dry-run
```

## 🔄 업데이트 및 유지보수

### 애플리케이션 업데이트

```bash
cd /var/www/cert-license-manager

# Git에서 최신 코드 가져오기
git pull

# 프론트엔드 재빌드
npm install
npm run build

# 백엔드 재시작
cd backend
npm install
pm2 restart cert-license-backend
```

### 백업

```bash
# 데이터베이스 백업
mysqldump -u certmanager -p cert_license_db > backup_$(date +%Y%m%d).sql

# 백업 자동화 (crontab)
sudo crontab -e

# 매일 새벽 2시에 백업 (crontab에 추가)
0 2 * * * mysqldump -u certmanager -pyour_password cert_license_db > /var/backups/cert_license_$(date +\%Y\%m\%d).sql
```

### 로그 확인

```bash
# PM2 로그
pm2 logs cert-license-backend

# Nginx 로그
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MySQL 로그
sudo tail -f /var/log/mysql/error.log
```

## 🔒 보안 권장사항

1. **강력한 비밀번호 사용**
   - MySQL 사용자 비밀번호를 강력하게 설정

2. **방화벽 설정**
   - MySQL 포트(3306)는 외부 접근 차단
   - SSH 포트 변경 권장

3. **정기 업데이트**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **백업 자동화**
   - 데이터베이스 정기 백업 설정

5. **HTTPS 사용**
   - SSL 인증서 설치 (Let's Encrypt 무료)

## 📊 접속 확인

- **웹 브라우저에서 접속**: `http://your-server-ip` 또는 `http://your-domain.com`
- **API 테스트**: `http://your-server-ip/api/health`

## 🆘 트러블슈팅

### 백엔드가 시작되지 않을 때
```bash
pm2 logs cert-license-backend
# 로그에서 에러 메시지 확인
```

### 데이터베이스 연결 실패
```bash
# MySQL 실행 여부 확인
sudo systemctl status mysql

# 연결 테스트
mysql -u certmanager -p cert_license_db
```

### Nginx 오류
```bash
# Nginx 설정 테스트
sudo nginx -t

# Nginx 로그 확인
sudo tail -f /var/log/nginx/error.log
```

## 📝 체크리스트

- [ ] Node.js 설치
- [ ] MySQL 설치 및 데이터베이스 생성
- [ ] 프로젝트 파일 업로드
- [ ] 백엔드 .env 설정
- [ ] 프론트엔드 .env 설정
- [ ] 프론트엔드 빌드
- [ ] PM2로 백엔드 실행
- [ ] Nginx 설정 및 재시작
- [ ] 방화벽 설정
- [ ] 웹 브라우저 접속 테스트
- [ ] SSL 인증서 설치 (선택)

## 💡 참고 사항

- 프로덕션 환경에서는 `.env` 파일의 비밀번호를 강력하게 설정하세요
- 정기적으로 데이터베이스를 백업하세요
- PM2 대시보드로 모니터링: `pm2 monit`
