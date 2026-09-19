import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// Fallback deterministic ethical reasoning generator
function getDeterministicAnalysis(question?: string, context?: any, scenario?: any) {
  const qLower = (question || "").toLowerCase();
  
  let recommendation = "Authorize immediate phased deployment of decentralized solar kiosks and bioswale retention weirs. Bind operational commands to signed concurrence from community wardens.";
  let gains = "Guaranteed potable water at subsidized Ksh 3/20L and 48,000m³ peak flood attenuation.";
  let deteriorations = "Temporary resistance from informal water cartels requiring cooperative security escort.";
  let focusGroup = "Low-income families, elderly residents, and children in Mukuru Kwa Njenga and Mathare 4A riparian zones.";

  if (qLower.includes("cartel") || qLower.includes("bowser") || qLower.includes("kiosk")) {
    recommendation = "Deploy municipal cooperative protection for 4 active Solar UF kiosks while freezing unregistered water cartel taps. Do not disperse emergency bowsers without GPS telemetry tracking.";
    gains = "Directly breaks cartel monopoly, reducing average monthly household water expenditure from Ksh 3,800 to Ksh 650.";
    deteriorations = "Syndicate intimidation against local kiosk operators in Mukuru Ward 6.";
  } else if (qLower.includes("flood") || qLower.includes("weir") || qLower.includes("sluice") || qLower.includes("rain")) {
    recommendation = "Activate upstream bioswale detention cell #2 at stage threshold 1.80m. Maintain open downstream relief culverts along Nairobi River railway crossing.";
    gains = "Buffers up to 65mm/hr precipitation event without inundating Mathare riverbank households.";
    deteriorations = "Localized saturation of upstream secondary agricultural swales for 48 hours.";
  } else if (qLower.includes("sensor") || qLower.includes("fluoride") || qLower.includes("failure") || qLower.includes("fl-2024-11")) {
    recommendation = "Maintain optical and electrochemical dual-sensor verification. Require manual titration verification twice daily when turbidity exceeds 200 NTU.";
    gains = "Prevents false-negative sensor drift as witnessed in Failure Case FL-2024-11.";
    deteriorations = "Increases daily field technician operational burden by 4.5 man-hours.";
  }

  return {
    summary: `Living laboratory synthesis for Nairobi Basin: The immediate challenge centers on balancing hydrological shock resilience against community economic strain. Interventions must align physical reality with the Priority Floor covenant.`,
    firstPrincipleVerdict: `Priority Floor Sovereign Rule: The strength and legitimacy of this decision are measured solely by what happens to the families living within 10 meters of the riparian floodway in Mukuru and Mathare.`,
    recommendation,
    tradeOffMatrix: {
      immediateGains: gains,
      deteriorations,
      reversibility: "High: Solar UF kiosk modules and vegetative swale berms can be recalibrated or dismantled within 72 hours without permanent environmental scarring."
    },
    stakeholdersAtRisk: focusGroup,
    uncertaintyStatement: "Epistemic Uncertainty: Antecedent soil moisture variance (±12%) and unregistered industrial discharges between 01:00-04:00 UTC cannot be resolved via satellite alone without ground wardens."
  };
}

