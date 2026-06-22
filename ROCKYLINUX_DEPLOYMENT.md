# 🏔️ Rocky Linux 배포 가이드

Rocky Linux 서버에서 SSL 인증서 & 라이센스 관리 시스템을 배포하는 완벽 가이드입니다.

---

## 📋 지원 버전

- Rocky Linux 8
- Rocky Linux 9 (권장)
- AlmaLinux 8/9 (호환)

---

## 🚀 빠른 시작

### 1단계: 프로젝트 다운로드

```bash
# GitHub에서 Clone
git clone https://github.com/saehyen/Cert-license-manager.git
cd Cert-license-manager
```

### 2단계: 자동 설정

```bash
chmod +x setup-rockylinux.sh
./setup-rockylinux.sh
```

### 3단계: 실행

```bash
chmod +x start-rockylinux.sh
./start-rockylinux.sh
```

### 완료! 🎉
브라우저에서 **http://서버IP:3000** 접속

---

## 📦 수동 설치 (Rocky Linux 9)

### 1단계: 시스템 업데이트

```bash
sudo dnf update -y
sudo dnf install -y epel-release
```

### 2단계: Node.js 20.x 설치

```bash
# NodeSource 저장소 추가
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# Node.js 설치
sudo dnf install -y nodejs

# 확인
node --version  # v20.x.x
npm --version   # 10.x.x
```

### 3단계: MySQL 8.0 설치

```bash
# MySQL 저장소 추가
sudo dnf install -y https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm

# GPG 키 가져오기
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2023

# MySQL 서버 설치
sudo dnf install -y mysql-server

# MySQL 시작
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 임시 비밀번호 확인
sudo grep 'temporary password' /var/log/mysqld.log

# 보안 설정
sudo mysql_secure_installation
```

**MySQL 보안 설정:**
```
Enter password for user root: [임시 비밀번호 입력]
New password: [새 비밀번호 입력]
Re-enter new password: [새 비밀번호 재입력]

Remove anonymous users? Y
Disallow root login remotely? Y
Remove test database? Y
Reload privilege tables? Y
```

### 4단계: Git 설치

```bash
sudo dnf install -y git
```

### 5단계: 방화벽 설정

```bash
# 포트 열기
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload

# 확인
sudo firewall-cmd --list-ports
```

### 6단계: SELinux 설정 (선택사항)

```bash
# SELinux 확인
getenforce

# 개발 환경에서 Permissive 모드 (선택)
sudo setenforce 0

# 영구 변경 (필요시)
sudo sed -i 's/SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config
```

### 7단계: 프로젝트 설정

```bash
# 프로젝트 디렉토리
cd Cert-license-manager

# 의존성 설치
npm install
cd backend && npm install && cd ..

# 환경 변수 설정
cp backend/.env.example backend/.env
nano backend/.env
```

**backend/.env:**
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cert_license_db
```

```bash
# 프론트엔드 환경 변수
cp .env.example .env
nano .env
```

**프론트엔드 .env:**
```
VITE_API_URL=http://서버IP:5000/api
```

### 8단계: 데이터베이스 초기화

```bash
mysql -u root -p < backend/init-db.sql
```

### 9단계: 테스트 실행

```bash
# 백엔드 (터미널 1)
cd backend
npm run dev

# 프론트엔드 (터미널 2)
npm run dev
```

브라우저에서 **http://서버IP:3000** 접속

---

## 🌐 프로덕션 배포

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
pm2 start server.js --name cert-license-backend
pm2 startup
pm2 save
cd ..
```

### 4단계: Nginx 설치 및 설정

```bash
# Nginx 설치
sudo dnf install -y nginx

# Nginx 설정
sudo nano /etc/nginx/conf.d/cert-manager.conf
```

