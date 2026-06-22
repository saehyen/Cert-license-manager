#!/bin/bash

# Quick Start Script for Rocky Linux

echo "============================================"
echo "Starting SSL Certificate & License Manager"
echo "Rocky Linux Edition"
echo "============================================"
echo ""

# Check if setup was run
if [ ! -f "backend/.env" ]; then
    echo "ERROR: Setup not completed"
    echo "Please run: ./setup-rockylinux.sh first"
    exit 1
fi

echo "Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..
sleep 3

echo "Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!
sleep 5

echo ""
echo "============================================"
echo "Servers Started!"
echo "============================================"
echo ""

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo "Backend:  http://$SERVER_IP:11050"
echo "Frontend: http://$SERVER_IP:13000"
echo ""
echo "Access from your browser:"
echo "  http://$SERVER_IP:13000"
echo ""
echo "Press Ctrl+C to stop servers..."
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servers stopped.'; exit 0" INT

wait
