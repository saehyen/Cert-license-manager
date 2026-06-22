# Windows Setup Script - SSL Certificate & License Manager

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "SSL Certificate & License Manager Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "1. Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   OK: Node.js installed - $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Node.js not installed" -ForegroundColor Red
    Write-Host "   Please install from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "   Download LTS version (recommended)" -ForegroundColor Yellow
    $open = Read-Host "Open download page? (Y/N)"
    if ($open -eq "Y" -or $open -eq "y") {
        Start-Process "https://nodejs.org/"
    }
    exit 1
}
Write-Host ""

# Check MySQL
Write-Host "2. Checking MySQL..." -ForegroundColor Yellow
$mysqlRunning = Get-Service -Name MySQL* -ErrorAction SilentlyContinue | Where-Object {$_.Status -eq 'Running'}
if ($mysqlRunning) {
    Write-Host "   OK: MySQL is running" -ForegroundColor Green
} else {
    Write-Host "   WARNING: MySQL not running or not installed" -ForegroundColor Yellow
    Write-Host "   Download from: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Quick MySQL Setup:" -ForegroundColor Cyan
    Write-Host "   1. Download MySQL Installer" -ForegroundColor White
    Write-Host "   2. Choose 'Server only' installation" -ForegroundColor White
    Write-Host "   3. Set root password (remember it!)" -ForegroundColor White
    Write-Host "   4. Complete installation" -ForegroundColor White
    Write-Host ""
    $open = Read-Host "Open download page? (Y/N)"
    if ($open -eq "Y" -or $open -eq "y") {
        Start-Process "https://dev.mysql.com/downloads/mysql/"
    }
    Write-Host ""
    Write-Host "After MySQL installation, run this script again." -ForegroundColor Yellow
    pause
    exit 0
}
Write-Host ""

# Install Backend Dependencies
Write-Host "3. Installing backend dependencies..." -ForegroundColor Yellow
Push-Location backend
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    Write-Host "   OK: Backend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Failed to install backend dependencies" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host ""

# Install Frontend Dependencies
Write-Host "4. Installing frontend dependencies..." -ForegroundColor Yellow
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    Write-Host "   OK: Frontend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Setup .env files
Write-Host "5. Setting up configuration files..." -ForegroundColor Yellow

# Backend .env
if (!(Test-Path "backend\.env")) {
    Write-Host "   Creating backend/.env file..." -ForegroundColor Gray
    $dbPassword = Read-Host "Enter MySQL root password"
    $envContent = @"
PORT=11050
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=$dbPassword
DB_NAME=cert_license_db
"@
    Set-Content -Path "backend\.env" -Value $envContent
    Write-Host "   OK: backend/.env created" -ForegroundColor Green
} else {
    Write-Host "   OK: backend/.env already exists" -ForegroundColor Green
}

# Frontend .env
if (!(Test-Path ".env")) {
    Write-Host "   Creating .env file..." -ForegroundColor Gray
    $envContent = "VITE_API_URL=http://localhost:11050/api"
    Set-Content -Path ".env" -Value $envContent
    Write-Host "   OK: .env created" -ForegroundColor Green
} else {
    Write-Host "   OK: .env already exists" -ForegroundColor Green
}
Write-Host ""

# Initialize Database
Write-Host "6. Initializing database..." -ForegroundColor Yellow
Write-Host "   Please enter MySQL root password when prompted" -ForegroundColor Gray
$mysqlPath = "mysql"
try {
    Get-Command mysql -ErrorAction Stop | Out-Null
    $initDb = Read-Host "Initialize database now? (Y/N)"
    if ($initDb -eq "Y" -or $initDb -eq "y") {
        Get-Content "backend\init-db.sql" | mysql -u root -p
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   OK: Database initialized" -ForegroundColor Green
        } else {
            Write-Host "   WARNING: Database initialization may have failed" -ForegroundColor Yellow
            Write-Host "   You can run manually: mysql -u root -p < backend\init-db.sql" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   Skipped. Run manually: mysql -u root -p < backend\init-db.sql" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   WARNING: mysql command not found in PATH" -ForegroundColor Yellow
    Write-Host "   Please run manually from MySQL installation directory:" -ForegroundColor Yellow
    Write-Host "   mysql -u root -p < backend\init-db.sql" -ForegroundColor Yellow
}
Write-Host ""

# Complete
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start Backend Server (in a new PowerShell):" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2. Start Frontend Server (in another PowerShell):" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Open browser:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Or use the quick start script:" -ForegroundColor Yellow
Write-Host "   .\start-windows.ps1" -ForegroundColor White
Write-Host ""

pause
