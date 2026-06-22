# 🚀 여기서 시작하세요!

SSL 인증서 & 라이센스 관리 시스템에 오신 것을 환영합니다!

---

## 🎯 어떻게 시작할까요?

### 📝 상황별 추천

| 상황 | 추천 방법 | 문서 |
|------|----------|------|
| **빠르게 테스트해보고 싶어요 (Windows/Linux)** | 🐳 Docker | [아래 참조](#-docker로-즉시-테스트-windows--linux-모두) |
| **로컬에서 개발하고 싶어요** | 💻 로컬 설치 | [로컬 개발](#-로컬-개발-환경) |
| **실제 서버에 배포하고 싶어요** | ☁️ 클라우드 배포 | [QUICKSTART.md](./QUICKSTART.md) |
| **DB를 선택하고 싶어요** | 📊 MySQL/PostgreSQL | [DATABASE_CHOICE.md](./DATABASE_CHOICE.md) |

---

## 🐳 Docker로 즉시 테스트 (Windows & Linux 모두)

### 1단계: Docker 설치 확인

#### Windows
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) 다운로드 및 설치
2. Docker Desktop 실행

#### Linux (Ubuntu)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# 재로그인
```

#### Mac
```bash
brew install --cask docker
```

### 2단계: 확인
```bash
docker --version
docker-compose --version
```

### 3단계: 실행 (3초!)

#### Windows (PowerShell)
```powershell
cd c:\kiro\cert-license-manager
docker-compose up -d
```

#### Linux/Mac (Terminal)
```bash
cd /path/to/cert-license-manager
docker-compose up -d
```

### 4단계: 접속 🎉
브라우저에서 **http://localhost:13000** 열기

### 완료!
- ✅ MySQL 자동 설치 및 설정
- ✅ 백엔드 API 자동 실행
- ✅ 프론트엔드 자동 실행
- ✅ 샘플 데이터 자동 로드

### 종료하려면
```bash
docker-compose down
```

### 더 자세히 알고 싶다면
📖 [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Docker 완전 가이드

---

## 💻 로컬 개발 환경

Docker 없이 직접 설치하고 싶다면:

### 사전 준비
1. **Node.js 20+** 설치: https://nodejs.org/
2. **MySQL** 설치:
   - Windows: https://dev.mysql.com/downloads/mysql/
   - Mac: `brew install mysql`
   - Linux: `sudo apt install mysql-server`

### 실행 순서

#### 1. 데이터베이스 초기화
```bash
# MySQL 접속
mysql -u root -p

# init-db.sql 실행
mysql -u root -p < backend/init-db.sql
```

#### 2. 백엔드 실행 (터미널 1)
```bash
cd backend
npm install
cp .env.example .env
# .env 파일에서 DB 비밀번호 설정
npm run dev
```

#### 3. 프론트엔드 실행 (터미널 2)
```bash
# 프로젝트 루트로 이동
npm install
npm run dev
```

#### 4. 접속
브라우저에서 **http://localhost:13000** 자동으로 열림

---

## ☁️ 클라우드 서버 배포

실제 서버에 배포하려면:

### 빠른 배포
📖 [QUICKSTART.md](./QUICKSTART.md) - 3분 배포 가이드

### 상세 배포
📖 [DEPLOYMENT.md](./DEPLOYMENT.md) - 완전한 배포 가이드

---

## 📊 데이터베이스 선택

MySQL과 PostgreSQL 중 선택할 수 있습니다:

| DB | 장점 | 추천 대상 |
|----|------|----------|
| **MySQL** | 간단, 빠른 설정 | 대부분의 경우 (기본) |
| **PostgreSQL** | 고급 기능, 복잡한 쿼리 | 대규모 데이터 |

📖 [DATABASE_CHOICE.md](./DATABASE_CHOICE.md) - 자세한 비교

---

## 📚 전체 문서 목록

| 문서 | 설명 |
|------|------|
| **[START_HERE.md](./START_HERE.md)** | 👈 지금 읽는 문서 - 시작 가이드 |
| **[README.md](./README.md)** | 프로젝트 개요 및 기능 설명 |
| **[DOCKER_GUIDE.md](./DOCKER_GUIDE.md)** | 🐳 Docker 완전 가이드 |
| **[QUICKSTART.md](./QUICKSTART.md)** | ⚡ 3분 배포 가이드 |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | 📖 상세 배포 가이드 |
| **[DATABASE_CHOICE.md](./DATABASE_CHOICE.md)** | 🔍 DB 선택 가이드 |

---

## 🎯 체크리스트

### 테스트용 (Docker)
- [ ] Docker 설치
- [ ] `docker-compose up -d` 실행
- [ ] http://localhost:13000 접속
- [ ] 인증서 추가/수정/삭제 테스트
- [ ] 다크모드 전환 테스트
- [ ] 검색 및 정렬 테스트

### 개발용 (로컬)
- [ ] Node.js 설치
- [ ] MySQL 설치
- [ ] `backend/init-db.sql` 실행
- [ ] 백엔드 .env 설정
- [ ] 백엔드 실행 (`npm run dev`)
- [ ] 프론트엔드 실행 (`npm run dev`)
- [ ] http://localhost:13000 접속 테스트

### 프로덕션 (클라우드)
- [ ] 리눅스 서버 준비
- [ ] Node.js, MySQL, Nginx 설치
- [ ] 프로젝트 업로드
- [ ] 데이터베이스 초기화
- [ ] PM2로 백엔드 실행
- [ ] Nginx 설정
- [ ] 방화벽 설정
- [ ] SSL 인증서 설치
- [ ] 백업 자동화

---

## ❓ FAQ

### Q: 가장 빠른 시작 방법은?
**A: Docker!** `docker-compose up -d` 한 줄로 끝.

### Q: Windows에서도 되나요?
**A: 네!** Docker를 사용하면 Windows/Linux/Mac 모두 동일하게 작동합니다.

### Q: MySQL을 꼭 설치해야 하나요?
**A: Docker 사용 시 불필요합니다.** Docker가 자동으로 MySQL을 설치하고 설정합니다.

### Q: 데이터가 저장되나요?
**A: 네!** Docker volume에 저장되어 컨테이너를 재시작해도 데이터가 유지됩니다.

### Q: 프로덕션에서도 Docker를 써야 하나요?
**A: 선택사항입니다.** 개발은 Docker가 편하고, 프로덕션은 직접 설치가 더 안정적일 수 있습니다.

### Q: PostgreSQL을 쓰고 싶어요
**A: 가능합니다!** [DATABASE_CHOICE.md](./DATABASE_CHOICE.md) 참조

---

## 🆘 문제가 생겼나요?

### Docker 관련
📖 [DOCKER_GUIDE.md - 트러블슈팅](./DOCKER_GUIDE.md#-트러블슈팅)

### 배포 관련
📖 [DEPLOYMENT.md - 트러블슈팅](./DEPLOYMENT.md#-트러블슈팅)

### 일반적인 문제

**"포트가 이미 사용 중"**
```bash
# 포트 변경 (docker-compose.yml)
ports:
  - "13001:13000"  # 13001로 변경
```

**"백엔드 연결 실패"**
```bash
# 로그 확인
docker-compose logs backend
# 또는
pm2 logs cert-license-backend
```

**"MySQL 연결 오류"**
```bash
# MySQL 상태 확인
docker-compose ps
# 또는
sudo systemctl status mysql
```

---

## 🎉 시작하세요!

### 빠르게 테스트하려면
```bash
docker-compose up -d
```

### 개발하려면
```bash
# 백엔드
cd backend && npm install && npm run dev

# 프론트엔드 (새 터미널)
npm install && npm run dev
```

### 배포하려면
📖 [QUICKSTART.md](./QUICKSTART.md) 참조

---

## 💡 다음 단계

1. ✅ 로컬에서 테스트 (Docker 추천)
2. 📝 요구사항 확인 및 커스터마이징
3. ☁️ 클라우드 서버 배포
4. 🔒 SSL 인증서 설치
5. 📊 데이터 입력 및 사용

---

**궁금한 점이 있으면 각 문서를 참조하세요!**

**Happy Coding! 🚀**
