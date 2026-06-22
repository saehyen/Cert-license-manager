# 🪟 Windows 설치 및 실행 가이드

MySQL과 Node.js를 직접 설치하여 Windows에서 실행하는 가이드입니다.

---

## 📋 사전 요구사항

1. **Windows 10 또는 11** (64-bit)
2. **관리자 권한** (프로그램 설치 시)
3. **인터넷 연결**

---

## 🚀 빠른 시작 (자동 설치)

### 1단계: 자동 설정 스크립트 실행

```powershell
cd c:\kiro\cert-license-manager
.\setup-windows.ps1
```

**이 스크립트가 자동으로:**
- ✅ Node.js 확인 (없으면 다운로드 링크 제공)
- ✅ MySQL 확인 (없으면 다운로드 링크 제공)
- ✅ 의존성 설치 (npm install)
- ✅ 환경 변수 설정 (.env 파일 생성)
- ✅ 데이터베이스 초기화

### 2단계: 프로젝트 실행

```powershell
.\start-windows.ps1
```

**자동으로:**
- 백엔드 서버 시작
- 프론트엔드 서버 시작
- 브라우저 자동 열기

### 완료! 🎉
**http://localhost:13000** 에서 확인

---

## 📦 수동 설치 (단계별)

자동 스크립트가 안 되거나 직접 하고 싶다면:

### 1단계: Node.js 설치

#### 다운로드
1. https://nodejs.org/ 접속
2. **LTS 버전** 다운로드 (추천)
3. 설치 파일 실행
4. 모든 기본 옵션으로 설치

#### 설치 확인
```powershell
node --version
# v20.x.x

npm --version
# 10.x.x
```

---

### 2단계: MySQL 설치

#### 다운로드
1. https://dev.mysql.com/downloads/mysql/ 접속
2. **Windows (x86, 64-bit), MSI Installer** 선택
3. **mysql-installer-community** 다운로드

#### 설치
1. 다운로드한 파일 실행
2. **Server only** 선택 (간단한 설치)
   - 또는 **Developer Default** (모든 도구 포함)
3. **Next** → **Execute** → 설치 진행
4. MySQL Root 비밀번호 설정 (꼭 기억하세요!)
5. Windows Service 설정:
   - ✅ Start the MySQL Server at System Startup
   - Service Name: **MySQL80** (기본값)
6. **Execute** → **Finish**

#### 설치 확인
```powershell
# 서비스 확인
Get-Service MySQL*

# 상태가 Running이어야 함
```

---

### 3단계: 프로젝트 설정

#### A. 의존성 설치

```powershell
cd c:\kiro\cert-license-manager

# 프론트엔드 의존성
npm install

# 백엔드 의존성
cd backend
npm install
cd ..
```

#### B. 환경 변수 설정

**백엔드 설정 (backend/.env):**
```powershell
cd backend
copy .env.example .env
notepad .env
```

`.env` 파일 내용:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=여기에_MySQL_비밀번호_입력
DB_NAME=cert_license_db
```

**프론트엔드 설정 (.env):**
```powershell
cd ..
copy .env.example .env
notepad .env
```

`.env` 파일 내용:
```
VITE_API_URL=http://localhost:11050/api
```

#### C. 데이터베이스 초기화

```powershell
# MySQL 실행 (비밀번호 입력 필요)
mysql -u root -p < backend\init-db.sql
```

비밀번호 입력 후 엔터

---

### 4단계: 서버 실행

#### 방법 1: 자동 시작 스크립트
```powershell
.\start-windows.ps1
```

#### 방법 2: 수동 시작 (각각 새 PowerShell 창에서)

**터미널 1 - 백엔드:**
```powershell
cd c:\kiro\cert-license-manager\backend
npm run dev
```

**터미널 2 - 프론트엔드:**
```powershell
cd c:\kiro\cert-license-manager
npm run dev
```

브라우저에서 자동으로 **http://localhost:13000** 열림

---

## 🐛 문제 해결

### ❌ "mysql: command not found"

**원인:** MySQL이 PATH에 없음

**해결방법 1: MySQL 설치 디렉토리에서 실행**
```powershell
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
.\mysql -u root -p < c:\kiro\cert-license-manager\backend\init-db.sql
```

**해결방법 2: PATH에 추가**
1. 시스템 환경 변수 편집
2. Path 변수에 추가: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
3. PowerShell 재시작

---

### ❌ "MySQL 연결 오류"

**증상:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**해결방법:**

1. MySQL 서비스 확인:
```powershell
Get-Service MySQL*
```

2. 서비스가 중지됨이면 시작:
```powershell
Start-Service MySQL80
```

3. backend/.env 파일 확인:
- DB_PASSWORD가 정확한지 확인
- DB_HOST=localhost
- DB_USER=root

---

### ❌ "포트가 이미 사용 중"

**증상:**
```
Error: listen EADDRINUSE: address already in use :::13000
```

**해결방법:**
```powershell
# 13000 포트 사용 프로세스 찾기
netstat -ano | findstr :13000

# 프로세스 종료 (PID 확인 후)
taskkill /PID [PID번호] /F
```

---

### ❌ "npm install 실패"

**해결방법:**

1. npm 캐시 정리:
```powershell
npm cache clean --force
```

2. node_modules 삭제 후 재설치:
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

3. 관리자 권한으로 PowerShell 실행 후 재시도

---

## 📊 개발 환경 구성

### 추천 에디터: VS Code

**설치:**
https://code.visualstudio.com/

**유용한 확장:**
- ESLint
- Prettier
- MySQL (by Jun Han)
- Thunder Client (API 테스트)

### 프로젝트 열기:
```powershell
code c:\kiro\cert-license-manager
```

---

## 🔧 유용한 명령어

### 서버 중지
```powershell
# Ctrl + C (실행 중인 터미널에서)
```

### 데이터베이스 재초기화
```powershell
mysql -u root -p < backend\init-db.sql
```

### 로그 확인
```powershell
# 백엔드 로그는 터미널에 표시됨
# 프론트엔드 로그는 브라우저 개발자 도구(F12)
```

### 포트 변경
**backend/.env:**
```
PORT=5001  # 다른 포트로 변경
```

**프론트엔드 .env:**
```
VITE_API_URL=http://localhost:5001/api  # 백엔드 포트에 맞춤
```

---

## 📚 추가 학습 자료

- **Node.js 문서**: https://nodejs.org/docs/
- **MySQL 문서**: https://dev.mysql.com/doc/
- **React 문서**: https://react.dev/
- **Express 문서**: https://expressjs.com/

---

## ✅ 설치 완료 체크리스트

- [ ] Node.js 설치 (`node --version` 확인)
- [ ] MySQL 설치 및 실행
- [ ] 프로젝트 의존성 설치 (`npm install`)
- [ ] backend/.env 설정
- [ ] .env 설정
- [ ] 데이터베이스 초기화
- [ ] 백엔드 서버 실행 (http://localhost:11050)
- [ ] 프론트엔드 서버 실행 (http://localhost:13000)
- [ ] 브라우저 접속 확인
- [ ] 인증서 추가 테스트

---

## 🎯 다음 단계

1. ✅ 로컬에서 테스트 완료
2. 필요시 커스터마이징
3. 회사 서버에 배포 ([DEPLOYMENT.md](./DEPLOYMENT.md) 참조)
4. 팀원 교육

---

**Windows에서 쉽게 실행하세요! 🚀**
