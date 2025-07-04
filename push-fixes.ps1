# PowerShell script to push fixes to GitHub
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

if ($currentVersion -lt $minVersion) {
    Write-Error "PowerShell Core 7.0.0 or higher is required. Current version: $currentVersion"
    exit 1
}

# Function to handle errors gracefully
function Write-StatusMessage {
    param(
        [string]$Message,
        [string]$Color = "Green"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Function to validate git commands
function Test-GitCommand {
    param([string]$Command)
    
    try {
        $result = & git $Command.Split(' ') 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "Git command failed: $Command"
        }
        return $result
    }
    catch {
        Write-Error "Git command error: $_"
        return $false
    }
}

try {
    Write-StatusMessage "Validating git installation..." "Yellow"
    
    # Check if git is available
    $gitPath = Get-Command git -ErrorAction SilentlyContinue
    if (-not $gitPath) {
        throw "Git is not installed or not in PATH"
    }
    
    Write-StatusMessage "Git found at: $($gitPath.Source)" "Green"
    
    Write-StatusMessage "Adding all changes..." "Green"
    if (-not (Test-GitCommand "add .")) {
        throw "Failed to add changes"
    }
    
    Write-StatusMessage "Committing fixes..." "Green"
    if (-not (Test-GitCommand "commit -m 'fix: Resolve all critical TypeScript and ESLint errors for Vercel deployment'")) {
        throw "Failed to commit changes"
    }
    
    Write-StatusMessage "Pushing to GitHub..." "Green"
    if (-not (Test-GitCommand "push origin main")) {
        throw "Failed to push to GitHub"
    }
    
    Write-StatusMessage "Done! Changes pushed to GitHub successfully." "Green"
}
catch {
    Write-Error "Script execution failed: $_"
    exit 1
}
finally {
    # Clean up any temporary variables
    Remove-Variable -Name gitPath, minVersion, currentVersion -ErrorAction SilentlyContinue
} 