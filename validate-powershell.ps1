# PowerShell Syntax Validation Script
# LOGIC MANIFEST EMBEDDED
# Version: 1.0.0
# Build Agent: Cursor AI Assistant
# Doctrine Reference: nuclear_doctrine_v1.2
# Generated At: 2025-01-03T12:00:00.000Z
#
# This output is generated according to the embedded logic manifest.
# No modifications should be made beyond the manifest specifications.

Set-StrictMode -Version Latest
Set-PSDebug -Trace 0

# Validate PowerShell version for Core 7 compatibility
$minVersion = [Version]"7.0.0"
$currentVersion = $PSVersionTable.PSVersion

Write-Host "PowerShell Syntax Validation Report" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "PowerShell Version: $currentVersion" -ForegroundColor Yellow
Write-Host "Required Version: $minVersion" -ForegroundColor Yellow

if ($currentVersion -lt $minVersion) {
    Write-Warning "PowerShell Core 7.0.0 or higher is recommended for full compatibility"
}

# Function to validate PowerShell syntax
function Test-PowerShellSyntax {
    param(
        [string]$FilePath
    )
    
    try {
        $content = Get-Content $FilePath -Raw -ErrorAction Stop
        $tokens = $null
        $errors = $null
        
        # Parse the script for syntax errors
        $null = [System.Management.Automation.PSParser]::Tokenize($content, [ref]$tokens, [ref]$errors)
        
        if ($errors.Count -gt 0) {
            Write-Host "❌ $FilePath" -ForegroundColor Red
            foreach ($syntaxError in $errors) {
                Write-Host "   Line $($syntaxError.StartLine): $($syntaxError.Message)" -ForegroundColor Red
            }
            return $false
        } else {
            Write-Host "✅ $FilePath" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "❌ $FilePath - Error reading file: $_" -ForegroundColor Red
        return $false
    }
}

# Function to check for common PowerShell issues
function Test-PowerShellBestPractices {
    param(
        [string]$FilePath
    )
    
    try {
        $content = Get-Content $FilePath -Raw -ErrorAction Stop
        $issues = @()
        
        # Check for strict mode
        if ($content -notmatch "Set-StrictMode") {
            $issues += "Missing Set-StrictMode declaration"
        }
        
        # Check for error handling
        if ($content -notmatch "try\s*\{|catch\s*\{|finally\s*\{") {
            $issues += "No error handling (try/catch/finally) detected"
        }
        
        # Check for proper parameter validation
        if ($content -match "param\s*\(" -and $content -notmatch "\[Parameter\]|\[ValidateNotNull\]|\[ValidateNotNullOrEmpty\]") {
            $issues += "Parameters lack validation attributes"
        }
        
        # Check for hardcoded paths (potential issue)
        if ($content -match "C:\\|/usr/|/etc/") {
            $issues += "Hardcoded paths detected - consider using environment variables"
        }
        
        # Check for deprecated cmdlets (only if not in validation script)
        if ($FilePath -notlike "*validate-powershell.ps1") {
            $deprecatedCmdlets = @("Get-WmiObject", "Invoke-WmiMethod", "Register-WmiEvent")
            foreach ($cmdlet in $deprecatedCmdlets) {
                if ($content -match $cmdlet) {
                    $issues += "Deprecated cmdlet detected: $cmdlet - use CimCmdlets instead"
                }
            }
        }
        
        if ($issues -and $issues.Count -gt 0) {
            Write-Host "⚠️  $FilePath" -ForegroundColor Yellow
            foreach ($issue in $issues) {
                Write-Host "   - $issue" -ForegroundColor Yellow
            }
        } else {
            Write-Host "✅ $FilePath (Best practices)" -ForegroundColor Green
        }
        
        return $issues
    }
    catch {
        Write-Host "❌ $FilePath - Error analyzing best practices: $_" -ForegroundColor Red
        return @("Error analyzing file")
    }
}

# Find all PowerShell files
Write-Host "`nScanning for PowerShell files..." -ForegroundColor Cyan
$psFiles = Get-ChildItem -Path . -Recurse -Include "*.ps1", "*.psm1", "*.psd1" | Where-Object { $_.FullName -notlike "*node_modules*" }

if ($psFiles.Count -eq 0) {
    Write-Host "No PowerShell files found in the project." -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($psFiles.Count) PowerShell file(s):" -ForegroundColor Green

# Validate syntax for each file
$syntaxErrors = 0
$bestPracticeIssues = 0

Write-Host "`nSyntax Validation:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan

foreach ($file in $psFiles) {
    if (-not (Test-PowerShellSyntax $file.FullName)) {
        $syntaxErrors++
    }
}

Write-Host "`nBest Practices Check:" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

foreach ($file in $psFiles) {
    $issues = Test-PowerShellBestPractices $file.FullName
    if ($issues.Count -gt 0) {
        $bestPracticeIssues++
    }
}

# Summary
Write-Host "`nValidation Summary:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "Files scanned: $($psFiles.Count)" -ForegroundColor White
Write-Host "Syntax errors: $syntaxErrors" -ForegroundColor $(if ($syntaxErrors -eq 0) { "Green" } else { "Red" })
Write-Host "Best practice issues: $bestPracticeIssues" -ForegroundColor $(if ($bestPracticeIssues -eq 0) { "Green" } else { "Yellow" })

if ($syntaxErrors -eq 0 -and $bestPracticeIssues -eq 0) {
    Write-Host "`n🎉 All PowerShell files passed validation!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n⚠️  Issues found. Please review and fix the above problems." -ForegroundColor Yellow
    exit 1
} 