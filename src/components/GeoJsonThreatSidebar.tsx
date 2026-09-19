import React, { useState, useMemo } from "react";
import { 
  ShieldAlert, 
  Layers, 
  AlertTriangle, 
  MapPin, 
  Activity, 
  ChevronRight, 
  SlidersHorizontal, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ExternalLink,
  Trees,
  Building2,
  Users,
  Compass
} from "lucide-react";
import { GeoJsonRiskCollection, GeoJsonRiskFeature } from "../types";

export interface GeoJsonThreatSidebarProps {
  geoJsonData: GeoJsonRiskCollection;
  enabledRiskTypes: Record<string, boolean>;
  onToggleRiskType: (riskType: string) => void;
  selectedAlertId: string;
  onSelectAlert: (alertId: string) => void;
  onCorrelateSensor?: (sensorId: string) => void;
}

export const GeoJsonThreatSidebar: React.FC<GeoJsonThreatSidebarProps> = ({
  geoJsonData,
  enabledRiskTypes,
  onToggleRiskType,
  selectedAlertId,
  onSelectAlert,
  onCorrelateSensor
}) => {
  const [activeCategory, setActiveCategory] = useState<"all" | "environmental" | "infrastructure">("all");
  const [showRawGeoJson, setShowRawGeoJson] = useState<boolean>(false);

  // Classify GeoJSON features into Environmental vs Infrastructure Risk Zones
  const classifiedFeatures = useMemo(() => {
    return geoJsonData.features.map(feat => {
      const isInfrastructure = 
        feat.properties.riskType === "landslide_hazard" || 
        feat.properties.riskType === "cartel_extortion";
      
      const category: "environmental" | "infrastructure" = isInfrastructure ? "infrastructure" : "environmental";
      return {
        ...feat,
        category
      };
    });
  }, [geoJsonData]);

  const filteredFeatures = useMemo(() => {
    if (activeCategory === "all") return classifiedFeatures;
    return classifiedFeatures.filter(f => f.category === activeCategory);
  }, [classifiedFeatures, activeCategory]);

  const selectedFeature = useMemo(() => {
    return geoJsonData.features.find(f => f.properties.id === selectedAlertId) || geoJsonData.features[0];
  }, [geoJsonData, selectedAlertId]);

  // Aggregate active statistics
  const activeStats = useMemo(() => {
    const activeFeats = geoJsonData.features.filter(f => enabledRiskTypes[f.properties.riskType]);
    const totalPop = activeFeats.reduce((sum, f) => sum + (f.properties.affectedPopulation || 0), 0);
    return {
      activeCount: activeFeats.length,
      totalCount: geoJsonData.features.length,
      populationExposed: totalPop
    };
  }, [geoJsonData, enabledRiskTypes]);

  const handleToggleAll = (enable: boolean) => {
    const uniqueTypes = Array.from(new Set(geoJsonData.features.map(f => f.properties.riskType)));
    uniqueTypes.forEach(type => {
      if (enabledRiskTypes[type] !== enable) {
        onToggleRiskType(type);
      }
    });
  };

  return (
    <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 flex flex-col justify-between h-full space-y-4 font-mono text-xs">
      {/* Header & Category Tabs */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2534] mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="font-['Syne'] text-sm font-bold text-[#F8FAFC]">
              GeoJSON Threat Data Sidebar
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#141B26] text-amber-300 border border-amber-500/30">
            CRS: EPSG:4326
          </span>
        </div>

        {/* Global Layer State Indicator */}
        <div className="bg-[#0C1017] p-2.5 rounded-lg border border-[#1E2738] flex items-center justify-between text-[11px] mb-3">
          <div>
            <span className="text-[#64748B] block text-[10px] uppercase">Active Risk Layers</span>
            <span className="font-bold text-white">
              {activeStats.activeCount} of {activeStats.totalCount} Overlays Active
            </span>
          </div>
          <div className="text-right">
            <span className="text-[#64748B] block text-[10px] uppercase">Population At Risk</span>
            <span className="font-bold text-rose-400">
              {activeStats.populationExposed.toLocaleString()} Citizens
            </span>
          </div>
        </div>

        {/* Category Switcher & Bulk Toggles */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1 bg-[#0A0D13] p-1 rounded-lg border border-[#1E2738]">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-2 py-1 rounded text-[10px] transition-all ${
                activeCategory === "all" ? "bg-[#1E2838] text-white font-bold" : "text-[#64748B] hover:text-[#94A3B8]"
              }`}
            >
              All Zones ({geoJsonData.features.length})
            </button>
            <button
              onClick={() => setActiveCategory("environmental")}
              className={`px-2 py-1 rounded text-[10px] flex items-center gap-1 transition-all ${
                activeCategory === "environmental" ? "bg-[#1E2838] text-emerald-300 font-bold" : "text-[#64748B] hover:text-[#94A3B8]"
              }`}
            >
              <Trees className="w-3 h-3 text-emerald-400" />
              <span>Eco</span>
            </button>
            <button
              onClick={() => setActiveCategory("infrastructure")}
              className={`px-2 py-1 rounded text-[10px] flex items-center gap-1 transition-all ${
                activeCategory === "infrastructure" ? "bg-[#1E2838] text-sky-300 font-bold" : "text-[#64748B] hover:text-[#94A3B8]"
              }`}
            >
              <Building2 className="w-3 h-3 text-sky-400" />
              <span>Infra</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px]">
            <button
              onClick={() => handleToggleAll(true)}
              className="text-amber-400 hover:text-amber-300 transition-colors underline decoration-dotted"
            >
              All On
            </button>
            <span className="text-[#475569]">|</span>
            <button
              onClick={() => handleToggleAll(false)}
              className="text-[#94A3B8] hover:text-white transition-colors underline decoration-dotted"
            >
              All Off
            </button>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {filteredFeatures.map((feat) => {
            const isEnabled = !!enabledRiskTypes[feat.properties.riskType];
            const isSelected = feat.properties.id === selectedAlertId;
            const [lng, lat] = feat.geometry.coordinates as [number, number];

            const severityBorder = 
              feat.properties.severity === "critical" ? "border-rose-500/50" :
              feat.properties.severity === "severe" ? "border-purple-500/50" :
              feat.properties.severity === "warning" ? "border-amber-500/50" : "border-sky-500/50";

            return (
              <div
                key={feat.id}
                onClick={() => onSelectAlert(feat.properties.id)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected 
                    ? `bg-[#182232] ${severityBorder} ring-1 ring-amber-400/40` 
                    : "bg-[#0C1017] border-[#1C2534] hover:border-[#2C384D]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleRiskType(feat.properties.riskType);
                        }}
                        className={`p-1 rounded transition-colors ${
                          isEnabled 
                            ? "text-emerald-400 hover:text-emerald-300 bg-emerald-950/40" 
                            : "text-zinc-500 hover:text-zinc-400 bg-zinc-900"
                        }`}
                        title={isEnabled ? "Disable map overlay" : "Enable map overlay"}
                      >
                        {isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <span className="text-[10px] font-bold text-[#E2E8F0] truncate">
                        {feat.properties.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
                      <span className="flex items-center gap-0.5 text-amber-300">
                        <MapPin className="w-2.5 h-2.5" />
                        {lat.toFixed(4)}°, {lng.toFixed(4)}°
                      </span>
                      <span>•</span>
                      <span className="text-rose-300">
                        {((feat.properties.affectedPopulation || 0) / 1000).toFixed(0)}k pop
                      </span>
                    </div>
                  </div>

                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    feat.properties.severity === "critical" ? "bg-rose-950 text-rose-300 border border-rose-500/40" :
                    feat.properties.severity === "severe" ? "bg-purple-950 text-purple-300 border border-purple-500/40" :
                    feat.properties.severity === "warning" ? "bg-amber-950 text-amber-300 border border-amber-500/40" :
                    "bg-sky-950 text-sky-300 border border-sky-500/40"
                  }`}>
                    {feat.properties.severity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Feature Parsed GeoJSON Deep Dive Card */}
      <div className="bg-[#0D121B] border border-[#232D3F] rounded-lg p-3 space-y-2 text-[11px]">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#1C2534]">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-[#F8FAFC]">{selectedFeature.properties.id}</span>
          </div>
          <button
            onClick={() => setShowRawGeoJson(!showRawGeoJson)}
            className="text-[10px] text-sky-400 hover:text-sky-300 transition-colors underline"
          >
            {showRawGeoJson ? "Hide GeoJSON" : "View GeoJSON"}
          </button>
        </div>

        {showRawGeoJson ? (
          <pre className="p-2 rounded bg-[#06080C] text-[9px] text-[#A5B4FC] overflow-x-auto max-h-28 font-mono border border-[#1A2230]">
            {JSON.stringify(selectedFeature, null, 2)}
          </pre>
        ) : (
          <div className="space-y-1.5 text-[#94A3B8]">
            <div className="text-white font-medium line-clamp-1">
              {selectedFeature.properties.headline}
            </div>
            <p className="text-[10px] leading-relaxed line-clamp-2">
              {selectedFeature.properties.detail}
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-[#64748B]">
              <span>Sensor: <strong className="text-[#CBD5E1]">{selectedFeature.properties.sensorId || "Telemetry Node"}</strong></span>
              <button
                type="button"
                onClick={() => {
                  if (selectedFeature.properties.sensorId && onCorrelateSensor) {
                    onCorrelateSensor(selectedFeature.properties.sensorId);
                  }
                }}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-0.5 transition-colors"
              >
                <span>Inspect Node</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
