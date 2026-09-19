import React, { useState } from "react";
import { 
  History, 
  AlertTriangle, 
  FileText, 
  Lightbulb, 
  ShieldAlert, 
  Search, 
  Filter, 
  ArrowRight,
  BookOpen,
  Download,
  Printer
} from "lucide-react";
import { FailureCase } from "../types";
import { exportFailureLedgerCSV, exportFailureLedgerPDF } from "../utils/exportUtils";

interface FailureLedgerViewProps {
  failures: FailureCase[];
}

export const FailureLedgerView: React.FC<FailureLedgerViewProps> = ({ failures }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(failures[0]?.id || "FL-2025-04");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCases = failures.filter(f => 
    f.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.failedAssumption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCase = failures.find(f => f.id === selectedCaseId) || failures[0];

  return (
    <div className="space-y-6">
      {/* Failure Ledger Mandate Banner */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 lg:p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <History className="w-4 h-4" />
              </span>
              <h2 className="font-['Syne'] text-lg font-bold text-[#F8FAFC]">
                The Failure Ledger — Permanent Institutional Memory
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-500/30">
                Non-Punitive Epistemic Covenant
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
              Every significant failure becomes structural knowledge.
              <span className="text-amber-400 font-semibold ml-1">
                The purpose is not blame. The purpose is institutional memory. Atlas becomes intelligent because it remembers what did not work.
              </span>
            </p>
          </div>

          {/* Export Actions for Institutional Transparency */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportFailureLedgerCSV(failures)}
              className="px-3 py-2 rounded-lg bg-[#141A24] hover:bg-[#1E2736] border border-[#232D3F] text-xs font-mono text-[#CBD5E1] flex items-center gap-1.5 transition-all shadow-sm"
              title="Download CSV audit log of all failures and post-mortems"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => exportFailureLedgerPDF(failures)}
              className="px-3.5 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-rose-950/50"
              title="Generate printable PDF Dossier for external and community auditing"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Case Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filteredCases.map((c) => {
          const isSelected = c.id === selectedCaseId;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#181B26] border-rose-500/70 shadow-md ring-1 ring-rose-500/30"
                  : "bg-[#10151E] border-[#232D3F] hover:border-[#374761]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-rose-400 font-bold">{c.id}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#1C2330] text-[#94A3B8]">
                  {c.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#F8FAFC] leading-snug mb-2">
                {c.event}
              </h3>
              <div className="text-[10px] font-mono text-[#64748B] pt-2 border-t border-[#1C2534] flex justify-between">
                <span>Date: {c.date}</span>
                <span className="text-amber-400">Inspect Post-Mortem →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Case Deep Post-Mortem Breakdown (Strict 7 Prompt Fields) */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1C2330] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-rose-400 font-semibold">
                Post-Mortem Investigation File {selectedCase.id}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C2533] text-[#94A3B8]">
                Recorded: {selectedCase.date}
              </span>
            </div>
            <h3 className="font-['Syne'] text-lg font-bold text-[#F8FAFC] mt-1">
              {selectedCase.event}
            </h3>
          </div>

          <div className="text-xs font-mono text-[#94A3B8]">
            <span>Decision Maker at Inception: </span>
            <span className="text-amber-300 font-bold">{selectedCase.decisionMaker}</span>
          </div>
        </div>

        {/* 7 Required Prompt Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* 1. What was expected vs What happened */}
          <div className="bg-[#141A24] p-4 rounded-lg border border-[#222C3D] space-y-3">
            <div>
              <span className="text-[10px] uppercase font-mono text-emerald-400 block font-bold mb-0.5">
                1. What Was Expected:
              </span>
              <p className="text-[#CBD5E1] leading-relaxed">
                {selectedCase.expectedOutcome}
              </p>
            </div>
            <div className="pt-2 border-t border-[#1F2937]">
              <span className="text-[10px] uppercase font-mono text-rose-400 block font-bold mb-0.5">
                2. What Actually Happened:
              </span>
              <p className="text-rose-200 leading-relaxed">
                {selectedCase.actualOutcome}
              </p>
            </div>
          </div>

          {/* 3. Unknowns at play & 4. Which assumption failed */}
          <div className="bg-[#141A24] p-4 rounded-lg border border-[#222C3D] space-y-3">
            <div>
              <span className="text-[10px] uppercase font-mono text-sky-400 block font-bold mb-0.5">
                3. Unknowns & Hidden Blind Spots:
              </span>
              <p className="text-[#CBD5E1] leading-relaxed">
                {selectedCase.unknownsAtPlay}
              </p>
            </div>
            <div className="pt-2 border-t border-[#1F2937]">
              <span className="text-[10px] uppercase font-mono text-amber-400 block font-bold mb-0.5">
                4. Which Assumption Failed:
              </span>
              <p className="text-amber-100 leading-relaxed">
                {selectedCase.failedAssumption}
              </p>
            </div>
          </div>

          {/* 5. What signals were missed */}
          <div className="bg-[#141A24] p-4 rounded-lg border border-[#222C3D]">
            <span className="text-[10px] uppercase font-mono text-rose-400 block font-bold mb-0.5">
              5. What Signals Were Missed or Dismissed as Noise:
            </span>
            <p className="text-[#CBD5E1] leading-relaxed">
              {selectedCase.missedSignals}
            </p>
          </div>

          {/* 6. What should change / Remedy permanently implemented */}
          <div className="bg-[#0D1F17] p-4 rounded-lg border border-emerald-500/40">
            <span className="text-[10px] uppercase font-mono text-emerald-400 block font-bold mb-0.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
              6. Permanent Remedy & Architectural Rule Instated:
            </span>
            <p className="text-emerald-100 leading-relaxed">
              {selectedCase.remedyImplemented}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#0C1017] border border-[#1C2534] flex items-center justify-between text-xs font-mono text-[#64748B]">
          <span>Institutional Memory ID: {selectedCase.id}</span>
          <span className="text-emerald-400 font-semibold">Active in Current Decision Engine Rules</span>
        </div>
      </div>
    </div>
  );
};
