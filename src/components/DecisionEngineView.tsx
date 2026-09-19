import React, { useState } from "react";
import { 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Clock, 
  Users, 
  ShieldAlert, 
  DollarSign, 
  FileText,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Filter,
  Layers
} from "lucide-react";
import { DecisionOption } from "../types";

interface DecisionEngineViewProps {
  options: DecisionOption[];
  onExecuteDecision: (optionId: string) => void;
  onOpenGeminiConsult: (option: DecisionOption) => void;
}

export const DecisionEngineView: React.FC<DecisionEngineViewProps> = ({
  options,
  onExecuteDecision,
  onOpenGeminiConsult
}) => {
  const [activeOptions, setActiveOptions] = useState<DecisionOption[]>(options);
  const [selectedOptId, setSelectedOptId] = useState<string>(options[0]?.id || "opt-alpha");
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>("All");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshSource, setRefreshSource] = useState<string | null>(null);

  const handleRefreshSuggestions = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/suggest-decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentConditions: {
            weirStage: 1.84,
            turbidityNTU: 412,
            cartelRateKsh: 50
          }
        })
      });
      const data = await res.json();
      if (data && data.decisions && Array.isArray(data.decisions)) {
        setActiveOptions(data.decisions);
        setSelectedOptId(data.decisions[0]?.id || "opt-alpha-plus");
        setRefreshSource(data.source || "Atlas Real-Time Synthesis Engine");
      }
    } catch (err) {
      console.error("Failed to refresh decision suggestions:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredOptions = activeOptions.filter(opt => {
    if (selectedTierFilter === "All") return true;
    return opt.tier.toLowerCase().includes(selectedTierFilter.toLowerCase());
  });

  const selectedOpt = filteredOptions.find(o => o.id === selectedOptId) || filteredOptions[0] || activeOptions[0];

  return (
    <div className="space-y-6">
      {/* Decision Engine Mandate Banner */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 lg:p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Compass className="w-4 h-4" />
              </span>
              <h2 className="font-['Syne'] text-lg font-bold text-[#F8FAFC]">
                Atlas Decision Engine — Multi-Criteria Ethical Deliberation
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                Human-in-the-Loop Sovereign
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
              Exposes evidence, alternatives, trade-offs, uncertainty, who benefits, who bears the cost, reversibility, and multi-generational horizons.
              <span className="text-amber-400/90 font-medium ml-1">
                Axiom: Strengthen human judgment rather than silently replacing it.
              </span>
            </p>
            {refreshSource && (
              <div className="mt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Proposals: {refreshSource}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Refresh Suggestions Button */}
            <button
              onClick={handleRefreshSuggestions}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-lg bg-[#141A24] hover:bg-[#1E2738] border border-[#2B374A] hover:border-amber-500/50 text-amber-300 text-xs font-mono font-medium flex items-center gap-2 transition-all shadow-sm"
              title="Refresh intervention suggestions based on live hydrological and cartel data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? "animate-spin text-amber-300" : ""}`} />
              <span>{isRefreshing ? "Synthesizing Proposals..." : "Refresh Suggestions"}</span>
            </button>

            {/* Consult Oracle Button */}
            <button
              onClick={() => onOpenGeminiConsult(selectedOpt)}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600/30 to-emerald-600/30 border border-amber-500/50 hover:border-amber-400 text-amber-200 text-xs font-mono font-medium flex items-center gap-2 transition-all shadow-md shadow-amber-950/40"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Consult Ethical Arbiter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tier Filter Bar & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="text-[#64748B]">Intervention Tier:</span>
          {["All", "Alpha", "Beta", "Gamma"].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTierFilter(tier)}
              className={`px-2.5 py-1 rounded-md border transition-all ${
                selectedTierFilter === tier
                  ? "bg-amber-500/20 text-amber-300 font-bold border-amber-500/50"
                  : "bg-[#141A24] text-[#94A3B8] hover:text-white border-[#232D3F]"
              }`}
            >
              {tier === "All" ? "All Proposals" : `Tier ${tier}`}
            </button>
          ))}
        </div>

        <span className="text-[#64748B]">
          Showing {filteredOptions.length} of {activeOptions.length} Strategic Suggestions
        </span>
      </div>

      {/* Decision Options Navigation Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filteredOptions.map((opt) => {
          const isSelected = opt.id === selectedOptId;
          return (
            <div
              key={opt.id}
              onClick={() => setSelectedOptId(opt.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#161F2E] border-amber-500/80 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/30"
                  : "bg-[#10151E] border-[#232D3F] hover:border-[#374761]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#1C2637] text-amber-400 font-semibold border border-amber-500/20">
                  {opt.tier}
                </span>
                <span className={`text-[10px] uppercase font-mono font-bold ${
                  opt.status === "recommended" ? "text-emerald-400" :
                  opt.status === "executed" ? "text-sky-400" : "text-amber-400"
                }`}>
                  ● {opt.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#F8FAFC] leading-snug mb-2">
                {opt.title}
              </h3>
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] pt-2 border-t border-[#1C2534]">
                <span>Capital: Ksh {(opt.capitalRequiredKsh / 1000000).toFixed(1)}M</span>
                <span>Time: {opt.timelineDays} Days</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Decision Deep Inspection Framework */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#1C2330] gap-4">
          <div>
            <span className="text-xs uppercase font-mono text-amber-400 font-semibold block">
              Consequential Decision Evaluation Matrix
            </span>
            <h3 className="font-['Syne'] text-xl font-bold text-[#F8FAFC] mt-1">
              {selectedOpt.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono text-xs">
              <span className="text-[#64748B] block">Estimated Capital Tranche</span>
              <span className="text-lg font-bold text-amber-300">
                Ksh {selectedOpt.capitalRequiredKsh.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => onExecuteDecision(selectedOpt.id)}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[#0C1017] font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950/40"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Authorize Human Operator Concurrence</span>
            </button>
          </div>
        </div>

        {/* 8 Mandatory Prompt Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dimension 1 & 2: Evidence & Alternatives */}
          <div className="space-y-4">
            <div className="bg-[#141B26] p-4 rounded-lg border border-[#222C3D]">
              <span className="text-xs uppercase font-mono text-emerald-400 font-bold block mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                1. Grounded Empirical Evidence
              </span>
              <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                {selectedOpt.evidence.map((e, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#141B26] p-4 rounded-lg border border-[#222C3D]">
              <span className="text-xs uppercase font-mono text-amber-400 font-bold block mb-2 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" />
                2. Alternatives Formally Considered & Rejected
              </span>
              <ul className="space-y-1.5 text-xs text-[#94A3B8]">
                {selectedOpt.alternativesConsidered.map((alt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">✗</span>
                    <span>{alt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Dimension 3 & 4: Trade-offs Matrix */}
          <div className="space-y-4">
            <div className="bg-[#141B26] p-4 rounded-lg border border-[#222C3D]">
              <span className="text-xs uppercase font-mono text-[#CBD5E1] font-bold block mb-2">
                3. Explicit Trade-Offs (What Improves vs Deteriorates)
              </span>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-emerald-400 font-mono text-[11px] block font-semibold mb-1">
                    ▲ Direct Improvements:
                  </span>
                  <ul className="space-y-1 text-[#CBD5E1]">
                    {selectedOpt.tradeOffs.gains.map((g, i) => (
                      <li key={i}>• {g}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t border-[#1F2937]">
                  <span className="text-rose-400 font-mono text-[11px] block font-semibold mb-1">
                    ▼ Known Costs & Deteriorations:
                  </span>
                  <ul className="space-y-1 text-[#94A3B8]">
                    {selectedOpt.tradeOffs.deteriorations.map((d, i) => (
                      <li key={i}>• {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Stakeholders & Uncertainty */}
            <div className="bg-[#141B26] p-4 rounded-lg border border-[#222C3D] space-y-3">
              <div>
                <span className="text-xs uppercase font-mono text-sky-400 font-bold block mb-1 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  4. Beneficiaries vs Stakeholders at Risk
                </span>
                <p className="text-[11px] text-[#94A3B8]">
                  <strong>Who benefits:</strong> {selectedOpt.stakeholdersBenefiting.join(", ")}
                </p>
                <p className="text-[11px] text-rose-300 mt-1">
                  <strong>Who bears the risk/cost:</strong> {selectedOpt.stakeholdersAtRisk.join(", ")}
                </p>
              </div>

              <div className="pt-2 border-t border-[#1F2937] flex items-center justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">Uncertainty Level:</span>
                <span className="text-amber-400 font-bold">{selectedOpt.uncertaintyRating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dimension 5 & 6: Reversibility & Multi-Generational Time Horizon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#1C2330]">
          <div className="bg-[#0C1017] p-3.5 rounded-lg border border-[#1C2534]">
            <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
              <span className="text-amber-400 uppercase font-semibold">5. Reversibility Score</span>
              <span className="text-amber-300 font-bold">{selectedOpt.reversibility.score} / 10</span>
            </div>
            <p className="text-xs text-[#CBD5E1]">
              {selectedOpt.reversibility.explanation}
            </p>
          </div>

          <div className="bg-[#0C1017] p-3.5 rounded-lg border border-[#1C2534] space-y-1 text-xs">
            <span className="text-sky-400 uppercase font-mono font-semibold block text-[11px] mb-1">
              6. Multi-Generational Time Horizon
            </span>
            <div className="text-[11px] text-[#CBD5E1]">
              <span className="text-[#64748B] font-mono">Immediate (0-30d):</span> {selectedOpt.timeHorizons.immediate}
            </div>
            <div className="text-[11px] text-[#CBD5E1]">
              <span className="text-[#64748B] font-mono">5-Year Resilience:</span> {selectedOpt.timeHorizons.fiveYear}
            </div>
            <div className="text-[11px] text-[#CBD5E1]">
              <span className="text-[#64748B] font-mono">Generational (50y):</span> {selectedOpt.timeHorizons.generational}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
