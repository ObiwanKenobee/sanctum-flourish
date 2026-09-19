import React, { useState } from "react";
import { 
  Coins, 
  Lock, 
  Unlock, 
  CheckCircle, 
  Clock, 
  FileCheck, 
  ShieldCheck, 
  ArrowRight, 
  DollarSign, 
  ExternalLink 
} from "lucide-react";
import { CapitalTranche } from "../types";

interface CapitalEngineViewProps {
  tranches: CapitalTranche[];
  onUnlockTranche: (trancheId: string) => void;
}

export const CapitalEngineView: React.FC<CapitalEngineViewProps> = ({
  tranches,
  onUnlockTranche
}) => {
  const [selectedTrancheId, setSelectedTrancheId] = useState<string>(tranches[0]?.id || "tranche-01");
  const selectedTranche = tranches.find(t => t.id === selectedTrancheId) || tranches[0];

  const totalCommitted = tranches.reduce((sum, t) => sum + t.amountKsh, 0);
  const totalDisbursed = tranches
    .filter(t => t.status === "unlocked_verified")
    .reduce((sum, t) => sum + t.amountKsh, 0);

  return (
    <div className="space-y-6">
      {/* Capital Engine Mandate Banner */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 lg:p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Coins className="w-4 h-4" />
              </span>
              <h2 className="font-['Syne'] text-lg font-bold text-[#F8FAFC]">
                Atlas Capital Engine — Milestone-Locked Ethical Allocation
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                Trust Compounds via Verification
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
              Connecting: <span className="text-amber-400 font-mono">Problems → Opportunities → Evidence → Projects → Capital → Execution → Outcomes</span>.
              Capital is released exclusively upon sensor and citizen verified milestones. Answer: <em>"What happened to the money?"</em>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#141A24] p-3 rounded-lg border border-[#232D3F] text-xs font-mono">
            <div>
              <span className="text-[#64748B] block">Total Facility</span>
              <span className="text-amber-400 font-bold text-sm">Ksh {(totalCommitted / 1000000).toFixed(1)}M</span>
            </div>
            <div className="border-l border-[#222C3D] pl-4">
              <span className="text-[#64748B] block">Disbursed & Verified</span>
              <span className="text-emerald-400 font-bold text-sm">Ksh {(totalDisbursed / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Stepper: 7-Stage Flow */}
      <div className="bg-[#0C1017] border border-[#1C2534] rounded-xl p-4 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] text-xs font-mono text-center">
          {[
            { label: "1. Problem", desc: "Flood & Cartel Extortion", active: true },
            { label: "2. Opportunity", desc: "Coop Solar Water Hubs", active: true },
            { label: "3. Evidence", desc: "Sensor & Survey Backed", active: true },
            { label: "4. Project", desc: "Nairobi Basin Pilot", active: true },
            { label: "5. Capital", desc: "Ksh 85M Facility", active: true },
            { label: "6. Execution", desc: "Coop Youth Earthworks", active: true },
            { label: "7. Outcome", desc: "72% Cost Cut & 0 Casualties", active: true },
          ].map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex-1 px-2">
                <span className="text-amber-400 font-bold block">{step.label}</span>
                <span className="text-[10px] text-[#94A3B8]">{step.desc}</span>
              </div>
              {idx < 6 && <ArrowRight className="w-3.5 h-3.5 text-[#334155] shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tranches Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tranches.map((t) => {
          const isSelected = t.id === selectedTrancheId;
          return (
            <div
              key={t.id}
              onClick={() => setSelectedTrancheId(t.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#161F2E] border-amber-500/80 shadow-md ring-1 ring-amber-500/30"
                  : "bg-[#10151E] border-[#232D3F] hover:border-[#374761]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-amber-400 font-bold">
                  Ksh {(t.amountKsh / 1000000).toFixed(1)}M
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-semibold flex items-center gap-1 ${
                  t.status === "unlocked_verified" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" :
                  t.status === "active_in_progress" ? "bg-amber-950/80 text-amber-400 border border-amber-500/30" :
                  "bg-[#1A2230] text-[#94A3B8] border border-[#2D3A4F]"
                }`}>
                  {t.status === "unlocked_verified" ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  {t.status.replace("_", " ")}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#F8FAFC] leading-snug mb-2">
                {t.milestoneTitle}
              </h3>
              <p className="text-[11px] text-[#94A3B8] line-clamp-2 mb-3">
                Recipient: {t.recipient}
              </p>
              <div className="text-[10px] font-mono text-[#64748B] pt-2 border-t border-[#1C2534] flex justify-between">
                <span>Items: {t.expenditureLedger.length}</span>
                <span>Audit: 100% Cryptographic</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Tranche Ledger: "What Happened to the Money?" */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#1C2330] gap-3">
          <div>
            <span className="text-xs font-mono uppercase text-amber-400 font-semibold block">
              Tranche Audit & Milestone Verification Ledger
            </span>
            <h3 className="font-['Syne'] text-base font-bold text-[#F8FAFC] mt-0.5">
              {selectedTranche.milestoneTitle}
            </h3>
          </div>

          {selectedTranche.status === "active_in_progress" && (
            <button
              onClick={() => onUnlockTranche(selectedTranche.id)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0A0D13] font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Verify Milestone & Release Remaining Ksh 12.2M</span>
            </button>
          )}
        </div>

        {/* Milestone Trigger Criteria & Evidence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-[#141A24] p-3 rounded-lg border border-[#222C3D]">
            <span className="text-[10px] uppercase text-[#64748B] block mb-1">
              Milestone Unlock Requirement:
            </span>
            <p className="text-[#CBD5E1]">
              {selectedTranche.verificationTrigger}
            </p>
          </div>

          <div className="bg-[#141A24] p-3 rounded-lg border border-[#222C3D]">
            <span className="text-[10px] uppercase text-emerald-400 block mb-1 font-semibold">
              Empirical Verification Evidence:
            </span>
            <p className="text-[#CBD5E1]">
              {selectedTranche.verifiedEvidence || "Telemetry currently collecting 14-day continuous stage/turbidity window."}
            </p>
          </div>
        </div>

        {/* What Happened to the Money? (Public Ledger) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-[#CBD5E1] font-bold">
              Itemized Capital Expenditure Ledger ({selectedTranche.expenditureLedger.length} Records)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Citizen Oversight Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0C1017] text-[#64748B] uppercase tracking-wider text-[10px] border-b border-[#1C2330]">
                <tr>
                  <th className="py-2.5 px-3">Item / Asset Description</th>
                  <th className="py-2.5 px-3">Recipient Vendor / Entity</th>
                  <th className="py-2.5 px-3">Amount (Ksh)</th>
                  <th className="py-2.5 px-3">Cryptographic State Hash</th>
                  <th className="py-2.5 px-3 text-right">Citizen Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18202E] text-[#CBD5E1]">
                {selectedTranche.expenditureLedger.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#141D29]">
                    <td className="py-2.5 px-3 font-medium text-[#F8FAFC]">{item.item}</td>
                    <td className="py-2.5 px-3 text-[#94A3B8]">{item.vendor}</td>
                    <td className="py-2.5 px-3 text-amber-300 font-bold">
                      Ksh {item.costKsh.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-[#64748B] text-[11px]">{item.cryptoHash}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                        Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
