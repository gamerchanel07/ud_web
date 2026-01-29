    #!/bin/bash
# Quick diagnostic script for UD Hotels Login Issues

echo "==================================="
echo "UD Hotels - Login Diagnostics"
echo "==================================="
echo ""

# Check if backend is running
echo "🔍 Checking backend health..."
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running on port 5000"
    RESPONSE=$(curl -s http://localhost:5000/api/health)
    echo "   Response: $RESPONSE"
else
    echo "❌ Backend NOT running on port 5000"
    echo "   Start with: cd D:\\Project\\Ud\\server && npm start"
fi

echo ""

# Check if frontend is running
echo "🔍 Checking frontend..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running on port 3000"
else
    echo "❌ Frontend NOT running on port 3000"
    echo "   Start with: cd D:\\Project\\Ud\\client && npm run dev"
fi

echo ""

# Check if database is accessible
echo "🔍 Checking database connection..."
if [ -f "D:\\Project\\Ud\\server\\.env" ]; then
    echo "✅ Backend .env file found"
else
    echo "❌ Backend .env file NOT found"
    echo "   Create D:\\Project\\Ud\\server\\.env with required variables"
fi

echo ""

# Summary
echo "==================================="
echo "To fix 401 Login Error:"
echo "==================================="
echo "1. Start Backend:  cd D:\\Project\\Ud\\server && npm start"
echo "2. Start Frontend: cd D:\\Project\\Ud\\client && npm run dev"
echo "3. Visit: http://localhost:3000"
echo "4. Try login with default credentials"
echo "5. Check browser console (F12) for errors"
echo ""
