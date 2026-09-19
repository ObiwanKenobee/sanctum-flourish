import React, { useState, useMemo } from "react";
import { 
  TrendingUp, 
  Droplets, 
  Zap, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Sliders,
  Calendar,
  Layers,
  ArrowDownRight,
  ArrowUpRight
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { SimulationParameters, ResourceScarcityPoint } from "../types";

interface ResourceScarcityTrendChartProps {
  params: SimulationParameters;
}

export const ResourceScarcityTrendChart: React.FC<ResourceScarcityTrendChartProps> = ({ params }) => {
  const [activeMetricFilter, setActiveMetricFilter] = useState<"all" | "water" | "electricity" | "waste">("all");
  const [displayUnit, setDisplayUnit] = useState<"percent" | "physical">("percent");

  // Generate dynamic 10-year projection (2026 to 2036) based on current simulator parameters
  const projectionData: ResourceScarcityPoint[] = useMemo(() => {
    const years = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036];
    
    // Parameter coefficients
    const bioswaleMitigation = params.bioswalePreDeployment ? 0.22 : 0.0;
    const solarKioskOffset = (params.solarKiosksOnline / 12) * 0.38; // Up to 38% mitigation if all 12 kiosks online
    const rainSurgeStress = params.rainfallSurge > 60 ? (params.rainfallSurge - 60) * 0.25 : 0; // Extreme flash floods damage intake
    const cartelFriction = (params.cartelPriceGouging / 100) * 0.32;
    const earlyWarningBenefit = (params.earlyWarningLeadHours / 48) * 0.18; // Pre-draining prevents culvert blowout

    return years.map((year, index) => {
      // Annual demographic & urbanization pressure compounding (+3.2% to +4.5% annual demand growth)
      const growthFactor = Math.pow(1.034, index);

      // 1. Water Scarcity / Deficit (% and MLD)
      // Baseline 2026 water deficit is 38%, aggravated by cartel gouging, mitigated by bioswales and solar UF
      const rawWaterDeficit = 38 * growthFactor + cartelFriction * 30 + rainSurgeStress * 0.5 - (bioswaleMitigation * 45) - (solarKioskOffset * 65);
      const waterDeficitPercent = Math.min(100, Math.max(8, Math.round(rawWaterDeficit * 10) / 10));
      // In Nairobi Basin, total informal settlement demand is ~180 Million Liters/day (MLD) in 2026 growing to 260 MLD by 2036
      const baseMLD = 180 * growthFactor;
      const waterDeficitMLD = Math.round((waterDeficitPercent / 100) * baseMLD);

      // 2. Electricity Grid Stress (%)
      // Central grid stress starts at 44%, grows +4.1% annually, mitigated by distributed solar microgrids
      const rawGridStress = 44 * Math.pow(1.041, index) - (solarKioskOffset * 50) + (params.upstreamIndustrialSpike * 0.15);
      const electricityGridStressPercent = Math.min(100, Math.max(12, Math.round(rawGridStress * 10) / 10));

      // 3. Solid Waste & Drainage Capacity Exhaustion (%)
      // Starts at 51%, compounding +4.2% per year; bioswales catch silt, early warning allows pre-desilting
      const rawWasteExhaustion = 51 * Math.pow(1.038, index) + (params.upstreamIndustrialSpike * 0.18) - (bioswaleMitigation * 35) - (earlyWarningBenefit * 28);
      const wasteCapacityExhaustionPercent = Math.min(100, Math.max(15, Math.round(rawWasteExhaustion * 10) / 10));

      // Composite Scarcity Index (Weighted)
      const composite = Math.round((waterDeficitPercent * 0.45 + electricityGridStressPercent * 0.30 + wasteCapacityExhaustionPercent * 0.25));

      let tippingPointAlert: string | undefined;
      if (waterDeficitPercent >= 75) tippingPointAlert = "Severe Potable Water Rationing";
      else if (electricityGridStressPercent >= 80) tippingPointAlert = "Rolling Blackout Imminent";
      else if (wasteCapacityExhaustionPercent >= 85) tippingPointAlert = "Culvert Hydraulic Failure";

      return {
        year,
        label: year.toString(),
        waterDeficitPercent,
        waterDeficitMLD,
        electricityGridStressPercent,
        wasteCapacityExhaustionPercent,
        compositeScarcityIndex: composite,
        tippingPointAlert
      };
    });
  }, [params]);

  // Key projection milestones (2026 vs 2036)
  const baseline = projectionData[0];
  const terminal = projectionData[projectionData.length - 1];
  const waterDelta = terminal.waterDeficitPercent - baseline.waterDeficitPercent;
  const gridDelta = terminal.electricityGridStressPercent - baseline.electricityGridStressPercent;
  const wasteDelta = terminal.wasteCapacityExhaustionPercent - baseline.wasteCapacityExhaustionPercent;

  // Custom Tooltip for 10-Year Projections
  const CustomProjectionTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = projectionData.find(p => p.label === label) || payload[0]?.payload;
      return (
        <div className="bg-[#0A0E17] border border-[#232D3F] p-3.5 rounded-xl shadow-2xl font-mono text-xs max-w-xs space-y-2">
          <div className="flex items-center justify-between border-b border-[#1E2738] pb-1.5">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Year {label} Outlook
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              point.compositeScarcityIndex > 70 ? "bg-rose-950 text-rose-300 border border-rose-500/40" :
              point.compositeScarcityIndex > 45 ? "bg-amber-950 text-amber-300 border border-amber-500/40" :
              "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
            }`}>
              Composite: {point.compositeScarcityIndex}%
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-sky-300">
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-sky-400" /> Water Deficit:
              </span>
              <span className="font-bold">
                {point.waterDeficitPercent}% ({point.waterDeficitMLD} MLD shortfall)
              </span>
            </div>

            <div className="flex items-center justify-between text-amber-300">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Grid Stress:
              </span>
              <span className="font-bold">{point.electricityGridStressPercent}%</span>
            </div>

            <div className="flex items-center justify-between text-emerald-300">
              <span className="flex items-center gap-1">
                <Trash2 className="w-3 h-3 text-emerald-400" /> Waste/Drain Exhaustion:
              </span>
              <span className="font-bold">{point.wasteCapacityExhaustionPercent}%</span>
            </div>
          </div>

          {point.tippingPointAlert && (
            <div className="p-1.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>{point.tippingPointAlert}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-5 space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1C2534]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-['Syne'] text-base font-bold text-[#F8FAFC]">
              10-Year Resource Scarcity Trend Analysis (2026 – 2036)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-400 border border-sky-500/30">
              Multi-Domain Projection Engine
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
            Simulates long-range depletion thresholds across potable water, electrical grid stability, and drainage/solid waste capacity under current intervention parameters.
          </p>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Resource Filter */}
          <div className="flex items-center bg-[#0A0E17] p-1 rounded-lg border border-[#1E2534] text-xs font-mono">
            {[
              { id: "all", label: "All Resources" },
              { id: "water", label: "Water", icon: Droplets },
              { id: "electricity", label: "Electricity", icon: Zap },
              { id: "waste", label: "Waste", icon: Trash2 }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveMetricFilter(f.id as any)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  activeMetricFilter === f.id
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                    : "text-[#64748B] hover:text-[#CBD5E1]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center bg-[#0A0E17] p-1 rounded-lg border border-[#1E2534] text-xs font-mono">
            <button
              onClick={() => setDisplayUnit("percent")}
              className={`px-2 py-1 rounded text-[11px] ${
                displayUnit === "percent" ? "bg-[#1E2838] text-white font-bold" : "text-[#64748B]"
              }`}
            >
              Capacity %
            </button>
            <button
              onClick={() => setDisplayUnit("physical")}
              className={`px-2 py-1 rounded text-[11px] ${
                displayUnit === "physical" ? "bg-[#1E2838] text-white font-bold" : "text-[#64748B]"
              }`}
            >
              MLD/Stress
            </button>
          </div>
        </div>
      </div>

      {/* Metric Delta Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
        {/* Water Scarcity Card */}
        <div className="bg-[#141B26] p-3 rounded-lg border border-[#222C3D] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1 text-sky-400">
              <Droplets className="w-3.5 h-3.5" /> Water Scarcity
            </span>
            <span>2026 → 2036</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-[#F8FAFC]">
              {displayUnit === "percent" ? `${terminal.waterDeficitPercent}%` : `${terminal.waterDeficitMLD} MLD`}
            </span>
            <span className={`text-[11px] font-bold flex items-center ${waterDelta > 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {waterDelta > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {waterDelta > 0 ? `+${waterDelta}%` : `${waterDelta}%`} 10-Yr
            </span>
          </div>
          <span className="text-[10px] text-[#94A3B8] mt-1">
            {params.solarKiosksOnline > 4 ? "Buffered by distributed solar UF" : "Severe deficit without kiosks"}
          </span>
        </div>

        {/* Electricity Grid Stress Card */}
        <div className="bg-[#141B26] p-3 rounded-lg border border-[#222C3D] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1 text-amber-400">
              <Zap className="w-3.5 h-3.5" /> Grid Stress
            </span>
            <span>2026 → 2036</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-[#F8FAFC]">
              {terminal.electricityGridStressPercent}%
            </span>
            <span className={`text-[11px] font-bold flex items-center ${gridDelta > 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {gridDelta > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {gridDelta > 0 ? `+${gridDelta}%` : `${gridDelta}%`} 10-Yr
            </span>
          </div>
          <span className="text-[10px] text-[#94A3B8] mt-1">
            {terminal.electricityGridStressPercent > 70 ? "Requires micro-grid expansion" : "Peak load contained"}
          </span>
        </div>

        {/* Waste Capacity Exhaustion Card */}
        <div className="bg-[#141B26] p-3 rounded-lg border border-[#222C3D] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1 text-emerald-400">
              <Trash2 className="w-3.5 h-3.5" /> Waste/Culvert Overload
            </span>
            <span>2026 → 2036</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-[#F8FAFC]">
              {terminal.wasteCapacityExhaustionPercent}%
            </span>
            <span className={`text-[11px] font-bold flex items-center ${wasteDelta > 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {wasteDelta > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {wasteDelta > 0 ? `+${wasteDelta}%` : `${wasteDelta}%`} 10-Yr
            </span>
          </div>
          <span className="text-[10px] text-[#94A3B8] mt-1">
            {params.bioswalePreDeployment ? "14ha wetland sediment traps active" : "Unmitigated drain choking"}
          </span>
        </div>

        {/* Dynamic Composite Scarcity Index */}
        <div className="bg-[#141B26] p-3 rounded-lg border border-[#222C3D] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1 text-purple-400">
              <Layers className="w-3.5 h-3.5" /> 2036 Scarcity Index
            </span>
            <span className="text-amber-400 font-bold">Horizon</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-xl font-bold ${
              terminal.compositeScarcityIndex > 70 ? "text-rose-400" :
              terminal.compositeScarcityIndex > 45 ? "text-amber-400" : "text-emerald-400"
            }`}>
              {terminal.compositeScarcityIndex} / 100
            </span>
            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
              terminal.compositeScarcityIndex > 70 ? "bg-rose-950 text-rose-300 border border-rose-500/40" :
              terminal.compositeScarcityIndex > 45 ? "bg-amber-950 text-amber-300 border border-amber-500/40" :
              "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
            }`}>
              {terminal.compositeScarcityIndex > 70 ? "Tipping Point" : terminal.compositeScarcityIndex > 45 ? "Elevated" : "Resilient"}
            </span>
          </div>
          <span className="text-[10px] text-[#94A3B8] mt-1">
            Weighted cross-system resilience
          </span>
        </div>
      </div>

      {/* Main Recharts Area & Line Chart */}
      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2738" vertical={false} />
            <XAxis 
              dataKey="label" 
              stroke="#64748B" 
              fontSize={11} 
              fontFamily="monospace"
              tickLine={false}
            />
            <YAxis 
              stroke="#64748B" 
              fontSize={11} 
              fontFamily="monospace"
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomProjectionTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "12px" }}
            />

            {/* Critical Tipping Point Reference Threshold at 70% */}
            <ReferenceLine 
              y={70} 
              stroke="#EF4444" 
              strokeDasharray="4 4" 
              label={{ value: "Critical Rationing Threshold (70%)", fill: "#EF4444", fontSize: 10, position: "top", fontFamily: "monospace" }} 
            />

            {/* Safe Operational Corridor at 40% */}
            <ReferenceLine 
              y={40} 
              stroke="#10B981" 
              strokeDasharray="3 3" 
              strokeOpacity={0.6}
              label={{ value: "Safe Reserve Ceiling (40%)", fill: "#10B981", fontSize: 10, position: "bottom", fontFamily: "monospace" }} 
            />

            {/* Water Deficit Curve */}
            {(activeMetricFilter === "all" || activeMetricFilter === "water") && (
              <Area
                type="monotone"
                dataKey="waterDeficitPercent"
                name="Water Scarcity / Deficit (%)"
                stroke="#38BDF8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#waterGrad)"
                activeDot={{ r: 6, fill: "#38BDF8", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            )}

            {/* Electricity Grid Stress Curve */}
            {(activeMetricFilter === "all" || activeMetricFilter === "electricity") && (
              <Area
                type="monotone"
                dataKey="electricityGridStressPercent"
                name="Electricity Grid Stress (%)"
                stroke="#F59E0B"
                strokeWidth={2.2}
                fillOpacity={1}
                fill="url(#gridGrad)"
                activeDot={{ r: 6, fill: "#F59E0B", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            )}

            {/* Waste/Drainage Capacity Exhaustion Curve */}
            {(activeMetricFilter === "all" || activeMetricFilter === "waste") && (
              <Area
                type="monotone"
                dataKey="wasteCapacityExhaustionPercent"
                name="Waste / Culvert Capacity Exhaustion (%)"
                stroke="#10B981"
                strokeWidth={2.2}
                fillOpacity={1}
                fill="url(#wasteGrad)"
                activeDot={{ r: 6, fill: "#10B981", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            )}

            {/* Composite Scarcity Trend Line */}
            {activeMetricFilter === "all" && (
              <Line
                type="monotone"
                dataKey="compositeScarcityIndex"
                name="Composite Scarcity Index"
                stroke="#A855F7"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: "#A855F7" }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Epistemic Simulator Parameter Feedback Footer */}
      <div className="bg-[#0A0D13] p-3.5 rounded-lg border border-[#1E2534] text-xs font-mono space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Parameter Sensitivity Feedback:
          </span>
          <span className="text-[#64748B] text-[10px]">
            Real-Time Coupling to Active Sliders
          </span>
        </div>
        <p className="text-[#94A3B8] text-[11px] leading-relaxed">
          {params.solarKiosksOnline >= 8 ? (
            <span className="text-emerald-300">
              ✓ High solar deployment ({params.solarKiosksOnline} kiosks) bends both the water deficit and electrical grid stress curves downward by 2032, averting rolling informal water shutoffs.
            </span>
          ) : (
            <span className="text-amber-300">
              ⚠️ With only {params.solarKiosksOnline} solar kiosks online, population growth outpaces municipal water distribution by 2029, escalating cartel dependency. Increase kiosk allocation in parameters.
            </span>
          )}
          {params.bioswalePreDeployment ? (
            <span className="text-emerald-300 ml-1">
              ✓ Phase 1 bioswales stabilize drainage capacity below the 70% tipping line through continuous wetland sediment retention.
            </span>
          ) : (
            <span className="text-rose-300 ml-1">
              ⚠️ Without bioswales active, culvert exhaustion hits 78% by 2031 under standard monsoon debris deposition.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
