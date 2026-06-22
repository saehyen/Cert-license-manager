#!/bin/bash

# Quick Start Script for Linux

echo "============================================"
echo "Starting SSL Certificate & License Manager"
echo "============================================"
echo ""

# Check if setup was run
if [ ! -f "backend/.env" ]; then
    echo "ERROR: Setup not completed"
    echo "Please run: ./setup-linux.sh first"
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
echo "Backend:  http://localhost:11050"
echo "Frontend: http://localhost:13000"
echo ""
echo "Opening browser..."
sleep 2

# Try to open browser
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:13000
elif command -v gnome-open &> /dev/null; then
    gnome-open http://localhost:13000
fi

echo ""
echo "Press Ctrl+C to stop servers..."
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servers stopped.'; exit 0" INT

wait
