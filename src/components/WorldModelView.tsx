import React, { useState } from "react";
import { 
  Share2, 
  GitBranch, 
  AlertCircle, 
  Link2, 
  Layers, 
  TrendingUp, 
  Search, 
  HelpCircle,
  ShieldCheck,
  Zap
} from "lucide-react";
import { WorldNode } from "../types";

interface WorldModelViewProps {
  nodes: WorldNode[];
}

export const WorldModelView: React.FC<WorldModelViewProps> = ({ nodes }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-residents-mukuru");
  const [activeQuery, setActiveQuery] = useState<"dependencies" | "bottlenecks" | "causation" | "nexus">("dependencies");

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Derive downstream dependants (nodes that depend on the selected node)
  const dependentNodes = nodes.filter(n => n.dependencies.includes(selectedNode.id));
  // Nodes that the selected node depends on
  const upstreamDependencies = nodes.filter(n => selectedNode.dependencies.includes(n.id));

  return (
    <div className="space-y-6">
      {/* World Model Mandate Banner */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 lg:p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Share2 className="w-4 h-4" />
              </span>
              <h2 className="font-['Syne'] text-lg font-bold text-[#F8FAFC]">
                Atlas World Model — Relational Causal Architecture
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-400 border border-sky-500/30">
                Explainable & Inspectable
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
              Connects people, places, institutions, infrastructure, resources, capital, ecosystems, risks, and outcomes.
              Evaluates causal dependencies rather than isolated siloed metrics.
            </p>
          </div>

          {/* Interactive World Model Inquiry Queries */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "dependencies", label: "What depends on what?", icon: GitBranch },
              { id: "bottlenecks", label: "Where are bottlenecks?", icon: AlertCircle },
              { id: "causation", label: "Correlation vs Causation", icon: HelpCircle },
              { id: "nexus", label: "Multi-System Nexus", icon: Zap }
            ].map((q) => {
              const Icon = q.icon;
              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQuery(q.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                    activeQuery === q.id
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"
                      : "bg-[#141A24] text-[#94A3B8] hover:text-[#CBD5E1] border border-[#232D3F]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{q.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Query Explanation Strip */}
      {activeQuery === "causation" && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-[#E2E8F0] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300 font-mono uppercase">Causal Inference Check: Water Price Spike</span>
            <p className="text-[#CBD5E1] leading-relaxed">
              <strong>Observed Correlation:</strong> During heavy rain, informal water vendor prices spike to Ksh 50/jerrycan. 
              <br />
              <strong>Naive Assumption:</strong> Water is physically scarce during storms.
              <br />
              <strong>True Causal Driver Identified by Atlas:</strong> Upstream industrial runoff floods municipal ground pipes; cartels manually turn off illegal valve manifolds to fabricate acute artificial scarcity while families are trapped indoors, extracting 850% margins.
            </p>
          </div>
        </div>
      )}

      {activeQuery === "bottlenecks" && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs text-[#E2E8F0] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-rose-300 font-mono uppercase">Active Bottleneck Warning: Physical Distribution Chokepoints</span>
            <p className="text-[#CBD5E1] leading-relaxed">
              While decentralized solar borehole yields are optimal (74kL/day), informal cartels physically threaten local women carrying jerrycans across the Railway Bridge culvert.
              <strong> Resolution:</strong> Decentralize tap heads directly inside 4 distinct residential village sub-clusters rather than a single perimeter depot.
            </p>
          </div>
        </div>
      )}

      {/* Relational Causal Graph Visualizer & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Canvas */}
        <div className="lg:col-span-8 bg-[#10151E] border border-[#232D3F] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C2330] mb-4 text-xs font-mono">
            <span className="text-[#CBD5E1] flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              RELATIONAL ENTITY GRAPH: NAIROBI ECOSYSTEM
            </span>
            <span className="text-[#64748B]">Click any node to inspect causal chains</span>
          </div>

          {/* Interactive Graph Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Ecosystems & Physical Places */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-wider block font-bold">
                Ecosystems & Catchments
              </span>
              {nodes.filter(n => n.category === "ecosystems" || n.category === "places").map(n => {
                const isSelected = n.id === selectedNodeId;
                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNodeId(n.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-emerald-950/40 border-emerald-400 shadow-md ring-1 ring-emerald-500/50" 
                        : "bg-[#141A24] border-[#222C3D] hover:border-[#374761]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#E2E8F0]">{n.label}</span>
                      <span className={`w-2 h-2 rounded-full ${
                        n.status === "critical" ? "bg-rose-500" :
                        n.status === "stressed" ? "bg-amber-500" : "bg-emerald-500"
                      }`} />
                    </div>
                    <p className="text-[11px] text-[#94A3B8] line-clamp-2">{n.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-[#64748B]">
                      <span>Dep: {n.dependencies.length}</span>
                      <span>•</span>
                      <span className="text-emerald-400">{n.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 2: Infrastructure & Capital & Institutions */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono text-amber-400 tracking-wider block font-bold">
                Infrastructure, Institutions & Capital
              </span>
              {nodes.filter(n => n.category === "infrastructure" || n.category === "institutions" || n.category === "capital").map(n => {
                const isSelected = n.id === selectedNodeId;
                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNodeId(n.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-amber-950/40 border-amber-400 shadow-md ring-1 ring-amber-500/50" 
                        : "bg-[#141A24] border-[#222C3D] hover:border-[#374761]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#E2E8F0]">{n.label}</span>
                      <span className={`w-2 h-2 rounded-full ${
                        n.status === "critical" ? "bg-rose-500" :
                        n.status === "stressed" ? "bg-amber-500" : "bg-emerald-500"
                      }`} />
                    </div>
                    <p className="text-[11px] text-[#94A3B8] line-clamp-2">{n.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-[#64748B]">
                      <span>Dep: {n.dependencies.length}</span>
                      <span>•</span>
                      <span className="text-amber-400">{n.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 3: People, Communities & Systemic Risks */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono text-sky-400 tracking-wider block font-bold">
                People, Communities & Systemic Risks
              </span>
              {nodes.filter(n => n.category === "people" || n.category === "risks").map(n => {
                const isSelected = n.id === selectedNodeId;
                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNodeId(n.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-sky-950/40 border-sky-400 shadow-md ring-1 ring-sky-500/50" 
                        : "bg-[#141A24] border-[#222C3D] hover:border-[#374761]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#E2E8F0]">{n.label}</span>
                      <span className={`w-2 h-2 rounded-full ${
                        n.status === "critical" ? "bg-rose-500" :
                        n.status === "stressed" ? "bg-amber-500" : "bg-emerald-500"
                      }`} />
                    </div>
                    <p className="text-[11px] text-[#94A3B8] line-clamp-2">{n.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-[#64748B]">
                      <span>Dep: {n.dependencies.length}</span>
                      <span>•</span>
                      <span className="text-sky-400">{n.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Causal Inspector Panel */}
        <div className="lg:col-span-4 bg-[#10151E] border border-[#232D3F] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2330] mb-3 text-xs font-mono">
              <span className="text-amber-400 font-bold uppercase tracking-wider">Causal Dependency Inspector</span>
              <span className="text-[#64748B]">{selectedNode.id}</span>
            </div>

            <h3 className="font-['Syne'] text-base font-bold text-[#F8FAFC]">
              {selectedNode.label}
            </h3>
            <span className="text-xs font-mono text-amber-500 uppercase block mb-2">
              Category: {selectedNode.category}
            </span>
            <p className="text-xs text-[#CBD5E1] leading-relaxed mb-4">
              {selectedNode.description}
            </p>

            {/* Key Metrics */}
            <div className="bg-[#141A24] rounded-lg p-3 border border-[#222C3D] mb-4 space-y-2">
              <span className="text-[10px] uppercase font-mono text-[#64748B] block">Empirical Metrics</span>
              {Object.entries(selectedNode.metrics).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#94A3B8]">{k}:</span>
                  <span className="text-amber-300 font-bold">{v}</span>
                </div>
              ))}
            </div>

            {/* Direct Upstream Dependencies */}
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-mono uppercase text-[#64748B] block font-semibold">
                ▲ What this Node Depends On ({upstreamDependencies.length}):
              </span>
              {upstreamDependencies.length === 0 ? (
                <span className="text-xs text-[#64748B] italic block">None (Direct primary node)</span>
              ) : (
                <div className="space-y-1.5">
                  {upstreamDependencies.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedNodeId(d.id)}
                      className="w-full text-left p-2 rounded bg-[#0C1017] hover:bg-[#161F2E] border border-[#1C2534] text-xs flex items-center justify-between text-[#CBD5E1]"
                    >
                      <span>{d.label}</span>
                      <span className="text-[10px] font-mono text-amber-400">Inspect →</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Downstream Dependants */}
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-mono uppercase text-[#64748B] block font-semibold">
                ▼ What Depends on this Node ({dependentNodes.length}):
              </span>
              {dependentNodes.length === 0 ? (
                <span className="text-xs text-[#64748B] italic block">Terminal outcome node</span>
              ) : (
                <div className="space-y-1.5">
                  {dependentNodes.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedNodeId(d.id)}
                      className="w-full text-left p-2 rounded bg-[#0C1017] hover:bg-[#161F2E] border border-[#1C2534] text-xs flex items-center justify-between text-[#CBD5E1]"
                    >
                      <span>{d.label}</span>
                      <span className="text-[10px] font-mono text-emerald-400">Inspect →</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vulnerabilities & Failure Risks */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase text-rose-400 block font-semibold">
                Structural Vulnerabilities:
              </span>
              {selectedNode.vulnerabilities.map((v, i) => (
                <div key={i} className="text-xs text-[#CBD5E1] flex items-start gap-1.5">
                  <span className="text-rose-400 text-sm leading-none">•</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1C2330] flex items-center justify-between text-[11px] text-[#64748B] font-mono">
            <span>Graph Version: v2026.09</span>
            <span className="text-amber-400">100% Causal Lineage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
