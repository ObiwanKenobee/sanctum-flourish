import React, { useState, useMemo } from "react";
import { 
  FlaskConical, 
  Sliders, 
  AlertTriangle, 
  RefreshCw, 
  TrendingUp, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle, 
  Activity, 
  Layers,
  CircleDollarSign,
  Droplets,
  Sparkles,
  Info
} from "lucide-react";
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
} from "recharts";
import { SimulationParameters, SimulationResult } from "../types";
import { ResourceScarcityTrendChart } from "./ResourceScarcityTrendChart";

interface SimulatorViewProps {
  onRunSimulation?: (params: SimulationParameters) => void;
}

interface CapitalOutcomePoint {
  id: string;
  name: string;
  category: "natural_infra" | "distributed_solar" | "integrated_nexus" | "conventional_gray" | "current_sim";
  capitalUSD: number;
  waterQualityNTU: number; // Lower is better (potable < 5 NTU)
  biodiversityIndex: number; // 0-100 (Higher is better, endemic species & wetland flora recovery)
  floodAttenuationMeters: number; // Higher is better
  monthlySavingsKsh: number; // Higher is better
  populationProtected: number;
  efficiencyRating: string;
  notes: string;
}

const HISTORICAL_CAPITAL_OUTCOMES: CapitalOutcomePoint[] = [
  {
    id: "OPT-01",
    name: "Ad-hoc Sandbags & Emergency Desilt",
    category: "conventional_gray",
    capitalUSD: 15000,
    waterQualityNTU: 380,
    biodiversityIndex: 12,
    floodAttenuationMeters: 0.15,
    monthlySavingsKsh: 150,
    populationProtected: 4500,
    efficiencyRating: "Low (Washes out annually)",
    notes: "High recurrence cost; zero heavy metal retention; fails on third rainfall event."
  },
  {
    id: "OPT-02",
    name: "Unfiltered Deep Borehole Drilling",
    category: "conventional_gray",
    capitalUSD: 45000,
    waterQualityNTU: 185,
    biodiversityIndex: 16,
    floodAttenuationMeters: 0.05,
    monthlySavingsKsh: 620,
    populationProtected: 12000,
    efficiencyRating: "Sub-optimal (Saline/Fluoride)",
    notes: "High initial capex but water requires secondary boiling; prone to aquifer drawdown."
  },
  {
    id: "OPT-03",
    name: "Plan Beta: 4x Solar UF Cooperative Kiosks",
    category: "distributed_solar",
    capitalUSD: 85000,
    waterQualityNTU: 12,
    biodiversityIndex: 48,
    floodAttenuationMeters: 0.10,
    monthlySavingsKsh: 2450,
    populationProtected: 48000,
    efficiencyRating: "High Capital Efficiency",
    notes: "Cooperative kiosk pricing breaks water cartels; 72% drop in clinic diarrheal cases."
  },
  {
    id: "OPT-04",
    name: "Plan Alpha: Phase 1 Bioswale Natural Infra",
    category: "natural_infra",
    capitalUSD: 140000,
    waterQualityNTU: 85,
    biodiversityIndex: 88,
    floodAttenuationMeters: 1.36,
    monthlySavingsKsh: 1200,
    populationProtected: 85000,
    efficiencyRating: "High Regenerative Yield",
    notes: "14ha wetland buffer retains 48,000m³ peak flood pulse; phytoremediates chromium."
  },
  {
    id: "OPT-05",
    name: "Plan Alpha + Beta Integrated Nexus",
    category: "integrated_nexus",
    capitalUSD: 225000,
    waterQualityNTU: 14,
    biodiversityIndex: 94,
    floodAttenuationMeters: 1.48,
    monthlySavingsKsh: 2750,
    populationProtected: 110000,
    efficiencyRating: "Optimal Pareto Frontier",
    notes: "Couples upstream hydrological flood attenuation with community-owned potable water nodes."
  },
  {
    id: "OPT-06",
    name: "Municipal Concrete Channel Lining",
    category: "conventional_gray",
    capitalUSD: 340000,
    waterQualityNTU: 320,
    biodiversityIndex: 8,
    floodAttenuationMeters: 0.40,
    monthlySavingsKsh: 220,
    populationProtected: 35000,
    efficiencyRating: "Extremely Poor (Displaces Risk)",
    notes: "Accelerates water velocity, shifting catastrophic erosion and drownings downstream into Viwandani."
  },
  {
    id: "OPT-07",
    name: "Full Catchment Regeneration & 8 Kiosks",
    category: "integrated_nexus",
    capitalUSD: 480000,
    waterQualityNTU: 6,
    biodiversityIndex: 97,
    floodAttenuationMeters: 1.84,
    monthlySavingsKsh: 3100,
    populationProtected: 165000,
    efficiencyRating: "Transformative Basin Scale",
    notes: "Comprehensive riparian stabilization with 100% decentralized water sovereignty."
  },
  {
    id: "OPT-08",
    name: "Centralized Deep Membrane Plant",
    category: "conventional_gray",
    capitalUSD: 620000,
    waterQualityNTU: 4,
    biodiversityIndex: 24,
    floodAttenuationMeters: 0.00,
    monthlySavingsKsh: 1800,
    populationProtected: 70000,
    efficiencyRating: "Fragile (High Energy & Grid Dependent)",
    notes: "High recurring maintenance costs; easily sabotaged by utility power cuts."
  }
];

