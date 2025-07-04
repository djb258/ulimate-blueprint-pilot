# Cursor Universal Logic Enforcement Setup Guide

## Overview

This guide configures Cursor for universal logic enforcement in the Ultimate Blueprint Pilot project, ensuring all code generation consumes embedded logic manifests as the authoritative source of truth.

## 1️⃣ Fusion Tab & Agent Mode Configuration

### Enable Fusion Tab
- **Purpose**: Ensures multi-line logic consistency across files
- **Configuration**: 
  - Open Cursor Settings (Ctrl/Cmd + ,)
  - Navigate to "Fusion" section
  - Enable "Fusion Tab for all files"
  - Enable "Multi-line logic consistency"

### Activate Agent Mode
- **Purpose**: Enables project-wide tasks and manifest enforcement
- **Configuration**:
  - Enable "Agent Mode for project-wide tasks"
  - Enable "Auto-scan for manifest JSON blocks"
  - Enable "Enforce logic manifest during edits"

### Agent Auto-Scan Settings
```json
{
  "cursor.agent.enabled": true,
  "cursor.agent.autoScanManifest": true,
  "cursor.agent.enforceLogicManifest": true
}
```

## 2️⃣ Context & Model Configuration

### Model Selection
- **Recommended**: Claude-4 Sonnet (largest context support)
- **Alternative**: GPT-4o (if Claude-4 Sonnet unavailable)
- **Configuration**:
  - Open Cursor Settings
  - Navigate to "AI" section
  - Set "Model" to "claude-4-sonnet"

### Max Mode Activation
- **Purpose**: Ensures entire logic manifest is ingested
- **Configuration**:
  - Enable "Max Mode" or "Large Context Mode"
  - Set context window to maximum available
  - Enable "Large context processing"

### Context Settings
```json
{
  "cursor.context.maxMode": true,
  "cursor.context.largeContext": true,
  "cursor.model": "claude-4-sonnet"
}
```

## 3️⃣ Visual Context Configuration

### Mermaid Diagram Support
- **Purpose**: Render logic structure diagrams in code and comments
- **Configuration**:
  - Enable "Mermaid diagram rendering"
  - Enable "Inline diagram support"
  - Enable "Comment diagram parsing"

### Markdown Table Support
- **Purpose**: Display logic structure documentation visibly
- **Configuration**:
  - Enable "Inline Markdown tables"
  - Enable "Table rendering in comments"
  - Enable "Structured documentation display"

### Visual Context Settings
```json
{
  "cursor.mermaid.enabled": true,
  "cursor.markdown.tables": true
}
```

## 4️⃣ Memories & Sticky Prompts Configuration

### Memories Feature
- **Purpose**: Retain logic manifest across sessions
- **Configuration**:
  - Enable "Memories feature"
  - Set "Persistent memories" to true
  - Configure "Cross-session retention"

### Sticky Prompts
- **Purpose**: Store logic manifest as default context
- **Configuration**:
  - Enable "Sticky prompts"
  - Set default prompt to "universal_app_logic_manifest"
  - Enable "Automatic prompt application"

### Memory Context
```json
{
  "process_id": "universal_app_logic_manifest",
  "goal": "Preserve and apply universal app logic exactly as specified without reinterpretation.",
  "constraints": [
    "Do not modify or inject logic beyond manifest",
    "Embed manifest reference inline in code",
    "Ensure output is model-neutral and portable"
  ]
}
```

## 5️⃣ Validation & Enforcement Configuration

### Manifest Validation
- **Purpose**: Ensure all files include valid logic manifests
- **Configuration**:
  - Enable "Manifest validation on save"
  - Enable "Required fields checking"
  - Enable "Scope enforcement validation"

### Template Enforcement
- **Purpose**: Use manifest-defined templates only
- **Configuration**:
  - Enable "Use manifest templates"
  - Enable "Template scope enforcement"
  - Enable "Template validation"

