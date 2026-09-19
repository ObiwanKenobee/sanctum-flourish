import React, { useState } from "react";
import { 
  Eye, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Layers, 
  Clock, 
  Satellite, 
  Waves, 
  Users, 
  ShieldAlert, 
  TrendingUp, 
  ExternalLink,
  Flame,
  Biohazard,
  Radio,
  Filter,
  Navigation,
  HeartHandshake,
  MessageSquare,
  History
} from "lucide-react";
import { TelemetryReading, GeoJsonRiskFeature } from "../types";
import { NAIROBI_GEOJSON_RISKS, COMMUNITY_SENTIMENT_DATA } from "../data/mockData";
import { AlertFeed } from "./AlertFeed";
import { GeoJsonThreatSidebar } from "./GeoJsonThreatSidebar";
import { CivScaleTimeline } from "./CivScaleTimeline";
import { CommunitySentimentPanel } from "./CommunitySentimentPanel";

interface ObservatoryViewProps {
  telemetry: TelemetryReading[];
  onSelectReading?: (reading: TelemetryReading) => void;
  priorityFloorMode: boolean;
}

export const ObservatoryView: React.FC<ObservatoryViewProps> = ({
  telemetry,
  priorityFloorMode
}) => {
  const [selectedId, setSelectedId] = useState<string>(telemetry[0]?.id || "gauge-mathare-01");
  const [activeLayer, setActiveLayer] = useState<string>("all");
  const [sidebarMode, setSidebarMode] = useState<"threats" | "sentiment" | "provenance">("threats");
  const [showSentimentOverlay, setShowSentimentOverlay] = useState<boolean>(true);
  const [selectedWardSentimentId, setSelectedWardSentimentId] = useState<string>("ward-mathare-4a");

  // GeoJSON Risk Overlay Toggles
  const [enabledRiskTypes, setEnabledRiskTypes] = useState<Record<string, boolean>>({
    flood_inundation: true,
    industrial_plume: true,
    pathogen_hotspot: true,
    landslide_hazard: true,
    cartel_extortion: true
  });

  const [selectedRiskAlertId, setSelectedRiskAlertId] = useState<string>("RISK-FLD-01");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const selectedReading = telemetry.find((t) => t.id === selectedId) || telemetry[0];

  const filteredTelemetry = telemetry.filter((t) => {
    if (activeLayer === "all") return true;
    if (activeLayer === "iot") return t.type.includes("IoT");
    if (activeLayer === "satellite") return t.type.includes("Orbital");
    if (activeLayer === "field") return t.type.includes("Citizen");
    if (activeLayer === "groundwater") return t.type.includes("Sub-surface");
    return true;
  });

  // Filter GeoJSON risk features according to enabled overlays and severity
  const activeRiskFeatures = NAIROBI_GEOJSON_RISKS.features.filter((f) => {
    if (!enabledRiskTypes[f.properties.riskType]) return false;
    if (severityFilter !== "all" && f.properties.severity !== severityFilter) return false;
    return true;
  });

  const selectedRisk = NAIROBI_GEOJSON_RISKS.features.find(
    (f) => f.properties.id === selectedRiskAlertId
  ) || NAIROBI_GEOJSON_RISKS.features[0];

  const toggleRiskType = (type: string) => {
    setEnabledRiskTypes((prev) => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Observatory Mandate Banner */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 lg:p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Eye className="w-4 h-4" />
              </span>
              <h2 className="font-['Syne'] text-lg font-bold text-[#F8FAFC]">
                Atlas Observatory — See Reality In Situ
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                Continuous Ingestion Active
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
              Living, normalized representation of reality across Nairobi Basin. Preserves strict provenance, measurement confidence, and uncertainty bands.
              <span className="text-amber-400/90 font-medium ml-1">
                Axiom: Never pretend incomplete data is complete.
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Telemetry (5)" },
              { id: "iot", label: "Hydrological IoT" },
              { id: "satellite", label: "Copernicus Sentinel-2" },
              { id: "field", label: "140 Warden SMS" },
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeLayer === layer.id
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"
                    : "bg-[#141A24] text-[#94A3B8] hover:text-[#CBD5E1] border border-[#232D3F]"
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GeoJSON Risk Overlay Control Bar */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#CBD5E1]">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span className="font-bold uppercase tracking-wider text-[11px]">GeoJSON Environmental Risk Overlays:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "flood_inundation", label: "Riparian Flood", color: "text-rose-400 border-rose-500/40" },
            { key: "industrial_plume", label: "Industrial Plume", color: "text-purple-400 border-purple-500/40" },
            { key: "pathogen_hotspot", label: "Pathogen / Drain", color: "text-amber-400 border-amber-500/40" },
            { key: "landslide_hazard", label: "Quarry Landslide", color: "text-orange-400 border-orange-500/40" },
            { key: "cartel_extortion", label: "Cartel Extortion", color: "text-sky-400 border-sky-500/40" },
          ].map((item) => {
            const isEnabled = enabledRiskTypes[item.key];
            return (
              <button
                key={item.key}
                onClick={() => toggleRiskType(item.key)}
                className={`px-2.5 py-1 rounded-md text-[11px] border transition-all flex items-center gap-1.5 ${
                  isEnabled
                    ? `bg-[#18202E] ${item.color} font-bold ring-1 ring-white/10`
                    : "bg-[#0E121A] text-[#64748B] border-[#1C2534] opacity-50"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isEnabled ? "bg-current" : "bg-zinc-600"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Dedicated Community Sentiment & Cohesion Overlay Toggle */}
          <div className="h-5 w-px bg-[#232D3F] mx-1 hidden sm:block" />
          <button
            onClick={() => setShowSentimentOverlay(!showSentimentOverlay)}
            className={`px-2.5 py-1 rounded-md text-[11px] border transition-all flex items-center gap-1.5 ${
              showSentimentOverlay
                ? "bg-[#1C182A] text-pink-300 border-pink-500/50 font-bold ring-1 ring-pink-500/20 shadow-sm"
                : "bg-[#0E121A] text-[#64748B] border-[#1C2534] opacity-50"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
            <span>Baraza Sentiment</span>
            <span className={`w-2 h-2 rounded-full ${showSentimentOverlay ? "bg-pink-400" : "bg-zinc-600"}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Nairobi Basin GIS Stage + Live Sensor Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Nairobi Basin Geospatial Tactical Vector Stage */}
        <div className="lg:col-span-7 bg-[#10151E] border border-[#232D3F] rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C2330] mb-3 text-xs">
            <div className="flex items-center gap-2 font-mono text-[#CBD5E1]">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>GEOSPATIAL IN-SITU CANVAS: NAIROBI RIVER BASIN</span>
            </div>
            <div className="flex items-center gap-3 text-[#64748B] font-mono text-[11px]">
              <span>CRS: EPSG:4326</span>
              <span>1.2864° S, 36.8172° E</span>
            </div>
          </div>

          {/* Stylized Vector Map with Live Sensor Points & GeoJSON Risk Zones */}
          <div className="relative w-full h-[410px] rounded-lg bg-[#0A0D13] border border-[#1A202C] overflow-hidden flex items-center justify-center">
            {/* Grid Lines & Sacred Geometry overlay */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#d97706 1px, transparent 1px), linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
                backgroundSize: "24px 24px, 48px 48px, 48px 48px"
              }}
            />

            {/* River Lines SVG (Mathare River, Nairobi River, Ngong River) & GeoJSON Polygons */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Watershed boundary */}
              <path
                d="M 60,40 Q 220,20 420,50 T 640,110 T 680,260 T 560,340 T 260,360 T 80,290 Z"
                fill="none"
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text x="70" y="60" fill="#64748B" fontSize="9" fontFamily="monospace">NAIROBI DRAINAGE CATCHMENT</text>

              {/* GeoJSON Flood Inundation Corridor Polygon */}
              {enabledRiskTypes.flood_inundation && (
                <g>
                  <polygon
                    points="140,75 220,80 340,120 420,135 380,165 240,140 130,95"
                    fill="#e11d48"
                    fillOpacity="0.18"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeDasharray="4,2"
                  />
                  <text x="210" y="115" fill="#fb7185" fontSize="8" fontFamily="monospace" fontStyle="italic">
                    [GeoJSON] Mathare Flood Buffer Zone
                  </text>
                </g>
              )}

              {/* GeoJSON Industrial Effluent Plume Zone */}
              {enabledRiskTypes.industrial_plume && (
                <g>
                  <ellipse
                    cx="390"
                    cy="80"
                    rx="45"
                    ry="22"
                    fill="#9333ea"
                    fillOpacity="0.22"
                    stroke="#c084fc"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                  <text x="360" y="75" fill="#d8b4fe" fontSize="8" fontFamily="monospace">
                    [GeoJSON] Ruaraka Plume
                  </text>
                </g>
              )}

              {/* GeoJSON Quarry Escarpment Slope Hazard */}
              {enabledRiskTypes.landslide_hazard && (
                <g>
                  <polygon
                    points="500,70 570,85 550,130 490,110"
                    fill="#f97316"
                    fillOpacity="0.18"
                    stroke="#fb923c"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />
                  <text x="502" y="100" fill="#fb923c" fontSize="8" fontFamily="monospace">
                    [GeoJSON] Quarry Hazard
                  </text>
                </g>
              )}

              {/* GeoJSON Pathogen & Open Sewer Inundation Hotspot */}
              {enabledRiskTypes.pathogen_hotspot && (
                <g>
                  <circle
                    cx="250"
                    cy="255"
                    r="32"
                    fill="#eab308"
                    fillOpacity="0.2"
                    stroke="#facc15"
                    strokeWidth="1.5"
                    strokeDasharray="4,2"
                  />
                  <text x="215" y="295" fill="#facc15" fontSize="8" fontFamily="monospace">
                    [GeoJSON] Pathogen Inflow Hotspot
                  </text>
                </g>
              )}

              {/* GeoJSON Cartel Monopoly Extortion Zone */}
              {enabledRiskTypes.cartel_extortion && (
                <g>
                  <rect
                    x="430"
                    y="250"
                    width="65"
                    height="45"
                    rx="4"
                    fill="#0284c7"
                    fillOpacity="0.18"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                  <text x="432" y="275" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                    [GeoJSON] Cartel Node
                  </text>
                </g>
              )}

              {/* Mathare River */}
              <path
                d="M 80,80 C 180,95 240,140 360,150 S 520,180 620,190"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-70"
              />
              <text x="130" y="85" fill="#38bdf8" fontSize="9" fontFamily="monospace">Mathare River</text>

              {/* Nairobi River Central */}
              <path
                d="M 120,150 C 220,165 340,180 440,210 S 540,230 630,240"
                fill="none"
                stroke="#0369a1"
                strokeWidth="2"
                strokeLinecap="round"
                className="opacity-60"
              />
              <text x="180" y="155" fill="#0284c7" fontSize="9" fontFamily="monospace">Nairobi River Proper</text>

              {/* Ngong River through Mukuru */}
              <path
                d="M 160,220 C 260,235 340,265 420,270 S 520,285 640,290"
                fill="none"
                stroke="#e11d48"
                strokeWidth="3"
                strokeLinecap="round"
                className="opacity-80"
              />
              <text x="210" y="245" fill="#fb7185" fontSize="9" fontFamily="monospace">Ngong River (High Coliform/Turbidity)</text>

              {/* Bioswale Retention Wetland Zone (Plan Alpha) */}
              <rect
                x="320"
                y="125"
                width="70"
                height="40"
                rx="6"
                fill="#065f46"
                fillOpacity="0.4"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
              <text x="325" y="148" fill="#34d399" fontSize="8" fontFamily="monospace">Swale Wetland 14ha</text>

              {/* Solar Kiosks Cluster (Plan Beta) */}
              <circle cx="390" cy="275" r="14" fill="#d97706" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="410" y="278" fill="#fbbf24" fontSize="8" fontFamily="monospace">Kiosk Cluster (4x UF)</text>
            </svg>

            {/* Interactive GeoJSON Risk Overlay Markers */}
            {activeRiskFeatures.map((feat) => {
              const isAlertSelected = feat.properties.id === selectedRiskAlertId;
              const [lng, lat] = feat.geometry.coordinates as [number, number];
              
              // Approximate vector coordinates
              const posX = feat.id.includes("mathare") ? "34%" :
                           feat.id.includes("ruaraka") ? "62%" :
                           feat.id.includes("mukuru") ? "64%" :
                           feat.id.includes("dandora") ? "80%" : "48%";
              const posY = feat.id.includes("mathare") ? "32%" :
                           feat.id.includes("ruaraka") ? "22%" :
                           feat.id.includes("mukuru") ? "72%" :
                           feat.id.includes("dandora") ? "26%" : "68%";

              const markerColor = feat.properties.severity === "critical" ? "bg-rose-500 text-rose-200 border-rose-400" :
                                  feat.properties.severity === "severe" ? "bg-purple-500 text-purple-200 border-purple-400" :
                                  feat.properties.severity === "warning" ? "bg-amber-500 text-amber-200 border-amber-400" :
                                  "bg-sky-500 text-sky-200 border-sky-400";

              return (
                <button
                  key={feat.id}
                  onClick={() => {
                    setSelectedRiskAlertId(feat.properties.id);
                    setSidebarMode("threats");
                  }}
                  style={{ left: posX, top: posY }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 group transition-all"
                  title={`${feat.properties.id}: ${feat.properties.name}`}
                >
                  <div className="relative">
                    <span className={`flex h-5 w-5 rounded-md border-2 ${markerColor} items-center justify-center shadow-lg transition-transform ${isAlertSelected ? "scale-125 ring-4 ring-rose-500/50" : "hover:scale-110"}`}>
                      <AlertTriangle className="w-3 h-3 text-white" />
                    </span>
                    {isAlertSelected && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#0A0D13] border border-rose-400 text-rose-300 text-[9px] font-mono whitespace-nowrap z-40 shadow-lg">
                        {feat.properties.id}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Interactive Telemetry Node Markers */}
            {telemetry.map((node) => {
              const isSelected = node.id === selectedId;
              const posX = node.id.includes("mathare") ? "30%" :
                           node.id.includes("mukuru") ? "58%" :
                           node.id.includes("sentinel") ? "50%" :
                           node.id.includes("wardens") ? "54%" : "44%";
              const posY = node.id.includes("mathare") ? "36%" :
                           node.id.includes("mukuru") ? "66%" :
                           node.id.includes("sentinel") ? "16%" :
                           node.id.includes("wardens") ? "76%" : "54%";

              const statusColor = node.status === "critical" ? "bg-rose-500 text-rose-300 border-rose-400" :
                                  node.status === "warning" ? "bg-amber-500 text-amber-300 border-amber-400" :
                                  node.status === "elevated" ? "bg-sky-500 text-sky-300 border-sky-400" :
                                  "bg-emerald-500 text-emerald-300 border-emerald-400";

              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedId(node.id);
                    setSidebarMode("provenance");
                  }}
                  style={{ left: posX, top: posY }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group transition-all`}
                >
                  <div className="relative">
                    <span className={`flex h-4 w-4 rounded-full border-2 ${statusColor} items-center justify-center shadow-lg transition-transform ${isSelected ? "scale-150 ring-4 ring-amber-500/40" : "hover:scale-125"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                    {isSelected && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#0A0D13] border border-amber-400 text-amber-300 text-[10px] font-mono whitespace-nowrap z-30 shadow-md">
                        {node.name.split(" ")[0]}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Interactive Community Sentiment & Social Cohesion Pulse Nodes */}
            {showSentimentOverlay && COMMUNITY_SENTIMENT_DATA.map((node) => {
              const isSelected = node.id === selectedWardSentimentId && sidebarMode === "sentiment";
              const posX = node.id.includes("mathare") ? "22%" :
                           node.id.includes("mukuru") ? "62%" :
                           node.id.includes("viwandani") ? "50%" :
                           node.id.includes("kiambiu") ? "36%" :
                           node.id.includes("ruaraka") ? "42%" : "72%";
              const posY = node.id.includes("mathare") ? "32%" :
                           node.id.includes("mukuru") ? "80%" :
                           node.id.includes("viwandani") ? "62%" :
                           node.id.includes("kiambiu") ? "52%" :
                           node.id.includes("ruaraka") ? "16%" : "28%";

              const sentimentBorder = 
                node.overallSentiment === "positive" ? "border-emerald-400 bg-emerald-950/90 text-emerald-300 shadow-emerald-900/40" :
                node.overallSentiment === "neutral" ? "border-sky-400 bg-sky-950/90 text-sky-300 shadow-sky-900/40" :
                node.overallSentiment === "tense" ? "border-amber-400 bg-amber-950/90 text-amber-300 shadow-amber-900/40" :
                "border-rose-400 bg-rose-950/90 text-rose-300 shadow-rose-900/40 animate-pulse";

              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedWardSentimentId(node.id);
                    setSidebarMode("sentiment");
                  }}
                  style={{ left: posX, top: posY }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 group transition-all"
                  title={`${node.wardName}: Cohesion ${node.socialCohesionScore}/100`}
                >
                  <div className="relative flex items-center">
                    <span className={`px-2 py-0.5 rounded-md border ${sentimentBorder} flex items-center gap-1 shadow-md text-[9px] font-mono font-bold transition-transform ${
                      isSelected ? "scale-125 ring-2 ring-amber-400" : "hover:scale-110"
                    }`}>
                      <HeartHandshake className="w-2.5 h-2.5" />
                      <span className="hidden sm:inline">{node.wardName.split(" ")[0]}</span>
                      <span className="opacity-90">{node.socialCohesionScore}%</span>
                    </span>
                  </div>
                </button>
              );
            })}

            {/* In-canvas Legend */}
            <div className="absolute bottom-2 left-2 p-2 rounded bg-[#0E131C]/90 border border-[#1E2738] text-[10px] font-mono space-y-1 backdrop-blur-sm z-10">
              <div className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                <span>GeoJSON Risk Alert Zone</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>IoT Sensor Node (In-situ)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Verified Bioremediation Zone</span>
              </div>
              {showSentimentOverlay && (
                <div className="flex items-center gap-1.5 text-pink-400">
                  <HeartHandshake className="w-2.5 h-2.5" />
                  <span>Ward Sentiment Pulse (Barazas)</span>
                </div>
              )}
            </div>
          </div>

          {/* Telemetry quick status strip */}
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-[#1C2330]">
            <div className="bg-[#141A24] p-2 rounded border border-[#222B3B]">
              <span className="text-[10px] text-[#64748B] font-mono block uppercase">Mathare Stage</span>
              <span className="text-sm font-mono font-bold text-amber-400">1.84 m</span>
              <span className="text-[10px] text-amber-500 ml-1">▲ +0.18/hr</span>
            </div>
            <div className="bg-[#141A24] p-2 rounded border border-[#222B3B]">
              <span className="text-[10px] text-[#64748B] font-mono block uppercase">Mukuru Turbidity</span>
              <span className="text-sm font-mono font-bold text-rose-400">412 NTU</span>
              <span className="text-[10px] text-rose-500 ml-1">Critical</span>
            </div>
            <div className="bg-[#141A24] p-2 rounded border border-[#222B3B]">
              <span className="text-[10px] text-[#64748B] font-mono block uppercase">Sentinel NDWI</span>
              <span className="text-sm font-mono font-bold text-sky-400">0.72 Index</span>
              <span className="text-[10px] text-[#94A3B8] ml-1">Saturated</span>
            </div>
            <div className="bg-[#141A24] p-2 rounded border border-[#222B3B]">
              <span className="text-[10px] text-[#64748B] font-mono block uppercase">Warden SMS</span>
              <span className="text-sm font-mono font-bold text-amber-400">38 Alerts</span>
              <span className="text-[10px] text-rose-400 ml-1">Cartel Surge</span>
            </div>
          </div>
        </div>

        {/* Right Column: Observation Provenance Inspector OR GeoJSON Threat Data Sidebar */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {/* View Mode Tab Switcher */}
          <div className="flex items-center gap-1 bg-[#0A0D13] p-1 rounded-xl border border-[#1E2534]">
            <button
              onClick={() => setSidebarMode("threats")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                sidebarMode === "threats"
                  ? "bg-[#1C2637] text-amber-400 border border-amber-500/40 shadow-sm"
                  : "text-[#64748B] hover:text-[#CBD5E1]"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>GeoJSON Threat Sidebar</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                {Object.values(enabledRiskTypes).filter(Boolean).length} Active
              </span>
            </button>
            <button
              onClick={() => setSidebarMode("provenance")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                sidebarMode === "provenance"
                  ? "bg-[#1C2637] text-emerald-400 border border-emerald-500/40 shadow-sm"
                  : "text-[#64748B] hover:text-[#CBD5E1]"
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Sensor Provenance</span>
            </button>
          </div>

          {sidebarMode === "threats" ? (
            <GeoJsonThreatSidebar
              geoJsonData={NAIROBI_GEOJSON_RISKS}
              enabledRiskTypes={enabledRiskTypes}
              onToggleRiskType={toggleRiskType}
              selectedAlertId={selectedRiskAlertId}
              onSelectAlert={(id) => setSelectedRiskAlertId(id)}
              onCorrelateSensor={(sensorId) => {
                setSelectedId(sensorId);
                setSidebarMode("provenance");
              }}
            />
          ) : (
            <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1C2330] mb-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-400" />
                    <h3 className="font-['Syne'] text-sm font-bold text-[#F8FAFC]">
                      Observation Provenance Inspector
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                    selectedReading.status === "critical" ? "bg-rose-950/80 text-rose-400 border border-rose-500/30" :
                    selectedReading.status === "warning" ? "bg-amber-950/80 text-amber-400 border border-amber-500/30" :
                    "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                  }`}>
                    {selectedReading.status}
                  </span>
                </div>

                {/* Observation Heading */}
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] block">
                    {selectedReading.type}
                  </span>
                  <h4 className="text-base font-bold text-[#E2E8F0] mt-0.5">
                    {selectedReading.name}
                  </h4>
                </div>

                {/* Current Value & Historical Mini-Trend */}
                <div className="bg-[#141B26] border border-[#222C3D] rounded-lg p-3.5 mb-4">
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <span className="text-2xl font-mono font-bold text-[#F8FAFC]">
                        {selectedReading.value}
                      </span>
                      <span className="text-xs font-mono text-[#94A3B8] ml-1.5">
                        {selectedReading.unit}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-amber-400 font-medium">
                      {selectedReading.trend}
                    </span>
                  </div>

                  {/* Mini SVG Trend Line */}
                  <div className="w-full h-12 pt-2">
                    <div className="flex items-end justify-between h-8 gap-1 border-b border-[#253245] pb-1">
                      {selectedReading.historical.map((h, i) => {
                        const maxVal = Math.max(...selectedReading.historical.map(item => item.value));
                        const minVal = Math.min(...selectedReading.historical.map(item => item.value));
                        const range = maxVal - minVal || 1;
                        const heightPercent = Math.max(15, Math.round(((h.value - minVal) / range) * 100));
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                            <div 
                              style={{ height: `${heightPercent}%` }} 
                              className="w-full bg-amber-500/60 hover:bg-amber-400 rounded-t transition-all"
                            />
                            <span className="text-[8px] font-mono text-[#64748B]">{h.time}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Mandatory Prompt Preservation Attributes */}
                <div className="space-y-2.5 text-xs">
                  <div className="bg-[#0C1017] p-2.5 rounded border border-[#1A2230]">
                    <span className="text-[10px] uppercase font-mono text-amber-400/90 block font-semibold mb-0.5">
                      1. Provenance & Calibration
                    </span>
                    <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                      {selectedReading.provenance}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#0C1017] p-2 rounded border border-[#1A2230]">
                      <span className="text-[10px] uppercase font-mono text-[#64748B] block">Confidence Level</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full bg-[#1F2937] overflow-hidden">
                          <div 
                            style={{ width: `${selectedReading.confidence * 100}%` }}
                            className="h-full bg-emerald-400 rounded-full"
                          />
                        </div>
                        <span className="font-mono text-[11px] text-emerald-400 font-bold">
                          {(selectedReading.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#0C1017] p-2 rounded border border-[#1A2230]">
                      <span className="text-[10px] uppercase font-mono text-amber-500 block">Uncertainty Band</span>
                      <span className="font-mono text-[11px] text-amber-300 font-medium block mt-1">
                        {selectedReading.uncertaintyBand}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#0C1017] p-2 rounded border border-[#1A2230] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#64748B]">Geographic Context</span>
                    <span className="text-[#CBD5E1]">{selectedReading.lat.toFixed(4)}° S, {selectedReading.lng.toFixed(4)}° E</span>
                  </div>

                  <div className="bg-[#0C1017] p-2 rounded border border-[#1A2230] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#64748B]">Timestamp UTC</span>
                    <span className="text-[#CBD5E1]">{selectedReading.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Axiomatic Footer */}
              <div className="mt-4 pt-3 border-t border-[#1C2330] flex items-center justify-between text-[11px] text-[#64748B]">
                <span className="font-mono">Audit Hash: SHA-256 Verified</span>
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live Signal
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GeoJSON Environmental Risk Alert Feed Component */}
      <AlertFeed
        geoJsonData={NAIROBI_GEOJSON_RISKS}
        enabledRiskTypes={enabledRiskTypes}
        onToggleRiskType={toggleRiskType}
        selectedAlertId={selectedRiskAlertId}
        onSelectAlert={(id) => setSelectedRiskAlertId(id)}
        onCorrelateSensor={(sensorId) => setSelectedId(sensorId)}
      />

      {/* Observation Telemetry Table */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#1C2330] flex items-center justify-between">
          <h3 className="font-['Syne'] text-sm font-bold text-[#F8FAFC]">
            Active Telemetry Feed ({filteredTelemetry.length} Nodes Online)
          </h3>
          <span className="text-xs text-[#64748B] font-mono">
            Standard: ISO-19115 Geospatial Metadata Compliant
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A0D13] text-[#64748B] uppercase tracking-wider text-[10px] border-b border-[#1C2330]">
              <tr>
                <th className="py-3 px-4">Node / Ingestion Stream</th>
                <th className="py-3 px-4">Modality</th>
                <th className="py-3 px-4">Value / Trend</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Uncertainty</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18202E] text-[#CBD5E1]">
              {filteredTelemetry.map((t) => (
                <tr 
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`cursor-pointer hover:bg-[#151D2A] transition-colors ${
                    t.id === selectedId ? "bg-[#182232]" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#E2E8F0] block">{t.name}</span>
                    <span className="text-[10px] text-[#64748B]">{t.id}</span>
                  </td>
                  <td className="py-3 px-4 text-[#94A3B8]">{t.type}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#F8FAFC]">{t.value} {t.unit}</span>
                    <span className="text-[10px] text-amber-400 block">{t.trend}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-400 font-bold">{(t.confidence * 100).toFixed(0)}%</span>
                  </td>
                  <td className="py-3 px-4 text-amber-400/90 text-[11px]">{t.uncertaintyBand}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                      t.status === "critical" ? "bg-rose-950/70 text-rose-400 border border-rose-500/30" :
                      t.status === "warning" ? "bg-amber-950/70 text-amber-400 border border-amber-500/30" :
                      "bg-emerald-950/70 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(t.id);
                      }}
                      className="px-2 py-1 rounded bg-[#1C2637] hover:bg-[#25334A] text-amber-300 text-[11px]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
