#!/bin/bash

# Rocky Linux Setup Script - SSL Certificate & License Manager

echo "============================================"
echo "SSL Certificate & License Manager Setup"
echo "Rocky Linux Edition"
echo "============================================"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "WARNING: Do not run this script as root"
    echo "Run as normal user with sudo privileges"
    exit 1
fi

# Check Rocky Linux version
echo "1. Checking Rocky Linux version..."
if [ -f /etc/rocky-release ]; then
    ROCKY_VERSION=$(cat /etc/rocky-release)
    echo "   OK: $ROCKY_VERSION"
else
    echo "   WARNING: This script is optimized for Rocky Linux"
    echo "   Continuing anyway..."
fi
echo ""

# Check Node.js
echo "2. Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   OK: Node.js installed - $NODE_VERSION"
else
    echo "   Node.js not installed. Installing..."
    
    # Install Node.js 20.x from NodeSource
    echo "   Adding NodeSource repository..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    
    echo "   Installing Node.js..."
    sudo dnf install -y nodejs
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo "   OK: Node.js $NODE_VERSION installed successfully"
    else
        echo "   ERROR: Failed to install Node.js"
        exit 1
    fi
fi
echo ""

# Check npm
echo "3. Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "   OK: npm $NPM_VERSION installed"
else
    echo "   ERROR: npm not found"
    exit 1
fi
echo ""

# Check MySQL
echo "4. Checking MySQL..."
if systemctl is-active --quiet mysqld; then
    echo "   OK: MySQL is running"
elif command -v mysql &> /dev/null; then
    echo "   MySQL installed but not running. Starting..."
    sudo systemctl start mysqld
    sudo systemctl enable mysqld
    echo "   OK: MySQL started"
else
    echo "   MySQL not installed. Installing MySQL 8.0..."
    
    # Install MySQL 8.0 repository
    sudo dnf install -y https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm
    
    # Import MySQL GPG key
    sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2023
    
    # Install MySQL server
    sudo dnf install -y mysql-server
    
    # Start MySQL service
    sudo systemctl start mysqld
    sudo systemctl enable mysqld
    
    echo "   OK: MySQL installed and started"
    echo ""
    echo "   IMPORTANT: MySQL root temporary password:"
    sudo grep 'temporary password' /var/log/mysqld.log | tail -1
    echo ""
    echo "   Run MySQL secure installation:"
    echo "   sudo mysql_secure_installation"
    echo ""
    read -p "Press Enter to continue after securing MySQL..."
fi
echo ""

# Install Git if not present
echo "5. Checking Git..."
if ! command -v git &> /dev/null; then
    echo "   Installing Git..."
    sudo dnf install -y git
    echo "   OK: Git installed"
else
    echo "   OK: Git is installed"
fi
echo ""

# Install Backend Dependencies
echo "6. Installing backend dependencies..."
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
echo "7. Installing frontend dependencies..."
if npm install; then
    echo "   OK: Frontend dependencies installed"
else
    echo "   ERROR: Failed to install frontend dependencies"
    exit 1
fi
echo ""

# Setup .env files
echo "8. Setting up configuration files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    echo "   Creating backend/.env file..."
    read -sp "   Enter MySQL root password: " DB_PASSWORD
    echo ""
    cat > backend/.env << EOF
PORT=5000
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
    
    # Get server IP
    SERVER_IP=$(hostname -I | awk '{print $1}')
    echo "   Detected server IP: $SERVER_IP"
    read -p "   Use this IP for API URL? (Y/n): " USE_IP
    
    if [ "$USE_IP" = "n" ] || [ "$USE_IP" = "N" ]; then
        read -p "   Enter API URL (e.g., http://your-domain.com:5000/api): " API_URL
    else
        API_URL="http://$SERVER_IP:5000/api"
    fi
    
    cat > .env << EOF
VITE_API_URL=$API_URL
EOF
    echo "   OK: .env created with API_URL=$API_URL"
else
    echo "   OK: .env already exists"
fi
echo ""

# Initialize Database
echo "9. Initializing database..."
read -p "   Initialize database now? (Y/n): " INIT_DB
if [ "$INIT_DB" != "n" ] && [ "$INIT_DB" != "N" ]; then
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

# Configure Firewall
echo "10. Configuring firewall..."
if command -v firewall-cmd &> /dev/null; then
    read -p "   Open ports 3000 and 5000 in firewall? (Y/n): " OPEN_PORTS
    if [ "$OPEN_PORTS" != "n" ] && [ "$OPEN_PORTS" != "N" ]; then
        sudo firewall-cmd --permanent --add-port=3000/tcp
        sudo firewall-cmd --permanent --add-port=5000/tcp
        sudo firewall-cmd --reload
        echo "   OK: Ports 3000 and 5000 opened"
    else
        echo "   Skipped. Open manually:"
        echo "   sudo firewall-cmd --permanent --add-port=3000/tcp"
        echo "   sudo firewall-cmd --permanent --add-port=5000/tcp"
        echo "   sudo firewall-cmd --reload"
    fi
else
    echo "   WARNING: firewalld not found"
fi
echo ""

# Make start script executable
chmod +x start-rockylinux.sh

# Complete
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "Next Steps:"
echo ""
echo "Manual Start:"
echo "  1. Backend (in a new terminal):"
echo "     cd backend && npm run dev"
echo ""
echo "  2. Frontend (in another terminal):"
echo "     npm run dev"
echo ""
echo "  3. Open browser:"
echo "     http://$SERVER_IP:3000"
echo ""
echo "Or use the quick start script:"
echo "  ./start-rockylinux.sh"
echo ""
echo "For production deployment:"
echo "  See ROCKYLINUX_DEPLOYMENT.md"
echo ""
