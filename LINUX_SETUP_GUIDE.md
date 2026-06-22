# 🐧 Linux 설치 및 실행 가이드

Linux 서버에서 SSL 인증서 & 라이센스 관리 시스템을 설치하고 실행하는 가이드입니다.

---

## 📋 지원 운영체제

- Ubuntu 20.04 / 22.04 / 24.04
- Debian 11 / 12
- CentOS 7 / 8
- Rocky Linux 8 / 9
- 기타 Linux 배포판

---

## 🚀 빠른 시작 (자동 설치)

### 1단계: 프로젝트 다운로드

#### GitHub에서 Clone
```bash
git clone https://github.com/YOUR_USERNAME/cert-license-manager.git
cd cert-license-manager
```

#### 또는 ZIP 다운로드
```bash
wget https://github.com/YOUR_USERNAME/cert-license-manager/archive/refs/heads/main.zip
unzip main.zip
cd cert-license-manager-main
```

### 2단계: 자동 설정

```bash
chmod +x setup-linux.sh
./setup-linux.sh
```

**이 스크립트가 자동으로:**
- ✅ Node.js 확인 및 설치
- ✅ MySQL 확인 및 설치
- ✅ 의존성 설치 (npm install)
- ✅ 환경 변수 설정 (.env 파일 생성)
- ✅ 데이터베이스 초기화

### 3단계: 실행

```bash
chmod +x start-linux.sh
./start-linux.sh
```

**자동으로:**
- 백엔드 서버 시작
- 프론트엔드 서버 시작
- 브라우저 열기 (GUI 환경)

### 완료! 🎉
**http://서버IP:13000** 에서 확인

---

## 📦 수동 설치 (Ubuntu/Debian)

### 1단계: 시스템 업데이트

```bash
sudo apt update
sudo apt upgrade -y
```

### 2단계: Node.js 설치

```bash
# Node.js 20.x 저장소 추가
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js 설치
sudo apt install -y nodejs

# 확인
node --version  # v20.x.x
npm --version   # 10.x.x
```

### 3단계: MySQL 설치

```bash
# MySQL 서버 설치
sudo apt install -y mysql-server

# MySQL 서비스 시작
sudo systemctl start mysql
sudo systemctl enable mysql

# 보안 설정
sudo mysql_secure_installation
```

MySQL 보안 설정:
```
- Set root password: Y (비밀번호 설정)
- Remove anonymous users: Y
- Disallow root login remotely: Y
- Remove test database: Y
- Reload privilege tables: Y
```

### 4단계: 프로젝트 다운로드

```bash
# GitHub에서 clone
git clone https://github.com/YOUR_USERNAME/cert-license-manager.git
cd cert-license-manager
```

### 5단계: 의존성 설치

```bash
# 프론트엔드
npm install

# 백엔드
cd backend
npm install
cd ..
```

### 6단계: 환경 변수 설정

```bash
# 백엔드 설정
cd backend
cp .env.example .env
nano .env
```

`.env` 파일 내용:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cert_license_db
```

```bash
# 프론트엔드 설정
cd ..
cp .env.example .env
nano .env
```

`.env` 파일 내용:
```
VITE_API_URL=http://localhost:11050/api
```

### 7단계: 데이터베이스 초기화

```bash
mysql -u root -p < backend/init-db.sql
```

### 8단계: 서버 실행

#### 터미널 1 - 백엔드
```bash
cd backend
npm run dev
```

#### 터미널 2 - 프론트엔드
```bash
npm run dev
```

---

## 🔧 CentOS/Rocky Linux 설치

### Node.js 설치
```bash
# Node.js 20.x 저장소 추가
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# Node.js 설치
sudo yum install -y nodejs
```

### MySQL 설치
```bash
# MySQL 저장소 추가
sudo yum install -y mysql-server

# MySQL 시작
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 보안 설정
sudo mysql_secure_installation
```

나머지는 Ubuntu와 동일

---

## 🌐 프로덕션 배포 (PM2 + Nginx)

### 1단계: PM2 설치

```bash
sudo npm install -g pm2
```

### 2단계: 프론트엔드 빌드

```bash
npm run build
```

### 3단계: PM2로 백엔드 실행

```bash
cd backend
pm2 start server.js --name cert-manager-backend
pm2 startup
pm2 save
cd ..
```

### 4단계: Nginx 설치 및 설정

```bash
# Nginx 설치
sudo apt install -y nginx

