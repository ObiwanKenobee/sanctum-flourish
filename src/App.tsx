import React, { useState } from "react";
import { 
  LoopStage, 
  TelemetryReading, 
  DecisionOption, 
  CapitalTranche, 
  AgentActionLog 
} from "./types";
import { 
  INITIAL_TELEMETRY, 
  WORLD_MODEL_NODES, 
  DECISION_OPTIONS, 
  CAPITAL_TRANCHES, 
  AGENT_ACTION_LOGS, 
  FAILURE_LEDGER, 
  VERIFICATION_AUDITS, 
  GOVERNANCE_PRINCIPLES 
} from "./data/mockData";

import { Header } from "./components/Header";
import { PriorityFloorBanner } from "./components/PriorityFloorBanner";
import { ObservatoryView } from "./components/ObservatoryView";
import { WorldModelView } from "./components/WorldModelView";
import { SimulatorView } from "./components/SimulatorView";
import { DecisionEngineView } from "./components/DecisionEngineView";
import { CapitalEngineView } from "./components/CapitalEngineView";
import { OperationsView } from "./components/OperationsView";
import { VerificationView } from "./components/VerificationView";
import { FailureLedgerView } from "./components/FailureLedgerView";
import { GovernanceView } from "./components/GovernanceView";
import { ScorecardView } from "./components/ScorecardView";
import { GeminiOracleModal } from "./components/GeminiOracleModal";

import { 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  MapPin, 
  HelpCircle,
  Activity,
  HeartHandshake
} from "lucide-react";

