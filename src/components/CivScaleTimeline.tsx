import React, { useState, useRef, useMemo } from "react";
import { 
  History, 
  Calendar, 
  ZoomIn, 
  ZoomOut, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Target, 
  Compass, 
  Sparkles, 
  Trees, 
  Cpu, 
  Scale, 
  Users, 
  ChevronRight, 
  Maximize2, 
  ShieldCheck,
  ArrowDownCircle,
  FileCheck
} from "lucide-react";
import { CivScaleMilestone } from "../types";
import { CIV_SCALE_MILESTONES } from "../data/mockData";

interface CivScaleTimelineProps {
  milestones?: CivScaleMilestone[];
  onSelectMilestone?: (milestone: CivScaleMilestone) => void;
}

export const CivScaleTimeline: React.FC<CivScaleTimelineProps> = ({
  milestones = CIV_SCALE_MILESTONES,
  onSelectMilestone
}) => {
  // Zoom level: 1 = Macro/Decadal, 2 = Standard/Multi-Year, 3 = Granular/Deep Epistemic
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 3>(2);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>("MS-2026-01");
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  // Filtered milestones
  const filteredMilestones = useMemo(() => {
    return milestones.filter((m) => {
      if (selectedCategory !== "all" && m.category !== selectedCategory) return false;
      if (selectedPeriod !== "all" && m.period !== selectedPeriod) return false;
      // Macro zoom level filters for critical anchors
      if (zoomLevel === 1 && !m.isZoomCritical && m.period !== "current" && m.year % 2 !== 1) {
        return false;
      }
      return true;
    });
  }, [milestones, selectedCategory, selectedPeriod, zoomLevel]);

  // Jump to 2026 present milestone
  const handleJumpToPresent = () => {
    setActiveMilestoneId("MS-2026-01");
    const el = document.getElementById("milestone-MS-2026-01");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const activeMilestone = milestones.find((m) => m.id === activeMilestoneId) || milestones[0];

  return (
    <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-5 space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1C2534]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <History className="w-4 h-4" />
            </span>
            <h3 className="font-['Syne'] text-base font-bold text-[#F8FAFC]">
              Civ-Scale Intervention Timeline (2021 – 2035)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              Temporal Epistemic Spine
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
            Vertical chronological registry tracing historical flood crises, empirical milestones, and statutory resilience deadlines across the Nairobi Basin.
          </p>
        </div>

        {/* Interactive Controls: Zoom and Quick Jump */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Jump to Present Button */}
          <button
            onClick={handleJumpToPresent}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Now (2026)</span>
          </button>

          {/* Zoom Controller */}
          <div className="flex items-center bg-[#0A0E17] p-1 rounded-lg border border-[#1E2534] text-xs font-mono">
            <span className="text-[10px] text-[#64748B] px-1.5 uppercase">Zoom:</span>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(1, prev - 1) as any)}
              disabled={zoomLevel === 1}
              className="p-1 rounded text-[#64748B] hover:text-white disabled:opacity-40"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            {[
              { level: 1, label: "Macro" },
              { level: 2, label: "Std" },
              { level: 3, label: "Granular" }
            ].map((z) => (
              <button
                key={z.level}
                onClick={() => setZoomLevel(z.level as any)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                  zoomLevel === z.level
                    ? "bg-[#1E2838] text-amber-400 font-bold border border-amber-500/40"
                    : "text-[#64748B] hover:text-[#CBD5E1]"
                }`}
              >
                {z.label}
              </button>
            ))}

            <button
              onClick={() => setZoomLevel((prev) => Math.min(3, prev + 1) as any)}
              disabled={zoomLevel === 3}
              className="p-1 rounded text-[#64748B] hover:text-white disabled:opacity-40"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row: Category & Period Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pb-1">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-[#64748B] uppercase">Domain:</span>
          {[
            { id: "all", label: "All Domains" },
            { id: "ecological", label: "Ecological", icon: Trees },
            { id: "infrastructure", label: "Infrastructure", icon: Cpu },
            { id: "governance", label: "Governance", icon: Scale },
            { id: "community", label: "Community", icon: Users }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md border transition-all ${
                selectedCategory === cat.id
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold"
                  : "bg-[#141A24] text-[#94A3B8] border-[#222C3D] hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#64748B] uppercase">Horizon:</span>
          {[
            { id: "all", label: "All" },
            { id: "historical", label: "Historical (2021-25)" },
            { id: "current", label: "Active 2026" },
            { id: "strategic_future", label: "Future (2027-35)" }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPeriod(p.id)}
              className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                selectedPeriod === p.id
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold"
                  : "bg-[#141A24] text-[#64748B] border-[#1C2534] hover:text-[#CBD5E1]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Scrollable Vertical Timeline (Left 7 cols) + Selected Milestone Detail Inspector (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Scrollable Vertical Timeline */}
        <div 
          ref={timelineScrollRef}
          className="lg:col-span-7 max-h-[460px] overflow-y-auto pr-2 space-y-4 relative scrollbar-thin scrollbar-thumb-[#232D3F]"
        >
          {/* Continuous Vertical Spine */}
          <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#2B384E] via-amber-500/70 to-purple-500/70 z-0" />

          {filteredMilestones.map((m) => {
            const isSelected = m.id === activeMilestoneId;
            const isCurrent = m.period === "current";
            const isFuture = m.period === "strategic_future";

            // Category Icons & Badges
            const CatIcon = m.category === "ecological" ? Trees :
                            m.category === "infrastructure" ? Cpu :
                            m.category === "governance" ? Scale : Users;

            const periodBadgeColor = isCurrent
              ? "bg-amber-950/80 text-amber-300 border-amber-400"
              : isFuture
              ? "bg-purple-950/80 text-purple-300 border-purple-500/40"
              : "bg-[#161E2C] text-[#94A3B8] border-[#253245]";

            return (
              <div
                id={`milestone-${m.id}`}
                key={m.id}
                onClick={() => {
                  setActiveMilestoneId(m.id);
                  if (onSelectMilestone) onSelectMilestone(m);
                }}
                className={`relative z-10 pl-14 transition-all cursor-pointer group`}
              >
                {/* Year Marker on Timeline Spine */}
                <div 
                  className={`absolute left-0 top-1 w-11 h-11 rounded-xl flex flex-col items-center justify-center border-2 transition-all shadow-lg ${
                    isSelected 
                      ? "bg-amber-500 text-black border-white ring-4 ring-amber-500/40 scale-110" 
                      : isCurrent
                      ? "bg-[#1E293B] text-amber-400 border-amber-500 animate-pulse"
                      : isFuture
                      ? "bg-[#161228] text-purple-300 border-purple-500/60 hover:border-purple-400"
                      : "bg-[#0E141E] text-[#94A3B8] border-[#253245] hover:border-[#4B5E7D]"
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold leading-tight">
                    {m.year}
                  </span>
                  <CatIcon className={`w-3 h-3 ${isSelected ? "text-black" : "text-amber-400"}`} />
                </div>

                {/* Milestone Content Card */}
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-[#182333] border-amber-500 shadow-md ring-1 ring-amber-500/40"
                      : isCurrent
                      ? "bg-[#131B27] border-amber-500/50 hover:border-amber-400"
                      : "bg-[#121722] border-[#222C3D] hover:border-[#384863]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${periodBadgeColor}`}>
                        {m.date}
                      </span>
                      <span className="text-[10px] font-mono text-[#64748B] capitalize">
                        {m.category}
                      </span>
                    </div>

                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase ${
                      m.status === "verified_completed" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" :
                      m.status === "in_progress" ? "bg-amber-950/80 text-amber-300 border border-amber-500/30" :
                      m.status === "mandated_deadline" ? "bg-sky-950/80 text-sky-300 border border-sky-500/30" :
                      "bg-purple-950/80 text-purple-300 border border-purple-500/30"
                    }`}>
                      {m.status.replace("_", " ")}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#F8FAFC] group-hover:text-amber-300 transition-colors">
                    {m.title}
                  </h4>

                  {/* Compact Description (Shown at all zoom levels) */}
                  <p className={`text-[11px] text-[#94A3B8] mt-1 leading-relaxed ${zoomLevel === 1 ? "line-clamp-1" : "line-clamp-2"}`}>
                    {m.description}
                  </p>

                  {/* Physical Metric & Agency Tag (Shown at Zoom Levels 2 and 3) */}
                  {zoomLevel >= 2 && (
                    <div className="mt-2 pt-2 border-t border-[#1C2534] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                      <span className="text-sky-300 bg-[#0C1017] px-2 py-0.5 rounded border border-[#1A2230]">
                        Metric: {m.physicalMetric}
                      </span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {m.agencyYield}
                      </span>
                    </div>
                  )}

                  {/* Deep Epistemic Source Provenance (Shown at Zoom Level 3) */}
                  {zoomLevel === 3 && (
                    <div className="mt-2 p-2 rounded bg-[#090D14] border border-[#1B2332] text-[10px] font-mono text-[#CBD5E1] flex items-center justify-between">
                      <span className="text-[#64748B]">Audit Provenance:</span>
                      <span className="text-amber-300 truncate max-w-[280px]">{m.provenanceSource}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Milestone Deep Inspector */}
        <div className="lg:col-span-5 bg-[#121722] border border-[#232D3F] rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1C2534]">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono text-[#64748B] uppercase">Milestone Registry:</span>
                <span className="text-xs font-mono font-bold text-amber-300">{activeMilestone.id}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                activeMilestone.period === "current" ? "bg-amber-950 text-amber-300 border border-amber-500/40" :
                activeMilestone.period === "strategic_future" ? "bg-purple-950 text-purple-300 border border-purple-500/40" :
                "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
              }`}>
                {activeMilestone.period.replace("_", " ")}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#64748B] uppercase">
                {activeMilestone.date} • {activeMilestone.category} domain
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {activeMilestone.title}
              </h4>
            </div>

            {/* Detailed Narrative */}
            <div className="bg-[#0C1017] p-3 rounded-lg border border-[#1A2230] text-xs text-[#CBD5E1] leading-relaxed">
              {activeMilestone.description}
            </div>

            {/* Measurable Physical Metric */}
            <div className="bg-[#0C1017] p-3 rounded-lg border border-[#1A2230] space-y-1">
              <span className="text-[10px] font-mono text-sky-400 uppercase font-bold block">
                Empirical Physical Reality Metric
              </span>
              <span className="font-mono text-xs text-white font-bold block">
                {activeMilestone.physicalMetric}
              </span>
            </div>

            {/* Agency Yield & Sovereign Transfer */}
            <div className="bg-[#0C1017] p-3 rounded-lg border border-[#1A2230] space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                Human Agency & Structural Power Shift
              </span>
              <p className="text-xs text-[#CBD5E1]">
                {activeMilestone.agencyYield}
              </p>
            </div>

            {/* Audit & Legal Provenance */}
            <div className="bg-[#0C1017] p-2.5 rounded-lg border border-[#1A2230] text-[11px] font-mono flex items-start gap-2">
              <FileCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-[#64748B] block uppercase">Statutory / Epistemic Evidence:</span>
                <span className="text-[#F8FAFC]">{activeMilestone.provenanceSource}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1C2534] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
            <span>Audit Standard: SHA-256 Non-Repudiation</span>
            <span className="text-amber-400">Civilization Scale</span>
          </div>
        </div>
      </div>
    </div>
  );
};
