# 🏢 기업/회사 사용 가이드

이 문서는 회사나 기업 환경에서 SSL 인증서 & 라이센스 관리 시스템을 사용하는 방법을 설명합니다.

---

## ✅ 회사에서 사용 가능한가요?

**네, 완전히 무료이며 상업적 사용이 가능합니다!**

### 📜 라이센스

- **MIT License** - 가장 자유로운 오픈소스 라이센스
- ✅ **상업적 사용 가능** (회사, 고객사 등)
- ✅ **수정 및 재배포 가능**
- ✅ **비용 없음** (영구 무료)
- ✅ **라이센스 표기만 유지**하면 됨

---

## 🏢 회사 환경 배포 시나리오

### 시나리오 1: 사내 인트라넷 서버

**용도:** 회사 내부 팀이 사용

```
[사내 서버] → [MySQL] → [팀원들이 브라우저로 접속]
```

**배포 방법:**
1. 회사 인트라넷 서버에 배포
2. 내부 IP 또는 도메인으로 접근
3. VPN 연결 시 원격에서도 접근 가능

**보안:**
- 방화벽으로 외부 접근 차단
- HTTPS 설정 (자체 인증서 또는 내부 CA)
- 사용자 인증 추가 가능 (커스터마이징)

---

### 시나리오 2: 클라우드 서버 (AWS, Azure, NCP 등)

**용도:** 여러 지사, 원격 근무자가 사용

```
[클라우드 서버] → [RDS/MySQL] → [전 세계 어디서나 접속]
```

**배포 방법:**
- AWS EC2, Azure VM, Naver Cloud Server 등
- 보안 그룹으로 특정 IP만 허용
- Let's Encrypt SSL 인증서 (무료)

**장점:**
- 재택근무자도 접근 가능
- 자동 백업 가능
- 확장 용이

---

### 시나리오 3: 다중 고객사 관리 (MSP, SI 업체)

**용도:** 여러 고객사의 인증서/라이센스를 통합 관리

```
[관리 서버] → [MySQL]
            ↓
[고객사A, 고객사B, 고객사C 데이터]
```

**커스터마이징:**
- 고객사별 권한 분리 (로그인 기능 추가)
- 고객사별 대시보드
- 만료 알림 자동화 (이메일/슬랙)

---

## 🔒 보안 고려사항

### 1. 인증/권한 관리

**현재 상태:**
- 인증 기능 없음 (URL 접근 시 바로 사용 가능)

**회사 환경 권장사항:**

#### 방법 1: 네트워크 레벨 보안
```nginx
# Nginx 설정
location / {
    # 특정 IP만 허용
    allow 192.168.1.0/24;  # 사내 IP 대역
    allow 10.0.0.0/8;       # VPN IP 대역
    deny all;
    
    proxy_pass http://localhost:13000;
}
```

#### 방법 2: Basic Auth 추가
```nginx
# Nginx 설정
location / {
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    proxy_pass http://localhost:13000;
}
```

```bash
# 사용자 생성
sudo htpasswd -c /etc/nginx/.htpasswd admin
```

#### 방법 3: 회사 SSO 연동
- OAuth 2.0 (Google, Microsoft 등)
- LDAP/Active Directory
- SAML

**구현 필요 시 별도 개발 필요**

---

### 2. 데이터 암호화

#### 전송 중 암호화 (Transport)
```bash
# SSL/TLS 인증서 설치
sudo certbot --nginx -d cert-manager.company.com
```

#### 저장 중 암호화 (At Rest)
```sql
-- MySQL 암호화 (선택사항)
-- 민감한 라이센스 키 암호화
-- 별도 암호화 로직 추가 가능
```

---

### 3. 접근 로그 및 감사

```bash
# Nginx 접근 로그
tail -f /var/log/nginx/access.log

# MySQL 쿼리 로그
mysql> SET GLOBAL general_log = 'ON';
```

---