export default function App() {
  const [activeStage, setActiveStage] = useState<LoopStage>("observatory");
  const [priorityFloorMode, setPriorityFloorMode] = useState<boolean>(false);
  const [geminiModalOpen, setGeminiModalOpen] = useState<boolean>(false);
  const [selectedContext, setSelectedContext] = useState<any>(null);

  // Application state for live interventions & tranche releases
  const [telemetry, setTelemetry] = useState<TelemetryReading[]>(INITIAL_TELEMETRY);
  const [decisions, setDecisions] = useState<DecisionOption[]>(DECISION_OPTIONS);
  const [tranches, setTranches] = useState<CapitalTranche[]>(CAPITAL_TRANCHES);
  const [agentLogs, setAgentLogs] = useState<AgentActionLog[]>(AGENT_ACTION_LOGS);

  // Handle human authorization of decision
  const handleExecuteDecision = (optionId: string) => {
    setDecisions(prev => prev.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, status: "executed" };
      }
      return opt;
    }));

    // Record new consequential action log
    const chosen = decisions.find(d => d.id === optionId);
    const newLog: AgentActionLog = {
      id: "act-auth-" + Date.now().toString(36),
      agentName: "Civilization Decision Dispatcher",
      agentRole: "Human-In-The-Loop Execution Bridge",
      boundedAuthority: "Transcribes human sovereign concurrence into operational dispatches.",
      timestamp: new Date().toISOString(),
      intent: `Dispatch authorized intervention: ${chosen?.title}`,
      authorization: "Signed Human Operator Concurrence (Charter Rule 09)",
      action: `Initiated deployment contracts and released pre-clearance tokens for ${chosen?.tier}`,
      actor: "Operator E. Ochieng (NMWEA) & Muungano Co-signatory",
      evidence: "Multi-criteria decision matrix approved with reversibility score " + chosen?.reversibility.score + "/10",
      result: "success",
      selfReflection: {
        attempted: `Executed sovereign dispatch for ${chosen?.id}.`,
        why: "Human authority concurred after evaluating trade-offs, uncertainty, and Priority Floor guarantees.",
        authorityHeld: "Bounded human authorization gateway.",
        outcome: "Dispatched operational tasks to field teams and contractors.",
        failureOrLimitation: "Requires continuous telemetry monitoring during initial 48-hour surge window.",
        requiredHumanRole: "Field wardens must sign physical receipt of materials upon delivery."
      }
    };

    setAgentLogs(prev => [newLog, ...prev]);
    setActiveStage("operations");
  };

  // Handle unlocking capital tranche
  const handleUnlockTranche = (trancheId: string) => {
    setTranches(prev => prev.map(t => {
      if (t.id === trancheId) {
        return {
          ...t,
          status: "unlocked_verified",
          verifiedEvidence: "Sensor array telemetry verified 14 days continuous output below 1.0 NTU. Citizen oversight panel concurred.",
          unlockedAt: new Date().toISOString().split("T")[0]
        };
      }
      return t;
    }));
  };

  // Handle manual override
  const handleTriggerManualOverride = (actionId: string) => {
    alert(`Human Sovereign Interlock Engaged for Action ${actionId}. All autonomous routines paused on this node until physical keycard authorization.`);
  };

  return (
    <div className="min-h-screen bg-[#0C0F14] text-[#E5E9F0] flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Universal Header */}
      <Header
        activeStage={activeStage}
        onSelectStage={(stage) => setActiveStage(stage)}
        priorityFloorMode={priorityFloorMode}
        onTogglePriorityFloor={() => setPriorityFloorMode(!priorityFloorMode)}
        onOpenGeminiModal={() => {
          setSelectedContext({ currentStage: activeStage, laboratory: "Nairobi Basin" });
          setGeminiModalOpen(true);
        }}
      />

      {/* Priority Floor Banner */}
      <PriorityFloorBanner
        active={priorityFloorMode}
        onDismiss={() => setPriorityFloorMode(false)}
      />

      {/* Main Mission Control Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* The 5 Fundamental Questions of Atlas Sanctum (Section VI requirement) */}
        <section className="bg-gradient-to-r from-[#121824] via-[#0F141E] to-[#121824] border border-[#232D3F] rounded-2xl p-5 lg:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Civilization Infrastructure
                </span>
                <span className="text-xs text-[#64748B] font-mono">
                  Operational Laboratory: Nairobi, Kenya
                </span>
              </div>
              <h2 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                Decision Intelligence for Complex Real-World Systems
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Atlas Sanctum is a living system that helps human beings <span className="text-emerald-400 font-medium">understand reality</span>, <span className="text-amber-400 font-medium">reason about complex problems</span>, coordinate capital, execute bounded interventions, verify outcomes against empirical facts, and regenerate the ecological and social systems on which life depends.
              </p>
            </div>

            {/* Quick 5 Answers Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono shrink-0">
              <div className="bg-[#141A24] p-2.5 rounded-lg border border-[#232D3F]">
                <span className="text-[9px] uppercase text-[#64748B] block">Who is it for?</span>
                <span className="text-[#E2E8F0] font-semibold text-[11px] block mt-0.5">Institutions & Communities</span>
              </div>
              <div className="bg-[#141A24] p-2.5 rounded-lg border border-[#232D3F]">
                <span className="text-[9px] uppercase text-[#64748B] block">Where does it start?</span>
                <span className="text-amber-400 font-semibold text-[11px] block mt-0.5">Nairobi Basin, Kenya</span>
              </div>
              <div className="bg-[#141A24] p-2.5 rounded-lg border border-[#232D3F] col-span-2 sm:col-span-1">
                <span className="text-[9px] uppercase text-[#64748B] block">Why does it exist?</span>
                <span className="text-emerald-400 font-semibold text-[11px] block mt-0.5">To help humanity flourish</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Stage Render */}
        {activeStage === "observatory" && (
          <ObservatoryView
            telemetry={telemetry}
            priorityFloorMode={priorityFloorMode}
          />
        )}

        {activeStage === "world-model" && (
          <WorldModelView
            nodes={WORLD_MODEL_NODES}
          />
        )}

        {activeStage === "simulator" && (
          <SimulatorView />
        )}

        {activeStage === "decisions" && (
          <DecisionEngineView
            options={decisions}
            onExecuteDecision={handleExecuteDecision}
            onOpenGeminiConsult={(option) => {
              setSelectedContext(option);
              setGeminiModalOpen(true);
            }}
          />
        )}

        {activeStage === "capital" && (
          <CapitalEngineView
            tranches={tranches}
            onUnlockTranche={handleUnlockTranche}
          />
        )}

        {activeStage === "operations" && (
          <OperationsView
            logs={agentLogs}
            onTriggerManualOverride={handleTriggerManualOverride}
          />
        )}

        {activeStage === "verification" && (
          <VerificationView
            audits={VERIFICATION_AUDITS}
          />
        )}

        {activeStage === "failure-ledger" && (
          <FailureLedgerView
            failures={FAILURE_LEDGER}
          />
        )}

        {activeStage === "governance" && (
          <GovernanceView
            principles={GOVERNANCE_PRINCIPLES}
            priorityFloorMode={priorityFloorMode}
            onTogglePriorityFloor={() => setPriorityFloorMode(!priorityFloorMode)}
          />
        )}

        {activeStage === "scorecard" && (
          <ScorecardView />
        )}
      </main>

      {/* The Covenant of the Builder Footer */}
      <footer className="border-t border-[#1C2330] bg-[#0A0D13] py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-['Cinzel'] font-bold text-amber-400 text-sm">
                ATLAS SANCTUM
              </span>
              <span className="text-[#64748B]">|</span>
              <span className="text-[#94A3B8] font-mono text-[11px]">
                Nairobi Basin Operating Laboratory
              </span>
            </div>
            <p className="text-[#64748B] text-[11px] font-serif italic max-w-xl">
              "See clearly. Serve faithfully. Build beautifully. Restore what is broken. Protect human agency. Tell the truth about uncertainty. Learn from failure. Leave the future stronger."
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-[#64748B]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> SHA-256 Provenance Active
            </span>
            <span>•</span>
            <span className="text-amber-400">ISO-19115 GIS Metadata</span>
            <span>•</span>
            <span className="text-[#94A3B8]">Priority Floor Enforced</span>
          </div>
        </div>
      </footer>

      {/* Gemini Ethical Intelligence Oracle Modal */}
      <GeminiOracleModal
        isOpen={geminiModalOpen}
        onClose={() => setGeminiModalOpen(false)}
        contextData={selectedContext}
      />
    </div>
  );
}
