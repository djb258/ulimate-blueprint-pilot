"use client";

import React, { useState, useRef } from "react";
import type { PlanPhasePayload, PlanPhaseAuditLog } from "../types";
import LoadingSpinner from "./LoadingSpinner";
import { useNotificationHelpers } from "./NotificationSystem";

// UI output binding (for validation)
const PLAN_UI_OUTPUT_SCHEMA = {
  plan_phase_id: "string",
  plan_phase_duration: "number",
  objective: {
    data_domain: "string",
    target_output: "string",
  },
  constraints: {
    input_format: "string",
    output_target: "string",
  },
  assumptions: {
    items: "string[]",
    reviewed: "boolean",
    confirmed: "boolean",
    revisions: "string[]?",
  },
  input_references: "array",
  validation_criteria: "array",
  inference_flags: "array",
  promotion_conditions: "object",
  audit_log: "array",
};

function getInitialPayload(user: string): PlanPhasePayload {
  return {
    plan_phase_id: `plan_${Date.now()}`,
    plan_phase_duration: 0,
    objective: { data_domain: "", target_output: "" },
    constraints: { input_format: "", output_target: "" },
    assumptions: { items: [], reviewed: false, confirmed: false },
    input_references: [],
    validation_criteria: [],
    inference_flags: [],
    promotion_conditions: {
      all_fields_populated: false,
      owner_signoff: false,
      ui_output_binding_match: false,
      promote_to_phase2: false,
    },
    audit_log: [
      {
        timestamp: new Date().toISOString(),
        action: "plan_phase_created",
        user,
        details: "PLAN phase initialized",
      },
    ],
  };
}

function validatePlanPayload(payload: PlanPhasePayload): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!payload.objective.data_domain) errors.push("Objective data domain required");
  if (!payload.objective.target_output) errors.push("Objective target output required");
  if (!payload.constraints.input_format) errors.push("Constraint input format required");
  if (!payload.constraints.output_target) errors.push("Constraint output target required");
  if (!payload.assumptions.items.length) errors.push("At least one assumption required");
  if (!payload.assumptions.reviewed || !payload.assumptions.confirmed) errors.push("Assumptions must be reviewed and confirmed");
  if (payload.input_references.length === 0) errors.push("At least one input reference required");
  if (payload.input_references.some(ref => !ref.type)) errors.push("Each input reference must have a type");
  if (payload.validation_criteria.length < 2) errors.push("At least two validation criteria required");
  if (!payload.promotion_conditions.owner_signoff) errors.push("Owner signoff required");
  if (!payload.promotion_conditions.ui_output_binding_match) errors.push("UI output binding match required");
  return { valid: errors.length === 0, errors };
}

function checkUiOutputBinding(payload: PlanPhasePayload): boolean {
  // Minimal check: all required fields exist and types match
  try {
    if (typeof payload.plan_phase_id !== "string") return false;
    if (typeof payload.plan_phase_duration !== "number") return false;
    if (typeof payload.objective.data_domain !== "string") return false;
    if (typeof payload.objective.target_output !== "string") return false;
    if (typeof payload.constraints.input_format !== "string") return false;
    if (typeof payload.constraints.output_target !== "string") return false;
    if (!Array.isArray(payload.assumptions.items)) return false;
    if (typeof payload.assumptions.reviewed !== "boolean") return false;
    if (typeof payload.assumptions.confirmed !== "boolean") return false;
    if (!Array.isArray(payload.input_references)) return false;
    if (!Array.isArray(payload.validation_criteria)) return false;
    if (!Array.isArray(payload.inference_flags)) return false;
    if (typeof payload.promotion_conditions !== "object") return false;
    if (!Array.isArray(payload.audit_log)) return false;
    return true;
  } catch {
    return false;
  }
}

const PING_PONG_PLACEHOLDER = (
  <div className="bg-gray-50 border border-dashed border-gray-300 rounded p-4 my-4 text-center text-gray-500 italic">
    Ping-pong prompt flow placeholder (to be implemented)
  </div>
);

interface PlanPhaseModuleProps {
  user: string;
  onPromoteToPhase2: (payload: PlanPhasePayload) => void;
}