interface ScenarioPreset {
  id: string;
  title: string;
  badge: string;
  category: string;
  description: string;
  params: SimulationParameters;
}

const SCENARIO_SUGGESTIONS_POOL: ScenarioPreset[] = [
  {
    id: "scen-el-nino",
    title: "El Niño 100-Year Surge",
    badge: "Extreme Climate",
    category: "Severe Flood Pulse",
    description: "95% rainfall surge with upstream bioswales primed and 36h early warning lead time.",
    params: {
      rainfallSurge: 95,
      upstreamIndustrialSpike: 35,
      cartelPriceGouging: 60,
      bioswalePreDeployment: true,
      solarKiosksOnline: 6,
      earlyWarningLeadHours: 36
    }
  },
  {
    id: "scen-cartel-shock",
    title: "Syndicate Supply Embargo",
    badge: "Economic Extortion",
    category: "Water Monopoly Crisis",
    description: "100% cartel price gouging counteracted by 10 community solar kiosks.",
    params: {
      rainfallSurge: 25,
      upstreamIndustrialSpike: 20,
      cartelPriceGouging: 100,
      bioswalePreDeployment: false,
      solarKiosksOnline: 10,
      earlyWarningLeadHours: 12
    }
  },
  {
    id: "scen-toxic-midnight",
    title: "Industrial Midnight Slurry Spike",
    badge: "Ecological Hazard",
    category: "Toxic Chemical Pulse",
    description: "85% industrial chemical discharge during a moderate 40% precipitation pulse.",
    params: {
      rainfallSurge: 40,
      upstreamIndustrialSpike: 85,
      cartelPriceGouging: 45,
      bioswalePreDeployment: true,
      solarKiosksOnline: 4,
      earlyWarningLeadHours: 8
    }
  },
  {
    id: "scen-regenerative-nexus",
    title: "Sovereign Regenerative Nexus",
    badge: "Target State",
    category: "Optimal Resilience",
    description: "Full bioswale buffer active + 12 cooperative solar kiosks + 48h early warning lead time.",
    params: {
      rainfallSurge: 60,
      upstreamIndustrialSpike: 15,
      cartelPriceGouging: 10,
      bioswalePreDeployment: true,
      solarKiosksOnline: 12,
      earlyWarningLeadHours: 48
    }
  },
  {
    id: "scen-vulnerable-baseline",
    title: "Unmitigated Gray Infrastructure",
    badge: "Vulnerability Audit",
    category: "High Disaster Risk",
    description: "Zero bioswale buffers, 0 kiosks online, 4h lead warning with 80% flood pulse.",
    params: {
      rainfallSurge: 80,
      upstreamIndustrialSpike: 65,
      cartelPriceGouging: 90,
      bioswalePreDeployment: false,
      solarKiosksOnline: 0,
      earlyWarningLeadHours: 4
    }
  },
  {
    id: "scen-dry-spell-fluoride",
    title: "Severe Drought & Aquifer Drawdown",
    badge: "Groundwater Stress",
    category: "Scarcity Crisis",
    description: "Low rainfall with extreme water scarcity, 85% cartel markup, and borehole drawdowns.",
    params: {
      rainfallSurge: 5,
      upstreamIndustrialSpike: 70,
      cartelPriceGouging: 95,
      bioswalePreDeployment: false,
      solarKiosksOnline: 3,
      earlyWarningLeadHours: 12
    }
  }
];

