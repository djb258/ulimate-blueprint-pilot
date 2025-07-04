# Blueprints Directory

This directory contains blueprint outputs with embedded logic manifests. All outputs in this directory follow the logic manifest specification to ensure consistent code generation across all IDEs and agents.

## Logic Manifest Embedding

Every blueprint output in this directory includes an embedded logic manifest that defines:

- **Canonical Data Table Design**: Authoritative database schema specifications
- **Join/Mapping Logic**: Standardized data relationship definitions
- **Constants & Variables**: Type-safe constant and variable declarations
- **Agent Interaction Patterns**: Approved patterns for AI agent interactions
- **Cursor Templates**: Standardized code generation templates
- **Health/Status Hooks**: System monitoring and error handling specifications
- **Audit Requirements**: Compliance and logging requirements

## Manifest Header Format

All outputs include a manifest header in the appropriate format for the file type:

### YAML Files
```yaml
# LOGIC MANIFEST EMBEDDED
# Version: 1.0.0
# Build Agent: Cursor AI Assistant
# Doctrine Reference: nuclear_doctrine_v1.2
# Generated At: 2025-01-03T12:00:00.000Z
# Embedded At: 2025-01-03T12:00:00.000Z
#
# This output is generated according to the embedded logic manifest.
# No modifications should be made beyond the manifest specifications.

# Actual blueprint content follows...
```

### TypeScript/JavaScript Files
```typescript
/**
 * LOGIC MANIFEST EMBEDDED
 * Version: 1.0.0
 * Build Agent: Cursor AI Assistant
 * Doctrine Reference: nuclear_doctrine_v1.2
 * Generated At: 2025-01-03T12:00:00.000Z
 * Embedded At: 2025-01-03T12:00:00.000Z
 * 
 * This output is generated according to the embedded logic manifest.
 * No modifications should be made beyond the manifest specifications.
 */

// Actual code follows...
```

### Python Files
```python
"""
LOGIC MANIFEST EMBEDDED
Version: 1.0.0
Build Agent: Cursor AI Assistant
Doctrine Reference: nuclear_doctrine_v1.2
Generated At: 2025-01-03T12:00:00.000Z
Embedded At: 2025-01-03T12:00:00.000Z

This output is generated according to the embedded logic manifest.
No modifications should be made beyond the manifest specifications.
"""

# Actual code follows...
```

### SQL Files
```sql
-- LOGIC MANIFEST EMBEDDED
-- Version: 1.0.0
-- Build Agent: Cursor AI Assistant
-- Doctrine Reference: nuclear_doctrine_v1.2
-- Generated At: 2025-01-03T12:00:00.000Z
-- Embedded At: 2025-01-03T12:00:00.000Z
--
-- This output is generated according to the embedded logic manifest.
-- No modifications should be made beyond the manifest specifications.

-- Actual SQL follows...
```

## Validation Rules

1. **No Freelancing**: Code generators must not modify beyond manifest specifications
2. **Version Tracking**: All outputs must include version and build agent tags
3. **Doctrine Compliance**: All outputs must reference the nuclear doctrine
4. **Manifest Integrity**: All outputs must pass manifest validation
5. **Audit Trail**: All generation activities must be logged

## Usage

When consuming blueprint outputs:

1. Extract the embedded logic manifest
2. Validate manifest integrity
3. Follow manifest specifications exactly
4. Do not add features beyond manifest scope
5. Include manifest in any derived outputs

## File Naming Convention

Blueprint files follow this naming pattern:
```
{blueprint_name}_{version}_{format}.{extension}
```

Examples:
- `user_management_v1.0.0_typescript.ts`
- `api_gateway_v1.0.0_yaml.yaml`
- `database_schema_v1.0.0_sql.sql`

## Logic Manifest Requirements

### Blueprint Packaging Specification

All future builds produced from this blueprint must consume the embedded logic manifest as the authoritative source of truth. The blueprint packaging specification now includes:

```yaml
logic_manifest_required: true
logic_manifest_spec:
  required_fields:
    - master_file_strategy
    - table_merge_plan
    - constants_variables_map
    - agent_interaction
    - cursor_scope
    - sustainment_plan
    - audit_map
    - build_agent
    - manifest_version
```

### Enforcement Rules

1. **No Build Approval Without Manifest**: All builds must validate and consume the embedded logic manifest
2. **No Code Generation Beyond Scope**: No modifications permitted beyond manifest specifications
3. **Manifest Embedding Required**: All build artifacts must include the embedded manifest
4. **Agent Interaction Limits**: All agents (Cursor, Claude, etc.) must follow manifest-defined patterns
5. **Audit Trail Mandatory**: All generation activities must be logged according to audit requirements

### Required Fields

- **master_file_strategy**: Defines primary and secondary files with merge strategy
- **table_merge_plan**: Specifies database table relationships and merge rules
- **constants_variables_map**: Maps global constants and module variables with validation rules
- **agent_interaction**: Defines allowed patterns and forbidden operations
- **cursor_scope**: Specifies template usage and code generation rules
- **sustainment_plan**: Defines health checks, monitoring hooks, and failure handlers
- **audit_map**: Specifies required audits, fields, and retention policies
- **build_agent**: Identifies the build agent for traceability
- **manifest_version**: Tracks manifest version for compatibility

### Safe Build Handoff

The logic manifest ensures:
- **Traceable**: All builds are traceable to their manifest source
- **Portable**: Builds can be safely transferred between agents
- **Cross-Agent**: Consistent behavior across different AI agents
- **Manifest-Locked**: No deviation from specified design patterns

## Compliance

All outputs in this directory are validated against the logic manifest specification. Any output without a valid embedded manifest will be rejected during the build process. No build is approved without manifest consumption and validation. 