import React, { useState, useMemo } from "react";
import { 
  Radio, 
  AlertTriangle, 
  ShieldAlert, 
  Navigation, 
  Filter, 
  Search, 
  CheckCircle2, 
  Eye, 
  Layers, 
  MapPin, 
  Activity, 
  ExternalLink,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import { GeoJsonRiskCollection, GeoJsonRiskFeature } from "../types";

export interface AlertFeedProps {
  geoJsonData: GeoJsonRiskCollection;
  enabledRiskTypes: Record<string, boolean>;
  onToggleRiskType: (riskType: string) => void;
  selectedAlertId: string;
  onSelectAlert: (alertId: string) => void;
  onCorrelateSensor?: (sensorId: string) => void;
}

export const AlertFeed: React.FC<AlertFeedProps> = ({
  geoJsonData,
  enabledRiskTypes,
  onToggleRiskType,
  selectedAlertId,
  onSelectAlert,
  onCorrelateSensor
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showTogglesPanel, setShowTogglesPanel] = useState<boolean>(true);

  // Available risk overlay definitions with thematic badges & metadata
  const overlayDefinitions = [
    { 
      key: "flood_inundation", 
      label: "Riparian Flood Corridor", 
      badge: "Flood Zone", 
      color: "text-rose-400 border-rose-500/40 bg-rose-950/40",
      activeColor: "bg-rose-500/20 text-rose-300 border-rose-500",
      description: "Hydrological stage surges & low-lying dwelling inundation"
    },
    { 
      key: "industrial_plume", 
      label: "Industrial Effluent Plume", 
      badge: "Toxic Effluent", 
      color: "text-purple-400 border-purple-500/40 bg-purple-950/40",
      activeColor: "bg-purple-500/20 text-purple-300 border-purple-500",
      description: "Unregulated tannery organo-sulfate & heavy metal discharge"
    },
    { 
      key: "pathogen_hotspot", 
      label: "Pathogen Drainage Runoff", 
      badge: "Pathogen", 
      color: "text-amber-400 border-amber-500/40 bg-amber-950/40",
      activeColor: "bg-amber-500/20 text-amber-300 border-amber-500",
      description: "Unpaved open stormwater ditch overflow into footpaths"
    },
    { 
      key: "landslide_hazard", 
      label: "Quarry Landslide Hazard", 
      badge: "Geohazard", 
      color: "text-orange-400 border-orange-500/40 bg-orange-950/40",
      activeColor: "bg-orange-500/20 text-orange-300 border-orange-500",
      description: "Volcanic tuff shear saturation along quarry rims"
    },
    { 
      key: "cartel_extortion", 
      label: "Water Syndicate Extortion", 
      badge: "Economic Rent", 
      color: "text-sky-400 border-sky-500/40 bg-sky-950/40",
      activeColor: "bg-sky-500/20 text-sky-300 border-sky-500",
      description: "Informal private bowser price-gouging routes"
    }
  ];

  // Parse and filter GeoJSON features
  const filteredFeatures = useMemo(() => {
    return geoJsonData.features.filter((feat) => {
      // 1. Overlay toggle check
      if (!enabledRiskTypes[feat.properties.riskType]) return false;

      // 2. Severity filter check
      if (severityFilter !== "all" && feat.properties.severity !== severityFilter) return false;

      // 3. Search query check
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = feat.properties.name.toLowerCase().includes(query);
        const matchesHeadline = feat.properties.headline.toLowerCase().includes(query);
        const matchesDetail = feat.properties.detail.toLowerCase().includes(query);
        const matchesId = feat.properties.id.toLowerCase().includes(query);
        if (!matchesName && !matchesHeadline && !matchesDetail && !matchesId) return false;
      }

      return true;
    });
  }, [geoJsonData, enabledRiskTypes, severityFilter, searchQuery]);

  const selectedFeature = useMemo(() => {
    return geoJsonData.features.find((f) => f.properties.id === selectedAlertId) || geoJsonData.features[0];
  }, [geoJsonData, selectedAlertId]);

  const totalAffected = useMemo(() => {
    return filteredFeatures.reduce((sum, f) => sum + (f.properties.affectedPopulation || 0), 0);
  }, [filteredFeatures]);

  return (
    <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-5 space-y-4 shadow-lg">
      {/* Feed Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-[#1C2330] gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Radio className="w-4 h-4 animate-pulse" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Syne'] text-base font-bold text-[#F8FAFC]">
                Environmental Risk Alert Feed
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-500/40">
                {filteredFeatures.length} Active GeoJSON Hazard{filteredFeatures.length === 1 ? "" : "s"}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Parsed from Nairobi Basin GeoJSON FeatureCollection • Impacting {(totalAffected / 1000).toFixed(0)}k Residents
            </p>
          </div>
        </div>

        {/* Controls & Search */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search risks, wards, zones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#0A0D13] border border-[#232D3F] text-xs text-[#CBD5E1] placeholder-[#64748B] focus:outline-none focus:border-amber-500/60 w-44 md:w-56"
            />
          </div>

          <button
            onClick={() => setShowTogglesPanel(!showTogglesPanel)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
              showTogglesPanel
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-[#141A24] text-[#94A3B8] border-[#232D3F] hover:text-[#CBD5E1]"
            }`}
            title="Toggle risk layer controls"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Map Overlays</span>
          </button>
        </div>
      </div>

      {/* Collapsible Risk Map Overlay Toggles Strip */}
      {showTogglesPanel && (
        <div className="p-3 rounded-lg bg-[#0A0D13] border border-[#1E2738] space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-amber-400" />
              Toggle GeoJSON Risk Map Overlays:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  overlayDefinitions.forEach(ov => {
                    if (!enabledRiskTypes[ov.key]) onToggleRiskType(ov.key);
                  });
                }}
                className="text-[10px] text-amber-400 hover:text-amber-300 underline"
              >
                Enable All
              </button>
              <span className="text-[#334155]">•</span>
              <button
                onClick={() => {
                  overlayDefinitions.forEach(ov => {
                    if (enabledRiskTypes[ov.key]) onToggleRiskType(ov.key);
                  });
                }}
                className="text-[10px] text-[#94A3B8] hover:text-white underline"
              >
                Disable All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
            {overlayDefinitions.map((ov) => {
              const isEnabled = !!enabledRiskTypes[ov.key];
              return (
                <button
                  key={ov.key}
                  onClick={() => onToggleRiskType(ov.key)}
                  className={`p-2 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                    isEnabled
                      ? `${ov.activeColor} shadow-sm ring-1 ring-white/10`
                      : "bg-[#10151E] text-[#64748B] border-[#1C2534] opacity-50 hover:opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] uppercase font-bold tracking-tight">
                      {ov.badge}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isEnabled ? "bg-current animate-pulse" : "bg-zinc-700"}`} />
                  </div>
                  <span className="text-[11px] font-sans font-bold leading-tight line-clamp-1 text-white">
                    {ov.label}
                  </span>
                  <span className="text-[9px] text-[#94A3B8] mt-1 font-mono">
                    {isEnabled ? "Overlay ON" : "Overlay OFF"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Severity Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#64748B]">Filter Severity:</span>
          {["all", "critical", "severe", "warning", "advisory"].map((sev) => {
            const count = sev === "all" 
              ? geoJsonData.features.filter(f => enabledRiskTypes[f.properties.riskType]).length
              : geoJsonData.features.filter(f => enabledRiskTypes[f.properties.riskType] && f.properties.severity === sev).length;
            
            return (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-0.5 rounded capitalize text-[11px] transition-all ${
                  severityFilter === sev
                    ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/50"
                    : "bg-[#141A24] text-[#94A3B8] hover:text-[#CBD5E1] border border-[#232D3F]"
                }`}
              >
                {sev} ({count})
              </button>
            );
          })}
        </div>

        <span className="text-[10px] text-[#64748B]">
          Live GeoJSON Stream • Updated 2026-09-18
        </span>
      </div>

      {/* Risk Alert Cards Grid */}
      {filteredFeatures.length === 0 ? (
        <div className="p-8 text-center bg-[#0A0D13] rounded-xl border border-[#1E2738] space-y-2">
          <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto opacity-70" />
          <h4 className="text-sm font-bold text-[#E2E8F0]">No Environmental Hazards Match Current Filters</h4>
          <p className="text-xs text-[#94A3B8] font-mono">
            Adjust your severity filter, enable overlays above, or clear the search query to view active hazard points.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredFeatures.map((feat) => {
            const isSelected = feat.properties.id === selectedAlertId;
            const [lng, lat] = feat.geometry.coordinates as [number, number];
            
            const sevBadge = 
              feat.properties.severity === "critical" ? "bg-rose-950/80 text-rose-300 border-rose-500/50" :
              feat.properties.severity === "severe" ? "bg-purple-950/80 text-purple-300 border-purple-500/50" :
              feat.properties.severity === "warning" ? "bg-amber-950/80 text-amber-300 border-amber-500/50" :
              "bg-sky-950/80 text-sky-300 border-sky-500/50";

            return (
              <div
                key={feat.properties.id}
                onClick={() => onSelectAlert(feat.properties.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#161F2E] border-rose-500/90 shadow-md ring-1 ring-rose-500/40"
                    : "bg-[#0E121A] border-[#1C2534] hover:border-[#2C3B4E]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-400">
                      {feat.properties.id}
                    </span>
                    <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border font-bold ${sevBadge}`}>
                      ● {feat.properties.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#F8FAFC] leading-snug mb-1 font-sans">
                    {feat.properties.name}
                  </h4>

                  <p className="text-[11px] text-rose-300 font-medium line-clamp-1 mb-2 font-mono">
                    {feat.properties.headline}
                  </p>

                  <p className="text-[11px] text-[#94A3B8] line-clamp-2 mb-3 leading-relaxed">
                    {feat.properties.detail}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#1C2534] text-[10px] font-mono">
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>At-Risk Population:</span>
                    <span className="text-[#CBD5E1] font-bold">
                      {(feat.properties.affectedPopulation / 1000).toFixed(0)}k Residents
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>GeoJSON Coord:</span>
                    <span className="text-[#94A3B8]">
                      [{lat.toFixed(3)}°, {lng.toFixed(3)}°]
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#161D29]">
                    <span className="text-amber-400 flex items-center gap-1 font-semibold">
                      <Navigation className="w-3 h-3" /> Focus On Map
                    </span>
                    <span className="text-xs text-[#64748B]">
                      {isSelected ? "● Active Focus" : "Select →"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Alert Action & Sensor Correlation Dossier */}
      {selectedFeature && (
        <div className="bg-[#141A24] border border-[#222C3D] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono shadow-inner">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-rose-400 font-bold uppercase text-[10px] flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Active Mitigation Protocol • {selectedFeature.properties.id}
              </span>
              <span className="text-[10px] text-[#64748B]">
                ({selectedFeature.properties.name})
              </span>
            </div>
            <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
              {selectedFeature.properties.mitigationAction}
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-2">
            {selectedFeature.properties.sensorId && onCorrelateSensor && (
              <button
                onClick={() => onCorrelateSensor(selectedFeature.properties.sensorId!)}
                className="px-3 py-2 rounded-lg bg-rose-600/30 border border-rose-500/50 hover:bg-rose-600/40 text-rose-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Correlate Sensor ({selectedFeature.properties.sensorId})</span>
              </button>
            )}

            <button
              onClick={() => {
                // Focus on alert coordinates
                onSelectAlert(selectedFeature.properties.id);
              }}
              className="px-3 py-2 rounded-lg bg-[#1A2230] border border-[#2A374D] hover:bg-[#232F42] text-amber-300 text-xs font-mono flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Center In-Situ Canvas</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