## 👥 다중 사용자 환경

### 현재 상태
- 동시에 여러 명이 사용 가능
- 실시간 데이터 동기화 (새로고침 시)

### 권장 사항

**소규모 팀 (5-10명)**
- 현재 구조 그대로 사용 가능
- 네트워크/Nginx 레벨 보안으로 충분

**중규모 팀 (10-50명)**
- 로그인 기능 추가 권장
- 사용자별 수정 이력 추적

**대규모 조직 (50명+)**
- 역할 기반 권한 (RBAC) 추가
- 부서별/팀별 데이터 분리
- 별도 커스터마이징 필요

---

## 📊 백업 및 복구

### 1. 자동 백업 설정

```bash
# 매일 새벽 2시 자동 백업
sudo crontab -e

# 추가
0 2 * * * mysqldump -u certmanager -p'PASSWORD' cert_license_db > /backup/cert_db_$(date +\%Y\%m\%d).sql
0 2 * * * find /backup -name "cert_db_*.sql" -mtime +30 -delete  # 30일 이상 백업 삭제
```

### 2. 백업 복구

```bash
# 백업 파일에서 복구
mysql -u certmanager -p'PASSWORD' cert_license_db < /backup/cert_db_20241220.sql
```

### 3. 클라우드 백업 (AWS S3)

```bash
# AWS CLI로 S3에 백업
aws s3 cp /backup/cert_db_$(date +\%Y\%m\%d).sql s3://company-backup/cert-manager/
```

---

## 🔔 알림 및 자동화

### 만료 알림 자동화 (별도 개발 필요)

#### 이메일 알림
```javascript
// Node.js 예시 (별도 스크립트)
const nodemailer = require('nodemailer');

// 30일 이내 만료 인증서 조회
const expiringSoon = await query(`
  SELECT * FROM certificates 
  WHERE DATEDIFF(expiry_date, CURDATE()) <= 30 
  AND DATEDIFF(expiry_date, CURDATE()) > 0
`);

// 이메일 발송
expiringSoon.forEach(cert => {
  sendEmail({
    to: cert.manager,
    subject: `[알림] ${cert.domain} 인증서 만료 임박`,
    body: `${cert.domain} 인증서가 ${daysRemaining}일 후 만료됩니다.`
  });
});
```

#### Slack 알림
```javascript
// Slack Webhook
const slack = require('slack-notify')(SLACK_WEBHOOK_URL);

slack.send({
  text: `⚠️ 인증서 만료 임박: ${cert.domain} (${daysRemaining}일)`,
  username: 'Certificate Manager'
});
```

#### 커스터마이징 가능한 알림 시나리오
- 30일 전 알림
- 7일 전 재알림
- 만료일 당일 긴급 알림
- 주간/월간 리포트

---

## 📈 확장 및 커스터마이징

### 추가 가능한 기능

#### 1. 사용자 관리
- 로그인/로그아웃
- 역할 (관리자, 일반 사용자, 조회만)
- 부서별 권한

#### 2. 히스토리 추적
- 수정 이력 (누가, 언제, 무엇을)
- 감사 로그
- 변경 승인 워크플로우

#### 3. 대시보드 확장
- 통계 차트 (만료 현황, 발급처별 분포)
- 고객사별 요약
- 비용 추적

#### 4. 알림 시스템
- 이메일 알림
- Slack/Teams 연동
- SMS 알림

#### 5. API 확장
- 외부 시스템 연동
- 자동화 스크립트 연동
- CI/CD 파이프라인 통합

#### 6. 인증서 자동 갱신
- Let's Encrypt 자동 갱신
- ACME 프로토콜 연동
- 갱신 실패 시 알림

---

## 💼 실제 회사 배포 예시

### 예시 1: IT 대기업 (200명)

**구성:**
- AWS EC2 (t3.medium)
- RDS MySQL (db.t3.medium)
- Application Load Balancer
- Route 53 (cert-manager.company.com)
- Nginx + Let's Encrypt SSL

