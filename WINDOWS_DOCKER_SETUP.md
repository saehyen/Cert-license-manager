# 🪟 Windows에서 Docker 설치 및 설정 가이드

Windows에서 Docker를 처음 설치하고 설정하는 완벽 가이드입니다.

---

## 📋 사전 확인사항

### 1. Windows 버전 확인
- **Windows 10 64-bit**: Pro, Enterprise, Education (Build 19041 이상)
- **Windows 11** 64-bit

확인 방법:
```powershell
# PowerShell에서 실행
winver
```

### 2. 가상화 확인
BIOS에서 가상화(Virtualization)가 활성화되어 있어야 합니다.

확인 방법:
```powershell
# PowerShell에서 실행
systeminfo
# "Hyper-V Requirements" 섹션 확인
```

---

## 🚀 단계별 설치

### 1단계: WSL 2 설치

Docker Desktop은 WSL 2를 사용합니다.

#### PowerShell을 **관리자 권한**으로 실행

```powershell
# 1. WSL 활성화
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 2. 가상 머신 플랫폼 활성화
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 3. 컴퓨터 재시작
Restart-Computer
```

재시작 후 다시 **관리자 권한 PowerShell**에서:

```powershell
# 4. WSL 2를 기본 버전으로 설정
wsl --set-default-version 2

# 5. WSL 업데이트
wsl --update
```

### 2단계: Docker Desktop 설치

#### 방법 1: 수동 다운로드 (추천)

1. 브라우저에서 다음 링크 열기:
   - https://www.docker.com/products/docker-desktop/

2. **Download for Windows** 클릭

3. 다운로드한 `Docker Desktop Installer.exe` 실행

4. 설치 옵션:
   - ✅ **Use WSL 2 instead of Hyper-V** (선택)
   - ✅ **Add shortcut to desktop** (선택사항)

5. **Install** 클릭

6. 설치 완료 후 **Close and restart** 클릭

#### 방법 2: winget 사용 (PowerShell)

```powershell
# PowerShell에서 실행
winget install -e --id Docker.DockerDesktop
```

### 3단계: Docker Desktop 실행

1. 바탕화면 또는 시작 메뉴에서 **Docker Desktop** 실행

2. 첫 실행 시:
   - Docker 서비스 약관 동의
   - (선택사항) Docker Hub 계정 로그인 (건너뛰기 가능)

3. Docker가 실행되면 트레이 아이콘에 고래 모양이 나타남

4. "Docker Desktop is running" 메시지 확인

### 4단계: 설치 확인

일반 PowerShell (관리자 권한 불필요)에서:

```powershell
# Docker 버전 확인
docker --version
# 출력 예: Docker version 24.0.7, build afdd53b

# Docker Compose 버전 확인
docker compose version
# 출력 예: Docker Compose version v2.23.3

# Docker 실행 테스트
docker run hello-world
```

마지막 명령어가 성공하면 설치 완료! ✅

---

## ⚙️ Docker 설정 최적화

### 1. 리소스 할당 (선택사항)

Docker Desktop 설정:
1. Docker Desktop 아이콘 우클릭 → **Settings**
2. **Resources** 탭
3. 권장 설정:
   - **CPUs**: 2-4개
   - **Memory**: 4-8 GB
   - **Disk**: 64 GB 이상

### 2. WSL Integration 확인

1. Docker Desktop → **Settings**
2. **Resources** → **WSL Integration**
3. ✅ **Enable integration with my default WSL distro** 활성화

---

## 🐛 문제 해결

### ❌ "WSL 2 installation is incomplete"

**해결 방법:**