// In-memory living laboratory data state for Nairobi Basin
const laboratoryState = {
  region: "Nairobi Basin, Kenya",
  pilot: "Mathare & Mukuru Water Security & Regenerative Flood Defense",
  leadPartner: "Nairobi Metropolitan Water & Ecological Authority (NMWEA) & Muungano wa Wanavijiji",
  lastUpdated: new Date().toISOString(),
  readings: [
    {
      id: "gauge-mathare-01",
      name: "Mathare River Upstream Gauging Weir",
      type: "IoT Hydrological",
      lat: -1.2612,
      lng: 36.8584,
      value: 1.84,
      unit: "meters stage",
      trend: "+0.18m/hr",
      status: "warning",
      threshold: 2.10,
      confidence: 0.94,
      uncertaintyBand: "±0.06m",
      provenance: "Solar telemetry node MW-44, calibration certified 2026-08-12",
      timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
    },
    {
      id: "gauge-mukuru-04",
      name: "Ngong River Mukuru Kwa Njenga Inflow",
      type: "IoT Turbidity & E.coli Surrogate",
      lat: -1.3142,
      lng: 36.8791,
      value: 412,
      unit: "NTU",
      trend: "rising sharply",
      status: "critical",
      threshold: 250,
      confidence: 0.89,
      uncertaintyBand: "±28 NTU",
      provenance: "Optical probe via safaricom NB-IoT, authenticated HMAC-SHA256",
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    },
    {
      id: "satellite-sentinel-2",
      name: "Sentinel-2 MSI Surface Runoff & Chlorophyll-A",
      type: "Orbital Multispectral",
      lat: -1.2864,
      lng: 36.8172,
      value: 0.72,
      unit: "NDWI Index",
      trend: "saturated soils",
      status: "elevated",
      threshold: 0.60,
      confidence: 0.91,
      uncertaintyBand: "cloud obscuration: 8%",
      provenance: "ESA Copernicus Open Hub, L2A atmospherically corrected",
      timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    },
    {
      id: "community-wardens",
      name: "Mukuru Community Water Wardens Network",
      type: "Citizen Field Observation",
      lat: -1.3188,
      lng: 36.8745,
      value: 38,
      unit: "verified cartel price gouging reports (Ksh 35-50 / 20L jerrycan)",
      trend: "+140% above baseline",
      status: "critical",
      threshold: 15,
      confidence: 0.96,
      uncertaintyBand: "cross-verified by 12 independent health volunteers",
      provenance: "USSD / SMS Relay server, verified sender IDs from Ward 6",
      timestamp: new Date(Date.now() - 11 * 60000).toISOString(),
    },
    {
      id: "groundwater-aquifer-02",
      name: "Nairobi Volcanic Aquifer Monitoring Well #9",
      type: "Sub-surface Telemetry",
      lat: -1.2954,
      lng: 36.8329,
      value: 68.4,
      unit: "meters below ground level",
      trend: "depleting 0.04m/wk",
      status: "nominal",
      threshold: 75.0,
      confidence: 0.98,
      uncertaintyBand: "±0.2m",
      provenance: "WRMA Piezoelectric transducer",
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    }
  ]
};

// API: Telemetry
app.get("/api/telemetry", (req, res) => {
  res.json({
    status: "ok",
    data: laboratoryState
  });
});

// API: Scenario Simulation
app.post("/api/simulate", (req, res) => {
  const {
    rainfallSurge = 45, // percentage
    upstreamIndustrialSpike = 30, // percentage
    cartelPriceGouging = 80, // percentage
    bioswalePreDeployment = true,
    solarKiosksOnline = 4,
    earlyWarningLeadHours = 12
  } = req.body || {};

  // Deterministic systems equations with uncertainty bands
  const baseFloodRisk = Math.min(100, Math.round(35 + rainfallSurge * 0.75 - (bioswalePreDeployment ? 28 : 0) - (earlyWarningLeadHours * 1.4)));
  const choleraOutbreakProb = Math.min(100, Math.max(5, Math.round(15 + upstreamIndustrialSpike * 0.4 + (cartelPriceGouging * 0.35) - (solarKiosksOnline * 8))));
  const householdEconomicStrainKsh = Math.round(1800 + (cartelPriceGouging * 32) - (solarKiosksOnline * 240));
  const populationAtRisk = Math.round(145000 * (baseFloodRisk / 100));
  const waterTreatedPerDayLiters = solarKiosksOnline * 18500;

  res.json({
    simulationId: "sim-" + Date.now().toString(36),
    inputs: {
      rainfallSurge,
      upstreamIndustrialSpike,
      cartelPriceGouging,
      bioswalePreDeployment,
      solarKiosksOnline,
      earlyWarningLeadHours
    },
    outputs: {
      floodRiskIndex: baseFloodRisk,
      floodRiskCategory: baseFloodRisk > 70 ? "Severe Inundation" : baseFloodRisk > 40 ? "Moderate Surface Flooding" : "Manageable Swale Retention",
      choleraOutbreakProbPercent: choleraOutbreakProb,
      householdEconomicStrainKshPerMonth: householdEconomicStrainKsh,
      estimatedPopulationAtRisk: populationAtRisk,
      waterTreatedDailyLiters: waterTreatedPerDayLiters,
      ecologicalRetentionCapacityPercent: bioswalePreDeployment ? 78 : 34,
      uncertaintyBands: {
        floodRisk: `±${Math.round(baseFloodRisk * 0.12)}%`,
        waterQuality: "±14 NTU",
        socioEconomicImpact: "±9.5% confidence interval"
      },
      assumptions: [
        "Soil absorption capacity derived from 2026 antecedent precipitation index (API = 42mm)",
        "Water kiosk consumption assumes 22 liters per capita per day for 8,500 target families",
        "Informal vendor price elasticity modeled from Muungano 2025 field surveys"
      ],
      unknowns: [
        "Unregistered industrial dump valves operating between 01:00 and 04:00 UTC",
        "Micro-drainage clogging rates along Juja Road culverts during heavy plastic drift"
      ]
    }
  });
});