### Validation Settings
```json
{
  "cursor.validation.manifestRequired": true,
  "cursor.validation.scopeEnforcement": true,
  "cursor.validation.auditTrail": true,
  "cursor.templates.useManifestTemplates": true,
  "cursor.templates.enforceScope": true
}
```

## 6️⃣ File-Specific Configuration

### TypeScript/JavaScript Files
- Enable "Manifest header inclusion"
- Enable "Constant usage validation"
- Enable "Pattern compliance checking"
- Enable "Health hook implementation"

### YAML/JSON Files
- Enable "Manifest comment inclusion"
- Enable "Schema validation"
- Enable "Version tag inclusion"

### React Components
- Enable "Template usage enforcement"
- Enable "Modification limit checking"
- Enable "Manifest validation integration"

### API Endpoints
- Enable "Template usage enforcement"
- Enable "Audit requirement implementation"
- Enable "Error handling pattern compliance"

## 7️⃣ Session Persistence Setup

### Cross-Session Retention
- **Configuration**:
  - Enable "Session memory persistence"
  - Set "Memory retention period" to "Indefinite"
  - Enable "Context restoration on startup"

### Team Member Synchronization
- **Configuration**:
  - Share `.cursor` folder in version control
  - Include `.cursorrules` in repository
  - Document setup process for new team members

### Persistence Settings
```json
{
  "cursor.memories.enabled": true,
  "cursor.memories.persistent": true,
  "cursor.stickyPrompts.enabled": true,
  "cursor.stickyPrompts.default": "universal_app_logic_manifest"
}
```

## 8️⃣ Verification Steps

### Configuration Verification
1. **Fusion Tab**: Verify multi-line consistency is active
2. **Agent Mode**: Confirm auto-scan and enforcement are enabled
3. **Model**: Verify Claude-4 Sonnet is selected
4. **Max Mode**: Confirm large context processing is active
5. **Mermaid**: Test diagram rendering in comments
6. **Memories**: Verify manifest context is retained
7. **Validation**: Test manifest validation on file save

### Functionality Testing
1. **Template Usage**: Create new file using manifest templates
2. **Validation**: Modify file and verify manifest compliance
3. **Scope Enforcement**: Attempt forbidden operation and verify rejection
4. **Audit Trail**: Check audit logging functionality
5. **Cross-Session**: Restart Cursor and verify context retention

## 9️⃣ Troubleshooting

### Common Issues
- **Model Not Available**: Fall back to GPT-4o
- **Context Limit**: Reduce context size or use chunking
- **Memory Loss**: Check memory persistence settings
- **Validation Failures**: Verify manifest format compliance

### Support Resources
- Cursor Documentation: [cursor.sh/docs](https://cursor.sh/docs)
- Logic Manifest Specification: `BLUEPRINT_PACKAGING_SPECIFICATION.md`
- Project Rules: `.cursorrules`

## 10️⃣ Team Setup Instructions

### New Team Member Setup
1. Clone repository with `.cursor` folder
2. Install Cursor IDE
3. Open project in Cursor
4. Verify configuration files are loaded
5. Test manifest validation functionality
6. Review logic manifest requirements

### Configuration Sharing
- Include all `.cursor` configuration files in repository
- Document any local overrides needed
- Maintain consistent settings across team
- Regular configuration validation meetings

## 11️⃣ Maintenance

### Regular Checks
- Weekly: Verify configuration integrity
- Monthly: Update manifest specifications
- Quarterly: Review enforcement effectiveness
- Annually: Update Cursor configuration standards

### Updates
- Monitor Cursor updates for new features
- Update configuration files as needed
- Maintain backward compatibility
- Document configuration changes

## 12️⃣ Compliance Monitoring

### Automated Checks
- CI/CD integration for manifest validation
- Automated testing of template compliance
- Regular audit trail verification
- Scope enforcement monitoring

### Manual Reviews
- Code review with manifest compliance checklist
- Template usage verification
- Audit trail completeness checks
- Scope violation detection

This configuration ensures that Cursor enforces universal logic manifest compliance across all development sessions and team members, providing safe, portable, and manifest-locked code generation. 