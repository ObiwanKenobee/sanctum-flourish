import React, { useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck, 
  Search, 
  ArrowRight, 
  Layers, 
  TrendingDown, 
  Activity, 
  AlertCircle,
  Download,
  Printer,
  Calendar,
  Sparkles
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
import { VerificationAudit } from "../types";
import { 
  exportVerificationAuditsCSV, 
  exportVerificationAuditPDF,
  exportVerificationAuditsAllPDF 
} from "../utils/exportUtils";

interface VerificationViewProps {
  audits: VerificationAudit[];
}

export const VerificationView: React.FC<VerificationViewProps> = ({ audits }) => {
  const [selectedAuditId, setSelectedAuditId] = useState<string>(audits[0]?.id || "VER-2026-08");
  const [activeChartMetric, setActiveChartMetric] = useState<"primary" | "delta" | "envelope">("primary");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(6); // Day 7 peak default
  const selectedAudit = audits.find(a => a.id === selectedAuditId) || audits[0];

  const trendData = selectedAudit.longitudinalTrend || [];
  const selectedDayData = trendData[selectedDayIndex] || trendData[0];

  // Compute calculated delta data for delta metric view
  const formattedTrendData = trendData.map((d) => {
    const deltaPercent = d.counterfactualBaseline !== 0
      ? (((d.counterfactualBaseline - d.monitoredValue) / d.counterfactualBaseline) * 100)
      : 0;
    return {
      ...d,
      deltaPercent: Number(deltaPercent.toFixed(1))
    };
  });

  // Dynamic peak or milestone event marker date
  const peakEvent = trendData.find(d => d.eventMarker);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0C1017] border border-amber-500/50 p-3.5 rounded-xl shadow-2xl text-xs font-mono space-y-2 z-50 min-w-[240px]">
          <div className="flex items-center justify-between gap-4 border-b border-[#232D3F] pb-1.5">
            <span className="text-amber-400 font-bold">{data.day} • {data.date}</span>
            <span className="text-[10px] text-[#94A3B8] bg-[#141A24] px-1.5 py-0.5 rounded border border-[#232D3F]">{data.unit}</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between gap-3 text-rose-400">
              <span>Counterfactual Baseline:</span>
              <span className="font-bold">{data.counterfactualBaseline} {data.unit}</span>
            </div>
            <div className="flex justify-between gap-3 text-emerald-400">
              <span>Verified Reality Delta:</span>
              <span className="font-bold">{data.monitoredValue} {data.unit}</span>
            </div>
            <div className="flex justify-between gap-3 text-amber-300">
              <span>Mitigation Efficiency:</span>
              <span className="font-bold">+{data.deltaPercent ?? ((((data.counterfactualBaseline - data.monitoredValue)/data.counterfactualBaseline)*100).toFixed(1))}%</span>
            </div>
            <div className="flex justify-between gap-3 text-sky-300 text-[10px] pt-1 border-t border-[#1C2534]">
              <span>95% CI Range:</span>
              <span>{data.lowerBound} – {data.upperBound}</span>
            </div>
          </div>

          {data.eventMarker && (
            <div className="mt-1 pt-1.5 border-t border-[#1C2534] text-amber-300 text-[11px] font-sans font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>{data.eventMarker}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Verification Mandate Banner */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 lg:p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h2 className="font-['Syne'] text-lg font-bold text-[#F8FAFC]">
                Atlas Verification — Did Reality Actually Change?
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                Cryptographic Proof of Outcome
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
              <span className="text-rose-400 font-semibold font-mono">
                Never confuse: activity with impact, spending with outcomes, claims with evidence.
              </span>{" "}
              Ground-truthed using sensor telemetry, laboratory atomic spectrometry, independent field reports, before/after counterfactual baselines.
            </p>
          </div>

          {/* Export Actions for Institutional Transparency */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportVerificationAuditsCSV(audits)}
              className="px-3 py-2 rounded-lg bg-[#141A24] hover:bg-[#1E2736] border border-[#232D3F] text-xs font-mono text-[#CBD5E1] flex items-center gap-1.5 transition-all shadow-sm"
              title="Download CSV of all verified outcomes and counterfactual models"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => exportVerificationAuditPDF(selectedAudit)}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[#0C1017] font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/50"
              title="Generate printable PDF Certificate with cryptographic seal & signatures for this audit"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate (PDF)</span>
            </button>

            <button
              onClick={() => exportVerificationAuditsAllPDF(audits)}
              className="px-3 py-2 rounded-lg bg-[#141A24] hover:bg-[#1E2736] border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center gap-1.5 transition-all"
              title="Generate complete institutional audit book containing all verification records"
            >
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Print All Audits Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Audited Outcome Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {audits.map((a) => {
          const isSelected = a.id === selectedAuditId;
          return (
            <div
              key={a.id}
              onClick={() => {
                setSelectedAuditId(a.id);
                setSelectedDayIndex(6);
              }}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#161F2E] border-amber-500/80 shadow-lg ring-1 ring-amber-500/30"
                  : "bg-[#10151E] border-[#232D3F] hover:border-[#374761]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-amber-400 font-bold">{a.id}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                  Confidence: {(a.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#F8FAFC] leading-snug mb-1">
                {a.intervention}
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono mb-3">
                Key Indicator: {a.indicator}
              </p>

              {/* Before vs After Visual Comparison */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded bg-[#0C1017] border border-[#1C2534] mb-3">
                <div>
                  <span className="text-[10px] uppercase text-rose-400 block">Baseline (Pre-Intervention)</span>
                  <span className="text-[#CBD5E1] text-[11px] block mt-0.5">{a.baseline}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-emerald-400 block">Achieved Reality Delta</span>
                  <span className="text-[#F8FAFC] text-[11px] block mt-0.5 font-bold">{a.achievedOutcome}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] pt-2 border-t border-[#1C2534]">
                <span>Verified: {a.dateVerified}</span>
                <span className="text-amber-400 flex items-center gap-1 font-medium">
                  Inspect 14-Day Trend <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 14-Day Longitudinal Telemetry Trend Visualization (Recharts) */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-5 lg:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#1C2330] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-xs uppercase font-mono text-emerald-400 font-bold">
                14-Day In-Situ Telemetry Window: Longitudinal Impact Curve
              </span>
            </div>
            <h3 className="font-['Syne'] text-base font-bold text-[#F8FAFC] mt-0.5">
              {selectedAudit.intervention} ({selectedAudit.indicator})
            </h3>
          </div>

          {/* Metric View Switcher */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#64748B] hidden sm:inline">View Mode:</span>
            <div className="flex rounded-lg bg-[#0C1017] p-1 border border-[#232D3F]">
              <button
                onClick={() => setActiveChartMetric("primary")}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  activeChartMetric === "primary"
                    ? "bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/50"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Physical Values
              </button>
              <button
                onClick={() => setActiveChartMetric("delta")}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  activeChartMetric === "delta"
                    ? "bg-amber-600/30 text-amber-300 font-bold border border-amber-500/50"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Improvement Delta (%)
              </button>
              <button
                onClick={() => setActiveChartMetric("envelope")}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  activeChartMetric === "envelope"
                    ? "bg-sky-600/30 text-sky-300 font-bold border border-sky-500/50"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                95% CI Bounds
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Chart Component */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartMetric === "delta" ? (
              <AreaChart data={formattedTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="deltaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2738" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} fontFamily="monospace" unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "10px" }} />
                <Area
                  type="monotone"
                  dataKey="deltaPercent"
                  name="Verified Performance Improvement (%)"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  fill="url(#deltaGradient)"
                />
                {peakEvent && (
                  <ReferenceLine 
                    x={peakEvent.date} 
                    stroke="#10B981" 
                    strokeDasharray="3 3" 
                    label={{ value: peakEvent.eventMarker || "Milestone", fill: "#10B981", fontSize: 10, position: "top" }} 
                  />
                )}
              </AreaChart>
            ) : (
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="monitoredGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="counterfactualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1E2738" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false} 
                  fontFamily="monospace"
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "10px" }} 
                />

                {/* Counterfactual baseline (What would have happened) */}
                <Area
                  type="monotone"
                  dataKey="counterfactualBaseline"
                  name="Counterfactual Baseline (Unmitigated Reality)"
                  stroke="#F43F5E"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="url(#counterfactualGradient)"
                />

                {/* Monitored reality outcome (What was achieved) */}
                <Area
                  type="monotone"
                  dataKey="monitoredValue"
                  name="Verified Reality Delta (In-Situ Monitored)"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fill="url(#monitoredGradient)"
                />

                {/* Upper & lower uncertainty bound markers */}
                <Line
                  type="monotone"
                  dataKey="upperBound"
                  name="Upper Bound (95% CI)"
                  stroke="#38BDF8"
                  strokeWidth={activeChartMetric === "envelope" ? 2 : 1}
                  strokeDasharray="2 2"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="lowerBound"
                  name="Lower Bound (95% CI)"
                  stroke="#38BDF8"
                  strokeWidth={activeChartMetric === "envelope" ? 2 : 1}
                  strokeDasharray="2 2"
                  dot={false}
                />

                {peakEvent && (
                  <ReferenceLine 
                    x={peakEvent.date} 
                    stroke="#F59E0B" 
                    strokeDasharray="3 3" 
                    label={{ value: peakEvent.eventMarker || "Peak Event", fill: "#F59E0B", fontSize: 10, position: "top" }} 
                  />
                )}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Interactive 14-Day Timeline Scrubber */}
        <div className="space-y-2 pt-2 border-t border-[#1C2330]">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
            <span>14-Day Telemetry Scrubber (Click day to inspect in-situ field reading):</span>
            <span className="text-amber-400">Selected: {selectedDayData.day} ({selectedDayData.date})</span>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
            {trendData.map((d, idx) => {
              const isSelected = idx === selectedDayIndex;
              const hasMarker = Boolean(d.eventMarker);
              return (
                <button
                  key={d.day}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`p-1.5 rounded text-center transition-all font-mono text-[10px] relative ${
                    isSelected
                      ? "bg-amber-500/20 border border-amber-500 text-amber-300 font-bold shadow"
                      : "bg-[#0C1017] border border-[#1C2534] text-[#94A3B8] hover:border-[#2C3B4E]"
                  }`}
                >
                  {hasMarker && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                  )}
                  <div className="text-[9px] uppercase text-[#64748B]">{d.day.replace("Day ", "D")}</div>
                  <div className="font-bold text-[10px] truncate">{d.date.split(" ")[1]}</div>
                </button>
              );
            })}
          </div>

          {/* Selected Day Field Telemetry Box */}
          <div className="bg-[#141A24] p-3 rounded-xl border border-[#222C3D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-bold">{selectedDayData.day} ({selectedDayData.date}):</span>
              <span className="text-emerald-400 font-bold">
                Monitored: {selectedDayData.monitoredValue} {selectedDayData.unit}
              </span>
              <span className="text-rose-400">
                Baseline: {selectedDayData.counterfactualBaseline} {selectedDayData.unit}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#94A3B8] text-[11px]">
              {selectedDayData.eventMarker ? (
                <span className="text-amber-300 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5" /> Event: {selectedDayData.eventMarker}
                </span>
              ) : (
                <span>Stable in-situ stream within 95% CI [{selectedDayData.lowerBound} – {selectedDayData.upperBound}]</span>
              )}
            </div>
          </div>
        </div>

        {/* Narrative & Metric Legend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div className="bg-[#141A24] p-3 rounded-lg border border-[#222C3D]">
            <span className="text-[10px] text-rose-400 block uppercase font-bold">Counterfactual Red Line</span>
            <p className="text-[#CBD5E1] text-[11px] mt-0.5">
              Hydrological/epidemiological simulation of unmitigated baseline trajectory without community engineering intervention.
            </p>
          </div>

          <div className="bg-[#141A24] p-3 rounded-lg border border-[#222C3D]">
            <span className="text-[10px] text-emerald-400 block uppercase font-bold">Emerald Delta Curve</span>
            <p className="text-[#CBD5E1] text-[11px] mt-0.5">
              Physically verified sensor telemetry showing sustained suppression of hazard across the complete 14-day window.
            </p>
          </div>

          <div className="bg-[#141A24] p-3 rounded-lg border border-[#222C3D]">
            <span className="text-[10px] text-sky-400 block uppercase font-bold">Sky Blue CI Bounds</span>
            <p className="text-[#CBD5E1] text-[11px] mt-0.5">
              ISO-17025 compliant confidence intervals calibrated daily against independent ground-truth manual instruments.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Verification Deep Dive */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#1C2330] gap-3">
          <div>
            <span className="text-xs uppercase font-mono text-amber-400 font-semibold block">
              Cryptographic Proof of Outcome Verification
            </span>
            <h3 className="font-['Syne'] text-base font-bold text-[#F8FAFC] mt-0.5">
              {selectedAudit.intervention}
            </h3>
          </div>
          <span className="text-xs font-mono text-[#94A3B8]">Audit Ref: {selectedAudit.id}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-3">
            <div className="bg-[#141A24] p-3.5 rounded-lg border border-[#222C3D]">
              <span className="text-[10px] uppercase font-mono text-amber-400 block font-semibold mb-1">
                Empirical Measurement Methodology:
              </span>
              <p className="text-[#CBD5E1] leading-relaxed">
                {selectedAudit.empiricalMethod}
              </p>
            </div>

            <div className="bg-[#141A24] p-3.5 rounded-lg border border-[#222C3D]">
              <span className="text-[10px] uppercase font-mono text-emerald-400 block font-semibold mb-1">
                Independent Third-Party Inspector Sign-Off:
              </span>
              <p className="text-[#CBD5E1]">
                {selectedAudit.thirdPartyInspector}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-[#141A24] p-3.5 rounded-lg border border-[#222C3D]">
              <span className="text-[10px] uppercase font-mono text-sky-400 block font-semibold mb-1">
                Counterfactual Back-Casting Analysis:
              </span>
              <p className="text-[#CBD5E1] leading-relaxed">
                {selectedAudit.counterFactualAnalysis}
              </p>
            </div>

            <div className="bg-[#0C1017] p-3.5 rounded-lg border border-[#1C2534] font-mono">
              <span className="text-[10px] uppercase text-[#64748B] block mb-1">
                SHA-256 State Verification Hash:
              </span>
              <span className="text-xs text-amber-300 break-all select-all font-bold">
                {selectedAudit.cryptographicHash}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
