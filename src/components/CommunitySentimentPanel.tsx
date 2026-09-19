import React, { useState } from "react";
import { 
  HeartHandshake, 
  MessageSquare, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Quote, 
  Radio, 
  Sparkles,
  Search
} from "lucide-react";
import { CommunitySentimentNode } from "../types";
import { COMMUNITY_SENTIMENT_DATA } from "../data/mockData";

interface CommunitySentimentPanelProps {
  sentimentData?: CommunitySentimentNode[];
  selectedWardId: string;
  onSelectWard: (wardId: string) => void;
  onInspectSensor?: (sensorId: string) => void;
}

export const CommunitySentimentPanel: React.FC<CommunitySentimentPanelProps> = ({
  sentimentData = COMMUNITY_SENTIMENT_DATA,
  selectedWardId,
  onSelectWard,
  onInspectSensor
}) => {
  const [filterSentiment, setFilterSentiment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredNodes = sentimentData.filter((node) => {
    if (filterSentiment !== "all" && node.overallSentiment !== filterSentiment) return false;
    if (searchQuery && !node.wardName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const selectedNode = sentimentData.find((n) => n.id === selectedWardId) || sentimentData[0];

  // Overall basin sentiment stats
  const avgCohesion = Math.round(sentimentData.reduce((acc, curr) => acc + curr.socialCohesionScore, 0) / sentimentData.length);
  const totalGrievances = sentimentData.reduce((acc, curr) => acc + curr.grievanceCount, 0);
  const avgResolutionRate = Math.round(sentimentData.reduce((acc, curr) => acc + curr.grievanceResolutionRate, 0) / sentimentData.length);

  return (
    <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 flex flex-col justify-between space-y-4 font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2330]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <HeartHandshake className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-['Syne'] text-sm font-bold text-[#F8FAFC]">
                Community Feedback & Social Cohesion
              </h3>
              <span className="text-[10px] font-mono text-[#64748B]">
                Baraza Audits & SMS Warden Sentinel Feed
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
            Basin Cohesion: {avgCohesion}/100
          </span>
        </div>

        {/* Global Summary Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-3 text-xs font-mono">
          <div className="bg-[#141B26] p-2 rounded border border-[#222C3D]">
            <span className="text-[9px] text-[#64748B] block uppercase">Active Grievances</span>
            <span className="text-sm font-bold text-amber-400">{totalGrievances} Logged</span>
          </div>
          <div className="bg-[#141B26] p-2 rounded border border-[#222C3D]">
            <span className="text-[9px] text-[#64748B] block uppercase">Resolution Rate</span>
            <span className="text-sm font-bold text-emerald-400">{avgResolutionRate}% Closed</span>
          </div>
          <div className="bg-[#141B26] p-2 rounded border border-[#222C3D]">
            <span className="text-[9px] text-[#64748B] block uppercase">Cartel Resistance</span>
            <span className="text-sm font-bold text-sky-400">73 / 100 Index</span>
          </div>
        </div>

        {/* Ward Selector List */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
            <span>Monitored Informal Settlement Wards:</span>
            <span>{filteredNodes.length} Active</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {sentimentData.map((node) => {
              const isSelected = node.id === selectedWardId;
              const sentimentColor = 
                node.overallSentiment === "positive" ? "border-emerald-500/60 text-emerald-400" :
                node.overallSentiment === "neutral" ? "border-sky-500/60 text-sky-400" :
                node.overallSentiment === "tense" ? "border-amber-500/60 text-amber-400" :
                "border-rose-500/60 text-rose-400";

              return (
                <button
                  key={node.id}
                  onClick={() => onSelectWard(node.id)}
                  className={`p-2 rounded-lg text-left transition-all border font-mono text-[11px] flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#182335] border-amber-400 shadow-sm"
                      : "bg-[#0E131C] border-[#1E2738] hover:border-[#374763]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate max-w-[100px]">
                      {node.wardName.split(" ")[0]}
                    </span>
                    <span className={`text-[9px] px-1 rounded uppercase font-bold ${
                      node.overallSentiment === "positive" ? "bg-emerald-950 text-emerald-300" :
                      node.overallSentiment === "neutral" ? "bg-sky-950 text-sky-300" :
                      node.overallSentiment === "tense" ? "bg-amber-950 text-amber-300" :
                      "bg-rose-950 text-rose-300"
                    }`}>
                      {node.overallSentiment === "critical_unrest" ? "Unrest" : node.overallSentiment}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-1">
                    <span>Cohesion: {node.socialCohesionScore}</span>
                    <span>{node.grievanceCount} msgs</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Ward Deep Dive Card */}
        <div className="mt-3 bg-[#0D121B] border border-[#232D3F] rounded-lg p-3 space-y-2.5 text-xs font-mono">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#1C2534]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-white text-xs font-sans">{selectedNode.wardName}</span>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
              selectedNode.overallSentiment === "positive" ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40" :
              selectedNode.overallSentiment === "neutral" ? "bg-sky-950 text-sky-300 border border-sky-500/40" :
              selectedNode.overallSentiment === "tense" ? "bg-amber-950 text-amber-300 border border-amber-500/40" :
              "bg-rose-950 text-rose-300 border border-rose-500/40"
            }`}>
              {selectedNode.overallSentiment.replace("_", " ")}
            </span>
          </div>

          {/* Key Community Indices */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-[#141B26] p-2 rounded border border-[#20293A]">
              <span className="text-[10px] text-[#64748B] block">Social Cohesion Score</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-[#20293A] rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${selectedNode.socialCohesionScore}%` }} 
                    className="h-full bg-emerald-400 rounded-full"
                  />
                </div>
                <span className="text-emerald-400 font-bold">{selectedNode.socialCohesionScore}%</span>
              </div>
            </div>

            <div className="bg-[#141B26] p-2 rounded border border-[#20293A]">
              <span className="text-[10px] text-[#64748B] block">Cartel Resistance Index</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-[#20293A] rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${selectedNode.cartelExtortionResistanceIndex}%` }} 
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>
                <span className="text-amber-400 font-bold">{selectedNode.cartelExtortionResistanceIndex}%</span>
              </div>
            </div>
          </div>

          {/* Top Community Concern */}
          <div className="bg-[#141B26] p-2 rounded border border-[#20293A]">
            <span className="text-[10px] text-amber-400/90 font-bold uppercase block">
              Primary Citizen Grievance:
            </span>
            <p className="text-[#CBD5E1] text-[11px] leading-relaxed mt-0.5">
              {selectedNode.topCommunityConcern}
            </p>
          </div>

          {/* Warden Baraza Feedback */}
          <div className="bg-[#141B26] p-2 rounded border border-[#20293A]">
            <span className="text-[10px] text-sky-400 font-bold uppercase block flex items-center gap-1">
              <Radio className="w-3 h-3" /> Community Baraza Synthesis:
            </span>
            <p className="text-[#CBD5E1] text-[11px] leading-relaxed mt-0.5">
              {selectedNode.wardenBarazaFeedback}
            </p>
          </div>

          {/* Verbatim Citizen Quotations */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-[#64748B] uppercase block">
              Verified Citizen Testimonies:
            </span>
            {selectedNode.sampleCitizenQuotations.map((quote, idx) => (
              <div key={idx} className="p-2 rounded bg-[#070A0F] border border-[#1A2230] text-[10px] text-[#94A3B8] italic flex items-start gap-1.5">
                <Quote className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                <span>"{quote}"</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#1C2534] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
        <span>Participatory Governance: Verified</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> USSD + Baraza Mesh
        </span>
      </div>
    </div>
  );
};
