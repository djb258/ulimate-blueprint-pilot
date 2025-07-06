# Claude Code CLI Setup for Cursor

This directory contains scripts to install and configure Claude Code CLI with Cursor's Model Context Protocol (MCP).

## What is Claude Code CLI?

Claude Code CLI is a command-line interface that allows you to interact with Claude AI for code-related tasks. When integrated with Cursor via MCP, it provides enhanced AI capabilities directly within your development environment.

## Installation Scripts

### For Linux/macOS (Bash)
```bash
chmod +x install-claude-code.sh
./install-claude-code.sh
```

### For Windows (PowerShell)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install-claude-code.ps1
```

## What the Scripts Do

1. **Install Claude Code CLI globally** via npm
2. **Create Cursor MCP configuration** at `~/.cursor/mcp.json`
3. **Configure the MCP server** to use Claude Code CLI
4. **Provide setup instructions** for Cursor

## Manual Setup (Alternative)

If you prefer to set up manually:

### 1. Install Claude Code CLI
```bash
npm install -g @anthropic-ai/claude-code
```

### 2. Create MCP Configuration
Create or edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "claude-code": {
      "command": "claude",
      "args": ["mcp", "serve"]
    }
  }
}
```

## Post-Installation Steps

1. **Restart Cursor** completely
2. **Refresh MCP servers** in Cursor settings
3. **Test installation** by running: `claude --version`

## Verification

After installation, you should be able to:
- Run `claude --version` in your terminal
- See Claude Code as an available MCP server in Cursor
- Use enhanced AI features within Cursor

## Troubleshooting

### Common Issues

1. **Permission Denied**: Make sure you have write permissions to `~/.cursor/`
2. **npm not found**: Ensure Node.js and npm are installed
3. **MCP not working**: Restart Cursor and refresh MCP servers

### Manual Verification

Check if the MCP config was created correctly:
```bash
cat ~/.cursor/mcp.json
```

## Integration with Ultimate Blueprint Pilot

This setup enhances the Ultimate Blueprint Pilot by providing:
- **Enhanced AI assistance** for blueprint design
- **Code generation** capabilities
- **Intelligent suggestions** for phase completion
- **Context-aware help** throughout the development process

## Resources

- [Claude Code CLI Documentation](https://docs.anthropic.com/claude/docs/claude-code-cli)
- [Cursor MCP Documentation](https://cursor.sh/docs/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/) 