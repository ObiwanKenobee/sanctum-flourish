import React, { useState } from "react";
import { 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  Terminal, 
  UserCheck, 
  Radio, 
  CheckCircle2, 
  ExternalLink,
  Lock
} from "lucide-react";
import { AgentActionLog } from "../types";

interface OperationsViewProps {
  logs: AgentActionLog[];
  onTriggerManualOverride: (actionId: string) => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  logs,
  onTriggerManualOverride
}) => {
  const [selectedActionId, setSelectedActionId] = useState<string>(logs[0]?.id || "act-hydro-882");
  const selectedLog = logs.find(l => l.id === selectedActionId) || logs[0];

  return (
    <div className="space-y-6">
      {/* Operations Mandate Banner */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 lg:p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Cpu className="w-4 h-4" />
              </span>
              <h2 className="font-['Syne'] text-lg font-bold text-[#F8FAFC]">
                Atlas Operations — Bounded Agentic Coordination
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                Bounded Authority Enforced
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
              Coordinates humans, AI agents, software services, field teams, and physical infrastructure. Every action preserves:
              <span className="font-mono text-amber-400 font-semibold ml-1">
                intent → authorization → action → actor → evidence → result
              </span>.
              Agents explain what they attempted, their authority boundary, and what strictly requires human judgment.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Autonomous Sluice Gate Actuation: Barred (Human Required)</span>
          </div>
        </div>
      </div>

      {/* Grid: Agent Actions Stream + Detailed Self-Reflection Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Action Stream */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1C2330] text-xs font-mono text-[#CBD5E1]">
            <span>CONSEQUENTIAL ACTION LOGS ({logs.length})</span>
            <span className="text-[#64748B]">Real-Time Dispatch Ledger</span>
          </div>

          <div className="space-y-3">
            {logs.map((log) => {
              const isSelected = log.id === selectedActionId;
              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedActionId(log.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#161F2E] border-amber-500/80 shadow-md ring-1 ring-amber-500/30"
                      : "bg-[#10151E] border-[#232D3F] hover:border-[#374761]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                    <span className="text-amber-400 font-bold">{log.agentName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                      log.result === "success" ? "bg-emerald-950/70 text-emerald-400 border border-emerald-500/30" :
                      log.result === "escalated_to_human" ? "bg-amber-950/70 text-amber-400 border border-amber-500/30" :
                      "bg-rose-950/70 text-rose-400 border border-rose-500/30"
                    }`}>
                      {log.result.replace(/_/g, " ")}
                    </span>
                  </div>

                  <span className="text-[10px] text-[#64748B] font-mono block mb-1">
                    Role: {log.agentRole}
                  </span>

                  <p className="text-xs text-[#E2E8F0] font-medium leading-snug mb-2">
                    {log.action}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] pt-2 border-t border-[#1C2534]">
                    <span>Timestamp: {new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="text-amber-300">Inspect Explanation →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Prompt Mandate Agent Self-Explanation Framework */}
        <div className="lg:col-span-6 bg-[#10151E] border border-[#232D3F] rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2330] mb-3 text-xs font-mono">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Agent Self-Explanation & Authority Audit
              </span>
              <span className="text-[#64748B]">{selectedLog.id}</span>
            </div>

            <div className="mb-4">
              <span className="text-sm font-bold text-[#F8FAFC]">
                {selectedLog.agentName} — Operational Audit
              </span>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                Actor Protocol: {selectedLog.actor}
              </p>
            </div>

            {/* Strict Consequential Action 6-Part Lineage */}
            <div className="space-y-2 text-xs font-mono bg-[#0C1017] p-3 rounded-lg border border-[#1C2534] mb-4">
              <div>
                <span className="text-[10px] uppercase text-amber-500 font-bold block">Intent:</span>
                <span className="text-[#CBD5E1]">{selectedLog.intent}</span>
              </div>
              <div className="pt-1.5 border-t border-[#18202E]">
                <span className="text-[10px] uppercase text-emerald-400 font-bold block">Authorization:</span>
                <span className="text-[#CBD5E1]">{selectedLog.authorization}</span>
              </div>
              <div className="pt-1.5 border-t border-[#18202E]">
                <span className="text-[10px] uppercase text-sky-400 font-bold block">Supporting Evidence:</span>
                <span className="text-[#CBD5E1]">{selectedLog.evidence}</span>
              </div>
            </div>

            {/* The 6 Explainability Questions Required by Prompt */}
            <div className="space-y-2.5 text-xs">
              <span className="text-[11px] font-mono uppercase text-amber-400 font-bold block">
                Agent Explainability Breakdown:
              </span>

              <div className="bg-[#141A24] p-2.5 rounded border border-[#222C3D]">
                <span className="text-[10px] font-mono uppercase text-[#64748B] block">1. What I Attempted:</span>
                <p className="text-[#CBD5E1] mt-0.5">{selectedLog.selfReflection.attempted}</p>
              </div>

              <div className="bg-[#141A24] p-2.5 rounded border border-[#222C3D]">
                <span className="text-[10px] font-mono uppercase text-[#64748B] block">2. Why I Attempted It:</span>
                <p className="text-[#CBD5E1] mt-0.5">{selectedLog.selfReflection.why}</p>
              </div>

              <div className="bg-[#141A24] p-2.5 rounded border border-[#222C3D]">
                <span className="text-[10px] font-mono uppercase text-amber-400 block">3. What Authority I Held:</span>
                <p className="text-[#CBD5E1] mt-0.5">{selectedLog.selfReflection.authorityHeld}</p>
              </div>

              <div className="bg-[#141A24] p-2.5 rounded border border-[#222C3D]">
                <span className="text-[10px] font-mono uppercase text-emerald-400 block">4. What Happened:</span>
                <p className="text-[#CBD5E1] mt-0.5">{selectedLog.selfReflection.outcome}</p>
              </div>

              <div className="bg-[#141A24] p-2.5 rounded border border-[#222C3D]">
                <span className="text-[10px] font-mono uppercase text-rose-400 block">5. What Failed or Was Constrained:</span>
                <p className="text-[#CBD5E1] mt-0.5">{selectedLog.selfReflection.failureOrLimitation}</p>
              </div>

              <div className="bg-[#141A24] p-2.5 rounded border border-[#222C3D]">
                <span className="text-[10px] font-mono uppercase text-sky-400 block">6. What Requires a Human:</span>
                <p className="text-amber-200 mt-0.5 font-medium">{selectedLog.selfReflection.requiredHumanRole}</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1C2330] flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#64748B]">State Provenance: Signed Cryptographic Audit</span>
            <button
              onClick={() => onTriggerManualOverride(selectedLog.id)}
              className="px-3 py-1.5 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Human Override / Interlock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
