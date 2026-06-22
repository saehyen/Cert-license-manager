# 🔐 SSL 인증서 & 라이센스 관리 시스템

깔끔하고 현대적인 UI로 SSL 인증서와 라이센스를 효율적으로 관리할 수 있는 풀스택 웹 애플리케이션입니다.

## ⚡ 빠른 시작

### 🪟 Windows에서 실행

```powershell
# 1. 자동 설정
cd cert-license-manager
.\setup-windows.ps1

# 2. 실행
.\start-windows.ps1

# 3. 브라우저에서 http://localhost:3000 접속
```

📖 자세히: [WINDOWS_SETUP_GUIDE.md](./WINDOWS_SETUP_GUIDE.md)

### 🐧 Linux에서 실행

#### Ubuntu/Debian
```bash
git clone https://github.com/saehyen/Cert-license-manager.git
cd Cert-license-manager

chmod +x setup-linux.sh
./setup-linux.sh

chmod +x start-linux.sh
./start-linux.sh
```

#### Rocky Linux / AlmaLinux
```bash
git clone https://github.com/saehyen/Cert-license-manager.git
cd Cert-license-manager

chmod +x setup-rockylinux.sh
./setup-rockylinux.sh

chmod +x start-rockylinux.sh
./start-rockylinux.sh
```

📖 자세히: 
- Ubuntu/Debian: [LINUX_SETUP_GUIDE.md](./LINUX_SETUP_GUIDE.md)
- Rocky Linux: [ROCKYLINUX_DEPLOYMENT.md](./ROCKYLINUX_DEPLOYMENT.md)

---

## 🎯 주요 기능

### ✨ SSL 인증서 관리
- 고객사, 서비스명, 도메인, 발급처, 만료일, 담당자, 비고 관리
- 실시간 검색 (도메인/서비스 기반)
- 남은 일수 자동 계산 및 색상 표시
- 만료 임박 경고 (30일 이내)
- 모든 컬럼 정렬 가능

### 📝 라이센스 관리
- 고객사별 서비스 라이센스 관리
- 라이센스 키, 수량, 만료일 등 관리
- 검색 및 필터링
- 만료 상태 자동 모니터링

### 🎨 UI/UX
- 깔끔하고 직관적인 인터페이스
- 다크모드 지원 (자동 저장)
- 반응형 디자인
- 빠른 검색 및 정렬
- 사용자 친화적인 모달 폼

---

## 📚 문서 가이드

| 문서 | 설명 |
|------|------|
| **[WINDOWS_SETUP_GUIDE.md](./WINDOWS_SETUP_GUIDE.md)** | 🪟 Windows 설치 및 실행 가이드 |
| **[LINUX_SETUP_GUIDE.md](./LINUX_SETUP_GUIDE.md)** | 🐧 Linux 설치 및 실행 가이드 |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | 📖 리눅스 서버 배포 가이드 (PM2 + Nginx) |
| **[DATABASE_CHOICE.md](./DATABASE_CHOICE.md)** | 🔍 MySQL vs PostgreSQL |
| **[ENTERPRISE_GUIDE.md](./ENTERPRISE_GUIDE.md)** | 🏢 기업 사용 가이드 |
| **[README.md](./README.md)** | 📝 프로젝트 전체 설명 (지금 읽는 문서) |

---

## 🏗️ 기술 스택

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 (Custom Properties for theming)
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: mysql2 (Promise-based)
- **Process Manager**: PM2 (프로덕션)

---

## 📊 프로젝트 구조

```
cert-license-manager/
├── backend/                        # 백엔드 서버
│   ├── server.js                  # Express 서버 (MySQL)
│   ├── server-postgresql.js       # Express 서버 (PostgreSQL)
│   ├── init-db.sql                # MySQL 초기화
│   ├── init-db-postgresql.sql     # PostgreSQL 초기화
│   ├── package.json
│   └── .env.example
├── src/                           # 프론트엔드
│   ├── components/                # React 컴포넌트
│   ├── styles/                    # CSS 스타일
│   ├── utils/                     # 유틸리티
│   └── App.jsx                    # 메인 앱
├── setup-windows.ps1              # Windows 자동 설정
├── start-windows.ps1              # Windows 빠른 실행
├── setup-linux.sh                 # Linux 자동 설정
├── start-linux.sh                 # Linux 빠른 실행
├── index.html
├── package.json
└── vite.config.js
```

---

## 📝 API 엔드포인트

### SSL 인증서
- `GET /api/certificates` - 모든 인증서 조회
- `POST /api/certificates` - 인증서 추가
- `PUT /api/certificates/:id` - 인증서 수정
- `DELETE /api/certificates/:id` - 인증서 삭제

### 라이센스
- `GET /api/licenses` - 모든 라이센스 조회
- `POST /api/licenses` - 라이센스 추가
- `PUT /api/licenses/:id` - 라이센스 수정
- `DELETE /api/licenses/:id` - 라이센스 삭제

### 헬스 체크
- `GET /api/health` - 서버 상태 확인

---

## 🔒 환경 변수

### 프론트엔드 (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### 백엔드 (backend/.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cert_license_db
```

---

## 🌐 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

---

## 📜 라이센스

MIT License - 상업적 사용 가능 (회사/기업에서 자유롭게 사용 가능)

자세한 내용: [LICENSE](./LICENSE)

---

## 🏢 기업 사용 가이드

회사나 기업 환경에서 사용하시나요? 보안, 권한 관리, 백업 등에 대한 가이드를 참조하세요:
📖 [ENTERPRISE_GUIDE.md](./ENTERPRISE_GUIDE.md)

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📮 문의 및 지원

- GitHub Issues: [이슈 등록](https://github.com/YOUR_USERNAME/cert-license-manager/issues)
- 이메일: your-email@example.com

---

## 🎯 로드맵

- [ ] 사용자 인증 및 권한 관리
- [ ] 만료 알림 자동화 (이메일/Slack)
- [ ] 통계 대시보드
- [ ] API 문서 (Swagger)
- [ ] 다국어 지원

---

## 📸 스크린샷

### 라이트 모드
![Light Mode](screenshots/light-mode.png)

### 다크 모드
![Dark Mode](screenshots/dark-mode.png)

---

**Windows와 Linux 모두에서 쉽게 실행하세요! 🚀**
