# PowerShell script to push fixes to GitHub
Write-Host "Adding all changes..." -ForegroundColor Green
git add .

Write-Host "Committing fixes..." -ForegroundColor Green
git commit -m "fix: Resolve all critical TypeScript and ESLint errors for Vercel deployment"

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push origin main

Write-Host "Done! Changes pushed to GitHub." -ForegroundColor Green 