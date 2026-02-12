#!/bin/bash

# Hair Salon Booking System - Quick Start Script

echo "🏛️  Hair Salon Booking System - Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd backend
cp .env.example .env
echo "   - Created .env file (edit with your PostgreSQL details)"

if [ ! -d "node_modules" ]; then
    npm install
    echo "   ✅ Dependencies installed"
else
    echo "   ✅ Dependencies already installed"
fi

cd ..
echo ""

# Frontend setup
echo "📦 Setting up Frontend..."
cd frontend
cp .env.example .env
echo "   - Created .env file"

if [ ! -d "node_modules" ]; then
    npm install
    echo "   ✅ Dependencies installed"
else
    echo "   ✅ Dependencies already installed"
fi

cd ..
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your PostgreSQL connection string"
echo "2. Run: cd backend && npm run migrate (to create databases tables)"
echo "3. Run: npm run dev (in backend directory, in one terminal)"
echo "4. Run: npm run dev (in frontend directory, in another terminal)"
echo ""
echo "Frontend will be available at: http://localhost:3000"
echo "Backend will be available at: http://localhost:5000"