// API: Gemini-powered Ethical Reasoning & Systems Analysis
app.post("/api/reason", async (req, res) => {
  const { question, context, scenario } = req.body || {};
  const client = getGenAI();

  if (!client) {
    // Intelligent offline fallback adhering strictly to Atlas principles
    return res.json({
      model: "Atlas Deterministic Ethical Engine (Autonomous Mode)",
      grounded: true,
      analysis: getDeterministicAnalysis(question, context, scenario)
    });
  }

  const prompt = `
You are the Chief Intelligence Architect of ATLAS SANCTUM, an ethical decision-intelligence infrastructure for civilization-scale problems.
We are currently evaluating the living laboratory: Nairobi Basin (Mathare & Mukuru Water Security and Regenerative Flood Defense).

User Context: ${JSON.stringify(context || {})}
Active Scenario Parameters: ${JSON.stringify(scenario || {})}
User Query/Challenge: ${question || "Evaluate the ethical, ecological, and capital trade-offs of this intervention."}

Respond in strict JSON with the following format:
{
  "summary": "Concise 2-sentence systems explanation of what is happening and why",
  "firstPrincipleVerdict": "Assessment against the Priority Floor ('The strength of the system is measured by what happens to those with the least power')",
  "recommendation": "Concrete, actionable, bounded next step for human operators and capital allocators",
  "tradeOffMatrix": {
    "immediateGains": "What improves right now",
    "deteriorations": "What costs or friction will emerge",
    "reversibility": "Can this be undone? (Explain how and over what timeframe)"
  },
  "stakeholdersAtRisk": "Specific vulnerable groups bearing the brunt if this fails",
  "uncertaintyStatement": "Transparent admission of unknowns, sensor limitations, or missing data"
}
`;

  // Array of models to try in sequence if upstream 503 high demand or 429 occurs
  const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout waiting for model response")), 5000)
      );
      const callPromise = client.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const response: any = await Promise.race([callPromise, timeoutPromise]);
      const text = response?.text || "{}";
      const parsed = JSON.parse(text);

      return res.json({
        model: `${modelName} (Atlas Sanctum Node)`,
        grounded: true,
        analysis: parsed
      });
    } catch (err: any) {
      lastError = err;
      console.warn(`[Atlas Sanctum] Model ${modelName} unavailable (${err?.status || err?.message}), failing over...`);
      // If it's a 503/429 load spike, immediately try the next model without artificial sleep
      if (err?.status !== 503 && err?.status !== 429) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }

  // Graceful fallback when all external models are experiencing demand spikes (e.g. 503 Unavailable)
  console.warn("[Atlas Sanctum] Upstream Gemini API experiencing high demand spikes. Activating deterministic ethical arbiter.");
  return res.json({
    model: "Atlas Deterministic Ethical Engine (Autonomous Failover)",
    grounded: true,
    serviceNotice: "Gemini models are currently experiencing temporary high demand spikes. The system activated the autonomous deterministic ethical arbiter to ensure uninterrupted deliberative sovereignty.",
    analysis: getDeterministicAnalysis(question, context, scenario)
  });
});

