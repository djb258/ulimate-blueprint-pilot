# PowerShell script to install Claude Code CLI and configure MCP with Cursor

Write-Host "Installing Claude Code CLI globally via npm..." -ForegroundColor Cyan
npm install -g @anthropic-ai/claude-code

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install Claude Code CLI. Please check your npm setup and try again." -ForegroundColor Red
    exit 1
}

Write-Host "Claude Code CLI installed." -ForegroundColor Green

# Create Cursor MCP config directory if it doesn't exist
$CURSOR_CONFIG_DIR = "$env:USERPROFILE\.cursor"
if (!(Test-Path $CURSOR_CONFIG_DIR)) {
    New-Item -ItemType Directory -Path $CURSOR_CONFIG_DIR -Force
}

# Create or update MCP config
$MCP_CONFIG_FILE = "$CURSOR_CONFIG_DIR\mcp.json"

if (Test-Path $MCP_CONFIG_FILE) {
    Write-Host "Updating existing MCP config at $MCP_CONFIG_FILE..." -ForegroundColor Cyan
} else {
    Write-Host "Creating new MCP config at $MCP_CONFIG_FILE..." -ForegroundColor Cyan
}

$mcpConfig = @{
    mcpServers = @{
        "claude-code" = @{
            command = "claude"
            args = @("mcp", "serve")
        }
    }
} | ConvertTo-Json -Depth 3

$mcpConfig | Out-File -FilePath $MCP_CONFIG_FILE -Encoding UTF8

Write-Host "MCP server config for Claude Code written to $MCP_CONFIG_FILE" -ForegroundColor Green

Write-Host "Done. Please restart Cursor and refresh MCP servers in settings." -ForegroundColor Yellow
Write-Host "Test by running: claude --version" -ForegroundColor Yellow 