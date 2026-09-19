import React from "react";
import { 
  Eye, 
  Share2, 
  FlaskConical, 
  Compass, 
  Coins, 
  Cpu, 
  ShieldCheck, 
  History, 
  Scale, 
  Activity, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Radio
} from "lucide-react";
import { LoopStage } from "../types";

interface HeaderProps {
  activeStage: LoopStage;
  onSelectStage: (stage: LoopStage) => void;
  priorityFloorMode: boolean;
  onTogglePriorityFloor: () => void;
  onOpenGeminiModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeStage,
  onSelectStage,
  priorityFloorMode,
  onTogglePriorityFloor,
  onOpenGeminiModal
}) => {
  const navItems: { id: LoopStage; label: string; step: string; icon: React.ElementType }[] = [
    { id: "observatory", label: "Observatory", step: "01 SEE", icon: Eye },
    { id: "world-model", label: "World Model", step: "02 UNDERSTAND", icon: Share2 },
    { id: "simulator", label: "Simulator", step: "03 EXPLORE", icon: FlaskConical },
    { id: "decisions", label: "Decision Engine", step: "04 DECIDE", icon: Compass },
    { id: "capital", label: "Capital Engine", step: "05 ALLOCATE", icon: Coins },
    { id: "operations", label: "Operations", step: "06 ACT", icon: Cpu },
    { id: "verification", label: "Verification", step: "07 PROVE", icon: ShieldCheck },
    { id: "failure-ledger", label: "Failure Ledger", step: "08 REMEMBER", icon: History },
    { id: "governance", label: "Governance", step: "09 RESTRAIN", icon: Scale },
    { id: "scorecard", label: "Scorecard", step: "10 MEASURE", icon: Activity },
  ];

  return (
    <header className="border-b border-[#252C37] bg-[#0E121A]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner: First Principle & Operating Node */}
      <div className="px-4 py-2 border-b border-[#1C2330] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono uppercase tracking-wider text-emerald-400 font-semibold">Living Node 01</span>
          </div>
          <span className="text-[#64748B]">|</span>
          <span className="text-[#94A3B8] font-medium flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-amber-500" />
            Nairobi Basin Operating Laboratory (Mathare & Mukuru Pilot)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePriorityFloor}
            className={`px-2.5 py-1 rounded border text-xs font-mono transition-colors flex items-center gap-1.5 ${
              priorityFloorMode
                ? "bg-amber-950/70 border-amber-500 text-amber-300 font-semibold"
                : "bg-[#161D29] border-[#2E3B4E] text-[#94A3B8] hover:text-[#E2E8F0]"
            }`}
            title="Toggle Priority Floor Mode: Low-bandwidth, low-latency display optimized for frontline stewards and low-power devices"
          >
            {priorityFloorMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>PRIORITY FLOOR: ACTIVE</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Priority Floor: Full Telemetry</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenGeminiModal}
            className="px-3 py-1 rounded bg-gradient-to-r from-amber-600/30 to-emerald-600/30 border border-amber-500/50 hover:border-amber-400 text-amber-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-sm shadow-amber-950/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Atlas Intelligence Oracle</span>
          </button>
        </div>
      </div>

      {/* Main Bar: Title & Civilization Scale Architecture */}
      <div className="px-4 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 via-[#854D0E] to-[#1E293B] p-0.5 shadow-lg shadow-amber-950/40 flex items-center justify-center">
            <div className="w-full h-full bg-[#0C0F14] rounded-[7px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-400 stroke-current fill-none stroke-[1.8]">
                {/* Sacred Geometry: Octagonal interlocking loop */}
                <polygon points="12,2 19,5 22,12 19,19 12,22 5,19 2,12 5,5" className="stroke-amber-400/80" />
                <circle cx="12" cy="12" r="4" className="stroke-emerald-400/90" />
                <line x1="12" y1="2" x2="12" y2="22" className="stroke-amber-500/40" />
                <line x1="2" y1="12" x2="22" y2="12" className="stroke-amber-500/40" />
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Cinzel'] tracking-wider text-lg lg:text-xl font-bold text-[#F8FAFC]">
                ATLAS SANCTUM
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#1C2533] text-amber-400 border border-amber-500/30">
                Ethical Intelligence Infrastructure
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              A trustworthy feedback loop between <span className="text-emerald-400 font-medium">reality</span>, <span className="text-amber-400 font-medium">capital</span>, and <span className="text-sky-400 font-medium">responsible action</span>.
            </p>
          </div>
        </div>

        {/* First Principle Banner */}
        <div className="hidden xl:flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-[#141A24] border border-[#232D3F] text-xs">
          <div className="w-1.5 h-6 rounded-full bg-amber-500/80" />
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#64748B] font-mono block">The First Principle</span>
            <span className="text-[#CBD5E1] font-serif italic text-xs">
              "Where should humanity act next, why, with what resources, and how will we know whether it worked?"
            </span>
          </div>
        </div>
      </div>

      {/* Universal Feedback Loop Stage Stepper */}
      <div className="px-2 overflow-x-auto scrollbar-none border-t border-[#1B2230] bg-[#0A0D13]">
        <div className="flex items-center min-w-max py-1.5 px-2 gap-1.5">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeStage === item.id;
            return (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => onSelectStage(item.id)}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-xs transition-all ${
                    isActive
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-950/60 font-semibold"
                      : "text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#161D29] border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-[#64748B]"}`} />
                  <div className="text-left leading-tight">
                    <span className="text-[9px] block uppercase font-mono tracking-wider text-[#64748B]">
                      {item.step}
                    </span>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                </button>
                {idx < navItems.length - 1 && (
                  <span className="text-[#2D3748] select-none text-[10px] font-mono">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};