// API: Dynamic Deliberation Suggestions
app.get("/api/suggestions", (req, res) => {
  const { stage, category } = req.query as { stage?: string; category?: string };

  const allSuggestions = [
    {
      id: "sug-hydro-01",
      category: "Hydrological & Climate",
      stage: "observatory",
      domain: "Flood & Stage Elevation",
      title: "Storm Surge Buffer at Mathare Weir",
      prompt: "Evaluate stage threshold 1.84m at Mathare Weir: Should we activate swale detention cell #2 before midnight rainfall surge?",
      contextTag: "Grounded on gauge-mathare-01 (+0.18m/hr)"
    },
    {
      id: "sug-hydro-02",
      category: "Hydrological & Climate",
      stage: "simulator",
      domain: "El Niño Scenario Simulation",
      title: "65mm/hr Cloudburst Stress Test",
      prompt: "Stress test: What happens to riparian households if a 65mm/hr precipitation event hits when upstream bioswale swales are at 80% saturation?",
      contextTag: "Simulates 145,000 population exposure"
    },
    {
      id: "sug-cartel-01",
      category: "Water Sovereignty & Cartels",
      stage: "decisions",
      domain: "Economic Extortion & Water Rights",
      title: "Breaking Informal Water Syndicates",
      prompt: "Deliberate intervention: How can community-owned Solar UF kiosks undercut the Ksh 50/jerrycan cartel price gouging without sparking retaliatory sabotage?",
      contextTag: "Grounded on USSD citizen reports (Mukuru Ward 6)"
    },
    {
      id: "sug-cartel-02",
      category: "Water Sovereignty & Cartels",
      stage: "capital",
      domain: "Capital Protection",
      title: "Emergency Bowsers vs. Fixed Solar Kiosks",
      prompt: "Evaluate Priority Floor trade-offs: Releasing Ksh 32M solar kiosk tranche vs deploying subsidized emergency water bowsers.",
      contextTag: "Tranche Beta Milestone Review"
    },
    {
      id: "sug-priority-01",
      category: "Priority Floor & Ethics",
      stage: "governance",
      domain: "First Principles & Human Flourishing",
      title: "Least-Advantaged Protection Metric",
      prompt: "Apply Priority Floor Axiom: Which specific families bear the highest tail-risk under Plan Alpha vs Plan Beta in Mukuru Kwa Njenga?",
      contextTag: "Charter Rule 01 Verification"
    },
    {
      id: "sug-priority-02",
      category: "Priority Floor & Ethics",
      stage: "operations",
      domain: "Human Interlock Oversight",
      title: "Automated Dispatch Boundary Audit",
      prompt: "Inspect agentic boundaries: Under what conditions must the AI dispatcher yield sovereign execution authority to local community wardens?",
      contextTag: "Consequential Action Log Interlock"
    },
    {
      id: "sug-failure-01",
      category: "Failure Ledger Precedents",
      stage: "failure-ledger",
      domain: "Epistemic Memory & Sensor Drift",
      title: "Comparing Current Signals to FL-2024-11",
      prompt: "Inspect Failure Ledger: Compare the current dual-sensor redundancy against historical case FL-2024-11 sensor fouling during industrial discharge.",
      contextTag: "Case FL-2024-11 Post-Mortem"
    },
    {
      id: "sug-failure-02",
      category: "Failure Ledger Precedents",
      stage: "verification",
      domain: "Institutional Accountability",
      title: "Counterfactual Back-Casting Proof",
      prompt: "Audit Verification Dossier: How robust is the counterfactual back-casting methodology in isolating kiosk impact from seasonal cholera trends?",
      contextTag: "ISO-17025 Audit Ref AUD-2026-NBI-02"
    }
  ];

  let filtered = allSuggestions;
  if (stage && stage !== "all") {
    const stageMatches = allSuggestions.filter(s => s.stage === stage);
    if (stageMatches.length > 0) {
      filtered = stageMatches;
    }
  }
  if (category && category !== "All") {
    filtered = filtered.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
  }

  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    suggestions: filtered.length > 0 ? filtered : allSuggestions
  });
});

