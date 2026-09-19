import React, { useState } from "react";
import { 
  Activity, 
  Heart, 
  DollarSign, 
  Trees, 
  Building2, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Scale, 
  BarChart3, 
  Radar as RadarIcon, 
  ArrowUpRight, 
  Info, 
  Sparkles 
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { PriorityFloorWidget } from "./PriorityFloorWidget";

interface TrancheImpact {
  id: string;
  trancheName: string;
  shortName: string;
  capitalKsh: number;
  capitalUSD: number;
  humanAgency: number; // 0-100
  ecologicalRegeneration: number; // 0-100
  economicProductivity: number; // 0-100
  priorityFloorRating: string;
  reversibilityScore: number; // 1-10
  keyBeneficiaries: string;
  vulnerableGroupsAtRisk: string;
  description: string;
  metrics: {
    communityOwnership: string;
    wetlandRestoredHa: number;
    annualSavingsKshM: number;
    jobsCreated: number;
    floodPeakDampening: string;
  };
}

const TRANCHE_IMPACT_DATA: TrancheImpact[] = [
  {
    id: "tranche-0",
    trancheName: "Baseline: Unmitigated Conventional Gray Infrastructure",
    shortName: "Conventional Gray",
    capitalKsh: 110000000,
    capitalUSD: 850000,
    humanAgency: 22,
    ecologicalRegeneration: 18,
    economicProductivity: 38,
    priorityFloorRating: "Critical Failure (Bottom 20% Displaced)",
    reversibilityScore: 2,
    keyBeneficiaries: "Upstream commercial developers and civil engineering contractors",
    vulnerableGroupsAtRisk: "Low-lying riparian informal settlement families in Mukuru & Mathare",
    description: "Concrete canalization and centralized drainage. High capital cost, zero community control, downstream flash-flood acceleration, and severe ecological degradation.",
    metrics: {
      communityOwnership: "0% (Municipal/Corporate)",
      wetlandRestoredHa: 0,
      annualSavingsKshM: 4.2,
      jobsCreated: 45,
      floodPeakDampening: "-8% (Spikes kinetic velocity downstream)"
    }
  },
  {
    id: "tranche-alpha",
    trancheName: "Tranche Alpha: Upstream Riparian Bioswales & Natural Retention",
    shortName: "Tranche Alpha",
    capitalKsh: 38500000,
    capitalUSD: 298000,
    humanAgency: 68,
    ecologicalRegeneration: 92,
    economicProductivity: 64,
    priorityFloorRating: "High Protection (Riparian Buffer Intact)",
    reversibilityScore: 9,
    keyBeneficiaries: "85,000 riparian settlement dwellers, urban ecology cooperatives",
    vulnerableGroupsAtRisk: "Smallholder upstream vegetable growers during temporary detention cycles",
    description: "Bio-engineered natural wetlands, vetiver root zones, and terraced swales across Kiambu and Mathare weirs. Exceptional flood attenuation and heavy metal phytoremediation.",
    metrics: {
      communityOwnership: "65% (Co-managed with Youth Basin Council)",
      wetlandRestoredHa: 14.2,
      annualSavingsKshM: 28.5,
      jobsCreated: 180,
      floodPeakDampening: "-38% (Absorbs 62,000m³ storm pulses)"
    }
  },
  {
    id: "tranche-beta",
    trancheName: "Tranche Beta: Decentralized Solar Ultra-Filtration Water Kiosks",
    shortName: "Tranche Beta",
    capitalKsh: 42000000,
    capitalUSD: 325000,
    humanAgency: 94,
    ecologicalRegeneration: 58,
    economicProductivity: 91,
    priorityFloorRating: "Exemplary (Breaks Cartel Water Extortion)",
    reversibilityScore: 8,
    keyBeneficiaries: "48,000 low-income households, women-led savings circles, informal kiosk operators",
    vulnerableGroupsAtRisk: "Informal cartel vendors (revenue displacement; requires transition pathways)",
    description: "Community-owned solar UF micro-treatment kiosks delivering 148,000L/day at Ksh 3 per 20L jerrycan, shattering predatory cartel syndicates.",
    metrics: {
      communityOwnership: "100% (Muungano Cooperative Trustees)",
      wetlandRestoredHa: 3.5,
      annualSavingsKshM: 56.1,
      jobsCreated: 140,
      floodPeakDampening: "-12% (Rainwater harvesting buffer)"
    }
  },
  {
    id: "tranche-gamma",
    trancheName: "Tranche Gamma: Integrated Regenerative Nexus (Sovereign Target)",
    shortName: "Tranche Gamma",
    capitalKsh: 80500000,
    capitalUSD: 623000,
    humanAgency: 96,
    ecologicalRegeneration: 95,
    economicProductivity: 94,
    priorityFloorRating: "Maximal Pareto Frontier (Priority Floor Axiom 01)",
    reversibilityScore: 8,
    keyBeneficiaries: "145,000 basin residents, downstream lake ecosystems, decentralized micro-enterprises",
    vulnerableGroupsAtRisk: "Zero tail-risk burden transferred to least-advantaged populations",
    description: "Fully coupled bioswale flood buffer, 12 cooperative solar kiosks, sensor telemetry edge nodes, and community sovereign governance.",
    metrics: {
      communityOwnership: "92% (Basin Sovereign Trust)",
      wetlandRestoredHa: 17.7,
      annualSavingsKshM: 84.6,
      jobsCreated: 320,
      floodPeakDampening: "-48% (Comprehensive catchment sponge)"
    }
  }
];

export const ScorecardView: React.FC = () => {
  const [activeChartType, setActiveChartType] = useState<"bar" | "radar">("bar");
  const [selectedTrancheId, setSelectedTrancheId] = useState<string>("tranche-gamma");

  const selectedTranche = TRANCHE_IMPACT_DATA.find(t => t.id === selectedTrancheId) || TRANCHE_IMPACT_DATA[3];

  // Prepare radar data for selected tranche vs baseline
  const baselineTranche = TRANCHE_IMPACT_DATA[0];
  const radarData = [
    {
      subject: "Human Agency",
      selected: selectedTranche.humanAgency,
      baseline: baselineTranche.humanAgency,
      fullMark: 100
    },
    {
      subject: "Ecological Regeneration",
      selected: selectedTranche.ecologicalRegeneration,
      baseline: baselineTranche.ecologicalRegeneration,
      fullMark: 100
    },
    {
      subject: "Economic Productivity",
      selected: selectedTranche.economicProductivity,
      baseline: baselineTranche.economicProductivity,
      fullMark: 100
    },
    {
      subject: "Reversibility (x10)",
      selected: selectedTranche.reversibilityScore * 10,
      baseline: baselineTranche.reversibilityScore * 10,
      fullMark: 100
    },
    {
      subject: "Priority Floor Fidelity",
      selected: selectedTranche.id === "tranche-gamma" ? 98 : selectedTranche.id === "tranche-beta" ? 92 : selectedTranche.id === "tranche-alpha" ? 85 : 20,
      baseline: 20,
      fullMark: 100
    }
  ];

  const categories = [
    {
      name: "Human Flourishing",
      icon: Heart,
      color: "text-rose-400",
      borderColor: "border-rose-500/30",
      bgGradient: "from-rose-950/20 to-transparent",
      metrics: [
        { label: "Pediatric Diarrheal Incidence", value: "-88%", detail: "From 42 to 5 cases/wk in Mukuru clinic", trend: "positive" },
        { label: "Daily Household Water Cost", value: "-72%", detail: "Ksh 180 dropped to Ksh 24 per family", trend: "positive" },
        { label: "Community Water Agency", value: "100%", detail: "Cooperative legal ownership of kiosks", trend: "positive" },
        { label: "Zero Flood Casualties", value: "0 Deaths", detail: "2026 Long Rains season zero losses", trend: "positive" }
      ]
    },
    {
      name: "Economic Resilience",
      icon: DollarSign,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgGradient: "from-amber-950/20 to-transparent",
      metrics: [
        { label: "Milestone Capital Deployed", value: "Ksh 42.7M", detail: "Ksh 85M facility (50.2% released)", trend: "positive" },
        { label: "Informal Youth Jobs Created", value: "320 Jobs", detail: "Earthmoving, solar & kiosk operators", trend: "positive" },
        { label: "Annual Household Savings", value: "Ksh 56.1M", detail: "Retained by 18,500 families", trend: "positive" },
        { label: "Cartel Monopoly Extraction", value: "-72%", detail: "Broken in 4 key informal wards", trend: "positive" }
      ]
    },
    {
      name: "Ecological Regeneration",
      icon: Trees,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      bgGradient: "from-emerald-950/20 to-transparent",
      metrics: [
        { label: "Riparian Wetland Restored", value: "14.2 Hectares", detail: "Endemic papyrus & vetiver bioswales", trend: "positive" },
        { label: "Flood Surge Retention", value: "48,000 m³", detail: "Natural attenuation at Kiambu weir", trend: "positive" },
        { label: "Downstream Heavy Metal Burden", value: "-64%", detail: "Bio-accumulated by plant root systems", trend: "positive" },
        { label: "River Dissolved Oxygen", value: "+2.4 mg/L", detail: "Fish fingerlings observed upstream", trend: "positive" }
      ]
    },
    {
      name: "Institutional Accountability",
      icon: Building2,
      color: "text-sky-400",
      borderColor: "border-sky-500/30",
      bgGradient: "from-sky-950/20 to-transparent",
      metrics: [
        { label: "Flood Lead Time Alert", value: "12.4 Hours", detail: "Dispatched to 140 community wardens", trend: "positive" },
        { label: "Public Decision Auditability", value: "100%", detail: "Every action carries SHA-256 proof", trend: "positive" },
        { label: "Failure Ledger Recurrence", value: "0 Repetitions", detail: "Historical failure lessons prevented recurrence", trend: "positive" },
        { label: "Citizen Oversight Concurrence", value: "98.2%", detail: "Muungano trustee sign-off on tranches", trend: "positive" }
      ]
    },
    {
      name: "Technical Instrumentation",
      icon: Cpu,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgGradient: "from-purple-950/20 to-transparent",
      metrics: [
        { label: "Sensor Array Uptime", value: "99.4%", detail: "Solar + battery buffered telemetry", trend: "positive" },
        { label: "Hydrological Stage Latency", value: "< 2.8 sec", detail: "NB-IoT & LoRaWAN edge gateway", trend: "positive" },
        { label: "Sensor Drift Detection", value: "100%", detail: "Dual-redundant optical cross-checks", trend: "positive" },
        { label: "Simulation Accuracy", value: "92.6%", detail: "Validated against physical high-water marks", trend: "positive" }
      ]
    },
    {
      name: "Trust & Non-Extraction",
      icon: ShieldCheck,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      bgGradient: "from-emerald-950/20 to-transparent",
      metrics: [
        { label: "Unconsented Surveillance", value: "0 Incidents", detail: "Strict prohibition under GOV-03", trend: "positive" },
        { label: "Deceptive Impact Claims", value: "0 Tolerated", detail: "Before/after empirical laboratory tests", trend: "positive" },
        { label: "Citizen Override Petitions", value: "3 Processed", detail: "All heard by community review tribunal", trend: "positive" },
        { label: "Priority Floor Fidelity", value: "Verified", detail: "Lowest-income residents directly benefit", trend: "positive" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Scorecard Mandate Banner */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 lg:p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Activity className="w-4 h-4" />
              </span>
              <h2 className="font-['Syne'] text-lg font-bold text-[#F8FAFC]">
                The Atlas Multi-Layer Scorecard — Measure What Matters
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                Auditable Civilization Metrics
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
              Atlas must answer the central sovereign question:
              <span className="text-amber-400 font-bold font-serif text-base block mt-1">
                "Are we actually making things better?"
              </span>
            </p>
          </div>

          <div className="bg-[#141A24] p-3 rounded-lg border border-[#232D3F] text-xs font-mono">
            <span className="text-[#64748B] block">Overall System Health</span>
            <span className="text-emerald-400 font-bold text-sm flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4" /> 94.8% Ethical Coherence
            </span>
          </div>
        </div>
      </div>

      {/* Priority Floor Status Indicators Widget (Non-Negotiable Threshold Alerts) */}
      <PriorityFloorWidget />

      {/* NEW: Stakeholder Impact Matrix (Recharts Visual Trade-Offs) */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-5 lg:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#1C2534]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Scale className="w-4 h-4" />
              </span>
              <h3 className="font-['Syne'] text-base font-bold text-[#F8FAFC]">
                Stakeholder Impact Matrix — Multi-Tranche Trade-Offs
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                Recharts Empirical Trade-Off Model
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] max-w-2xl">
              Visualizing the tensions and synergies between <strong className="text-rose-300">Human Agency</strong>, <strong className="text-emerald-300">Ecological Regeneration</strong>, and <strong className="text-amber-300">Economic Productivity</strong> across discrete investment tranches.
            </p>
          </div>

          {/* Chart Display Mode Switcher */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-[#0A0D13] p-1 rounded-lg border border-[#222C3D] flex items-center gap-1">
              <button
                onClick={() => setActiveChartType("bar")}
                className={`px-3 py-1.5 rounded-md text-xs font-mono flex items-center gap-1.5 transition-all ${
                  activeChartType === "bar"
                    ? "bg-[#1E293B] text-white font-bold shadow-sm"
                    : "text-[#64748B] hover:text-[#94A3B8]"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Grouped Bar</span>
              </button>
              <button
                onClick={() => setActiveChartType("radar")}
                className={`px-3 py-1.5 rounded-md text-xs font-mono flex items-center gap-1.5 transition-all ${
                  activeChartType === "radar"
                    ? "bg-[#1E293B] text-white font-bold shadow-sm"
                    : "text-[#64748B] hover:text-[#94A3B8]"
                }`}
              >
                <RadarIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Radar Polygon</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tranche Selector Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TRANCHE_IMPACT_DATA.map((tranche) => {
            const isSelected = tranche.id === selectedTrancheId;
            return (
              <div
                key={tranche.id}
                onClick={() => setSelectedTrancheId(tranche.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#161F2E] border-amber-500/80 ring-1 ring-amber-500/30 shadow-md"
                    : "bg-[#0E131C] border-[#1C2534] hover:border-[#2C384D]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400">
                    {tranche.shortName}
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    Ksh {(tranche.capitalKsh / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="text-xs font-bold text-[#E2E8F0] line-clamp-1 mb-2">
                  {tranche.trancheName}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="text-rose-400">Agency: {tranche.humanAgency}%</span>
                  <span className="text-emerald-400">Eco: {tranche.ecologicalRegeneration}%</span>
                  <span className="text-amber-400">Econ: {tranche.economicProductivity}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Chart Canvas & Detailed Tranche Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Chart Column */}
          <div className="lg:col-span-7 bg-[#0A0D13] border border-[#1C2534] rounded-xl p-4 flex flex-col justify-between min-h-[360px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-[#94A3B8] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {activeChartType === "bar" 
                    ? "Comparative Dimensions (0-100 Standardized Scale)" 
                    : `Radar Dimension Signature: ${selectedTranche.shortName} vs Conventional Gray Baseline`}
                </span>
              </span>
              <span className="text-[10px] font-mono text-[#64748B]">
                Axiom: Priority Floor Non-Negotiable
              </span>
            </div>

            <div className="w-full h-[280px]">
              {activeChartType === "bar" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TRANCHE_IMPACT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                    <XAxis 
                      dataKey="shortName" 
                      stroke="#64748B" 
                      tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "monospace" }} 
                    />
                    <YAxis 
                      stroke="#64748B" 
                      domain={[0, 100]}
                      tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "monospace" }} 
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[#0F172A] border border-[#334155] p-3 rounded-lg shadow-xl text-xs font-mono space-y-1 z-50">
                              <span className="font-bold text-white block pb-1 border-b border-[#1E293B]">
                                {label}
                              </span>
                              {payload.map((entry: any, index: number) => (
                                <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                                  <span style={{ color: entry.color }}>{entry.name}:</span>
                                  <span className="font-bold text-white">{entry.value}%</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "8px" }} 
                    />
                    <Bar dataKey="humanAgency" name="Human Agency" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="ecologicalRegeneration" name="Ecological Regeneration" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="economicProductivity" name="Economic Productivity" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#1E293B" />
                    <PolarAngleAxis dataKey="subject" stroke="#94A3B8" tick={{ fill: "#CBD5E1", fontSize: 10, fontFamily: "monospace" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: "#64748B", fontSize: 9 }} />
                    <Radar 
                      name={selectedTranche.shortName} 
                      dataKey="selected" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.4} 
                    />
                    <Radar 
                      name="Conventional Gray Baseline" 
                      dataKey="baseline" 
                      stroke="#F43F5E" 
                      fill="#F43F5E" 
                      fillOpacity={0.15} 
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "4px" }} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[#0F172A] border border-[#334155] p-2.5 rounded-lg shadow-xl text-xs font-mono space-y-1">
                              <span className="font-bold text-white block">{payload[0]?.payload?.subject}</span>
                              {payload.map((p: any, i: number) => (
                                <div key={i} className="flex items-center justify-between gap-3">
                                  <span style={{ color: p.color }}>{p.name}:</span>
                                  <span className="font-bold text-white">{p.value}%</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1C2534] text-[10px] font-mono text-[#64748B]">
              <span>Chart Mode: Recharts Vector Engine</span>
              <span>Normalized against Nairobi Basin Empirical Longitudinal Datasets</span>
            </div>
          </div>

          {/* Detailed Tranche Inspector Column */}
          <div className="lg:col-span-5 bg-[#121824] border border-[#232D3F] rounded-xl p-4 lg:p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30">
                  {selectedTranche.shortName} Dossier
                </span>
                <span className="text-xs font-mono font-bold text-[#E2E8F0]">
                  Ksh {selectedTranche.capitalKsh.toLocaleString()} ($ {selectedTranche.capitalUSD.toLocaleString()})
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#F8FAFC]">
                {selectedTranche.trancheName}
              </h4>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {selectedTranche.description}
              </p>

              {/* Physical Empirical Indicators */}
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                <div className="bg-[#0B0F17] p-2 rounded-lg border border-[#1E2738]">
                  <span className="text-[10px] text-[#64748B] block">Community Ownership</span>
                  <span className="font-bold text-rose-300">{selectedTranche.metrics.communityOwnership}</span>
                </div>
                <div className="bg-[#0B0F17] p-2 rounded-lg border border-[#1E2738]">
                  <span className="text-[10px] text-[#64748B] block">Wetland Restored</span>
                  <span className="font-bold text-emerald-300">{selectedTranche.metrics.wetlandRestoredHa} Hectares</span>
                </div>
                <div className="bg-[#0B0F17] p-2 rounded-lg border border-[#1E2738]">
                  <span className="text-[10px] text-[#64748B] block">Annual Retained Savings</span>
                  <span className="font-bold text-amber-300">Ksh {selectedTranche.metrics.annualSavingsKshM}M / yr</span>
                </div>
                <div className="bg-[#0B0F17] p-2 rounded-lg border border-[#1E2738]">
                  <span className="text-[10px] text-[#64748B] block">Flood Dampening</span>
                  <span className="font-bold text-sky-300">{selectedTranche.metrics.floodPeakDampening}</span>
                </div>
              </div>

              {/* Priority Floor Audit Box */}
              <div className="bg-[#0E1522] p-3 rounded-lg border border-amber-500/30 text-xs space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Priority Floor Rating
                  </span>
                  <span className="text-[11px] text-amber-300 font-semibold">{selectedTranche.priorityFloorRating}</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-normal pt-1">
                  <strong>Primary Beneficiaries:</strong> {selectedTranche.keyBeneficiaries}
                </p>
                <p className="text-[11px] text-rose-300/90 leading-normal">
                  <strong>Tail-Risk Exposure:</strong> {selectedTranche.vulnerableGroupsAtRisk}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
              <span>Reversibility: {selectedTranche.reversibilityScore}/10</span>
              <span className="text-emerald-400">ISO-14040 Life Cycle Assessed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Dimension Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className={`bg-[#10151E] border ${cat.borderColor} rounded-xl p-5 space-y-4 relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${cat.bgGradient} pointer-events-none`} />

              <div className="flex items-center gap-2.5 pb-3 border-b border-[#1C2330]">
                <Icon className={`w-4 h-4 ${cat.color}`} />
                <h3 className="font-['Syne'] text-sm font-bold text-[#F8FAFC]">
                  {cat.name}
                </h3>
              </div>

              <div className="space-y-3">
                {cat.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="bg-[#141A24] p-3 rounded-lg border border-[#222C3D]">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <span className="text-[11px] text-[#94A3B8] font-mono">{m.label}</span>
                      <span className={`text-sm font-mono font-bold ${cat.color}`}>
                        {m.value}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#CBD5E1] block leading-snug">
                      {m.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
