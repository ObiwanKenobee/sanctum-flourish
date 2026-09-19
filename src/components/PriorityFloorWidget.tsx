import React, { useState } from "react";
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Droplets, 
  Waves, 
  DollarSign, 
  Skull, 
  GitPullRequest, 
  BellRing, 
  Sparkles, 
  ExternalLink,
  Filter,
  Check,
  Zap,
  Info
} from "lucide-react";
import { PriorityFloorStatus } from "../types";
import { PRIORITY_FLOOR_DATA } from "../data/mockData";

interface PriorityFloorWidgetProps {
  priorityFloors?: PriorityFloorStatus[];
  onTriggerProtocol?: (floor: PriorityFloorStatus) => void;
}

export const PriorityFloorWidget: React.FC<PriorityFloorWidgetProps> = ({
  priorityFloors = PRIORITY_FLOOR_DATA,
  onTriggerProtocol
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [activeFloorDetail, setActiveFloorDetail] = useState<PriorityFloorStatus | null>(null);
  const [dispatchedProtocols, setDispatchedProtocols] = useState<Record<string, boolean>>({});

  // Filtered indicators
  const filteredFloors = priorityFloors.filter((f) => {
    if (selectedCategory !== "all" && f.category !== selectedCategory) return false;
    if (selectedStatusFilter !== "all" && f.status !== selectedStatusFilter) return false;
    return true;
  });

  // Summary tallies
  const breachedCount = priorityFloors.filter((f) => f.status === "breached_critical").length;
  const warningCount = priorityFloors.filter((f) => f.status === "near_breach_warning").length;
  const heldCount = priorityFloors.filter((f) => f.status === "guaranteed_held").length;
  const totalPopulationProtected = priorityFloors.reduce((sum, f) => sum + f.populationAffected, 0);

  const handleDispatch = (floor: PriorityFloorStatus) => {
    setDispatchedProtocols((prev) => ({ ...prev, [floor.id]: true }));
    if (onTriggerProtocol) onTriggerProtocol(floor);
  };

  return (
    <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-5 lg:p-6 space-y-5">
      {/* Widget Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1C2534]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h3 className="font-['Syne'] text-base font-bold text-[#F8FAFC]">
              Priority Floor Status Monitor — Critical Infrastructure Baselines
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-500/30">
              Non-Negotiable Thresholds
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
            Axiomatic system safeguards for human dignity. If any priority floor breaches, automated mitigation protocols activate to prevent downstream catastrophic collapse.
          </p>
        </div>

        {/* Executive Status Tally Badges */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span className="font-bold">{breachedCount} Breached</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-bold">{warningCount} Warning</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold">{heldCount} Held</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-[#64748B] uppercase">Category:</span>
          {[
            { id: "all", label: "All Indicators" },
            { id: "water_access", label: "Water Access" },
            { id: "flood_safety", label: "Flood Safety" },
            { id: "economic_extortion", label: "Anti-Extortion" },
            { id: "pathogen_toxicity", label: "Toxicity" },
            { id: "drainage_flow", label: "Culvert Flow" }
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

        {/* Status Quick Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#64748B] uppercase">Status:</span>
          {[
            { id: "all", label: "All" },
            { id: "breached_critical", label: "Critical Breaches" },
            { id: "near_breach_warning", label: "Warnings" },
            { id: "guaranteed_held", label: "Guaranteed" }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatusFilter(st.id)}
              className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                selectedStatusFilter === st.id
                  ? "bg-[#1E2838] text-white font-bold border-amber-400"
                  : "bg-[#0E131C] text-[#64748B] border-[#1C2534] hover:text-[#CBD5E1]"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Priority Floor Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFloors.map((floor) => {
          const isBreached = floor.status === "breached_critical";
          const isWarning = floor.status === "near_breach_warning";
          const isHeld = floor.status === "guaranteed_held";
          const isDispatched = dispatchedProtocols[floor.id];

          // Status-specific card accent styling
          const borderAccent = isBreached 
            ? "border-rose-500/60 bg-[#160D15]/80 hover:border-rose-400" 
            : isWarning 
            ? "border-amber-500/50 bg-[#16140F]/80 hover:border-amber-400" 
            : "border-emerald-500/40 bg-[#0E1715]/80 hover:border-emerald-400";

          const CategoryIcon = 
            floor.category === "water_access" ? Droplets :
            floor.category === "flood_safety" ? Waves :
            floor.category === "economic_extortion" ? DollarSign :
            floor.category === "pathogen_toxicity" ? Skull : GitPullRequest;

          return (
            <div
              key={floor.id}
              className={`rounded-xl border p-4 flex flex-col justify-between space-y-3 transition-all ${borderAccent}`}
            >
              {/* Card Header: Category & Status Badge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#64748B] uppercase">
                    <CategoryIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{floor.id}</span>
                  </div>

                  {/* Color-Coded Alert Status Badge */}
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase flex items-center gap-1 ${
                    isBreached ? "bg-rose-950 text-rose-300 border border-rose-500/50 animate-pulse" :
                    isWarning ? "bg-amber-950 text-amber-300 border border-amber-500/50" :
                    "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isBreached ? "bg-rose-400" : isWarning ? "bg-amber-400" : "bg-emerald-400"
                    }`} />
                    {isBreached ? "Critical Breach" : isWarning ? "Near Breach" : "Floor Held"}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#F8FAFC]">
                  {floor.title}
                </h4>

                {/* Quantitative Threshold vs Observed Reality */}
                <div className="bg-[#0A0D13] p-3 rounded-lg border border-[#1A2230] space-y-2 font-mono text-xs">
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className="text-[#64748B]">Floor Mandate:</span>
                    <span className="text-amber-300 font-bold">{floor.floorThresholdLabel}</span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-[#64748B]">Observed Reality:</span>
                    <span className={`font-bold text-sm ${
                      isBreached ? "text-rose-400" : isWarning ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {floor.currentObservedValue}
                    </span>
                  </div>

                  {/* Tolerance Bar */}
                  <div className="pt-1">
                    <div className="w-full h-1.5 bg-[#1C2534] rounded-full overflow-hidden">
                      <div 
                        style={{ width: isBreached ? "100%" : isWarning ? "80%" : "35%" }}
                        className={`h-full rounded-full ${
                          isBreached ? "bg-rose-500" : isWarning ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Mitigation Trigger Protocol Description */}
                <div className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-2">
                  <span className="text-amber-400 font-mono text-[10px] block font-bold uppercase mb-0.5">
                    Trigger Protocol:
                  </span>
                  {floor.mitigationTriggerProtocol}
                </div>
              </div>

              {/* Card Footer: Affected Population + Action Button */}
              <div className="pt-3 border-t border-[#1C2534] flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#64748B]">
                  Pop: <strong className="text-[#CBD5E1]">{floor.populationAffected.toLocaleString()}</strong>
                </span>

                {isBreached || isWarning ? (
                  <button
                    onClick={() => handleDispatch(floor)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${
                      isDispatched
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                        : isBreached
                        ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950"
                        : "bg-amber-600 hover:bg-amber-500 text-white"
                    }`}
                  >
                    {isDispatched ? (
                      <>
                        <Check className="w-3 h-3" /> Dispatched
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3" /> Trigger Protocol
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Safe Reserve
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Epistemic Verification & Compliance Summary Footer */}
      <div className="bg-[#0A0D13] p-3.5 rounded-lg border border-[#1E2534] text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-3 text-[#64748B]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Telemetry Protocol: Continuous 100Hz verification anchored to public USSD citizen reporting & WRMA hydro gauges.
          </span>
        </div>
        <span className="text-amber-300 font-bold whitespace-nowrap">
          Total Basin Population Covered: {totalPopulationProtected.toLocaleString()} Citizens
        </span>
      </div>
    </div>
  );
};