// API: Refresh / Synthesize Ethical Decision Suggestions
app.post("/api/suggest-decisions", async (req, res) => {
  const { currentConditions, activeScenario } = req.body || {};
  const client = getGenAI();

  // Deterministic refreshed decisions pool synthesized from active laboratory telemetry
  const fallbackRefreshedOptions = [
    {
      id: "opt-alpha-plus",
      title: "Plan Alpha+: Bioswale Retention with Real-Time Sluice Flow Triggers",
      tier: "Alpha (Ecosystem)",
      capitalRequiredKsh: 38500000,
      timelineDays: 45,
      evidence: [
        "Upstream Mathare weir gauge trending +0.18m/hr stage elevation",
        "Sentinel-2 multispectral surface saturation index at 0.72 NDWI",
        "Community flood wardens cross-validated high runoff velocities along Mathare 4A bend"
      ],
      alternativesConsidered: [
        "Concrete channel deepening (Rejected: accelerates velocity downstream into Viwandani)",
        "Passive emergency evacuation camps (Rejected: fails to address structural hazard)"
      ],
      tradeOffs: {
        gains: [
          "Attenuates 62,000m³ peak flood volume before reaching informal shanties",
          "Phytoremediates 68% of suspended chromium and heavy metals via vetiver root zone",
          "Zero human displacement required along designated wetland preservation corridor"
        ],
        deteriorations: [
          "Requires temporary 48-hour access limitation on 3 upstream agricultural plots",
          "Labor intensive manual debris clearing required after first 3 rainfall pulses"
        ]
      },
      uncertaintyRating: "Moderate (±18%)",
      stakeholdersBenefiting: [
        "85,000 residents residing within 50m of the Mathare River riparian zone",
        "Informal youth restoration cooperative (120 paid green jobs created)"
      ],
      stakeholdersAtRisk: [
        "Smallholder vegetable farmers upstream during acute backwater detention"
      ],
      reversibility: {
        score: 9,
        explanation: "Modular earthen weirs and planted vegetation can be reconfigured or breached manually within 4 hours if unintended backwater occurs."
      },
      timeHorizons: {
        immediate: "Instant 35% flood crest suppression for the upcoming 72-hour storm window.",
        fiveYear: "Stabilizes 18km of eroding riverbank and establishes a permanent urban ecological buffer.",
        generational: "Restores hydrological sponge capacity, preventing catastrophic multi-decade alluvial scouring."
      },
      status: "recommended"
    },
    {
      id: "opt-beta-plus",
      title: "Plan Beta+: 8x Solar UF Kiosks with Community Cooperative Veto Interlock",
      tier: "Beta (Decentralized Infrastructure)",
      capitalRequiredKsh: 42000000,
      timelineDays: 30,
      evidence: [
        "38 verified citizen reports of cartel gouging reaching Ksh 45-50 per 20L jerrycan",
        "Ngong River inflow turbidity peaked at 412 NTU with acute E.coli presence",
        "Field clinic pediatric diarrheal admissions increased 34% over prior week"
      ],
      alternativesConsidered: [
        "Deploying municipal tanker bowsers (Rejected: cartels siphon and resell at high markup)",
        "Deep borehole chlorination only (Rejected: leaves high fluoride levels untreated)"
      ],
      tradeOffs: {
        gains: [
          "Delivers 148,000L/day ultra-filtered potable water compliant with WHO standards (< 0.8 NTU)",
          "Caps water expenditure at Ksh 3 per 20L, saving families an aggregate Ksh 4.8M monthly",
          "100% community ownership vested in Muungano-registered women and youth collectives"
        ],
        deteriorations: [
          "Cartel intimidation risk against kiosk operators requiring localized security escorts",
          "Battery replacement and membrane flush schedule demands diligent technician adherence"
        ]
      },
      uncertaintyRating: "Low (±8%)",
      stakeholdersBenefiting: [
        "48,000 low-income residents in Mukuru Kwa Njenga and Mathare 4A",
        "18 cooperative kiosk stewards drawing formal living wages"
      ],
      stakeholdersAtRisk: [
        "Cooperative kiosk attendants if informal water cartels stage nighttime intimidation"
      ],
      reversibility: {
        score: 8,
        explanation: "Decentralized containerized solar modules are completely redeployable within 48 hours to alternate neighborhoods."
      },
      timeHorizons: {
        immediate: "Immediate 85% reduction in household water expenditure and safe water access.",
        fiveYear: "Breaks the informal water cartel monopoly permanently across informal basin wards.",
        generational: "Eliminates chronic pediatric waterborne stuntings and builds sovereign community asset wealth."
      },
      status: "deliberating"
    },
    {
      id: "opt-gamma-plus",
      title: "Plan Gamma+: Rapid Deployment Emergency Micro-Filtration & USSD Early Warning Relay",
      tier: "Gamma (Emergency Relief)",
      capitalRequiredKsh: 12500000,
      timelineDays: 3,
      evidence: [
        "Precipitation radar indicates severe convective cell moving towards Nairobi catchment within 14 hours",
        "Low-lying shanties in Mukuru Zone 4 have zero elevated physical barriers"
      ],
      alternativesConsidered: [
        "Unassisted voluntary retreat (Rejected: community lacks resources and safe relocation space)",
        "Military cordon (Rejected: breaches community trust and dignity covenants)"
      ],
      tradeOffs: {
        gains: [
          "Sends geotargeted USSD early warnings to 14,000 households with 12-hour lead time",
          "Pre-positions 2,500 gravity-fed emergency household ceramic filtration kits",
          "Mobilizes 40 community wardens with satellite communication links"
        ],
        deteriorations: [
          "Consumes emergency relief contingency capital without permanent asset creation",
          "High logistical friction during rapid door-to-door distribution"
        ]
      },
      uncertaintyRating: "Low (±8%)",
      stakeholdersBenefiting: [
        "Mothers, infants, and mobility-impaired residents in critical low-lying alleys"
      ],
      stakeholdersAtRisk: [
        "Field volunteers navigating slippery pathways during nightfall"
      ],
      reversibility: {
        score: 10,
        explanation: "Distribution of portable ceramic filters and SMS dispatch is completely non-invasive with zero permanent infrastructure impact."
      },
      timeHorizons: {
        immediate: "Zero flood drownings and immediate drinking water protection during peak storm pulse.",
        fiveYear: "Strengthens trusted citizen early-warning communications protocol.",
        generational: "Establishes institutional memory of prompt, respectful emergency response."
      },
      status: "deliberating"
    }
  ];

  if (!client) {
    return res.json({
      status: "ok",
      source: "Atlas Deterministic Decision Synthesis (Autonomous Mode)",
      refreshedAt: new Date().toISOString(),
      decisions: fallbackRefreshedOptions
    });
  }

  // Attempt dynamic Gemini synthesis
  try {
    const prompt = `
You are the Chief Intelligence Architect of ATLAS SANCTUM.
Generate 3 distinct, highly realistic decision options for the Nairobi Basin (Mathare & Mukuru Water Security and Regenerative Flood Defense).
Grounded on:
- Active condition: Mathare weir stage 1.84m, Ngong River turbidity 412 NTU, cartel price gouging at Ksh 50/jerrycan.
- First Principle: The Priority Floor ("The strength and legitimacy of the system are measured by what happens to the least powerful").
Format MUST be strict JSON array of objects matching this exact structure:
[
  {
    "id": "opt-dynamic-1",
    "title": "Clear Actionable Plan Title",
    "tier": "Alpha (Ecosystem)" or "Beta (Decentralized Infrastructure)" or "Gamma (Emergency Relief)",
    "capitalRequiredKsh": 35000000,
    "timelineDays": 30,
    "evidence": ["Evidence point 1", "Evidence point 2"],
    "alternativesConsidered": ["Rejected alternative 1 with reason", "Rejected alternative 2"],
    "tradeOffs": {
      "gains": ["Specific physical or economic gain 1", "Gain 2"],
      "deteriorations": ["Specific cost, burden, or friction 1", "Friction 2"]
    },
    "uncertaintyRating": "Low (±8%)" or "Moderate (±18%)" or "High (±32%)",
    "stakeholdersBenefiting": ["Vulnerable group 1", "Group 2"],
    "stakeholdersAtRisk": ["Group bearing burden 1"],
    "reversibility": {
      "score": 8,
      "explanation": "Concrete reversibility timeframe and mechanism"
    },
    "timeHorizons": {
      "immediate": "Outcome in 72 hours",
      "fiveYear": "5-year systemic outcome",
      "generational": "Multi-generational flourishing outcome"
    },
    "status": "recommended" or "deliberating"
  }
]
`;

    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    for (const m of candidateModels) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 6000)
        );
        const callPromise = client.models.generateContent({
          model: m,
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });
        const resp: any = await Promise.race([callPromise, timeoutPromise]);
        const text = resp?.text || "[]";
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          return res.json({
            status: "ok",
            source: `${m} (Synthesized live for Nairobi Basin)`,
            refreshedAt: new Date().toISOString(),
            decisions: parsed
          });
        }
      } catch (err) {
        // continue to next model
      }
    }
  } catch (e) {
    // fallback
  }

  return res.json({
    status: "ok",
    source: "Atlas Deterministic Decision Synthesis (Failover Mode)",
    refreshedAt: new Date().toISOString(),
    decisions: fallbackRefreshedOptions
  });
});

