# 📤 GitHub 업로드 가이드

이 가이드는 프로젝트를 GitHub에 업로드하는 방법을 설명합니다.

---

## 🚀 빠른 업로드

### 1단계: GitHub 저장소 생성

1. https://github.com 접속 및 로그인
2. 우측 상단 **+** 클릭 → **New repository**
3. 저장소 설정:
   - Repository name: `cert-license-manager`
   - Description: `SSL Certificate & License Management System`
   - Public 또는 Private 선택
   - ✅ **Add a README file 체크 안 함** (이미 있음)
   - ✅ **Add .gitignore 체크 안 함** (이미 있음)
   - ✅ **Choose a license 체크 안 함** (이미 있음)
4. **Create repository** 클릭

### 2단계: Git 초기 설정 (최초 1회)

```powershell
# Git 사용자 정보 설정 (GitHub 계정 정보)
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### 3단계: 프로젝트 업로드

프로젝트 디렉토리에서:

```powershell
cd c:\kiro\cert-license-manager

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: SSL Certificate & License Management System"

# 원격 저장소 연결 (YOUR_USERNAME을 본인 GitHub 아이디로 변경)
git remote add origin https://github.com/YOUR_USERNAME/cert-license-manager.git

# GitHub에 푸시
git push -u origin main
```

**만약 main 브랜치가 아닌 master 브랜치라면:**
```powershell
git branch -M main
git push -u origin main
```

### 완료! 🎉
https://github.com/YOUR_USERNAME/cert-license-manager 에서 확인

---

## 🔐 GitHub 인증 (HTTPS)

### Personal Access Token 사용 (추천)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. **Generate new token (classic)** 클릭
3. Note: `cert-license-manager`
4. Expiration: `No expiration` 또는 원하는 기간
5. 권한 선택:
   - ✅ `repo` (전체 선택)
6. **Generate token** 클릭
7. **토큰 복사** (다시 볼 수 없으니 꼭 저장!)

### Token으로 푸시

```powershell
# 푸시 시 Username은 GitHub 아이디, Password는 Token 입력
git push -u origin main
Username: your-github-username
Password: ghp_xxxxxxxxxxxxxxxxxxxx (토큰 붙여넣기)
```

---

## 📝 파일 수정 후 업데이트

프로젝트를 수정한 후 GitHub에 업데이트:

```powershell
cd c:\kiro\cert-license-manager

# 변경된 파일 확인
git status

# 모든 변경사항 추가
git add .

# 커밋
git commit -m "수정 내용 설명"

# 푸시
git push
```

---

## 🐧 Linux에서 다운로드

다른 Linux 서버에서 다운로드:

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/cert-license-manager.git
cd cert-license-manager

# 자동 설정
chmod +x setup-linux.sh
./setup-linux.sh

# 실행
chmod +x start-linux.sh
./start-linux.sh
```

---

## 📋 .gitignore 확인

업로드되지 않는 파일들 (.gitignore):
- ✅ `node_modules/` - npm 패키지
- ✅ `.env` - 환경 변수 (비밀번호 등)
- ✅ `backend/.env` - 백엔드 환경 변수
- ✅ `dist/` - 빌드 결과물
- ✅ `*.log` - 로그 파일

---

## 🎯 GitHub Actions (자동 배포 - 선택사항)

### CI/CD 파이프라인 설정

`.github/workflows/deploy.yml` 생성:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    
    - name: Install dependencies
      run: |
        npm install
        cd backend && npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to server
      run: |
        # SSH로 서버에 배포
        # 설정 필요
```

---

## 🔄 협업하기

### 팀원 초대

1. GitHub 저장소 페이지
2. **Settings** → **Collaborators**
3. **Add people** → 팀원 GitHub 아이디 입력

### Branch 전략

```bash
# 새 기능 개발
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# GitHub에서 Pull Request 생성
```

---

## 📸 스크린샷 추가 (선택사항)

```bash
# screenshots 폴더 생성
mkdir screenshots

# 스크린샷 파일 추가
# light-mode.png
# dark-mode.png

# Git에 추가
git add screenshots/
git commit -m "Add screenshots"
git push
```

README.md에 이미지 링크:
```markdown
![Light Mode](screenshots/light-mode.png)
![Dark Mode](screenshots/dark-mode.png)
```

---

## 🏷️ 릴리스 만들기

1. GitHub 저장소 페이지
2. **Releases** → **Create a new release**
3. Tag: `v1.0.0`
4. Release title: `Version 1.0.0 - Initial Release`
5. Description: 변경 사항 설명
6. **Publish release**

---

## ⚠️ 주의사항

### 절대 업로드하면 안 되는 것:
- ❌ `.env` 파일 (비밀번호 포함)
- ❌ `node_modules/` (용량 너무 큼)
- ❌ 데이터베이스 백업 파일 (민감 정보)
- ❌ 개인 정보가 포함된 파일

### 실수로 업로드했다면:
```powershell
# 파일 삭제 및 히스토리에서 제거
git rm --cached .env
git commit -m "Remove .env file"
git push

# .gitignore에 추가
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
git push
```

---

## 🆘 문제 해결

### "fatal: remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/cert-license-manager.git
```

### "fatal: refusing to merge unrelated histories"
```powershell
git pull origin main --allow-unrelated-histories
```

### 푸시가 거부됨
```powershell
# 원격 저장소 변경사항 가져오기
git pull origin main --rebase
git push
```

---

## 📚 Git 기본 명령어

```powershell
git status              # 상태 확인
git add .               # 모든 변경사항 추가
git commit -m "메시지"  # 커밋
git push                # 푸시
git pull                # 원격 변경사항 가져오기
git log                 # 커밋 히스토리
git branch              # 브랜치 목록
```

---

## ✅ GitHub 업로드 체크리스트

- [ ] GitHub 계정 생성
- [ ] 새 저장소 생성
- [ ] Git 사용자 정보 설정
- [ ] `git init` (이미 완료됨)
- [ ] `.gitignore` 확인
- [ ] `git add .`
- [ ] `git commit -m "Initial commit"`
- [ ] `git remote add origin ...`
- [ ] `git push -u origin main`
- [ ] GitHub에서 업로드 확인
- [ ] README.md에서 YOUR_USERNAME 수정
- [ ] Linux에서 테스트

---

**GitHub에 업로드하고 Linux에서도 사용하세요! 🚀**
