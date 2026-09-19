import React from "react";
import { WifiOff, MessageSquare, Globe, Shield, RefreshCw } from "lucide-react";

interface PriorityFloorBannerProps {
  active: boolean;
  onDismiss: () => void;
}

export const PriorityFloorBanner: React.FC<PriorityFloorBannerProps> = ({ active, onDismiss }) => {
  if (!active) return null;

  return (
    <div className="bg-[#1C160F] border-b border-amber-500/60 p-3 text-xs text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <WifiOff className="w-4 h-4" />
          </span>
          <div>
            <span className="font-mono font-bold uppercase tracking-wider text-amber-300 mr-2">
              PRIORITY FLOOR MODE ACTIVE
            </span>
            <span className="text-[#CBD5E1]">
              Low-Bandwidth (2G/SMS fallback) • Swahili Telemetry Relay • Zero Decorative Overhead
            </span>
          </div>
        </div>

        {/* Live USSD / SMS payload preview */}
        <div className="flex items-center gap-3 font-mono text-[11px] bg-[#0E121A] px-3 py-1.5 rounded border border-amber-500/30">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-emerald-300">
            SMS: "Mto Mathare: 1.84m (Tahadhari). Vituo vya maji Mukuru: Bei Ksh 3/20L salama."
          </span>
          <button
            onClick={onDismiss}
            className="text-[#94A3B8] hover:text-white underline ml-2"
          >
            Switch to High-Res Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
