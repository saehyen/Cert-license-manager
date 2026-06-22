# 포트 설정 확인

## 현재 포트 설정

### 프론트엔드: 13000
- `vite.config.js` → `port: 13000`
- `.env` → `VITE_API_URL=http://localhost:11050/api`

### 백엔드: 11050
- `backend/.env` → `PORT=11050`
- `backend/server.js` → `const PORT = process.env.PORT || 11050`

## 서버 실행 방법

### 1. 백엔드 실행 (터미널 1)
```bash
cd backend
npm run dev
```

예상 출력:
```
============================================
🚀 서버가 포트 11050에서 실행 중입니다.
📍 로컬: http://localhost:11050
📍 네트워크: http://0.0.0.0:11050
============================================
```

### 2. 프론트엔드 실행 (터미널 2)
```bash
npm run dev
```

예상 출력:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:13000/
➜  Network: http://192.168.x.x:13000/
```

### 3. 브라우저에서 확인
http://localhost:13000

## 문제 해결

### 백엔드가 5000 포트로 실행되는 경우
→ `backend/.env` 파일의 PORT 확인 (11050이어야 함)
→ 백엔드 서버 재시작 필요

### 프론트엔드가 백엔드에 연결 안 되는 경우
→ `.env` 파일 확인 (VITE_API_URL=http://localhost:11050/api)
→ 프론트엔드 서버 재시작 필요 (Vite는 .env 변경 시 재시작 필요)

### 포트가 이미 사용 중인 경우
```bash
# Windows에서 포트 확인
netstat -ano | findstr :11050
netstat -ano | findstr :13000

# 프로세스 종료 (PID 확인 후)
taskkill /PID <프로세스ID> /F
```

## 중요 사항

⚠️ **환경 변수 파일(.env) 변경 후 반드시 서버 재시작!**
- 백엔드(.env) 변경 → 백엔드 재시작
- 프론트엔드(.env) 변경 → 프론트엔드 재시작

✅ **현재 설정이 올바른지 확인:**
1. `backend/.env` → PORT=11050
2. `.env` → VITE_API_URL=http://localhost:11050/api
3. 두 서버 모두 재시작
4. 브라우저 콘솔(F12)에서 API URL 확인
