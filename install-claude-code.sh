#!/bin/bash

echo "🔹 Installing Claude Code CLI globally via npm..."
npm install -g @anthropic-ai/claude-code

if [ $? -ne 0 ]; then
  echo "❌ Failed to install Claude Code CLI. Please check your npm setup and try again."
  exit 1
fi

echo "✅ Claude Code CLI installed."

# Create Cursor MCP config directory if it doesn't exist
CURSOR_CONFIG_DIR="$HOME/.cursor"
mkdir -p "$CURSOR_CONFIG_DIR"

# Create or update MCP config
MCP_CONFIG_FILE="$CURSOR_CONFIG_DIR/mcp.json"

if [ -f "$MCP_CONFIG_FILE" ]; then
  echo "🔹 Updating existing MCP config at $MCP_CONFIG_FILE..."
else
  echo "🔹 Creating new MCP config at $MCP_CONFIG_FILE..."
fi

cat > "$MCP_CONFIG_FILE" <<EOL
{
  "mcpServers": {
    "claude-code": {
      "command": "claude",
      "args": ["mcp", "serve"]
    }
  }
}
EOL

echo "✅ MCP server config for Claude Code written to $MCP_CONFIG_FILE"

echo "🔹 Done. Please restart Cursor and refresh MCP servers in settings."
echo "🔹 Test by running: claude --version" 