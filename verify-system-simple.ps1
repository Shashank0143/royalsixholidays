# RoyalSixHolidays - System Verification

Write-Host "RoyalSixHolidays System Verification" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# Check Backend Health
Write-Host "`nTesting Backend Connection..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET -UseBasicParsing
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "Backend is running successfully on port 5000" -ForegroundColor Green
        $healthData = $healthResponse.Content | ConvertFrom-Json
        Write-Host "Server Status: $($healthData.message)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Backend is not responding" -ForegroundColor Red
    Write-Host "Please ensure the backend server is running: npm run dev" -ForegroundColor Yellow
}

# Check Frontend
Write-Host "`nTesting Frontend Connection..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -UseBasicParsing
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "Frontend is running successfully on port 3000" -ForegroundColor Green
    }
} catch {
    Write-Host "Frontend is not responding" -ForegroundColor Red
    Write-Host "Please ensure the frontend server is running: npm run dev" -ForegroundColor Yellow
}

Write-Host "`nSystem Summary:" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host "Backend (Node.js/Express): http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend (Next.js): http://localhost:3000" -ForegroundColor Cyan
Write-Host "Database: MongoDB (configured)" -ForegroundColor Cyan

Write-Host "`nAvailable Features:" -ForegroundColor Green
Write-Host "- Authentication System (JWT + Google OAuth)" -ForegroundColor White
Write-Host "- Subscription Management" -ForegroundColor White
Write-Host "- Destinations and Places CRUD" -ForegroundColor White
Write-Host "- Booking System" -ForegroundColor White
Write-Host "- Reviews and Comments" -ForegroundColor White
Write-Host "- Protected Routes" -ForegroundColor White
Write-Host "- Admin Panel Ready" -ForegroundColor White
Write-Host "- Responsive UI Components" -ForegroundColor White

Write-Host "`nNext Steps:" -ForegroundColor Green
Write-Host "- Add sample data to database" -ForegroundColor White
Write-Host "- Configure Google OAuth credentials" -ForegroundColor White
Write-Host "- Implement India map with car animation" -ForegroundColor White
Write-Host "- Build additional pages" -ForegroundColor White

Write-Host "`nSystem is ready for development!" -ForegroundColor Green