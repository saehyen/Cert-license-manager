# 데이터베이스 선택 가이드

이 프로젝트는 **MySQL**과 **PostgreSQL** 두 가지 데이터베이스를 지원합니다.

## 🔍 어떤 것을 선택해야 할까요?

### MySQL 추천 대상
- ✅ 웹 애플리케이션 개발에 익숙한 경우
- ✅ 읽기 작업이 많은 경우
- ✅ 간단하고 빠른 설정을 원하는 경우
- ✅ 대부분의 클라우드 서비스에서 기본 지원

### PostgreSQL 추천 대상
- ✅ 복잡한 쿼리나 고급 기능이 필요한 경우
- ✅ 데이터 무결성이 매우 중요한 경우
- ✅ JSON 데이터 타입 등 고급 기능 활용
- ✅ 대규모 데이터 처리

### 결론
이 프로젝트의 경우, **두 DB 모두 충분히 사용 가능**합니다. 
더 익숙한 것을 선택하시면 됩니다. 일반적으로는 **MySQL을 추천**합니다.

---

## 📦 MySQL 사용 시

### 1. 서버 파일
`backend/server.js` 사용 (기본)

### 2. DB 초기화
```bash
mysql -u root -p < backend/init-db.sql
```

### 3. .env 설정
```bash
cd backend
cp .env.example .env
```

`.env` 파일 내용:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cert_license_db
```

### 4. 의존성 설치 및 실행
```bash
npm install
npm start
```

---

## 🐘 PostgreSQL 사용 시

### 1. 서버 파일 변경
`backend/server.js` 대신 `backend/server-postgresql.js` 사용

**방법 1: 파일 이름 변경**
```bash
cd backend
mv server.js server-mysql.js
mv server-postgresql.js server.js
```

**방법 2: package.json 수정**
```json
{
  "scripts": {
    "start": "node server-postgresql.js",
    "dev": "nodemon server-postgresql.js"
  }
}
```

### 2. PostgreSQL 설치 (Ubuntu)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. DB 생성 및 사용자 설정
```bash
# PostgreSQL 접속
sudo -u postgres psql

# PostgreSQL 프롬프트에서 실행
CREATE DATABASE cert_license_db;
CREATE USER certmanager WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE cert_license_db TO certmanager;
\q
```

### 4. DB 초기화
```bash
sudo -u postgres psql -d cert_license_db -f backend/init-db-postgresql.sql
```

### 5. .env 설정
```bash
cd backend
cp .env.example .env
```

`.env` 파일 내용:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=certmanager
DB_PASSWORD=your_strong_password
DB_NAME=cert_license_db
```

### 6. 의존성 설치 및 실행
```bash
npm install
npm start
```

---

## 🔄 데이터베이스 전환하기

이미 MySQL로 개발 중인데 PostgreSQL로 바꾸고 싶다면?

### 1. 데이터 백업 (MySQL)
```bash
mysqldump -u root -p cert_license_db > backup.sql
```

### 2. PostgreSQL 설치 및 설정 (위 참조)

### 3. 서버 파일 변경 (위 참조)

### 4. 데이터 마이그레이션
MySQL dump를 PostgreSQL로 직접 가져오기는 어렵습니다.
샘플 데이터만 있다면 `init-db-postgresql.sql`로 새로 시작하는 것을 권장합니다.

---

## 📊 성능 비교

| 항목 | MySQL | PostgreSQL |
|------|-------|------------|
| 읽기 성능 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 쓰기 성능 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 동시 접속 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 복잡한 쿼리 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 설정 난이도 | 쉬움 ⭐⭐⭐⭐⭐ | 보통 ⭐⭐⭐ |
| 커뮤니티 | 매우 큼 | 큼 |

---

## 💡 추천 사항

### 개발 시작 단계
👉 **MySQL** 사용 - 빠르고 간단하게 시작

### 프로덕션 준비
- 사용자 100명 미만: **MySQL** 또는 **PostgreSQL** 모두 OK
- 사용자 100명 이상: 둘 다 충분하지만, 복잡한 검색/필터링이 많다면 **PostgreSQL** 권장

### 클라우드 서비스별 지원
- **AWS RDS**: MySQL, PostgreSQL 모두 지원
- **Google Cloud SQL**: MySQL, PostgreSQL 모두 지원
- **Azure Database**: MySQL, PostgreSQL 모두 지원
- **Naver Cloud**: MySQL, PostgreSQL 모두 지원

---

## 🆘 문제 해결

### MySQL 연결 오류
```bash
# MySQL 상태 확인
sudo systemctl status mysql

# MySQL 재시작
sudo systemctl restart mysql
```

### PostgreSQL 연결 오류
```bash
# PostgreSQL 상태 확인
sudo systemctl status postgresql

# PostgreSQL 재시작
sudo systemctl restart postgresql

# 접속 권한 확인
sudo nano /etc/postgresql/14/main/pg_hba.conf
# local all all trust 또는 md5로 설정
```

---

## 결론

**이 프로젝트에서는 MySQL 사용을 기본으로 권장합니다.**

간단하고, 빠르며, 대부분의 개발자에게 익숙합니다.
하지만 PostgreSQL도 완벽하게 지원되므로, 원하시는 것을 선택하세요! 🚀