**Nginx 설정 파일:**
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 또는 서버 IP

    # Frontend
    location / {
        root /home/user/Cert-license-manager/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
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
# Nginx 권한 설정 (중요!)
sudo chown -R nginx:nginx /home/user/Cert-license-manager/dist
sudo chmod -R 755 /home/user/Cert-license-manager/dist

# 또는 SELinux 컨텍스트 설정
sudo chcon -R -t httpd_sys_content_t /home/user/Cert-license-manager/dist

# Nginx 테스트 및 시작
sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5단계: 방화벽 설정

```bash
# HTTP/HTTPS 포트 열기
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 6단계: SELinux 설정 (Nginx 연결 허용)

```bash
# Nginx가 네트워크 연결을 허용하도록 설정
sudo setsebool -P httpd_can_network_connect 1

# Nginx가 파일을 읽을 수 있도록 설정
sudo setsebool -P httpd_read_user_content 1
```

### 7단계: SSL 인증서 (Let's Encrypt)

```bash
# Certbot 설치
sudo dnf install -y certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com

# 자동 갱신 테스트
sudo certbot renew --dry-run
```

---

## 🔧 Rocky Linux 특화 설정

### systemd 서비스로 자동 시작

**백엔드 서비스 파일:**
```bash
sudo nano /etc/systemd/system/cert-manager-backend.service
```

```ini
[Unit]
Description=Certificate Manager Backend
After=network.target mysql.service

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/your-username/Cert-license-manager/backend
ExecStart=/usr/bin/npm run dev
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# 서비스 활성화
sudo systemctl daemon-reload
sudo systemctl enable cert-manager-backend
sudo systemctl start cert-manager-backend
sudo systemctl status cert-manager-backend
```

### 로그 관리

```bash
# PM2 로그
pm2 logs cert-license-backend

# Nginx 로그
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MySQL 로그
sudo tail -f /var/log/mysqld.log

# systemd 로그
sudo journalctl -u cert-manager-backend -f
```

---

## 📊 백업 및 모니터링

### 자동 백업 설정

```bash
# 백업 디렉토리 생성
sudo mkdir -p /var/backups/cert-manager
sudo chown $USER:$USER /var/backups/cert-manager

# 백업 스크립트
nano ~/backup-cert-manager.sh
```

**백업 스크립트:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/cert-manager"

# Database backup
mysqldump -u root -p'YOUR_PASSWORD' cert_license_db > $BACKUP_DIR/db_backup_$DATE.sql

# Compress
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Delete old backups (30 days)
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
```

```bash
# 실행 권한
chmod +x ~/backup-cert-manager.sh

# Cron 작업 (매일 새벽 2시)
crontab -e

# 추가
0 2 * * * /home/your-username/backup-cert-manager.sh >> /var/log/cert-manager-backup.log 2>&1
```

### PM2 모니터링

```bash
# PM2 모니터링 대시보드
pm2 monit

# 프로세스 목록
pm2 list

# 자동 재시작 설정
pm2 startup
pm2 save
```

---

## 🐛 문제 해결

### ❌ "Cannot find module" 오류

```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

### ❌ MySQL 연결 오류

```bash
# MySQL 상태 확인
sudo systemctl status mysqld

# MySQL 재시작
sudo systemctl restart mysqld

# 연결 테스트
mysql -u root -p -e "SELECT 1"
```

### ❌ Nginx 403 Forbidden

```bash
# 권한 확인
ls -la /home/user/Cert-license-manager/dist

# SELinux 컨텍스트 설정
sudo chcon -R -t httpd_sys_content_t /home/user/Cert-license-manager/dist

# 또는 소유권 변경
sudo chown -R nginx:nginx /home/user/Cert-license-manager/dist
```

### ❌ 방화벽 문제

```bash
# 방화벽 상태 확인
sudo firewall-cmd --list-all

# 포트 확인
sudo firewall-cmd --list-ports

# 포트 다시 열기
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload
```

### ❌ SELinux 거부

```bash
# SELinux 로그 확인
sudo ausearch -m avc -ts recent

# Nginx 네트워크 연결 허용
sudo setsebool -P httpd_can_network_connect 1

# 임시로 Permissive 모드 (디버깅용)
sudo setenforce 0
```

---

## 🔒 보안 강화

### 1. MySQL 보안

```sql
-- MySQL 접속
mysql -u root -p

-- 새 사용자 생성 (root 대신 사용)
CREATE USER 'certmanager'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON cert_license_db.* TO 'certmanager'@'localhost';
FLUSH PRIVILEGES;
```

backend/.env 수정:
```
DB_USER=certmanager
DB_PASSWORD=StrongPassword123!
```

### 2. 방화벽 제한

```bash
# 특정 IP만 허용 (예: 사무실 IP)
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="YOUR_OFFICE_IP" port protocol="tcp" port="3000" accept'
sudo firewall-cmd --reload
```

### 3. fail2ban 설치

```bash
sudo dnf install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📚 유용한 명령어

### Rocky Linux 시스템 관리
```bash
# 시스템 정보
hostnamectl
cat /etc/rocky-release

# 서비스 관리
sudo systemctl status [service]
sudo systemctl restart [service]
sudo systemctl enable [service]

# 방화벽
sudo firewall-cmd --list-all
sudo firewall-cmd --reload

# SELinux
getenforce
sudo setenforce 0  # Permissive
sudo setenforce 1  # Enforcing
```

### 애플리케이션 관리
```bash
# PM2
pm2 list
pm2 restart cert-license-backend
pm2 logs cert-license-backend

# Nginx
sudo nginx -t
sudo systemctl restart nginx

# MySQL
sudo systemctl status mysqld
mysql -u root -p
```

---

## ✅ 배포 체크리스트

- [ ] Rocky Linux 9 서버 준비
- [ ] Node.js 20.x 설치
- [ ] MySQL 8.0 설치 및 보안 설정
- [ ] 방화벽 설정 (포트 80, 443)
- [ ] SELinux 설정
- [ ] 프로젝트 다운로드
- [ ] 의존성 설치
- [ ] 환경 변수 설정
- [ ] 데이터베이스 초기화
- [ ] PM2로 백엔드 실행
- [ ] 프론트엔드 빌드
- [ ] Nginx 설정
- [ ] SSL 인증서 설치
- [ ] 백업 자동화 설정
- [ ] 모니터링 설정

---

**Rocky Linux에서 안정적으로 운영하세요! 🏔️🚀**
