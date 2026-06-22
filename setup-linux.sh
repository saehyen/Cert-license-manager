#!/bin/bash

# Linux Setup Script - SSL Certificate & License Manager

echo "============================================"
echo "SSL Certificate & License Manager Setup"
echo "============================================"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "WARNING: Do not run this script as root"
    echo "Run as normal user with sudo privileges"
    exit 1
fi

# Check Node.js
echo "1. Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   OK: Node.js installed - $NODE_VERSION"
else
    echo "   ERROR: Node.js not installed"
    echo "   Installing Node.js..."
    
    # Install Node.js 20.x
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    if command -v node &> /dev/null; then
        echo "   OK: Node.js installed successfully"
    else
        echo "   ERROR: Failed to install Node.js"
        exit 1
    fi
fi
echo ""

# Check MySQL
echo "2. Checking MySQL..."
if systemctl is-active --quiet mysql; then
    echo "   OK: MySQL is running"
elif systemctl is-active --quiet mysqld; then
    echo "   OK: MySQL is running"
else
    echo "   WARNING: MySQL not running or not installed"
    echo "   Installing MySQL..."
    
    sudo apt-get update
    sudo apt-get install -y mysql-server
    
    echo "   Starting MySQL service..."
    sudo systemctl start mysql
    sudo systemctl enable mysql
    
    echo "   OK: MySQL installed and started"
    echo ""
    echo "   IMPORTANT: Run MySQL secure installation:"
    echo "   sudo mysql_secure_installation"
    echo ""
fi
echo ""

# Install Backend Dependencies
echo "3. Installing backend dependencies..."
cd backend
if npm install; then
    echo "   OK: Backend dependencies installed"
else
    echo "   ERROR: Failed to install backend dependencies"
    exit 1
fi
cd ..
echo ""

# Install Frontend Dependencies
echo "4. Installing frontend dependencies..."
if npm install; then
    echo "   OK: Frontend dependencies installed"
else
    echo "   ERROR: Failed to install frontend dependencies"
    exit 1
fi
echo ""

# Setup .env files
echo "5. Setting up configuration files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    echo "   Creating backend/.env file..."
    read -sp "Enter MySQL root password: " DB_PASSWORD
    echo ""
    cat > backend/.env << EOF
PORT=11050
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=$DB_PASSWORD
DB_NAME=cert_license_db
EOF
    echo "   OK: backend/.env created"
else
    echo "   OK: backend/.env already exists"
fi

# Frontend .env
if [ ! -f ".env" ]; then
    echo "   Creating .env file..."
    cat > .env << EOF
VITE_API_URL=http://localhost:11050/api
EOF
    echo "   OK: .env created"
else
    echo "   OK: .env already exists"
fi
echo ""

# Initialize Database
echo "6. Initializing database..."
read -p "Initialize database now? (y/n): " INIT_DB
if [ "$INIT_DB" = "y" ] || [ "$INIT_DB" = "Y" ]; then
    echo "   Please enter MySQL root password when prompted"
    mysql -u root -p < backend/init-db.sql
    if [ $? -eq 0 ]; then
        echo "   OK: Database initialized"
    else
        echo "   WARNING: Database initialization may have failed"
        echo "   You can run manually: mysql -u root -p < backend/init-db.sql"
    fi
else
    echo "   Skipped. Run manually: mysql -u root -p < backend/init-db.sql"
fi
echo ""

# Make start script executable
chmod +x start-linux.sh

# Complete
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "Next Steps:"
echo ""
echo "1. Start Backend Server (in a new terminal):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2. Start Frontend Server (in another terminal):"
echo "   npm run dev"
echo ""
echo "3. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "Or use the quick start script:"
echo "   ./start-linux.sh"
echo ""
