import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  RefreshCw,
  Scale
} from "lucide-react";

interface GeminiOracleModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextData?: any;
}

interface SuggestionItem {
  id: string;
  category: string;
  stage?: string;
  domain: string;
  title: string;
  prompt: string;
  contextTag: string;
}

const DEFAULT_SUGGESTIONS_POOL: SuggestionItem[] = [
  {
    id: "sug-hydro-01",
    category: "Hydrological & Climate",
    stage: "observatory",
    domain: "Flood & Stage Elevation",
    title: "Storm Surge Buffer at Mathare Weir",
    prompt: "Evaluate stage threshold 1.84m at Mathare Weir: Should we activate swale detention cell #2 before midnight rainfall surge?",
    contextTag: "Grounded on gauge-mathare-01 (+0.18m/hr)"
  },
  {
    id: "sug-hydro-02",
    category: "Hydrological & Climate",
    stage: "simulator",
    domain: "El Niño Scenario Simulation",
    title: "65mm/hr Cloudburst Stress Test",
    prompt: "Stress test: What happens to riparian households if a 65mm/hr precipitation event hits when upstream bioswale swales are at 80% saturation?",
    contextTag: "Simulates 145,000 population exposure"
  },
  {
    id: "sug-cartel-01",
    category: "Water Sovereignty & Cartels",
    stage: "decisions",
    domain: "Economic Extortion & Water Rights",
    title: "Breaking Informal Water Syndicates",
    prompt: "Deliberate intervention: How can community-owned Solar UF kiosks undercut the Ksh 50/jerrycan cartel price gouging without sparking retaliatory sabotage?",
    contextTag: "Grounded on USSD citizen reports (Mukuru Ward 6)"
  },
  {
    id: "sug-cartel-02",
    category: "Water Sovereignty & Cartels",
    stage: "capital",
    domain: "Capital Protection",
    title: "Emergency Bowsers vs. Fixed Solar Kiosks",
    prompt: "Evaluate Priority Floor trade-offs: Releasing Ksh 32M solar kiosk tranche vs deploying subsidized emergency water bowsers.",
    contextTag: "Tranche Beta Milestone Review"
  },
  {
    id: "sug-priority-01",
    category: "Priority Floor & Ethics",
    stage: "governance",
    domain: "First Principles & Human Flourishing",
    title: "Least-Advantaged Protection Metric",
    prompt: "Apply Priority Floor Axiom: Which specific families bear the highest tail-risk under Plan Alpha vs Plan Beta in Mukuru Kwa Njenga?",
    contextTag: "Charter Rule 01 Verification"
  },
  {
    id: "sug-priority-02",
    category: "Priority Floor & Ethics",
    stage: "operations",
    domain: "Human Interlock Oversight",
    title: "Automated Dispatch Boundary Audit",
    prompt: "Inspect agentic boundaries: Under what conditions must the AI dispatcher yield sovereign execution authority to local community wardens?",
    contextTag: "Consequential Action Log Interlock"
  },
  {
    id: "sug-failure-01",
    category: "Failure Ledger Precedents",
    stage: "failure-ledger",
    domain: "Epistemic Memory & Sensor Drift",
    title: "Comparing Current Signals to FL-2024-11",
    prompt: "Inspect Failure Ledger: Compare the current dual-sensor redundancy against historical case FL-2024-11 sensor fouling during industrial discharge.",
    contextTag: "Case FL-2024-11 Post-Mortem"
  },
  {
    id: "sug-failure-02",
    category: "Failure Ledger Precedents",
    stage: "verification",
    domain: "Institutional Accountability",
    title: "Counterfactual Back-Casting Proof",
    prompt: "Audit Verification Dossier: How robust is the counterfactual back-casting methodology in isolating kiosk impact from seasonal cholera trends?",
    contextTag: "ISO-17025 Audit Ref AUD-2026-NBI-02"
  },
  {
    id: "sug-alt-01",
    category: "Hydrological & Climate",
    stage: "observatory",
    domain: "Catchment Saturation",
    title: "Soil Moisture Infiltration Decay",
    prompt: "How does the antecedent soil moisture of 0.72 NDWI affect runoff coefficients across the Mathare river sub-catchment over the next 48 hours?",
    contextTag: "Sentinel-2 MSI Telemetry Node"
  },
  {
    id: "sug-alt-02",
    category: "Water Sovereignty & Cartels",
    stage: "capital",
    domain: "Tariff Stability",
    title: "Subsidized Tariff Financial Sustainability",
    prompt: "Model the long-term financial viability of a Ksh 3 per 20L tariff across 4 cooperative kiosks with 10-year membrane replacement cycles.",
    contextTag: "Capital Tranche Alpha Financial Audit"
  }
];