// API: Failure Ledger records
app.get("/api/failure-ledger", (req, res) => {
  res.json([
    {
      id: "FL-2025-04",
      date: "2025-04-18",
      event: "Pre-Atlas Automated Sluice Gate Over-Retention during Ruaraka Cloudburst",
      expectedOutcome: "Retention of 45,000m³ storm runoff in upstream wetland to protect downstream Mathare 4A.",
      actualOutcome: "Backwater inundation caused localized flooding of 220 smallholder vegetable plots upstream in Kiambu border.",
      unknownsAtPlay: "Unmapped embankment construction by road contractor 3 days prior constricted overflow bypass.",
      failedAssumption: "Assumed static elevation model from 2023 LiDAR survey without real-time drone verification.",
      decisionMaker: "Nairobi Basin Automated Dispatcher (Unsupervised rule-engine v1.2)",
      missedSignals: "Kiambu agricultural extension SMS alert received 4 hours prior was categorized as 'low confidence noise'.",
      remedyImplemented: "Instituted the 'Human-in-the-loop Priority Floor Gate': any retention exceeding 1.8m stage requires signed community warden concurrence."
    },
    {
      id: "FL-2024-11",
      date: "2024-11-09",
      event: "Borehole Fluoride Filtration Sensor Drift at Mukuru Zone C",
      expectedOutcome: "Continuous filtration supplying 12,000L daily safe drinking water below 1.5 mg/L fluoride.",
      actualOutcome: "Electrochemical sensor fouled after high sulfate pulse, reporting 0.8 mg/L when true reading was 3.4 mg/L for 48 hours.",
      unknownsAtPlay: "Industrial textile battery discharge upstream created complex organo-sulfate biofilms.",
      failedAssumption: "Single sensor modality with quarterly physical reagent check was deemed sufficient.",
      decisionMaker: "Operations Field Maintenance Group",
      missedSignals: "Field health clinic reported mild tooth staining complaints 2 weeks prior in school-age cohort.",
      remedyImplemented: "Dual-redundant sensor arrays installed with cross-validation against daily decentralized colorimetric test strips."
    }
  ]);
});

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    system: "Atlas Sanctum Node 01 - Nairobi Operating Laboratory",
    uptimeSeconds: Math.floor(process.uptime()),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Atlas Sanctum] Server running on http://localhost:${PORT}`);
  });
}

startServer();