export const SimulatorView: React.FC<SimulatorViewProps> = () => {
  const [params, setParams] = useState<SimulationParameters>({
    rainfallSurge: 55,
    upstreamIndustrialSpike: 35,
    cartelPriceGouging: 75,
    bioswalePreDeployment: true,
    solarKiosksOnline: 4,
    earlyWarningLeadHours: 14
  });

  const [simResult, setSimResult] = useState<SimulationResult>({
    simulationId: "sim-nbi-901",
    floodRiskIndex: 42,
    floodRiskCategory: "Moderate Surface Flooding (Swale Buffered)",
    choleraOutbreakProbPercent: 22,
    householdEconomicStrainKshPerMonth: 2340,
    estimatedPopulationAtRisk: 60900,
    waterTreatedDailyLiters: 74000,
    ecologicalRetentionCapacityPercent: 78,
    uncertaintyBands: {
      floodRisk: "±7.8% variance",
      waterQuality: "±18 NTU range",
      socioEconomicImpact: "±Ksh 320/month"
    },
    assumptions: [
      "Soil absorption capacity in Kiambu tea belt based on antecedent moisture index (API = 42mm)",
      "Solar kiosks sustain 74kL daily output assuming minimum 4.8 peak sun hours with LFP battery buffer",
      "Informal cartel pricing elasticity modeled from 1,200 Muungano household longitudinal records"
    ],
    unknowns: [
      "Unregistered midnight effluent dumping from industrial leather tanneries in Ruaraka",
      "Rapid debris clogging rate along Juja Road railway culverts during peak storm pulse"
    ]
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [scenarioOffset, setScenarioOffset] = useState<number>(0);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [isRefreshingScenarios, setIsRefreshingScenarios] = useState<boolean>(false);

  const handleRefreshScenarios = () => {
    setIsRefreshingScenarios(true);
    setScenarioOffset(prev => (prev + 3) % SCENARIO_SUGGESTIONS_POOL.length);
    setTimeout(() => setIsRefreshingScenarios(false), 300);
  };

  const handleSelectScenario = (scen: ScenarioPreset) => {
    setActiveScenarioId(scen.id);
    setParams(scen.params);
    // Directly run computation with selected params
    setIsSimulating(true);
    fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scen.params)
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.outputs) setSimResult(data.outputs);
      })
      .catch(() => {
        const baseFlood = Math.min(100, Math.round(30 + scen.params.rainfallSurge * 0.7 - (scen.params.bioswalePreDeployment ? 28 : 0) - (scen.params.earlyWarningLeadHours * 1.2)));
        const cholera = Math.min(100, Math.max(5, Math.round(15 + scen.params.upstreamIndustrialSpike * 0.4 + (scen.params.cartelPriceGouging * 0.3) - (scen.params.solarKiosksOnline * 7))));
        setSimResult(prev => ({
          ...prev,
          floodRiskIndex: baseFlood,
          floodRiskCategory: baseFlood > 70 ? "Severe Riparian Inundation" : baseFlood > 40 ? "Moderate Surface Flooding" : "Swale Managed Flow",
          choleraOutbreakProbPercent: cholera,
          waterTreatedDailyLiters: scen.params.solarKiosksOnline * 18500,
          householdEconomicStrainKshPerMonth: Math.round(1800 + (scen.params.cartelPriceGouging * 28) - (scen.params.solarKiosksOnline * 220))
        }));
      })
      .finally(() => setIsSimulating(false));
  };

  const displayedScenarioSuggestions = Array.from({ length: 3 }, (_, i) => {
    const idx = (i + scenarioOffset) % SCENARIO_SUGGESTIONS_POOL.length;
    return SCENARIO_SUGGESTIONS_POOL[idx];
  });

  // Scatter plot state
  const [activeScatterMetric, setActiveScatterMetric] = useState<"waterQuality" | "biodiversity" | "floodAttenuation" | "savings">("waterQuality");
  const [selectedPointId, setSelectedPointId] = useState<string>("OPT-05");

  // Compute active simulation dynamic scatter point
  const currentSimPoint: CapitalOutcomePoint = useMemo(() => {
    const calculatedCapital = (params.bioswalePreDeployment ? 140000 : 0) + (params.solarKiosksOnline * 21250);
    const ntu = Math.max(8, Math.round(412 - (params.solarKiosksOnline * 48) - (params.bioswalePreDeployment ? 150 : 0) + (params.upstreamIndustrialSpike * 1.2)));
    const bioIndex = params.bioswalePreDeployment 
      ? Math.min(96, Math.round(72 + (params.solarKiosksOnline * 2.2) - (params.upstreamIndustrialSpike * 0.15))) 
      : Math.max(10, Math.round(18 - (params.upstreamIndustrialSpike * 0.12)));
    const floodAtten = params.bioswalePreDeployment ? Math.min(2.1, 1.1 + (params.earlyWarningLeadHours * 0.02)) : 0.12;
    const savings = Math.max(100, Math.round((params.solarKiosksOnline * 550) + (params.cartelPriceGouging * 12)));

    return {
      id: "CURRENT_SIM",
      name: `Active Scenario (${params.solarKiosksOnline} Kiosks + ${params.bioswalePreDeployment ? "Swales" : "No Swales"})`,
      category: "current_sim",
      capitalUSD: calculatedCapital,
      waterQualityNTU: ntu,
      biodiversityIndex: bioIndex,
      floodAttenuationMeters: Number(floodAtten.toFixed(2)),
      monthlySavingsKsh: savings,
      populationProtected: Math.round(params.solarKiosksOnline * 15000 + (params.bioswalePreDeployment ? 65000 : 0)),
      efficiencyRating: "Computed Real-Time Scenario",
      notes: "Dynamic calculation reflecting current slider configurations and counterfactual assumptions."
    };
  }, [params]);

  const scatterDataset = useMemo(() => {
    return [...HISTORICAL_CAPITAL_OUTCOMES, currentSimPoint];
  }, [currentSimPoint]);

  const activeSelectedPoint = scatterDataset.find(p => p.id === selectedPointId) || currentSimPoint;

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const data = await res.json();
        setSimResult(data.outputs);
      }
    } catch (e) {
      // Fallback calculations
      const baseFlood = Math.min(100, Math.round(30 + params.rainfallSurge * 0.7 - (params.bioswalePreDeployment ? 28 : 0) - (params.earlyWarningLeadHours * 1.2)));
      const cholera = Math.min(100, Math.max(5, Math.round(15 + params.upstreamIndustrialSpike * 0.4 + (params.cartelPriceGouging * 0.3) - (params.solarKiosksOnline * 7))));
      setSimResult({
        ...simResult,
        floodRiskIndex: baseFlood,
        floodRiskCategory: baseFlood > 70 ? "Severe Riparian Inundation" : baseFlood > 40 ? "Moderate Surface Flooding" : "Swale Managed Flow",
        choleraOutbreakProbPercent: cholera,
        waterTreatedDailyLiters: params.solarKiosksOnline * 18500,
        householdEconomicStrainKshPerMonth: Math.round(1800 + (params.cartelPriceGouging * 28) - (params.solarKiosksOnline * 220))
      });
    } finally {
      setIsSimulating(false);
    }
  };

  // Custom Scatter Tooltip
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const pt: CapitalOutcomePoint = payload[0].payload;
      return (
        <div className="bg-[#0C1017] border border-amber-500/60 p-3 rounded-lg shadow-2xl text-xs font-mono max-w-xs z-50">
          <div className="flex items-center justify-between border-b border-[#232D3F] pb-1.5 mb-1.5">
            <span className="text-amber-400 font-bold">{pt.id}</span>
            <span className="text-[10px] text-[#94A3B8]">{pt.category.replace("_", " ")}</span>
          </div>
          <div className="font-sans font-bold text-[#F8FAFC] text-xs mb-2">{pt.name}</div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-[#CBD5E1]">
              <span>Capital Flow:</span>
              <span className="text-amber-300 font-bold">${pt.capitalUSD.toLocaleString()} USD</span>
            </div>
            <div className="flex justify-between text-[#CBD5E1]">
              <span>Water Quality:</span>
              <span className={pt.waterQualityNTU < 25 ? "text-emerald-400 font-bold" : "text-rose-400"}>
                {pt.waterQualityNTU} NTU
              </span>
            </div>
            <div className="flex justify-between text-[#CBD5E1]">
              <span>Biodiversity Index:</span>
              <span className="text-emerald-300 font-bold">{pt.biodiversityIndex} / 100</span>
            </div>
            <div className="flex justify-between text-[#CBD5E1]">
              <span>Flood Stage Attenuation:</span>
              <span className="text-sky-400 font-bold">{pt.floodAttenuationMeters}m</span>
            </div>
            <div className="flex justify-between text-[#CBD5E1]">
              <span>Household Savings:</span>
              <span className="text-emerald-300 font-bold">Ksh {pt.monthlySavingsKsh}/mo</span>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#1C2534] text-[10px] text-[#94A3B8]">
            {pt.notes}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Simulator Mandate Banner */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 lg:p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <FlaskConical className="w-4 h-4" />
              </span>
              <h2 className="font-['Syne'] text-lg font-bold text-[#F8FAFC]">
                Atlas Simulator — Counterfactual Scenario Laboratory
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-500/30">
                Non-Prophetic Scenario Engine
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
              Stress-test interventions, infrastructure failures, climate shifts, and economic shocks before capital is committed.
              <span className="text-amber-400/90 font-medium ml-1">
                Axiom: Never present simulations as prophecy. Always distinguish facts, assumptions, model outputs, and unknowns.
              </span>
            </p>
          </div>

          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0A0D13] font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-950/50"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? "animate-spin" : ""}`} />
            <span>{isSimulating ? "Computing Stress Test..." : "Run Scenario Simulation"}</span>
          </button>
        </div>
      </div>

      {/* Scenario Suggestions & Stress-Test Presets Bar */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 lg:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#1C2534]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono text-amber-400 font-bold tracking-wider">
              Stress-Test Scenario Suggestions & Historical Baselines
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A2333] text-emerald-300 border border-emerald-500/20">
              One-Click Injection
            </span>
          </div>

          <button
            onClick={handleRefreshScenarios}
            disabled={isRefreshingScenarios}
            className="px-2.5 py-1 rounded-md bg-[#141A24] hover:bg-[#1E2738] border border-[#2B374A] hover:border-amber-500/40 text-[11px] font-mono text-amber-300 flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-sm"
            title="Cycle through realistic basin stress-test scenarios"
          >
            <RefreshCw className={`w-3 h-3 text-amber-400 ${isRefreshingScenarios ? "animate-spin text-amber-300" : ""}`} />
            <span>{isRefreshingScenarios ? "Synthesizing..." : "Refresh Scenarios"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {displayedScenarioSuggestions.map((scen) => {
            const isSelected = activeScenarioId === scen.id;
            return (
              <div
                key={scen.id}
                onClick={() => handleSelectScenario(scen)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#182233] border-amber-500/80 shadow-md ring-1 ring-amber-500/30"
                    : "bg-[#121722] border-[#222C3D] hover:border-[#374761]"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 font-bold border border-amber-500/30">
                      {scen.badge}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      {scen.category}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#F8FAFC]">
                    {scen.title}
                  </h4>

                  <p className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-2">
                    {scen.description}
                  </p>
                </div>

                <div className="pt-2.5 mt-2 border-t border-[#1C2534] flex items-center justify-between text-[10px] font-mono text-[#CBD5E1]">
                  <span>Rain: +{scen.params.rainfallSurge}%</span>
                  <span>Kiosks: {scen.params.solarKiosksOnline}</span>
                  <span className="text-amber-400 font-semibold">Simulate →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Interactive Parameter Control Laboratory + Epistemic Output Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Controls */}
        <div className="lg:col-span-5 bg-[#10151E] border border-[#232D3F] rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C2330] text-xs font-mono">
            <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Input Parameter Laboratory
            </span>
            <span className="text-[#64748B]">Nairobi River Basin</span>
          </div>

          {/* Slider 1: Rainfall Surge */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#CBD5E1]">Rainfall Surge (El Niño Pulse)</span>
              <span className="text-amber-400 font-bold">+{params.rainfallSurge}% above normal</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.rainfallSurge}
              onChange={(e) => setParams({ ...params, rainfallSurge: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-[#161D29] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
              <span>0% (Baseline 35mm)</span>
              <span>+50% (Flash Threshold)</span>
              <span>+100% (100-Yr Storm)</span>
            </div>
          </div>

          {/* Slider 2: Industrial Effluent Spike */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#CBD5E1]">Upstream Industrial Effluent Surge</span>
              <span className="text-rose-400 font-bold">+{params.upstreamIndustrialSpike}% shock load</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.upstreamIndustrialSpike}
              onChange={(e) => setParams({ ...params, upstreamIndustrialSpike: Number(e.target.value) })}
              className="w-full accent-rose-500 bg-[#161D29] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
              <span>Standard Discharge</span>
              <span>Unregulated Toxic Pulse</span>
            </div>
          </div>

          {/* Slider 3: Cartel Price Gouging */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#CBD5E1]">Informal Water Cartel Price Gouging</span>
              <span className="text-amber-400 font-bold">+{params.cartelPriceGouging}% tariff surge</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={params.cartelPriceGouging}
              onChange={(e) => setParams({ ...params, cartelPriceGouging: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-[#161D29] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
              <span>Ksh 5 / jerrycan</span>
              <span>Ksh 50 / jerrycan</span>
            </div>
          </div>

          {/* Toggle: Bioswale Pre-Deployment */}
          <div className="p-3 rounded-lg bg-[#141B26] border border-[#222C3D] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#E2E8F0] block">
                Upstream Bioswale & Micro-Wetland Pre-Retention
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                Absorbs 48,000m³ peak runoff and bioremediates heavy metals
              </span>
            </div>
            <button
              onClick={() => setParams({ ...params, bioswalePreDeployment: !params.bioswalePreDeployment })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                params.bioswalePreDeployment ? "bg-emerald-500" : "bg-[#2A3447]"
              }`}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  params.bioswalePreDeployment ? "left-7" : "left-1"
                }`} 
              />
            </button>
          </div>

          {/* Slider 4: Solar Kiosks Online */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#CBD5E1]">Solar UF Kiosks Deployed</span>
              <span className="text-emerald-400 font-bold">{params.solarKiosksOnline} of 8 Stations Active</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={params.solarKiosksOnline}
              onChange={(e) => setParams({ ...params, solarKiosksOnline: Number(e.target.value) })}
              className="w-full accent-emerald-500 bg-[#161D29] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
              <span>0 (100% Cartel Dependent)</span>
              <span>8 Stations (100% Self-Sufficient)</span>
            </div>
          </div>

          {/* Slider 5: Early Warning Lead Time */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#CBD5E1]">Early Flood Warning Lead Time</span>
              <span className="text-sky-400 font-bold">{params.earlyWarningLeadHours} Hours</span>
            </div>
            <input
              type="range"
              min="0"
              max="48"
              value={params.earlyWarningLeadHours}
              onChange={(e) => setParams({ ...params, earlyWarningLeadHours: Number(e.target.value) })}
              className="w-full accent-sky-500 bg-[#161D29] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
              <span>0h (Sudden Inundation)</span>
              <span>48h (Community Prepared)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Epistemic Clarity Matrix */}
        <div className="lg:col-span-7 space-y-4">
          {/* Key Simulation Outputs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#10151E] p-3.5 rounded-xl border border-[#232D3F]">
              <span className="text-[10px] uppercase font-mono text-[#64748B] block">Flood Risk Index</span>
              <span className={`text-xl font-mono font-bold block mt-1 ${
                simResult.floodRiskIndex > 65 ? "text-rose-400" :
                simResult.floodRiskIndex > 35 ? "text-amber-400" : "text-emerald-400"
              }`}>
                {simResult.floodRiskIndex} / 100
              </span>
              <span className="text-[10px] text-[#94A3B8] block mt-0.5">{simResult.floodRiskCategory}</span>
            </div>

            <div className="bg-[#10151E] p-3.5 rounded-xl border border-[#232D3F]">
              <span className="text-[10px] uppercase font-mono text-[#64748B] block">Cholera Probability</span>
              <span className={`text-xl font-mono font-bold block mt-1 ${
                simResult.choleraOutbreakProbPercent > 40 ? "text-rose-400" : "text-amber-400"
              }`}>
                {simResult.choleraOutbreakProbPercent}%
              </span>
              <span className="text-[10px] text-[#94A3B8] block mt-0.5">30-day outbreak risk</span>
            </div>

            <div className="bg-[#10151E] p-3.5 rounded-xl border border-[#232D3F]">
              <span className="text-[10px] uppercase font-mono text-[#64748B] block">Water Treated / Day</span>
              <span className="text-xl font-mono font-bold text-emerald-400 block mt-1">
                {(simResult.waterTreatedDailyLiters / 1000).toFixed(0)} kL
              </span>
              <span className="text-[10px] text-[#94A3B8] block mt-0.5">Ultrafiltered potable</span>
            </div>

            <div className="bg-[#10151E] p-3.5 rounded-xl border border-[#232D3F]">
              <span className="text-[10px] uppercase font-mono text-[#64748B] block">Household Burden</span>
              <span className="text-xl font-mono font-bold text-amber-300 block mt-1">
                Ksh {simResult.householdEconomicStrainKshPerMonth}
              </span>
              <span className="text-[10px] text-[#94A3B8] block mt-0.5">Avg water spend/mo</span>
            </div>
          </div>

          {/* Epistemic Segregation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Observed Facts vs Model Assumptions */}
            <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">
                  1. Grounded Facts (Observed In-Situ)
                </span>
                <ul className="mt-1 space-y-1 text-xs text-[#CBD5E1]">
                  <li>• Current stage at Mathare Weir MW-44: 1.84m (verified WRMA sensor).</li>
                  <li>• Turbidity at Mukuru inflow: 412 NTU (verified optical probe).</li>
                  <li>• 4 Solar Kiosks operational delivering 74,000L daily at Ksh 3.</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-[#1C2330]">
                <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block">
                  2. Explicit Model Assumptions
                </span>
                <ul className="mt-1 space-y-1 text-xs text-[#94A3B8]">
                  {simResult.assumptions.map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card 2: Uncertainty Bounds & Blind Spots / Unknowns */}
            <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-sky-400 font-bold block">
                  3. Quantified Uncertainty Bands
                </span>
                <div className="mt-2 space-y-1.5 font-mono text-xs text-[#CBD5E1]">
                  <div className="flex justify-between bg-[#141A24] p-1.5 rounded">
                    <span className="text-[#94A3B8]">Flood Crest Confidence:</span>
                    <span className="text-amber-400">{simResult.uncertaintyBands.floodRisk}</span>
                  </div>
                  <div className="flex justify-between bg-[#141A24] p-1.5 rounded">
                    <span className="text-[#94A3B8]">Water Quality Variance:</span>
                    <span className="text-sky-400">{simResult.uncertaintyBands.waterQuality}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1C2330]">
                <span className="text-[10px] uppercase font-mono text-rose-400 font-bold block flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  4. Explicit Unknowns & Blind Spots
                </span>
                <p className="text-[11px] text-[#94A3B8] italic mt-0.5">
                  The system confesses what it cannot observe:
                </p>
                <ul className="mt-1 space-y-1 text-xs text-[#CBD5E1]">
                  {simResult.unknowns.map((u, i) => (
                    <li key={i}>• {u}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10-Year Resource Scarcity Trend Analysis Chart (Water, Electricity, Waste Capacity) */}
      <ResourceScarcityTrendChart params={params} />

      {/* NEW: Interactive Scatter Plot Visualization (Capital Flow vs. Physical Outcomes) */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1C2330] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CircleDollarSign className="w-4 h-4 text-amber-400" />
              <h3 className="font-['Syne'] text-base font-bold text-[#F8FAFC]">
                Capital Flow vs. Physical Reality Outcomes (Interactive Scatter Plot)
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Empirical Pareto mapping comparing capital efficiency across green natural infrastructure, distributed cooperative kiosks, and conventional gray concrete interventions.
            </p>
          </div>

          {/* Physical Outcome Metric Selector */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-[#64748B]">Y-Axis Metric:</span>
            {[
              { key: "waterQuality", label: "Water Quality (NTU ↓)" },
              { key: "biodiversity", label: "Biodiversity Index (0-100 ↑)" },
              { key: "floodAttenuation", label: "Flood Attenuation (m ↑)" },
              { key: "savings", label: "Monthly Savings (Ksh ↑)" }
            ].map((m) => (
              <button
                key={m.key}
                onClick={() => setActiveScatterMetric(m.key as any)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  activeScatterMetric === m.key
                    ? "bg-amber-500/20 text-amber-300 font-bold border-amber-500/50 shadow-sm"
                    : "bg-[#141A24] text-[#94A3B8] hover:text-white border-[#232D3F]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scatter Plot Container */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2738" />
              <XAxis 
                type="number" 
                dataKey="capitalUSD" 
                name="Capital Flow ($ USD)" 
                stroke="#64748B" 
                fontSize={11} 
                fontFamily="monospace"
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                unit=" USD"
              />
              <YAxis 
                type="number" 
                dataKey={
                  activeScatterMetric === "waterQuality" ? "waterQualityNTU" :
                  activeScatterMetric === "biodiversity" ? "biodiversityIndex" :
                  activeScatterMetric === "floodAttenuation" ? "floodAttenuationMeters" : "monthlySavingsKsh"
                } 
                name={
                  activeScatterMetric === "waterQuality" ? "Water Turbidity (NTU)" :
                  activeScatterMetric === "biodiversity" ? "Biodiversity Index" :
                  activeScatterMetric === "floodAttenuation" ? "Flood Attenuation (Meters)" : "Monthly Savings (Ksh)"
                }
                stroke="#64748B" 
                fontSize={11} 
                fontFamily="monospace"
                domain={activeScatterMetric === "biodiversity" ? [0, 100] : undefined}
                unit={
                  activeScatterMetric === "waterQuality" ? " NTU" :
                  activeScatterMetric === "biodiversity" ? " pts" :
                  activeScatterMetric === "floodAttenuation" ? "m" : " Ksh"
                }
                reversed={activeScatterMetric === "waterQuality"} // Lower NTU is better!
              />
              <ZAxis range={[120, 260]} />
              <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#F59E0B' }} />
              <Legend 
                wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "12px" }}
              />

              <Scatter 
                name="Capital vs Reality Outcomes" 
                data={scatterDataset} 
                onClick={(e: any) => {
                  if (e && e.id) setSelectedPointId(e.id);
                }}
              >
                {scatterDataset.map((entry) => {
                  const isSim = entry.category === "current_sim";
                  const isSelected = entry.id === selectedPointId;
                  
                  // Color coding by archetype
                  let fill = "#10B981"; // natural_infra (emerald)
                  if (entry.category === "distributed_solar") fill = "#38BDF8"; // sky blue
                  if (entry.category === "integrated_nexus") fill = "#F59E0B"; // amber gold
                  if (entry.category === "conventional_gray") fill = "#EF4444"; // rose red
                  if (isSim) fill = "#E11D48"; // bright crimson pulsating for real-time scenario

                  return (
                    <Cell 
                      key={entry.id} 
                      fill={fill} 
                      stroke={isSelected ? "#FFFFFF" : isSim ? "#FCD34D" : "#0A0D13"} 
                      strokeWidth={isSelected ? 3 : isSim ? 2.5 : 1}
                      className="cursor-pointer transition-transform hover:opacity-80"
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Intervention Pareto Deep Dive Card */}
        <div className="bg-[#141A24] border border-[#222C3D] rounded-xl p-4 text-xs font-mono space-y-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#1E2838] pb-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold uppercase">{activeSelectedPoint.id}:</span>
              <span className="text-[#F8FAFC] font-bold text-sm font-sans">{activeSelectedPoint.name}</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#0C1017] text-emerald-400 border border-emerald-500/30">
              {activeSelectedPoint.efficiencyRating}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1">
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase">Capital Deployed</span>
              <span className="text-sm text-amber-300 font-bold">${activeSelectedPoint.capitalUSD.toLocaleString()} USD</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase">Water Quality Yield</span>
              <span className="text-sm text-emerald-400 font-bold">{activeSelectedPoint.waterQualityNTU} NTU</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase">Biodiversity Index</span>
              <span className="text-sm text-emerald-300 font-bold">{activeSelectedPoint.biodiversityIndex} / 100</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase">Flood Attenuation</span>
              <span className="text-sm text-sky-400 font-bold">{activeSelectedPoint.floodAttenuationMeters} Meters</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase">Target Population</span>
              <span className="text-sm text-[#F8FAFC] font-bold">{activeSelectedPoint.populationProtected.toLocaleString()} Citizens</span>
            </div>
          </div>

          <p className="text-[#CBD5E1] text-[11px] pt-1">
            <span className="text-[#64748B]">System Analysis: </span>
            {activeSelectedPoint.notes}
          </p>
        </div>

        {/* Visual Legend for Scatter Categories */}
        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#94A3B8] pt-2 border-t border-[#1C2330]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Natural Bioswales</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Solar UF Kiosks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Integrated Nexus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Gray Concrete</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 border border-amber-300 ring-2 ring-rose-500/40" />
              <span className="text-amber-300 font-bold">Active Sim Point</span>
            </div>
          </div>

          <span className="text-[#64748B] text-[10px]">
            *Click any node to inspect physical capital efficiency
          </span>
        </div>
      </div>
    </div>
  );
};