# 설정 파일 생성
sudo nano /etc/nginx/sites-available/cert-manager
```

Nginx 설정:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 또는 서버 IP

    # Frontend
    location / {
        root /home/user/cert-license-manager/dist;
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

```bash
# 설정 활성화
sudo ln -s /etc/nginx/sites-available/cert-manager /etc/nginx/sites-enabled/

# Nginx 테스트 및 재시작
sudo nginx -t
sudo systemctl restart nginx
```

### 5단계: 방화벽 설정

```bash
# UFW (Ubuntu)
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable

# firewalld (CentOS/Rocky)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 6단계: SSL 인증서 (선택사항)

```bash
# Certbot 설치
sudo apt install -y certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com

# 자동 갱신 테스트
sudo certbot renew --dry-run
```

---

## 🐛 문제 해결

### ❌ MySQL 연결 오류

```bash
# MySQL 상태 확인
sudo systemctl status mysql

# MySQL 재시작
sudo systemctl restart mysql

# MySQL 로그 확인
sudo tail -f /var/log/mysql/error.log
```

### ❌ 포트가 이미 사용 중

```bash
# 13000 포트 확인
sudo lsof -i :13000

# 프로세스 종료
kill -9 [PID]
```

### ❌ 권한 오류

```bash
# 프로젝트 디렉토리 권한 설정
sudo chown -R $USER:$USER /path/to/cert-license-manager

# node_modules 재설치
rm -rf node_modules
npm install
```

### ❌ npm install 실패

```bash
# npm 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 백업 설정

### 데이터베이스 자동 백업

```bash
# 백업 디렉토리 생성
sudo mkdir -p /var/backups/cert-manager
sudo chown $USER:$USER /var/backups/cert-manager

# 백업 스크립트 생성
nano ~/backup-cert-manager.sh
```

`backup-cert-manager.sh` 내용:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -pYOUR_PASSWORD cert_license_db > /var/backups/cert-manager/backup_$DATE.sql
find /var/backups/cert-manager -name "backup_*.sql" -mtime +30 -delete
```

```bash
# 실행 권한 부여
chmod +x ~/backup-cert-manager.sh

# Cron 작업 추가 (매일 새벽 2시)
crontab -e

# 추가
0 2 * * * /home/user/backup-cert-manager.sh
```

---

## 🔧 유용한 명령어

### PM2 관리
```bash
pm2 list                          # 프로세스 목록
pm2 logs cert-manager-backend    # 로그 보기
pm2 restart cert-manager-backend # 재시작
pm2 stop cert-manager-backend    # 중지
pm2 delete cert-manager-backend  # 삭제
```

### Nginx 관리
```bash
sudo systemctl status nginx   # 상태 확인
sudo systemctl restart nginx  # 재시작
sudo nginx -t                 # 설정 테스트
sudo tail -f /var/log/nginx/access.log  # 로그 보기
```

### MySQL 관리
```bash
sudo systemctl status mysql   # 상태 확인
sudo systemctl restart mysql  # 재시작
mysql -u root -p              # 접속
```

---

## 📚 참고 자료

- **Node.js**: https://nodejs.org/
- **MySQL**: https://dev.mysql.com/doc/
- **PM2**: https://pm2.keymetrics.io/
- **Nginx**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/

---

## ✅ 설치 완료 체크리스트

- [ ] Node.js 설치
- [ ] MySQL 설치 및 실행
- [ ] 프로젝트 다운로드
- [ ] 의존성 설치
- [ ] 환경 변수 설정
- [ ] 데이터베이스 초기화
- [ ] 개발 서버 실행 확인
- [ ] (프로덕션) PM2 설정
- [ ] (프로덕션) Nginx 설정
- [ ] (프로덕션) 방화벽 설정
- [ ] (프로덕션) 백업 자동화

---

**Linux에서 쉽게 실행하세요! 🐧🚀**
