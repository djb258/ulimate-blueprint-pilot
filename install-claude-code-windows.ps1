# PowerShell script for Windows users to set up Claude Code CLI alternatives

Write-Host "Claude Code CLI Installation for Windows" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Note: Claude Code CLI is not directly supported on Windows." -ForegroundColor Yellow
Write-Host "However, you have several options:" -ForegroundColor Yellow
Write-Host ""

Write-Host "Option 1: Use WSL (Windows Subsystem for Linux)" -ForegroundColor Green
Write-Host "  1. Install WSL if not already installed:" -ForegroundColor White
Write-Host "     wsl --install" -ForegroundColor Gray
Write-Host "  2. Open WSL terminal and run:" -ForegroundColor White
Write-Host "     npm install -g @anthropic-ai/claude-code" -ForegroundColor Gray
Write-Host ""

Write-Host "Option 2: Use Docker" -ForegroundColor Green
Write-Host "  1. Install Docker Desktop for Windows" -ForegroundColor White
Write-Host "  2. Run Claude Code in a container" -ForegroundColor White
Write-Host ""

Write-Host "Option 3: Use Cursor's Built-in AI Features" -ForegroundColor Green
Write-Host "  Cursor already has excellent AI integration with Claude." -ForegroundColor White
Write-Host ""

# Check if WSL is available
Write-Host "Checking WSL availability..." -ForegroundColor Cyan
try {
    $wslOutput = wsl --list --verbose 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "WSL is available on your system!" -ForegroundColor Green
        Write-Host "You can install Claude Code CLI in WSL." -ForegroundColor White
    } else {
        Write-Host "WSL is not installed or not available." -ForegroundColor Yellow
        Write-Host "To install WSL, run: wsl --install" -ForegroundColor White
    }
} catch {
    Write-Host "WSL check failed. You may need to install WSL first." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Recommended Next Steps:" -ForegroundColor Cyan
Write-Host "1. Install WSL: wsl --install" -ForegroundColor White
Write-Host "2. Restart your computer" -ForegroundColor White
Write-Host "3. Open WSL terminal and run the bash installation script" -ForegroundColor White
Write-Host "4. Configure Cursor to use WSL for terminal" -ForegroundColor White

Write-Host ""
Write-Host "For now, you can use Cursor's built-in AI features which are excellent!" -ForegroundColor Green 