const PlanPhaseModule: React.FC<PlanPhaseModuleProps> = ({ user, onPromoteToPhase2 }) => {
  const [payload, setPayload] = useState<PlanPhasePayload>(() => getInitialPayload(user));
  const [feed0, setFeed0] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [audit, setAudit] = useState<PlanPhaseAuditLog[]>(payload.audit_log);
  const [promotionError, setPromotionError] = useState<string | null>(null);
  const [promotionSuccess, setPromotionSuccess] = useState(false);
  const { showSuccess, showError } = useNotificationHelpers();
  const phaseStartRef = useRef<number>(Date.now());

  // Feed 0 input handler
  const handleFeed0Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feed0.trim()) return;
    const newAudit: PlanPhaseAuditLog = {
      timestamp: new Date().toISOString(),
      action: "feed0_submitted",
      user,
      details: `Feed 0 input: ${feed0}`,
    };
    setAudit(a => [...a, newAudit]);
    setPayload(p => ({
      ...p,
      objective: { ...p.objective, data_domain: feed0 },
      audit_log: [...p.audit_log, newAudit],
    }));
    setFeed0("");
  };

  // Simulate ping-pong prompt flow (placeholder)
  const handlePingPong = () => {
    setIsPrompting(true);
    setTimeout(() => {
      setIsPrompting(false);
      const newAudit: PlanPhaseAuditLog = {
        timestamp: new Date().toISOString(),
        action: "ping_pong_completed",
        user,
        details: "Ping-pong prompt flow completed (placeholder)",
      };
      setAudit(a => [...a, newAudit]);
      setPayload(p => ({
        ...p,
        audit_log: [...p.audit_log, newAudit],
      }));
      showSuccess("Prompt Flow Complete", "Ping-pong prompt flow completed (placeholder)");
    }, 1200);
  };

  // Update PLAN payload fields
  const updatePayload = (fields: Partial<PlanPhasePayload>) => {
    setPayload(p => ({ ...p, ...fields }));
  };

  // Promotion logic
  const handlePromote = () => {
    const duration = Math.floor((Date.now() - phaseStartRef.current) / 1000);
    const updatedPayload = {
      ...payload,
      plan_phase_duration: duration,
      promotion_conditions: {
        ...payload.promotion_conditions,
        all_fields_populated: true,
        ui_output_binding_match: checkUiOutputBinding(payload),
        promote_to_phase2: false, // Only set true after all checks
      },
      audit_log: [
        ...payload.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: "promotion_attempted",
          user,
          details: "User attempted to promote to Phase 2.",
        },
      ],
    };
    const validation = validatePlanPayload(updatedPayload);
    if (!validation.valid) {
      setPromotionError(validation.errors.join("; "));
      setPayload(updatedPayload);
      showError("Promotion Blocked", validation.errors.join("; "));
      return;
    }
    if (!updatedPayload.promotion_conditions.ui_output_binding_match) {
      setPromotionError("PLAN output does not match UI output binding contract.");
      showError("Promotion Blocked", "PLAN output does not match UI output binding contract.");
      return;
    }
    // All checks passed
    updatedPayload.promotion_conditions.promote_to_phase2 = true;
    updatedPayload.promotion_conditions.all_fields_populated = true;
    updatedPayload.promotion_conditions.owner_signoff = true;
    setPayload(updatedPayload);
    setPromotionError(null);
    setPromotionSuccess(true);
    showSuccess("Promoted!", "PLAN phase promoted to Phase 2.");
    onPromoteToPhase2(updatedPayload);
  };

  // Exception logging
  const handleException = (reason: string, mitigation: string) => {
    const newAudit: PlanPhaseAuditLog = {
      timestamp: new Date().toISOString(),
      action: "exception_logged",
      user,
      details: `Reason: ${reason}; Mitigation: ${mitigation}`,
    };
    setAudit(a => [...a, newAudit]);
    setPayload(p => ({
      ...p,
      promotion_conditions: {
        ...p.promotion_conditions,
        exception_logged: { reason, mitigation_plan: mitigation },
      },
      audit_log: [...p.audit_log, newAudit],
    }));
    showError("Exception Logged", reason);
  };

  // UI
  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-900">PLAN Phase</h2>
      <form onSubmit={handleFeed0Submit} className="mb-4 flex gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter minimal seed prompt (Feed 0)"
          value={feed0}
          onChange={e => setFeed0(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>

      {/* Ping-pong prompt flow placeholder */}
      {PING_PONG_PLACEHOLDER}
      <button
        onClick={handlePingPong}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
        disabled={isPrompting}
      >
        {isPrompting ? <LoadingSpinner size="sm" text="Prompting..." /> : "Run Prompt Flow"}
      </button>

      {/* PLAN Payload Editor (for demo, can be replaced with UI forms) */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Objective</label>
        <input
          className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Data domain"
          value={payload.objective.data_domain}
          onChange={e => updatePayload({ objective: { ...payload.objective, data_domain: e.target.value } })}
        />
        <input
          className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Target output"
          value={payload.objective.target_output}
          onChange={e => updatePayload({ objective: { ...payload.objective, target_output: e.target.value } })}
        />
        <label className="block font-medium text-gray-700 mb-1 mt-2">Constraints</label>
        <input
          className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Input format"
          value={payload.constraints.input_format}
          onChange={e => updatePayload({ constraints: { ...payload.constraints, input_format: e.target.value } })}
        />
        <input
          className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Output target"
          value={payload.constraints.output_target}
          onChange={e => updatePayload({ constraints: { ...payload.constraints, output_target: e.target.value } })}
        />
        <label className="block font-medium text-gray-700 mb-1 mt-2">Assumptions</label>
        <textarea
          className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="List assumptions, one per line"
          value={payload.assumptions.items.join("\n")}
          onChange={e => updatePayload({ assumptions: { ...payload.assumptions, items: e.target.value.split("\n") } })}
        />
        <div className="flex gap-2 mb-2">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={payload.assumptions.reviewed}
              onChange={e => updatePayload({ assumptions: { ...payload.assumptions, reviewed: e.target.checked } })}
            />
            Reviewed
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={payload.assumptions.confirmed}
              onChange={e => updatePayload({ assumptions: { ...payload.assumptions, confirmed: e.target.checked } })}
            />
            Confirmed
          </label>
        </div>
        <label className="block font-medium text-gray-700 mb-1 mt-2">Input References</label>
        <button
          type="button"
          className="mb-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          onClick={() => updatePayload({ input_references: [...payload.input_references, { type: "spec", label: "Stub Reference", stub: true }] })}
        >
          Add Reference Stub
        </button>
        <ul className="mb-2">
          {payload.input_references.map((ref, idx) => (
            <li key={idx} className="flex gap-2 items-center mb-1">
              <select
                value={ref.type}
                onChange={e => {
                  const refs = [...payload.input_references];
                  refs[idx].type = e.target.value as any;
                  updatePayload({ input_references: refs });
                }}
                className="px-2 py-1 border rounded"
              >
                <option value="spec">Spec</option>
                <option value="repo">Repo</option>
                <option value="compliance_doc">Compliance Doc</option>
                <option value="other">Other</option>
              </select>
              <input
                className="px-2 py-1 border rounded flex-1"
                placeholder="Label"
                value={ref.label}
                onChange={e => {
                  const refs = [...payload.input_references];
                  refs[idx].label = e.target.value;
                  updatePayload({ input_references: refs });
                }}
              />
              <input
                className="px-2 py-1 border rounded flex-1"
                placeholder="URL (optional)"
                value={ref.url || ""}
                onChange={e => {
                  const refs = [...payload.input_references];
                  refs[idx].url = e.target.value;
                  updatePayload({ input_references: refs });
                }}
              />
              <button
                type="button"
                className="text-red-500 hover:underline"
                onClick={() => {
                  const refs = payload.input_references.filter((_, i) => i !== idx);
                  updatePayload({ input_references: refs });
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <label className="block font-medium text-gray-700 mb-1 mt-2">Validation Criteria</label>
        <button
          type="button"
          className="mb-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          onClick={() => updatePayload({ validation_criteria: [...payload.validation_criteria, { description: "", test: "", measurable: true }] })}
        >
          Add Validation
        </button>
        <ul className="mb-2">
          {payload.validation_criteria.map((vc, idx) => (
            <li key={idx} className="flex gap-2 items-center mb-1">
              <input
                className="px-2 py-1 border rounded flex-1"
                placeholder="Description"
                value={vc.description}
                onChange={e => {
                  const v = [...payload.validation_criteria];
                  v[idx].description = e.target.value;
                  updatePayload({ validation_criteria: v });
                }}
              />
              <input
                className="px-2 py-1 border rounded flex-1"
                placeholder="Test"
                value={vc.test}
                onChange={e => {
                  const v = [...payload.validation_criteria];
                  v[idx].test = e.target.value;
                  updatePayload({ validation_criteria: v });
                }}
              />
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={vc.measurable}
                  onChange={e => {
                    const v = [...payload.validation_criteria];
                    v[idx].measurable = e.target.checked;
                    updatePayload({ validation_criteria: v });
                  }}
                />
                Measurable
              </label>
              <button
                type="button"
                className="text-red-500 hover:underline"
                onClick={() => {
                  const v = payload.validation_criteria.filter((_, i) => i !== idx);
                  updatePayload({ validation_criteria: v });
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <label className="block font-medium text-gray-700 mb-1 mt-2">Inference Flags</label>
        <button
          type="button"
          className="mb-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          onClick={() => updatePayload({ inference_flags: [...payload.inference_flags, { field: "", inferred: true, confirmation_required: true }] })}
        >
          Add Inference Flag
        </button>
        <ul className="mb-2">
          {payload.inference_flags.map((flag, idx) => (
            <li key={idx} className="flex gap-2 items-center mb-1">
              <input
                className="px-2 py-1 border rounded flex-1"
                placeholder="Field"
                value={flag.field}
                onChange={e => {
                  const f = [...payload.inference_flags];
                  f[idx].field = e.target.value;
                  updatePayload({ inference_flags: f });
                }}
              />
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={flag.inferred}
                  onChange={e => {
                    const f = [...payload.inference_flags];
                    f[idx].inferred = e.target.checked;
                    updatePayload({ inference_flags: f });
                  }}
                />
                Inferred
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={flag.confirmation_required}
                  onChange={e => {
                    const f = [...payload.inference_flags];
                    f[idx].confirmation_required = e.target.checked;
                    updatePayload({ inference_flags: f });
                  }}
                />
                Confirmation Required
              </label>
              <input
                className="px-2 py-1 border rounded flex-1"
                placeholder="Note (optional)"
                value={flag.note || ""}
                onChange={e => {
                  const f = [...payload.inference_flags];
                  f[idx].note = e.target.value;
                  updatePayload({ inference_flags: f });
                }}
              />
              <button
                type="button"
                className="text-red-500 hover:underline"
                onClick={() => {
                  const f = payload.inference_flags.filter((_, i) => i !== idx);
                  updatePayload({ inference_flags: f });
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Exception logging */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Log Exception (if any)</label>
        <button
          type="button"
          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm mb-2"
          onClick={() => {
            const reason = prompt("Exception reason?");
            const mitigation = prompt("Mitigation plan?");
            if (reason && mitigation) handleException(reason, mitigation);
          }}
        >
          Log Exception
        </button>
        {payload.promotion_conditions.exception_logged && (
          <div className="text-xs text-red-600 mt-1">
            <strong>Exception:</strong> {payload.promotion_conditions.exception_logged.reason} <br />
            <strong>Mitigation:</strong> {payload.promotion_conditions.exception_logged.mitigation_plan}
          </div>
        )}
      </div>

      {/* Promotion gating */}
      <div className="mb-4">
        <button
          type="button"
          className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
          onClick={handlePromote}
          disabled={promotionSuccess}
        >
          Promote to Phase 2
        </button>
        {promotionError && (
          <div className="mt-2 text-red-600 text-sm">{promotionError}</div>
        )}
        {promotionSuccess && (
          <div className="mt-2 text-green-600 text-sm">PLAN phase promoted to Phase 2!</div>
        )}
      </div>

      {/* Audit log */}
      <div className="mt-6">
        <h3 className="font-medium text-gray-800 mb-2">Audit Log</h3>
        <ul className="text-xs bg-gray-50 border rounded p-2 max-h-40 overflow-y-auto">
          {audit.map((log, idx) => (
            <li key={idx} className="mb-1">
              <span className="text-gray-500">[{log.timestamp}]</span> <span className="font-semibold">{log.user}</span>: {log.action} {log.details && <span className="text-gray-700">— {log.details}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PlanPhaseModule; 