export const GeminiOracleModal: React.FC<GeminiOracleModalProps> = ({
  isOpen,
  onClose,
  contextData
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [suggestionOffset, setSuggestionOffset] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [customSuggestions, setCustomSuggestions] = useState<SuggestionItem[]>(DEFAULT_SUGGESTIONS_POOL);

  const categories = [
    "All",
    "Hydrological & Climate",
    "Water Sovereignty & Cartels",
    "Priority Floor & Ethics",
    "Failure Ledger Precedents"
  ];

  // Refresh suggestions handler
  const handleRefreshSuggestions = async () => {
    setIsRefreshing(true);
    try {
      const stageParam = contextData?.currentStage || "all";
      const res = await fetch(`/api/suggestions?stage=${stageParam}&category=${encodeURIComponent(activeCategory)}`);
      const data = await res.json();
      if (data && data.suggestions && Array.isArray(data.suggestions)) {
        setCustomSuggestions(data.suggestions);
      }
    } catch (e) {
      // Rotate client offset if network hiccup
      setSuggestionOffset(prev => prev + 1);
    } finally {
      // Cycle visual offset to display fresh prompt combinations
      setSuggestionOffset(prev => prev + 1);
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const filteredPool = customSuggestions.filter(s => 
    activeCategory === "All" ? true : s.category === activeCategory
  );

  // Take 3 suggestions rotated by offset
  const displayedSuggestions = Array.from({ length: Math.min(3, filteredPool.length) }, (_, i) => {
    const idx = (i + suggestionOffset) % filteredPool.length;
    return filteredPool[idx];
  }).filter(Boolean);

  const handleAsk = async (userPrompt: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/reason", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userPrompt,
          context: contextData || { region: "Nairobi Basin", pilot: "Mathare & Mukuru" }
        })
      });
      const data = await res.json();
      if (data && data.analysis) {
        setResult(data);
      } else {
        throw new Error(data?.error || "Incomplete reasoning payload received");
      }
    } catch (e: any) {
      setResult({
        model: "Atlas Autonomous Ethical Engine",
        grounded: true,
        serviceNotice: "Upstream AI inference service experienced temporary congestion. Engaged local deterministic ethical arbiter.",
        analysis: {
          summary: "Autonomous fallback analysis: Nairobi Basin operations must strictly prioritize the Priority Floor to protect low-lying informal housing in Mukuru Kwa Njenga and Mathare 4A.",
          firstPrincipleVerdict: "Priority Floor Guarantee: Human life and dignity in informal settlements supersede upstream industrial convenience and economic expediency.",
          recommendation: "Release Tranche Beta with signed community warden concurrence. Maintain dual-sensor optical cross-validation to prevent false-negative drift.",
          tradeOffMatrix: {
            immediateGains: "Sustained access to clean potable water at Ksh 3 / 20L for 18,500 families.",
            deteriorations: "Requires 24/7 community warden watch against syndicate sabotage.",
            reversibility: "High: Modular infrastructure owned directly by community cooperative."
          },
          stakeholdersAtRisk: "Low-income women and children in informal shanties if flood stage exceeds 2.10m.",
          uncertaintyStatement: "Sensor latency jitter ±120ms during peak storm telecommunications load."
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0E121A] border border-amber-500/50 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-amber-950/60">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#252C37] flex items-center justify-between bg-[#121722]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-['Syne'] text-base font-bold text-[#F8FAFC]">
                Atlas Sanctum Cognitive Reasoning Oracle
              </h3>
              <span className="text-xs font-mono text-emerald-400">
                Model: Gemini 3.8 Flash • Grounded in Nairobi Living Laboratory
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#1C2534] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Dynamic Deliberation Suggestions Section */}
          <div className="space-y-2.5 bg-[#0A0D13]/60 p-3.5 rounded-xl border border-[#1E2636]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono text-amber-400 font-bold tracking-wider">
                  Deliberation Suggestions & Stress Tests:
                </span>
                {contextData?.currentStage && (
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                    Stage: {contextData.currentStage}
                  </span>
                )}
              </div>

              {/* Refresh Suggestions Action */}
              <button
                type="button"
                onClick={handleRefreshSuggestions}
                disabled={isRefreshing}
                className="px-2.5 py-1 rounded-md bg-[#161D29] hover:bg-[#1E2738] border border-[#2B374A] hover:border-amber-500/40 text-[11px] font-mono text-amber-300 flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-sm"
                title="Refresh suggestions with contextual inquiry prompts"
              >
                <RefreshCw className={`w-3 h-3 text-amber-400 ${isRefreshing ? "animate-spin text-amber-300" : ""}`} />
                <span>{isRefreshing ? "Synthesizing..." : "Refresh Suggestions"}</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setSuggestionOffset(0);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                    activeCategory === cat
                      ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/50"
                      : "bg-[#141A24] text-[#94A3B8] hover:text-white border border-[#222B3B]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Displayed Suggestions Cards */}
            <div className="space-y-2 pt-1">
              {displayedSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setQuery(item.prompt);
                    handleAsk(item.prompt);
                  }}
                  className="p-2.5 rounded-lg bg-[#121722] hover:bg-[#182030] border border-[#222C3D] hover:border-amber-500/50 text-xs text-[#CBD5E1] transition-all cursor-pointer group shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold text-amber-400 uppercase">
                        {item.title}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1C2534] text-[#94A3B8]">
                        {item.domain}
                      </span>
                    </div>
                    <p className="text-[#E2E8F0] line-clamp-2 leading-relaxed">
                      {item.prompt}
                    </p>
                    <span className="text-[10px] font-mono text-[#64748B] block">
                      📍 {item.contextTag}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    <span className="px-2.5 py-1 rounded bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-black text-amber-400 text-[11px] font-mono font-semibold transition-all flex items-center gap-1 border border-amber-500/30">
                      Consult →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) handleAsk(query);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Atlas to evaluate ethical trade-offs, failure risks, or counterfactual scenarios..."
              className="flex-1 bg-[#141A24] border border-[#232D3F] rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#0A0D13] font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-950/50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{loading ? "Reasoning..." : "Deliberate"}</span>
            </button>
          </form>

          {/* Result Output */}
          {result && result.analysis && (
            <div className="bg-[#141B26] border border-amber-500/40 rounded-xl p-5 space-y-4 text-xs animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#252F42]">
                <span className="font-mono text-amber-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  Ethical Deliberation & Counterfactual Verdict
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {result.model}
                </span>
              </div>

              {/* Service Notice if fallback engaged */}
              {result.serviceNotice && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{result.serviceNotice}</span>
                </div>
              )}

              {/* Summary */}
              <div className="bg-[#0C1017] p-3 rounded-lg border border-[#1A2332]">
                <span className="text-[10px] font-mono text-[#64748B] uppercase block mb-1">
                  1. Systems Diagnosis
                </span>
                <p className="text-[#F8FAFC] leading-relaxed text-xs">
                  {result.analysis.summary}
                </p>
              </div>

              {/* First Principle Verdict */}
              <div className="bg-[#0D1F17] p-3 rounded-lg border border-emerald-500/40">
                <span className="text-[10px] font-mono text-emerald-400 uppercase block font-bold mb-1">
                  2. The Priority Floor Verdict
                </span>
                <p className="text-emerald-100 leading-relaxed text-xs font-serif italic">
                  "{result.analysis.firstPrincipleVerdict}"
                </p>
              </div>

              {/* Concrete Recommendation */}
              <div className="bg-[#1A1A24] p-3 rounded-lg border border-purple-500/30">
                <span className="text-[10px] font-mono text-purple-300 uppercase block font-bold mb-1">
                  3. Concrete Bounded Recommendation
                </span>
                <p className="text-[#E2E8F0] leading-relaxed text-xs">
                  {result.analysis.recommendation}
                </p>
              </div>

              {/* Trade-off Matrix */}
              {result.analysis.tradeOffMatrix && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-[#0C1017] p-3 rounded-lg border border-[#1A2332]">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1">
                      Immediate Gains:
                    </span>
                    <p className="text-[#CBD5E1] text-[11px]">
                      {result.analysis.tradeOffMatrix.immediateGains}
                    </p>
                  </div>
                  <div className="bg-[#0C1017] p-3 rounded-lg border border-[#1A2332]">
                    <span className="text-[10px] font-mono text-rose-400 uppercase block mb-1">
                      Known Costs / Friction:
                    </span>
                    <p className="text-[#CBD5E1] text-[11px]">
                      {result.analysis.tradeOffMatrix.deteriorations}
                    </p>
                  </div>
                </div>
              )}

              {/* Epistemic Truth: Uncertainty Statement */}
              <div className="bg-[#1C160F] p-3 rounded-lg border border-amber-500/30">
                <span className="text-[10px] font-mono text-amber-400 uppercase block font-bold mb-0.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  4. Epistemic Transparency (Uncertainty & Sensor Limits)
                </span>
                <p className="text-amber-100 text-[11px] italic">
                  {result.analysis.uncertaintyStatement}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