**보안:**
- VPN 연결 필수
- SSO (Microsoft Azure AD)
- 역할 기반 권한 (부서별)

**비용:** 월 $100-200 (AWS 비용)

---

### 예시 2: 중소기업 (50명)

**구성:**
- Naver Cloud Server (Standard)
- Cloud DB for MySQL
- 내부 도메인 (cert.company.local)

**보안:**
- 사내 IP만 허용
- Basic Auth
- HTTPS (자체 서명 인증서)

**비용:** 월 5-10만원

---

###예시 3: 스타트업 (10명)

**구성:**
- Docker Compose (단일 서버)
- 공유 서버 (개발 서버 활용)
- IP 직접 접근

**보안:**
- 방화벽 (사무실 IP만)
- HTTP (내부망)

**비용:** 거의 무료 (기존 서버 활용)

---

## 📋 회사 사용 체크리스트

### 배포 전
- [ ] 라이센스 확인 (MIT - 상업적 사용 OK)
- [ ] 서버 준비 (클라우드 또는 사내)
- [ ] 도메인/IP 결정
- [ ] 보안 정책 수립 (접근 제어, 암호화)
- [ ] 백업 계획 수립

### 배포 중
- [ ] 서버 설치 및 설정
- [ ] 데이터베이스 초기화
- [ ] 네트워크/방화벽 설정
- [ ] SSL 인증서 설치
- [ ] 백업 자동화 설정

### 배포 후
- [ ] 팀원 교육 (사용 방법)
- [ ] 초기 데이터 입력
- [ ] 만료 알림 테스트
- [ ] 정기 백업 확인
- [ ] 모니터링 설정

---

## 🆘 기술 지원

### 오픈소스 프로젝트이므로:
- ✅ 무료로 사용 및 수정 가능
- ✅ 소스코드 완전 공개
- ❌ 유료 기술 지원 없음
- ✅ 커뮤니티/GitHub Issues 활용

### 회사에서 필요한 경우:
- 사내 개발팀이 커스터마이징
- 외부 개발사에 의뢰
- SI/보안 컨설팅 업체 활용

---

## 💡 회사별 권장 구성

| 회사 규모 | 권장 구성 | 보안 수준 | 비용 |
|----------|----------|---------|------|
| 소기업 (1-10명) | Docker 단일 서버 | Basic Auth | 무료-5만원 |
| 중소기업 (10-50명) | 클라우드 VM + RDS | VPN + 인증 | 5-20만원 |
| 대기업 (50명+) | HA 구성 + 권한 관리 | SSO + 감사 로그 | 20만원+ |

---

## 📝 법적 고지

### 데이터 책임
- 회사가 입력한 데이터는 회사 소유
- SSL 인증서, 라이센스 키 등 민감 정보는 회사 책임 하에 관리
- 데이터 유출 방지 책임은 회사에 있음

### 라이센스 의무사항
- MIT 라이센스 조건 준수
- LICENSE 파일 포함 유지
- 저작권 표시 유지

---

## 🚀 결론

**이 시스템은 회사에서 사용하기에 적합합니다!**

- ✅ **상업적 사용 가능** (MIT 라이센스)
- ✅ **무료** (영구)
- ✅ **보안 설정 가능** (Nginx, 방화벽, 인증)
- ✅ **커스터마이징 가능** (오픈소스)
- ✅ **확장 가능** (기능 추가 용이)

**시작 방법:**
1. 테스트 환경에서 먼저 시도
2. 보안 정책 수립
3. 프로덕션 배포
4. 팀 교육 및 사용

**문제가 있나요?**
- 📖 [DEPLOYMENT.md](./DEPLOYMENT.md) - 배포 가이드
- 🔒 보안 강화는 Nginx/방화벽 설정
- 💬 GitHub Issues (커뮤니티)

**회사에서 안전하게 사용하세요! 🏢**
