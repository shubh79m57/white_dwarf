# ============================================
# White Dwarf — Launch Script
# Run this from PowerShell: .\start.ps1
# ============================================

Write-Host ""
Write-Host "  ✦  WHITE DWARF — Starting Servers  ✦" -ForegroundColor Magenta
Write-Host ""

# Add Node.js and Python to PATH for this session
$env:PATH = "C:\Program Files\nodejs;C:\Python314;C:\Python314\Scripts;C:\Users\P. Infotech\AppData\Roaming\Python\Python314\Scripts;" + $env:PATH

# Start Backend (FastAPI) in a new window
Write-Host "[1/2] Starting Backend (FastAPI on :8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
    `$env:PATH = 'C:\Program Files\nodejs;C:\Python314;C:\Python314\Scripts;C:\Users\P. Infotech\AppData\Roaming\Python\Python314\Scripts;' + `$env:PATH
    Set-Location 'e:\white_dwarf\backend'
    Write-Host '  Backend starting on http://localhost:8000' -ForegroundColor Green
    python -m uvicorn app.main:app --reload --port 8000
"@

# Wait a moment for backend to initialize
Start-Sleep -Seconds 3

# Start Frontend (Vite) in a new window
Write-Host "[2/2] Starting Frontend (Vite on :5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
    `$env:PATH = 'C:\Program Files\nodejs;C:\Python314;C:\Python314\Scripts;C:\Users\P. Infotech\AppData\Roaming\Python\Python314\Scripts;' + `$env:PATH
    Set-Location 'e:\white_dwarf\frontend'
    Write-Host '  Frontend starting on http://localhost:5173' -ForegroundColor Green
    npm run dev
"@

Write-Host ""
Write-Host "  Both servers launching in new windows!" -ForegroundColor Green
Write-Host "  Open http://localhost:5173 in your browser" -ForegroundColor Yellow
Write-Host ""