1. [WSL 2 커널 업데이트](https://aka.ms/wsl2kernel) 다운로드 및 설치
2. 컴퓨터 재시작
3. Docker Desktop 재시작

### ❌ "Hardware assisted virtualization and data execution protection must be enabled in the BIOS"

**해결 방법:**

1. BIOS 진입 (보통 부팅 시 F2, F10, Del 키)
2. **Virtualization Technology** 또는 **Intel VT-x** / **AMD-V** 찾기
3. **Enabled**로 변경
4. 저장하고 재부팅

### ❌ "docker: command not found" 또는 "docker-compose: command not found"

**해결 방법:**

1. Docker Desktop이 실행 중인지 확인
2. PowerShell을 새로 열기
3. 환경 변수 PATH 확인:
   ```powershell
   $env:Path -split ';' | Select-String docker
   ```

### ❌ Docker Desktop이 시작되지 않음

**해결 방법:**

1. **완전 재설치:**
   ```powershell
   # Docker Desktop 제거
   winget uninstall Docker.DockerDesktop
   
   # 또는 제어판 → 프로그램 제거
   
   # 재부팅 후 재설치
   ```

2. **서비스 확인:**
   ```powershell
   # 서비스 관리자 열기
   services.msc
   
   # "Docker Desktop Service" 확인
   # 실행 중이 아니면 시작
   ```

### ❌ "port is already allocated" 오류

**해결 방법:**

```powershell
# 사용 중인 포트 확인 (예: 3306)
netstat -ano | findstr :3306

# 프로세스 ID(PID) 확인 후 종료
taskkill /PID [PID번호] /F

# 또는 docker-compose.yml에서 포트 변경
# ports:
#   - "3307:3306"  # 외부 포트를 3307로 변경
```

---

## 🎯 프로젝트 실행하기

이제 Docker가 설치되었으니 프로젝트를 실행해봅시다!

### 방법 1: 자동 스크립트 (추천)

```powershell
cd c:\kiro\cert-license-manager
.\test-docker.ps1
```

### 방법 2: 수동 실행

```powershell
cd c:\kiro\cert-license-manager

# 컨테이너 시작
docker compose up -d

# 상태 확인
docker compose ps

# 로그 확인
docker compose logs -f

# 브라우저에서 http://localhost:13000 접속
```

### 방법 3: Docker Desktop GUI 사용

1. Docker Desktop 열기
2. **Containers** 탭
3. 프로젝트 디렉토리에서 `docker-compose.yml` 찾기
4. ▶️ **Start** 클릭

---

## 📝 유용한 명령어 모음

### Docker 기본 명령어

```powershell
# Docker 버전
docker --version

# Docker 정보
docker info

# 실행 중인 컨테이너
docker ps

# 모든 컨테이너 (중지된 것 포함)
docker ps -a

# 이미지 목록
docker images

# 컨테이너 로그
docker logs [컨테이너명]

# 컨테이너 중지
docker stop [컨테이너명]

# 컨테이너 삭제
docker rm [컨테이너명]

# 이미지 삭제
docker rmi [이미지명]

# 정리 (사용하지 않는 것 모두 삭제)
docker system prune -a
```

### Docker Compose 명령어

```powershell
# 프로젝트 디렉토리에서 실행

# 시작 (백그라운드)
docker compose up -d

# 시작 (로그 보기)
docker compose up

# 중지
docker compose stop

# 중지 및 제거
docker compose down

# 중지, 제거 및 볼륨 삭제 (데이터 삭제)
docker compose down -v

# 재시작
docker compose restart

# 로그 보기
docker compose logs

# 실시간 로그
docker compose logs -f

# 특정 서비스 로그
docker compose logs backend

# 재빌드
docker compose up -d --build

# 상태 확인
docker compose ps
```

---

## 🔧 고급 설정

### 1. Docker Desktop 자동 시작 비활성화

1. Docker Desktop → **Settings**
2. **General**
3. ❌ **Start Docker Desktop when you log in** 비활성화

### 2. 디스크 공간 정리

```powershell
# 사용하지 않는 리소스 정리
docker system prune -a --volumes

# 캐시 정리
docker builder prune
```

### 3. Docker Hub 로그인 (선택사항)

```powershell
docker login
# Username과 Password 입력
```

---

## 📊 성능 최적화 팁

### Windows에서 Docker 성능 향상

1. **WSL 2 사용** (기본 설정)
   - Hyper-V보다 빠름

2. **프로젝트를 WSL 파일 시스템에 배치**
   ```powershell
   # WSL Ubuntu에서
   cd ~
   mkdir projects
   cd projects
   # 여기에 프로젝트 복사
   ```

3. **리소스 적절히 할당**
   - Docker Desktop → Settings → Resources
   - CPU: 시스템 코어의 50%
   - Memory: 시스템 RAM의 50%

4. **불필요한 컨테이너/이미지 정리**
   ```powershell
   docker system prune -a
   ```

---

## ✅ 설치 완료 체크리스트

- [ ] Windows 버전 확인 (10/11 64-bit)
- [ ] BIOS 가상화 활성화
- [ ] WSL 2 설치 및 업데이트
- [ ] Docker Desktop 설치
- [ ] Docker Desktop 실행 확인
- [ ] `docker --version` 명령어 실행
- [ ] `docker compose version` 명령어 실행
- [ ] `docker run hello-world` 테스트 성공
- [ ] 프로젝트에서 `docker compose up -d` 실행
- [ ] http://localhost:13000 접속 확인

---

## 🎉 완료!

Docker 설치가 완료되었습니다!

### 다음 단계:

```powershell
# 1. 프로젝트 디렉토리로 이동
cd c:\kiro\cert-license-manager

# 2. Docker Compose로 실행
docker compose up -d

# 3. 브라우저에서 접속
# http://localhost:3000
```

### 문제가 있나요?

- 📖 [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Docker 사용 가이드
- 🐛 위 "문제 해결" 섹션 참조
- 💬 GitHub Issues 또는 커뮤니티 문의

---

## 📚 추가 학습 자료

- **Docker 공식 문서**: https://docs.docker.com/
- **WSL 2 문서**: https://docs.microsoft.com/ko-kr/windows/wsl/
- **Docker Compose 문서**: https://docs.docker.com/compose/

**Happy Docker-ing! 🐳**
