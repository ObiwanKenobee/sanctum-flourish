import { 
  TelemetryReading, 
  WorldNode, 
  DecisionOption, 
  CapitalTranche, 
  AgentActionLog, 
  FailureCase, 
  VerificationAudit, 
  GovernancePrinciple,
  GeoJsonRiskCollection,
  CivScaleMilestone,
  CommunitySentimentNode,
  PriorityFloorStatus
} from "../types";

export const INITIAL_TELEMETRY: TelemetryReading[] = [
  {
    id: "gauge-mathare-01",
    name: "Mathare River Upstream Gauging Weir (Node MW-44)",
    type: "IoT Hydrological",
    lat: -1.2612,
    lng: 36.8584,
    value: 1.84,
    unit: "m stage",
    trend: "+0.18 m/hr",
    status: "warning",
    threshold: 2.10,
    confidence: 0.94,
    uncertaintyBand: "±0.06m (optical drift < 3%)",
    provenance: "Solar telemetry node MW-44, WRMA certified, calibration certified 2026-08-12",
    timestamp: "2026-09-18T12:15:00Z",
    historical: [
      { time: "06:00", value: 0.82 },
      { time: "08:00", value: 0.94 },
      { time: "10:00", value: 1.25 },
      { time: "11:00", value: 1.66 },
      { time: "12:00", value: 1.84 }
    ]
  },
  {
    id: "gauge-mukuru-04",
    name: "Ngong River Mukuru Kwa Njenga Inflow (Node NK-12)",
    type: "IoT Turbidity & E.coli Surrogate",
    lat: -1.3142,
    lng: 36.8791,
    value: 412,
    unit: "NTU",
    trend: "rising sharply",
    status: "critical",
    threshold: 250,
    confidence: 0.89,
    uncertaintyBand: "±28 NTU (algal bloom interference factor)",
    provenance: "Safaricom NB-IoT optical probe, authenticated via HMAC-SHA256 hardware token",
    timestamp: "2026-09-18T12:18:22Z",
    historical: [
      { time: "06:00", value: 120 },
      { time: "08:00", value: 165 },
      { time: "10:00", value: 245 },
      { time: "11:00", value: 360 },
      { time: "12:00", value: 412 }
    ]
  },
  {
    id: "satellite-sentinel-2",
    name: "Sentinel-2 MSI Surface Water & Soil Saturation",
    type: "Orbital Multispectral",
    lat: -1.2864,
    lng: 36.8172,
    value: 0.72,
    unit: "NDWI Index",
    trend: "clay soil fully saturated",
    status: "elevated",
    threshold: 0.60,
    confidence: 0.91,
    uncertaintyBand: "Cloud obscuration: 8% over Aberdare catchment headwaters",
    provenance: "ESA Copernicus Open Hub, L2A atmospherically corrected, processed at RCMRD Nairobi",
    timestamp: "2026-09-18T11:45:00Z",
    historical: [
      { time: "00:00", value: 0.45 },
      { time: "04:00", value: 0.52 },
      { time: "08:00", value: 0.61 },
      { time: "10:00", value: 0.68 },
      { time: "12:00", value: 0.72 }
    ]
  },
  {
    id: "community-wardens",
    name: "Mukuru Community Water Wardens Network (140 Monitors)",
    type: "Citizen Field Observation",
    lat: -1.3188,
    lng: 36.8745,
    value: 38,
    unit: "verified price gouging alerts (Ksh 35-50 / 20L)",
    trend: "+140% above baseline municipal tariff",
    status: "critical",
    threshold: 15,
    confidence: 0.96,
    uncertaintyBand: "Cross-verified across 12 independent health volunteer clusters via Muungano",
    provenance: "USSD / SMS Relay server, encrypted sender IDs, geo-hashed to Mukuru Kwa Njenga Ward",
    timestamp: "2026-09-18T12:08:44Z",
    historical: [
      { time: "06:00", value: 4 },
      { time: "08:00", value: 9 },
      { time: "10:00", value: 18 },
      { time: "11:00", value: 29 },
      { time: "12:00", value: 38 }
    ]
  },
  {
    id: "groundwater-aquifer-02",
    name: "Nairobi Volcanic Aquifer Deep Piezometer #09",
    type: "Sub-surface Telemetry",
    lat: -1.2954,
    lng: 36.8329,
    value: 68.4,
    unit: "m below surface",
    trend: "depleting 0.04m/wk",
    status: "nominal",
    threshold: 75.0,
    confidence: 0.98,
    uncertaintyBand: "±0.15m static hydrostatic pressure variance",
    provenance: "WRMA Piezoelectric transducer with daily GSM heartbeat",
    timestamp: "2026-09-18T11:00:00Z",
    historical: [
      { time: "00:00", value: 68.3 },
      { time: "04:00", value: 68.35 },
      { time: "08:00", value: 68.38 },
      { time: "10:00", value: 68.40 },
      { time: "12:00", value: 68.40 }
    ]
  }
];

export const WORLD_MODEL_NODES: WorldNode[] = [
  {
    id: "node-residents-mukuru",
    label: "Mukuru Informal Settlement Families",
    category: "people",
    description: "145,000 residents living along the riparian strip of Ngong River prone to inundation.",
    status: "critical",
    metrics: { "Pop At Risk": "145k", "Avg Daily Water Spend": "Ksh 180 (16% income)" },
    dependencies: ["node-river-ngong", "node-water-kiosks", "node-wardens"],
    vulnerabilities: ["Waterborne pathogens (Vibrio cholerae)", "Riparian flash flooding", "Cartel price extortion"]
  },
  {
    id: "node-river-mathare",
    label: "Mathare River Basin",
    category: "ecosystems",
    description: "Upper riparian corridor receiving unregulated industrial discharge from Ruaraka corridor.",
    status: "stressed",
    metrics: { "Stage": "1.84m", "Dissolved O2": "1.8 mg/L (anoxic)" },
    dependencies: ["node-kiambu-catchment", "node-ruaraka-industry"],
    vulnerabilities: ["Heavy siltation from uphill roadwork", "Culvert trash choke points"]
  },
  {
    id: "node-river-ngong",
    label: "Ngong River Corridor",
    category: "ecosystems",
    description: "Lower basin carrying chemical effluent and flash drainage through Mukuru slums.",
    status: "critical",
    metrics: { "Turbidity": "412 NTU", "Coliform": "18,000 CFU/100ml" },
    dependencies: ["node-river-mathare", "node-industrial-discharge"],
    vulnerabilities: ["Severe chemical shock loads during storm runoff", "Channel constriction"]
  },
  {
    id: "node-kiambu-catchment",
    label: "Kiambu Upper Catchment & Tea Uplands",
    category: "places",
    description: "High-altitude recharge zone determining flash crest volume for Nairobi rivers.",
    status: "resilient",
    metrics: { "Rainfall 24h": "74mm", "Soil Infiltration": "42%" },
    dependencies: [],
    vulnerabilities: ["Rapid land-use conversion to asphalt developments"]
  },
  {
    id: "node-water-kiosks",
    label: "Decentralized Solar UF Kiosks (Pilot Phase)",
    category: "infrastructure",
    description: "4 solar-powered ultrafiltration stations managed as community cooperatives.",
    status: "active",
    metrics: { "Daily Yield": "74,000 L", "Tariff": "Ksh 3 / 20L", "Uptime": "99.4%" },
    dependencies: ["node-capital-tranche-2", "node-community-coop"],
    vulnerabilities: ["Grid independence relies on battery buffer during prolonged cloud cover"]
  },
  {
    id: "node-community-coop",
    label: "Muungano wa Wanavijiji Cooperative",
    category: "institutions",
    description: "Grassroots federation of slum dwellers holding legal equity in water kiosks.",
    status: "resilient",
    metrics: { "Members": "14,200", "Equity Reserve": "Ksh 3.8M" },
    dependencies: ["node-residents-mukuru"],
    vulnerabilities: ["Intimidation by displaced informal water syndicate brokers"]
  },
  {
    id: "node-bioswale-weirs",
    label: "Regenerative Bioswale & Retention Weirs",
    category: "infrastructure",
    description: "Nature-based riparian retention zones absorbing 48,000m³ flood surge and filtering heavy metals.",
    status: "resilient",
    metrics: { "Retention Capacity": "48,000 m³", "Heavy Metal Sequestration": "64%" },
    dependencies: ["node-capital-tranche-1"],
    vulnerabilities: ["Extreme silt accumulation requires bi-annual community desilting"]
  },
  {
    id: "node-cartels",
    label: "Informal Water Syndicates (Displaced)",
    category: "risks",
    description: "Private bowsers and pipe slicers historically extracting monopoly rents from slum residents.",
    status: "stressed",
    metrics: { "Historical Margin": "850%", "Current Disruption": "72% volume lost" },
    dependencies: [],
    vulnerabilities: ["Loss of control over physical pipe access points"]
  },
  {
    id: "node-capital-facility",
    label: "Ksh 85M Nairobi Regeneration Capital Facility",
    category: "capital",
    description: "Blended finance vehicle governed by milestone verification and open citizen audit.",
    status: "active",
    metrics: { "Total Facility": "Ksh 85M", "Disbursed": "Ksh 42.7M", "Audit Rating": "100% Cryptographic Match" },
    dependencies: [],
    vulnerabilities: ["Contractor milestone delays during prolonged rain season"]
  }
];

export const DECISION_OPTIONS: DecisionOption[] = [
  {
    id: "opt-alpha",
    title: "Plan Alpha: Upstream Natural Infrastructure & Actuated Bioswale Retention",
    tier: "Alpha (Ecosystem)",
    capitalRequiredKsh: 24500000,
    timelineDays: 45,
    evidence: [
      "Sentinel-2 hydrological flow routing indicates 48,000m³ peak surge can be attenuated at Kiambu border.",
      "WRMA test boreholes confirm soil recharge rate increases 38% under terraced bioswale filtration.",
      "Community elder testimony confirms historical natural wetlands absorbed pre-1980 storms without slum loss."
    ],
    alternativesConsidered: [
      "Concrete storm channel dredging (Rejected: accelerates downstream flood surge velocity by 2.4x into Mukuru).",
      "Mass temporary relocation (Rejected: creates severe tenure insecurity and economic displacement for 8,500 casual workers)."
    ],
    tradeOffs: {
      gains: [
        "Eliminates flood inundation for 85,000 riparian residents.",
        "Restores 14 hectares of endemic acacia and papyrus wetland buffers.",
        "Generates 320 green stewardship jobs for local youth groups."
      ],
      deteriorations: [
        "Requires periodic mechanical desilting during first two years.",
        "Slight backwater pooling on 4 unoccupied municipal storage plots upstream."
      ]
    },
    uncertaintyRating: "Low (±8%)",
    stakeholdersBenefiting: [
      "Mukuru Kwa Njenga low-lying residents",
      "Mathare 4A community health clinics",
      "Downstream Athi River agricultural irrigators"
    ],
    stakeholdersAtRisk: [
      "Four upstream scrap metal yards situated on unleased riparian buffer who must be relocated."
    ],
    reversibility: {
      score: 8,
      explanation: "Nature-based earthworks can be naturally recontoured or adapted; zero permanent concrete poured in primary wetland channels."
    },
    timeHorizons: {
      immediate: "12-hour surge buffer active within 14 days of weir completion.",
      fiveYear: "Self-sustaining indigenous wetland ecosystem sequestering 240 tons of urban particulate annually.",
      generational: "Permanent restorative floodplain cooling the urban microclimate by 1.8°C."
    },
    status: "recommended"
  },
  {
    id: "opt-beta",
    title: "Plan Beta: Decentralized Solar Ultrafiltration Kiosks with Community Equity",
    tier: "Beta (Decentralized Infrastructure)",
    capitalRequiredKsh: 18200000,
    timelineDays: 21,
    evidence: [
      "Borehole salinity and coliform testing shows ultrafiltration + UV reduces pathogen count to 0 CFU/100ml.",
      "Pilot Kiosk #1 demonstrated 72,000L daily throughput at Ksh 3 per 20L, sustaining 100% cost recovery.",
      "12 women-led micro-savings groups successfully established bank accounts for cooperative equity dividend."
    ],
    alternativesConsidered: [
      "Extension of centralized municipal piped network (Rejected: estimated 18 months procurement delay and historical vulnerability to cartel pipe slicing).",
      "Subsidized water vouchers for commercial bowsers (Rejected: enriches cartels without leaving community assets)."
    ],
    tradeOffs: {
      gains: [
        "Drops average household water expenditure from Ksh 180/day to Ksh 24/day (saving Ksh 4,680/month).",
        "Directly breaks the cartel extortion monopoly across 4 informal settlements.",
        "Generates community cooperative surplus for local school scholarship funds."
      ],
      deteriorations: [
        "Initial friction and security risk from displaced cartel operatives requiring cooperative guard patrols.",
        "Battery replacement overhead at Year 4."
      ]
    },
    uncertaintyRating: "Low (±8%)",
    stakeholdersBenefiting: [
      "18,500 informal settlement households (primary beneficiaries: women and young children).",
      "Local schools and dispensaries who receive free piped surplus."
    ],
    stakeholdersAtRisk: [
      "Informal water vendors whose margins are eliminated (mitigated by offering operator employment at new kiosks)."
    ],
    reversibility: {
      score: 9,
      explanation: "Modular containerized skid units can be relocated within 48 hours if city planning zones change."
    },
    timeHorizons: {
      immediate: "Safe potable water available within 10 days of commissioning.",
      fiveYear: "Cooperative asset fully amortized with surplus funding community maternity clinics.",
      generational: "Eradication of endemic pediatric cholera in the Mukuru basin."
    },
    status: "recommended"
  },
  {
    id: "opt-gamma",
    title: "Plan Gamma: Emergency Evacuation Centers & Diesel Purification Trucks",
    tier: "Gamma (Emergency Relief)",
    capitalRequiredKsh: 7800000,
    timelineDays: 3,
    evidence: [
      "Kenya Red Cross standard operational protocols for acute seasonal displaced persons.",
      "Emergency diesel bowsers can mobilize within 6 hours of flood crest warning."
    ],
    alternativesConsidered: [
      "Do nothing and rely on spontaneous self-evacuation (Rejected: severe risk of casualties and asset looting)."
    ],
    tradeOffs: {
      gains: [
        "Rapid immediate life-safety evacuation for up to 6,000 residents in acute danger.",
        "Short-term provisioning of clean drinking water packets."
      ],
      deteriorations: [
        "Consumes Ksh 7.8M with zero lasting infrastructure, community equity, or regenerative capacity.",
        "Overcrowded emergency shelters create acute respiratory and sanitation risks.",
        "High carbon footprint from diesel generators and transport."
      ]
    },
    uncertaintyRating: "High (±32%)",
    stakeholdersBenefiting: [
      "Acute flood victims during peak 72-hour crest."
    ],
    stakeholdersAtRisk: [
      "Informal residents whose unattended shanties are vandalized during displacement.",
      "Taxpayers who fund recurrent emergency cycles every rainy season."
    ],
    reversibility: {
      score: 10,
      explanation: "Completely transient emergency intervention; ceases once funding expires."
    },
    timeHorizons: {
      immediate: "Stops acute drowning casualties for 3-5 days.",
      fiveYear: "Zero residual value; cycles of vulnerability repeat every November and April.",
      generational: "Entrenches dependence on external disaster aid."
    },
    status: "deliberating"
  }
];

export const CAPITAL_TRANCHES: CapitalTranche[] = [
  {
    id: "tranche-01",
    milestoneTitle: "Phase 1: Hydrological In-Situ Telemetry & Bioswale Civil Earthworks",
    amountKsh: 24500000,
    status: "unlocked_verified",
    recipient: "Muungano Youth Earthworks Trust & EarthTech Kenya Ltd",
    verificationTrigger: "Installation of 5 calibrated gauging weirs + excavation of 48,000m³ retention swale verified by satellite LiDAR.",
    verifiedEvidence: "ESA Copernicus Sentinel-2 MSI NDWI delta verified 2026-08-28. WRMA sensor telemetry online with 99.8% heartbeat.",
    unlockedAt: "2026-08-30",
    expenditureLedger: [
      {
        item: "Hydrological IoT Weirs & Safaricom NB-IoT Transceivers (5 Units)",
        costKsh: 3400000,
        vendor: "Silicon Savanna Telemetry Ltd",
        cryptoHash: "0x4f8a29b...e71c",
        citizenAuditApproved: true
      },
      {
        item: "Riparian Earthmoving & Terraced Swale Grading (14 Hectares)",
        costKsh: 14200000,
        vendor: "Muungano Youth Cooperative Earthworks",
        cryptoHash: "0x89d2c11...904b",
        citizenAuditApproved: true
      },
      {
        item: "Endemic Papyrus & Vetiver Grass Bioremediation Seedlings (65,000 sprigs)",
        costKsh: 2800000,
        vendor: "Kenya Forestry Research Institute (KEFRI)",
        cryptoHash: "0x12bfa88...4490",
        citizenAuditApproved: true
      },
      {
        item: "Third-Party Hydrological Geotechnical Audit & Sentinel Ground-Truthing",
        costKsh: 4100000,
        vendor: "University of Nairobi Civil & Biosystems Engineering",
        cryptoHash: "0x98ca301...12ff",
        citizenAuditApproved: true
      }
    ]
  },
  {
    id: "tranche-02",
    milestoneTitle: "Phase 2: Eight Solar Ultrafiltration Kiosks & Smart Distribution Rings",
    amountKsh: 32000000,
    status: "active_in_progress",
    recipient: "Mukuru Women Community Water Cooperative",
    verificationTrigger: "Commissioning of 8 solar stations delivering water below 1.0 NTU and 0 CFU coliforms, sustained for 14 continuous days.",
    verifiedEvidence: "Currently 4 of 8 stations operational. Average 74,000L daily verified by IoT water meters. Remaining 4 stations at 75% build.",
    expenditureLedger: [
      {
        item: "Containerized Solar UF Filtration Skid Units (8x 20kL/day)",
        costKsh: 19800000,
        vendor: "AquaSolar Africa Engineering",
        cryptoHash: "0x37a44f2...c889",
        citizenAuditApproved: true
      },
      {
        item: "Bifacial Solar PV Rooftops + LFP Battery Energy Storage (48 kWh)",
        costKsh: 6800000,
        vendor: "Strathmore Energy Research Centre",
        cryptoHash: "0x77c901e...441a",
        citizenAuditApproved: true
      },
      {
        item: "RFID Smart Dispenser Tap Heads with M-Pesa / Offline NFC Card Reader",
        costKsh: 2400000,
        vendor: "PawaBoda Technologies",
        cryptoHash: "0x55d812a...77b3",
        citizenAuditApproved: true
      },
      {
        item: "Community Cooperative Governance & Financial Accounting Training (120 women)",
        costKsh: 3000000,
        vendor: "Muungano Development Trust",
        cryptoHash: "0x61f9b30...2284",
        citizenAuditApproved: true
      }
    ]
  },
  {
    id: "tranche-03",
    milestoneTitle: "Phase 3: Deep Wetland Regeneration & Agroforestry Buffer Corridor",
    amountKsh: 28500000,
    status: "locked_pending_milestone",
    recipient: "Nairobi River Basin Community Land Trust",
    verificationTrigger: "Demonstrated 0 flood casualties and 50% reduction in downstream chemical biological oxygen demand (BOD) over 2026/27 seasons.",
    expenditureLedger: []
  }
];

export const AGENT_ACTION_LOGS: AgentActionLog[] = [
  {
    id: "act-hydro-882",
    agentName: "HydroWatch-07",
    agentRole: "Real-Time Inflow Telemetry & Flood Anomaly Detection",
    boundedAuthority: "Alert broadcast to wardens, telemetry cross-checking. STRICT PROHIBITION: Cannot actuate physical sluice gates without signed human engineer token.",
    timestamp: "2026-09-18T12:16:30Z",
    intent: "Detect upstream flash crest following 74mm downpour in Kiambu catchment.",
    authorization: "Protocol NMWEA-RULE-04 (Autonomous Telemetry Ingestion)",
    action: "Dispatched automated early flood warning to 140 community wardens in Swahili and English via USSD relay.",
    actor: "HydroWatch-07 Agent v2.4 (Model: Gemini 3.8 Flash Systems Node)",
    evidence: "Weir MW-44 stage increased from 0.82m to 1.84m in 6 hours; Sentinel-2 NDWI verified soil saturation at 0.72.",
    result: "success",
    selfReflection: {
      attempted: "Cross-correlated upstream sensor delta with radar rainfall forecast and alerted ground monitors.",
      why: "Lead time of 6-12 hours is vital for families in low-lying Mukuru Kwa Njenga shanties to elevate critical household goods.",
      authorityHeld: "Autonomous level 2: Broadcast alerts and trigger diagnostic ping.",
      outcome: "140 wardens acknowledged receipt within 4 minutes. Zero physical gate actuation attempted.",
      failureOrLimitation: "Two telemetry packets from Weir NK-12 had 180ms latency jitter due to cellular tower congestion.",
      requiredHumanRole: "County Chief Hydrologist must authorize physical bioswale bypass gate opening if stage reaches 2.10m."
    }
  },
  {
    id: "act-bilingual-401",
    agentName: "Sauti-Warden Bilingual Dispatcher",
    agentRole: "Vernacular Communication & Citizen Telemetry Synthesizer",
    boundedAuthority: "Bi-directional SMS / USSD messaging with community volunteers in Swahili and Sheng. No personal identifiable information (PII) stored or broadcast.",
    timestamp: "2026-09-18T12:12:10Z",
    intent: "Translate technical hydrological risk indexes into actionable community guidance: 'Maji yanaongezeka kwa mto Mathare. Weka vitu juu na fuata njia za usalama.'",
    authorization: "Charter Axiom 10 (Priority Floor Vernacular Transparency)",
    action: "Broadcasted localized Swahili voice and SMS advisory to 12 school headmasters and 4 clinic administrators.",
    actor: "Sauti-Warden Agent v1.8",
    evidence: "Weir MW-44 approaching 1.84m stage threshold.",
    result: "success",
    selfReflection: {
      attempted: "Translated hydrologic hazard index into accessible, jargon-free Swahili advisory.",
      why: "Technical meters and probability distributions cause panic or apathy unless framed in immediate practical terms.",
      authorityHeld: "Advisory broadcast within pre-approved community health lexicon.",
      outcome: "16 institutional coordinators acknowledged and readied dry evacuation halls.",
      failureOrLimitation: "Dialect nuance: 2 elder respondents requested voice audio rather than text SMS.",
      requiredHumanRole: "Community health supervisor confirmed local clinic bed availability."
    }
  },
  {
    id: "act-gate-override-02",
    agentName: "Bioswale Actuator Sentinel",
    agentRole: "Riparian Retention Sluice Telemetry & Mechanical Health",
    boundedAuthority: "Zero autonomous gate actuation. Monitors hydraulic pressure and proposes actuation parameters to human operator.",
    timestamp: "2026-09-18T11:50:00Z",
    intent: "Evaluate whether to actuate Sluice Gate #3 to divert 18,000m³ into the newly constructed micro-wetland basin.",
    authorization: "System Protocol SAFE-STOP-01",
    action: "Generated recommendation ticket for Engineer J. Kariuki with full trade-off matrix; withheld autonomous actuation.",
    actor: "Bioswale Actuator Sentinel v3.1",
    evidence: "Kiambu runoff surge ETA 2 hours. Basin currently dry with 92% absorption readiness.",
    result: "escalated_to_human",
    selfReflection: {
      attempted: "Calculated optimal diversion rate (12.4 m³/s) and presented actuation checklist to licensed operator.",
      why: "Unsupervised actuation in 2025 caused backwater flooding in Kiambu (Failure Ledger FL-2025-04). Autonomous actuation is strictly barred.",
      authorityHeld: "Advisory only. Physical circuit interlock requires physical cryptographic keycard.",
      outcome: "Ticket created and dispatched to mobile control tablet of Engineer Kariuki.",
      failureOrLimitation: "Human response latency took 8 minutes due to field transit.",
      requiredHumanRole: "Human engineer physical verification of downstream fishway and livestock presence before gate opening."
    }
  }
];

export const FAILURE_LEDGER: FailureCase[] = [
  {
    id: "FL-2025-04",
    date: "2025-04-18",
    event: "Pre-Atlas Automated Sluice Gate Over-Retention during Ruaraka Cloudburst",
    expectedOutcome: "Retention of 45,000m³ storm runoff in upstream wetland to protect downstream Mathare 4A from flash flooding.",
    actualOutcome: "Backwater inundation caused localized flooding of 220 smallholder vegetable plots on Kiambu border, destroying Ksh 2.8M in crops.",
    unknownsAtPlay: "Unmapped embankment construction by road contractor 3 days prior severely constricted the secondary overflow bypass culvert.",
    failedAssumption: "Assumed static digital elevation model (DEM) from 2023 aerial survey was still valid without real-time drone verification.",
    decisionMaker: "Nairobi Basin Automated Dispatcher (Legacy unsupervised rule-engine v1.2)",
    missedSignals: "Kiambu agricultural extension SMS alert received 4 hours prior was filtered out as 'low-confidence noise' by naive threshold.",
    remedyImplemented: "Instituted the 'Human-in-the-Loop Priority Floor Gate': any retention exceeding 1.8m stage requires signed community warden concurrence and physical drone ortho-check.",
    category: "Hydrological"
  },
  {
    id: "FL-2024-11",
    date: "2024-11-09",
    event: "Borehole Fluoride & Heavy Metal Sensor Drift at Mukuru Zone C",
    expectedOutcome: "Continuous automated monitoring supplying 12,000L daily safe drinking water below 1.5 mg/L fluoride standard.",
    actualOutcome: "Electrochemical sensor fouled under high sulfate industrial pulse, erroneously reporting 0.8 mg/L when true reading was 3.4 mg/L for 48 hours.",
    unknownsAtPlay: "Upstream textile battery wash discharged complex organo-sulfates that coated the ion-selective electrode membrane.",
    failedAssumption: "Single sensor modality with quarterly manual calibration was deemed sufficient for complex informal industrial waterways.",
    decisionMaker: "Operations Field Maintenance Group",
    missedSignals: "Field health dispensary reported mild pediatric gastrointestinal complaints that were not integrated into the telemetry loop.",
    remedyImplemented: "Dual-redundant multi-modal sensor arrays installed (optical spectrometer + electrochemical) with cross-validation against daily citizen colorimetric test strips.",
    category: "Sensor Drift"
  },
  {
    id: "FL-2024-06",
    date: "2024-06-03",
    event: "Informal Water Syndicate Pipe Slicing Sabotage in Ward 8",
    expectedOutcome: "Gravity-fed municipal distribution line to deliver subsidized water to 3 community kiosks.",
    actualOutcome: "Syndicate operatives severed the PVC line within 36 hours of commissioning, routing water into private bowsers and billing residents Ksh 50/jerrycan.",
    unknownsAtPlay: "Political patronage networks protecting informal water cartels were not mapped as active institutional stakeholders.",
    failedAssumption: "Believed technical infrastructure provisioning alone would overcome violent informal economic cartels.",
    decisionMaker: "Municipal Piped Water Taskforce",
    missedSignals: "Community warnings regarding syndicate threats to local plumbers were disregarded as 'informal rumors'.",
    remedyImplemented: "Shifted entirely to containerized, on-site solar borehole ultrafiltration with direct community cooperative equity ownership and 24/7 community warden guard stewardship.",
    category: "Socio-Economic"
  }
];

export const VERIFICATION_AUDITS: VerificationAudit[] = [
  {
    id: "VER-2026-08",
    intervention: "Plan Alpha: Phase 1 Bioswale Natural Infrastructure",
    indicator: "Peak flood stage attenuation & heavy metal bioremediation",
    baseline: "Pre-intervention peak stage: 3.2m with 650 houses flooded in 2024 Long Rains.",
    achievedOutcome: "Attenuated peak stage to 1.84m; zero houses flooded; 68% reduction in lead/cadmium indices downstream.",
    empiricalMethod: "Dual-weir differential stage telemetry + atomic absorption spectroscopy by University of Nairobi laboratory.",
    thirdPartyInspector: "Prof. D. Ochieng, Department of Environmental Biosystems Engineering, UoN",
    cryptographicHash: "0xa81ef932840b271d4e08c991a34b22e7f80459c03381a5e4d9b1c76251ef0021",
    confidenceScore: 0.96,
    dateVerified: "2026-08-28",
    counterFactualAnalysis: "Hydrological back-casting model confirms without bioswale weir retention, Mathare 4A would have suffered 1.2m standing floodwater on August 15.",
    longitudinalTrend: [
      { day: "D01", date: "Aug 15", counterfactualBaseline: 1.40, monitoredValue: 1.35, lowerBound: 1.31, upperBound: 1.39, unit: "m stage", eventMarker: "Antecedent Baseflow" },
      { day: "D02", date: "Aug 16", counterfactualBaseline: 1.55, monitoredValue: 1.42, lowerBound: 1.38, upperBound: 1.46, unit: "m stage" },
      { day: "D03", date: "Aug 17", counterfactualBaseline: 1.80, monitoredValue: 1.50, lowerBound: 1.45, upperBound: 1.55, unit: "m stage", eventMarker: "Kiambu Storm Pulse Initiates" },
      { day: "D04", date: "Aug 18", counterfactualBaseline: 2.25, monitoredValue: 1.62, lowerBound: 1.56, upperBound: 1.68, unit: "m stage" },
      { day: "D05", date: "Aug 19", counterfactualBaseline: 2.70, monitoredValue: 1.74, lowerBound: 1.67, upperBound: 1.81, unit: "m stage", eventMarker: "Bioswale Sluice Diversion Active" },
      { day: "D06", date: "Aug 20", counterfactualBaseline: 3.18, monitoredValue: 1.84, lowerBound: 1.78, upperBound: 1.90, unit: "m stage", eventMarker: "Peak Catchment Flood Crest" },
      { day: "D07", date: "Aug 21", counterfactualBaseline: 3.05, monitoredValue: 1.80, lowerBound: 1.73, upperBound: 1.87, unit: "m stage" },
      { day: "D08", date: "Aug 22", counterfactualBaseline: 2.65, monitoredValue: 1.72, lowerBound: 1.65, upperBound: 1.79, unit: "m stage", eventMarker: "Micro-Wetland Bioremediation" },
      { day: "D09", date: "Aug 23", counterfactualBaseline: 2.30, monitoredValue: 1.60, lowerBound: 1.54, upperBound: 1.66, unit: "m stage" },
      { day: "D10", date: "Aug 24", counterfactualBaseline: 1.95, monitoredValue: 1.48, lowerBound: 1.42, upperBound: 1.54, unit: "m stage" },
      { day: "D11", date: "Aug 25", counterfactualBaseline: 1.70, monitoredValue: 1.38, lowerBound: 1.33, upperBound: 1.43, unit: "m stage" },
      { day: "D12", date: "Aug 26", counterfactualBaseline: 1.50, monitoredValue: 1.30, lowerBound: 1.25, upperBound: 1.35, unit: "m stage" },
      { day: "D13", date: "Aug 27", counterfactualBaseline: 1.42, monitoredValue: 1.25, lowerBound: 1.20, upperBound: 1.30, unit: "m stage" },
      { day: "D14", date: "Aug 28", counterfactualBaseline: 1.38, monitoredValue: 1.20, lowerBound: 1.15, upperBound: 1.25, unit: "m stage", eventMarker: "UoN Spectrometry Audit Sign-off" }
    ]
  },
  {
    id: "VER-2026-09",
    intervention: "Plan Beta: Mukuru Solar Ultrafiltration Cooperative Kiosks (Stations 1-4)",
    indicator: "Household water affordability & pediatric diarrheal incidence",
    baseline: "Water price: Ksh 35-50 / 20L jerrycan; 42 pediatric waterborne cases/week at Mukuru Dispensary.",
    achievedOutcome: "Water price dropped to Ksh 3 / 20L (72% economic burden reduction); clinic cases dropped to 3 cases/week.",
    empiricalMethod: "Independent household survey of 1,200 families by Muungano wa Wanavijiji + Ministry of Health clinical log audit.",
    thirdPartyInspector: "Dr. Miriam Wambui, Kenya Medical Research Institute (KEMRI)",
    cryptographicHash: "0x77c22904b810dcf9104085e6612b774019a823e54b6691c9802e3341b590013d",
    confidenceScore: 0.98,
    dateVerified: "2026-09-10",
    counterFactualAnalysis: "Socio-economic control cohort in unserviced adjacent zone showed water prices surged to Ksh 60 during same period due to cartel scarcity extortion.",
    longitudinalTrend: [
      { day: "D01", date: "Aug 28", counterfactualBaseline: 42, monitoredValue: 38, lowerBound: 35, upperBound: 41, unit: "Weekly Clinic Cases", eventMarker: "Coop Kiosk Commissioning" },
      { day: "D02", date: "Aug 29", counterfactualBaseline: 43, monitoredValue: 32, lowerBound: 29, upperBound: 35, unit: "Weekly Clinic Cases" },
      { day: "D03", date: "Aug 30", counterfactualBaseline: 41, monitoredValue: 26, lowerBound: 23, upperBound: 29, unit: "Weekly Clinic Cases" },
      { day: "D04", date: "Aug 31", counterfactualBaseline: 44, monitoredValue: 21, lowerBound: 18, upperBound: 24, unit: "Weekly Clinic Cases", eventMarker: "Water Quality <0.5 NTU Verified" },
      { day: "D05", date: "Sep 01", counterfactualBaseline: 46, monitoredValue: 17, lowerBound: 14, upperBound: 20, unit: "Weekly Clinic Cases" },
      { day: "D06", date: "Sep 02", counterfactualBaseline: 45, monitoredValue: 14, lowerBound: 11, upperBound: 17, unit: "Weekly Clinic Cases" },
      { day: "D07", date: "Sep 03", counterfactualBaseline: 48, monitoredValue: 11, lowerBound: 9, upperBound: 13, unit: "Weekly Clinic Cases", eventMarker: "Cartel Tariff Collapses" },
      { day: "D08", date: "Sep 04", counterfactualBaseline: 47, monitoredValue: 9, lowerBound: 7, upperBound: 11, unit: "Weekly Clinic Cases" },
      { day: "D09", date: "Sep 05", counterfactualBaseline: 49, monitoredValue: 7, lowerBound: 5, upperBound: 9, unit: "Weekly Clinic Cases" },
      { day: "D10", date: "Sep 06", counterfactualBaseline: 52, monitoredValue: 6, lowerBound: 4, upperBound: 8, unit: "Weekly Clinic Cases" },
      { day: "D11", date: "Sep 07", counterfactualBaseline: 50, monitoredValue: 5, lowerBound: 3, upperBound: 7, unit: "Weekly Clinic Cases" },
      { day: "D12", date: "Sep 08", counterfactualBaseline: 48, monitoredValue: 4, lowerBound: 2, upperBound: 6, unit: "Weekly Clinic Cases" },
      { day: "D13", date: "Sep 09", counterfactualBaseline: 49, monitoredValue: 4, lowerBound: 2, upperBound: 6, unit: "Weekly Clinic Cases" },
      { day: "D14", date: "Sep 10", counterfactualBaseline: 51, monitoredValue: 3, lowerBound: 1, upperBound: 5, unit: "Weekly Clinic Cases", eventMarker: "KEMRI Epidemiological Audit Sign-off" }
    ]
  }
];

export const NAIROBI_GEOJSON_RISKS: GeoJsonRiskCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "feat-flood-mathare",
      geometry: {
        type: "Point",
        coordinates: [36.8584, -1.2612]
      },
      properties: {
        id: "RISK-FLD-01",
        name: "Mathare 4A Riparian Inundation Corridor",
        riskType: "flood_inundation",
        severity: "critical",
        headline: "High River Stage Threatening 85,000 Riparian Dwellers",
        detail: "Current stage at Weir MW-44 is 1.84m (critical threshold 2.10m). Backwater pooling at Juja Road railway embankment could overtop informal dykes within 6 hours.",
        affectedPopulation: 85000,
        sensorId: "gauge-mathare-01",
        mitigationAction: "Prepare Bioswale Sluice diversion buffer #3; notify 140 community wardens via USSD.",
        timestamp: "2026-09-18T12:15:00Z"
      }
    },
    {
      type: "Feature",
      id: "feat-effluent-ruaraka",
      geometry: {
        type: "Point",
        coordinates: [36.8675, -1.2480]
      },
      properties: {
        id: "RISK-IND-02",
        name: "Ruaraka Industrial Tannery Effluent Plume",
        riskType: "industrial_plume",
        severity: "severe",
        headline: "Midnight Chromium & Organo-Sulfate Pulse Detected",
        detail: "Spectrometer node detected surge to 412 NTU and elevated heavy metal chelates discharging from industrial estate bypass into tributary.",
        affectedPopulation: 42000,
        sensorId: "spectro-ruaraka-02",
        mitigationAction: "Actuate wetland bio-retention swales to filter heavy metals; alert National Environment Management Authority (NEMA).",
        timestamp: "2026-09-18T11:45:00Z"
      }
    },
    {
      type: "Feature",
      id: "feat-pathogen-mukuru",
      geometry: {
        type: "Point",
        coordinates: [36.8795, -1.3120]
      },
      properties: {
        id: "RISK-PAT-03",
        name: "Mukuru Kwa Njenga Informal Drain Cross-Contamination",
        riskType: "pathogen_hotspot",
        severity: "warning",
        headline: "Perched Water Table Surface Runoff Risk",
        detail: "Unpaved open stormwater ditch adjacent to informal settlement overflowing into secondary footpaths; E. coli surrogate reading elevated.",
        affectedPopulation: 120000,
        sensorId: "ecoli-mukuru-03",
        mitigationAction: "Route clean water via Solar UF Kiosks 1-4; broadcast boiling & disinfection SMS advisory.",
        timestamp: "2026-09-18T10:30:00Z"
      }
    },
    {
      type: "Feature",
      id: "feat-landslide-dandora",
      geometry: {
        type: "Point",
        coordinates: [36.8950, -1.2520]
      },
      properties: {
        id: "RISK-GEO-04",
        name: "Dandora River Escarpment Quarry Slope Hazard",
        riskType: "landslide_hazard",
        severity: "warning",
        headline: "Soil Saturation Exceeding Shear Failure Threshold",
        detail: "Antecedent precipitation index at 42mm has saturated fractured volcanic tuff along Dandora quarry edge; risk of localized bank slumping.",
        affectedPopulation: 18000,
        sensorId: "radar-orbital-04",
        mitigationAction: "Establish 30-meter exclusion tape along unstable rim; re-route pedestrian livestock path.",
        timestamp: "2026-09-18T09:10:00Z"
      }
    },
    {
      type: "Feature",
      id: "feat-cartel-viwandani",
      geometry: {
        type: "Point",
        coordinates: [36.8650, -1.3050]
      },
      properties: {
        id: "RISK-ECO-05",
        name: "Gikomba-Viwandani Water Syndicate Extortion Route",
        riskType: "cartel_extortion",
        severity: "advisory",
        headline: "Syndicate Water Bowsers Attempting Monopoly Markup",
        detail: "Informal cartel operators charging Ksh 40-50 per 20L jerrycan in perimeter sectors unreached by cooperative kiosks.",
        affectedPopulation: 65000,
        sensorId: "citizen-sms-05",
        mitigationAction: "Deploy mobile trailer-mounted solar purification pod to Ward 7 cooperative pickup point.",
        timestamp: "2026-09-18T08:00:00Z"
      }
    }
  ]
};

export const GOVERNANCE_PRINCIPLES: GovernancePrinciple[] = [
  {
    id: "GOV-01",
    axiom: "Human Dignity & Priority Floor: The system's strength is measured by what happens to the person with the least power.",
    status: "guaranteed",
    prohibition: "Strictly forbids prioritizing commercial or high-value assets over informal settlement human life and shelter.",
    challengeMechanism: "Direct USSD hotline & community warden veto that immediately halts any automated upstream retention action.",
    lastAuditDate: "2026-09-01"
  },
  {
    id: "GOV-02",
    axiom: "Truthfulness & Non-Prophetic Simulation: Never present simulations or probabilistic models as prophecy.",
    status: "guaranteed",
    prohibition: "Forbids displaying predictive charts without explicit confidence intervals, underlying assumptions, and stated unknowns.",
    challengeMechanism: "Mandatory public audit toggle exposing all raw parameters, sensor noise, and epistemic gaps.",
    lastAuditDate: "2026-09-05"
  },
  {
    id: "GOV-03",
    axiom: "Anti-Surveillance & Community Agency: Zero unconsented individual tracking or discriminatory optimization.",
    status: "guaranteed",
    prohibition: "No facial recognition, no individual device tracking, and no biometric logging at water distribution kiosks.",
    challengeMechanism: "Independent data custody trustee review panel with Muungano wa Wanavijiji representatives holding encryption keys.",
    lastAuditDate: "2026-09-12"
  },
  {
    id: "GOV-04",
    axiom: "Radical Transparency & The Failure Covenant: Every failure must become immutable institutional memory.",
    status: "guaranteed",
    prohibition: "Prohibits deleting, modifying, or retroactively sanitizing any operational incident, missed signal, or model error.",
    challengeMechanism: "Public append-only Failure Ledger cryptographically anchored to distributed public timestamps.",
    lastAuditDate: "2026-09-14"
  }
];

export const CIV_SCALE_MILESTONES: CivScaleMilestone[] = [
  {
    id: "MS-2021-01",
    year: 2021,
    period: "historical",
    date: "November 2021",
    title: "Mathare Inundation & Informal Water Price Spike",
    category: "community",
    status: "verified_completed",
    description: "Catastrophic 2.4m flood crest inundated 1,400 households; private water cartels hiked 20L jerrycans from Ksh 5 to Ksh 45, triggering acute waterborne disease outbreak.",
    agencyYield: "Catalyzed Muungano wa Wanavijiji citizen hydrology telemetry network",
    physicalMetric: "Peak stage: 2.42m | 82,000 citizens affected",
    provenanceSource: "Independent Red Cross & Ward 4A Elder Minutes #2021-11"
  },
  {
    id: "MS-2023-01",
    year: 2023,
    period: "historical",
    date: "April 2023",
    title: "Nairobi Basin Citizen Hydrology Accord",
    category: "governance",
    status: "verified_completed",
    description: "Multi-ward coalition established non-state hydrological monitoring across Mathare, Mukuru, and Ngong rivers to eliminate government data blackout.",
    agencyYield: "140 Community Wardens equipped with calibrated SMS telemetry kits",
    physicalMetric: "18 real-time water-level gauging stations online",
    provenanceSource: "Kenya Water Resources Authority & Community Baraza Charter"
  },
  {
    id: "MS-2024-02",
    year: 2024,
    period: "historical",
    date: "September 2024",
    title: "Upstream Ruaraka Industrial Discharge Prosecution",
    category: "ecological",
    status: "verified_completed",
    description: "Citizen water sampling proved persistent illegal midnight chromium and sulfate dumping from 4 commercial tanneries, resulting in formal NEMA regulatory sanctions.",
    agencyYield: "First court-admissible community atomic spectrometry dataset",
    physicalMetric: "Cr(VI) drop from 0.84 mg/L to 0.18 mg/L post-sanction",
    provenanceSource: "University of Nairobi Environmental Chemistry Lab #UON-2024-99"
  },
  {
    id: "MS-2025-01",
    year: 2025,
    period: "historical",
    date: "March 2025",
    title: "Phase 1 Bioswale Natural Infrastructure Commissioning",
    category: "ecological",
    status: "verified_completed",
    description: "Excavated and vegetated 14 hectares of native vetiver and typha wetland bio-retention cells upstream of Mathare 4A to absorb peak flood pulses.",
    agencyYield: "100% community labor and youth cooperative stewardship",
    physicalMetric: "48,000 m³ retention buffer | 1.36m flood attenuation",
    provenanceSource: "Verified Hydrodynamic LIDAR & Satellite Sentinel-2 NDWI"
  },
  {
    id: "MS-2026-01",
    year: 2026,
    period: "current",
    date: "August 2026",
    title: "Plan Beta: 4x Solar Ultrafiltration Kiosks Go Live",
    category: "infrastructure",
    status: "in_progress",
    description: "Commissioned 4 distributed 2.5kW solar UF kiosks providing community-owned drinking water at guaranteed flat rate of Ksh 2.00 / 20L.",
    agencyYield: "Water cartel revenues in Viwandani collapsed by 68%",
    physicalMetric: "74,000 Liters/day produced at < 1.2 NTU potability",
    provenanceSource: "Cryptographic smart meter telemetry #SOLAR-UF-K1..K4"
  },
  {
    id: "MS-2027-01",
    year: 2027,
    period: "strategic_future",
    date: "Q2 2027",
    title: "Basin Riparian Buffer 30m Protection Enforcement",
    category: "governance",
    status: "mandated_deadline",
    description: "Statutory deadline for industrial and real-estate boundary enforcement along 42km of riparian corridor, converting illegal waste dumps into civic parkways.",
    agencyYield: "Co-management rights transferred to local riparian conservation trusts",
    physicalMetric: "Zero unpermitted industrial outfalls across main stem",
    provenanceSource: "Nairobi County Urban Resilience Framework 2027 Mandate",
    isZoomCritical: true
  },
  {
    id: "MS-2029-01",
    year: 2029,
    period: "strategic_future",
    date: "Q4 2029",
    title: "Basin-Wide Decentralized Water Sovereignty (12 Kiosks)",
    category: "infrastructure",
    status: "mandated_deadline",
    description: "Scale solar UF kiosk network to 12 autonomous micro-nodes across all high-density wards, guaranteeing 40 Liters/capita/day potable access.",
    agencyYield: "185,000 residents completely freed from informal cartel extortion",
    physicalMetric: "240,000 Liters/day clean water capacity independent of central grid",
    provenanceSource: "Atlas Tranche Gamma Capital Architecture Plan"
  },
  {
    id: "MS-2032-01",
    year: 2032,
    period: "strategic_future",
    date: "Q1 2032",
    title: "Comprehensive Phytoremediation Canopy & Fish Stock Recovery",
    category: "ecological",
    status: "tail_risk_horizon",
    description: "Full maturation of 85-hectare riparian forest belt. Target recovery of indigenous tilapia and benthic macroinvertebrates in mid-stream sections.",
    agencyYield: "Ecological commons generating urban microclimate cooling and foraging",
    physicalMetric: "Dissolved Oxygen sustained > 5.5 mg/L | Heavy metals undetectable",
    provenanceSource: "UNEP East African Urban Catchment Long-Term Modeling",
    isZoomCritical: true
  },
  {
    id: "MS-2035-01",
    year: 2035,
    period: "strategic_future",
    date: "Q3 2035",
    title: "Zero-Casualty 100-Year Climate Flood Resilience Standard",
    category: "community",
    status: "tail_risk_horizon",
    description: "Fully coupled bioswales, distributed detention vaults, and AI-coordinated early warning ensuring zero lives lost in extreme 1-in-100-year rainfall events.",
    agencyYield: "Permanent human dignity priority floor permanently institutionalized",
    physicalMetric: "100% population protected against 3.5m surge events",
    provenanceSource: "Nairobi 2035 Civ-Scale Master Covenant"
  }
];

export const COMMUNITY_SENTIMENT_DATA: CommunitySentimentNode[] = [
  {
    id: "SENT-MATHARE-4A",
    wardName: "Mathare 4A (Riverfront)",
    lat: -1.2612,
    lng: 36.8584,
    overallSentiment: "tense",
    socialCohesionScore: 78,
    grievanceCount: 42,
    grievanceResolutionRate: 84,
    topCommunityConcern: "Upstream industrial discharge spikes during midnight rains & flash flood anxiety",
    wardenBarazaFeedback: "Baraza affirmed complete confidence in Phase 1 bioswales, but residents demand immediate punitive fines on Ruaraka tanneries.",
    cartelExtortionResistanceIndex: 82,
    cooperativeTrustIndex: 91,
    sampleCitizenQuotations: [
      "The swales kept the water out of our doorsteps yesterday, but the smell of industrial chemicals is choking our children at 3 AM.",
      "The kiosk water is clean and Ksh 2.00 is fair. We chased away the cartels trying to puncture the solar line."
    ]
  },
  {
    id: "SENT-MUKURU-NJENGA",
    wardName: "Mukuru Kwa Njenga (Sewer Confluence)",
    lat: -1.3142,
    lng: 36.8791,
    overallSentiment: "critical_unrest",
    socialCohesionScore: 54,
    grievanceCount: 89,
    grievanceResolutionRate: 48,
    topCommunityConcern: "Water cartel bowser intimidation, blocked railway culverts, and open drain overflow",
    wardenBarazaFeedback: "High tension: private tanker syndicate threatened youth maintaining municipal drainage. Immediate community safety escort required.",
    cartelExtortionResistanceIndex: 44,
    cooperativeTrustIndex: 68,
    sampleCitizenQuotations: [
      "The cartels are charging Ksh 25 for a single yellow jerrycan because the railway culvert backed up the ditch.",
      "We need a Solar UF kiosk here immediately. Why is Mathare getting pure water while Mukuru pays extortion?"
    ]
  },
  {
    id: "SENT-VIWANDANI",
    wardName: "Viwandani Industrial Buffer",
    lat: -1.3050,
    lng: 36.8680,
    overallSentiment: "neutral",
    socialCohesionScore: 66,
    grievanceCount: 31,
    grievanceResolutionRate: 72,
    topCommunityConcern: "Air particulate from recycling furnaces and sporadic water pressure cuts",
    wardenBarazaFeedback: "Cooperative members working alongside factory workers to install shared rainwater catchment tanks.",
    cartelExtortionResistanceIndex: 71,
    cooperativeTrustIndex: 83,
    sampleCitizenQuotations: [
      "When factory pumps turn on, our communal taps run dry. We need smart flow regulators.",
      "The community surveillance team caught an illegal waste hauler dumping sludge into the storm trench."
    ]
  },
  {
    id: "SENT-KIAMBIU",
    wardName: "Kiambiu Riparian Terrace",
    lat: -1.2820,
    lng: 36.8450,
    overallSentiment: "positive",
    socialCohesionScore: 88,
    grievanceCount: 14,
    grievanceResolutionRate: 92,
    topCommunityConcern: "Youth unemployment and maintenance tool replacement for drainage desilting teams",
    wardenBarazaFeedback: "Community celebration: zero homes flooded during last week's 45mm cloudburst thanks to pre-cleaned rock gabions.",
    cartelExtortionResistanceIndex: 94,
    cooperativeTrustIndex: 95,
    sampleCitizenQuotations: [
      "For the first time in ten years, we slept through the storm without our mattresses floating.",
      "Our youth cooperative earned Ksh 45,000 clearing the culverts. Community dignity is real."
    ]
  },
  {
    id: "SENT-RUARAKA",
    wardName: "Ruaraka Tannery Outfall Zone",
    lat: -1.2480,
    lng: 36.8720,
    overallSentiment: "tense",
    socialCohesionScore: 62,
    grievanceCount: 57,
    grievanceResolutionRate: 59,
    topCommunityConcern: "Skin ulcerations in children playing near the stream and toxic pungent vapors",
    wardenBarazaFeedback: "Wardens collected 24 independent spectrometry samples confirming illegal effluent. Community preparing legal class action.",
    cartelExtortionResistanceIndex: 65,
    cooperativeTrustIndex: 79,
    sampleCitizenQuotations: [
      "We see the purple water coming out of the factory pipe at midnight. The government inspectors never show up after dark.",
      "Atlas sensors proved the pollution spikes match their operating shifts. We now have undeniable evidence."
    ]
  },
  {
    id: "SENT-DANDORA",
    wardName: "Dandora Phase 2 (Quarry Escarpment)",
    lat: -1.2550,
    lng: 36.8920,
    overallSentiment: "neutral",
    socialCohesionScore: 69,
    grievanceCount: 38,
    grievanceResolutionRate: 67,
    topCommunityConcern: "Escarpment soil slumping from unlicensed stone quarrying and dumpsite runoff",
    wardenBarazaFeedback: "Geotechnical sensors placed along the slope; community evac plan rehearsed with 120 families.",
    cartelExtortionResistanceIndex: 76,
    cooperativeTrustIndex: 82,
    sampleCitizenQuotations: [
      "The quarry blasting vibrates the foundation of our church. We need strict geofencing enforcement.",
      "The SMS warning gave us 4 hours to move our elders before the mud washed down the footpath."
    ]
  }
];

export const PRIORITY_FLOOR_DATA: PriorityFloorStatus[] = [
  {
    id: "PF-WATER-01",
    title: "Minimum Potable Water Availability",
    category: "water_access",
    floorThresholdLabel: "≥ 25.0 Liters / Person / Day",
    currentObservedValue: "32.4 L / Person / Day",
    currentNumericValue: 32.4,
    thresholdNumericValue: 25.0,
    unit: "L/day",
    direction: "greater_than_or_equal",
    status: "guaranteed_held",
    populationAffected: 48000,
    mitigationTriggerProtocol: "If per capita delivery falls below 25 L, trigger automatic dispatch of cooperative solar UF reserve tanks.",
    lastTelemetryAudit: "2026-09-18 12:00 UTC (Smart Meter Mesh MW-UF-01..04)"
  },
  {
    id: "PF-TARIFF-02",
    title: "Potable Water Tariff Cap (Anti-Extortion)",
    category: "economic_extortion",
    floorThresholdLabel: "≤ Ksh 2.50 / 20-Liter Jerrycan",
    currentObservedValue: "Ksh 2.00 (Kiosks) / Ksh 18.50 (Cartels)",
    currentNumericValue: 2.00,
    thresholdNumericValue: 2.50,
    unit: "Ksh/20L",
    direction: "less_than_or_equal",
    status: "near_breach_warning",
    populationAffected: 115000,
    mitigationTriggerProtocol: "Cartel price gouging in peripheral unserviced Mukuru corridors reaching Ksh 20. Immediate deployment of mobile solar distribution units.",
    lastTelemetryAudit: "2026-09-18 11:30 UTC (140 SMS Warden Price Telemetry)"
  },
  {
    id: "PF-FLOOD-03",
    title: "Riparian Flood Safety Inundation Height",
    category: "flood_safety",
    floorThresholdLabel: "< 1.50 Meters Peak River Stage",
    currentObservedValue: "1.84 Meters (Mathare Node MW-44)",
    currentNumericValue: 1.84,
    thresholdNumericValue: 1.50,
    unit: "Meters",
    direction: "less_than_or_equal",
    status: "breached_critical",
    populationAffected: 38000,
    mitigationTriggerProtocol: "Stage exceeded 1.50m threshold (+0.34m breach). USSD evacuation alert sequence sent to 14,200 downstream riverbank homes. Swale retention gates open 100%.",
    lastTelemetryAudit: "2026-09-18 12:15 UTC (Hydrological Ultrasonic Radar MW-44)"
  },
  {
    id: "PF-TOXIC-04",
    title: "Hexavalent Chromium & Heavy Metal Ceiling",
    category: "pathogen_toxicity",
    floorThresholdLabel: "< 0.05 mg/L Industrial Effluent Ceiling",
    currentObservedValue: "0.14 mg/L (Ruaraka Outfall RF-02)",
    currentNumericValue: 0.14,
    thresholdNumericValue: 0.05,
    unit: "mg/L",
    direction: "less_than_or_equal",
    status: "breached_critical",
    populationAffected: 62000,
    mitigationTriggerProtocol: "Hexavalent chromium exceeds WHO safe threshold by 180%. Automatic legal notification filed with NEMA and emergency water intake diversion activated.",
    lastTelemetryAudit: "2026-09-18 10:45 UTC (Spectrometric Absorption Probe RF-02)"
  },
  {
    id: "PF-CULVERT-05",
    title: "Stormwater Drainage & Culvert Clearance",
    category: "drainage_flow",
    floorThresholdLabel: "≥ 75.0% Cross-Sectional Unobstructed Flow",
    currentObservedValue: "58.2% Clearance (Mukuru Canal 03)",
    currentNumericValue: 58.2,
    thresholdNumericValue: 75.0,
    unit: "% Flow",
    direction: "greater_than_or_equal",
    status: "near_breach_warning",
    populationAffected: 29000,
    mitigationTriggerProtocol: "Solid waste blockage under railway tracks eroding hydraulic capacity. Youth cooperative rapid desilting brigade mobilized with Ksh 35,000 emergency tranche.",
    lastTelemetryAudit: "2026-09-18 09:15 UTC (Optical Drone Inspection & Warden Report)"
  },
  {
    id: "PF-WARNING-06",
    title: "Early Warning Evacuation Lead Time",
    category: "flood_safety",
    floorThresholdLabel: "≥ 6.0 Hours Advance Lead Notice",
    currentObservedValue: "8.5 Hours Computed Lead Notice",
    currentNumericValue: 8.5,
    thresholdNumericValue: 6.0,
    unit: "Hours",
    direction: "greater_than_or_equal",
    status: "guaranteed_held",
    populationAffected: 145000,
    mitigationTriggerProtocol: "Lead time exceeds mandate floor (+2.5 hrs). Radar rain gauge and upstream mountain catchment sensors transmitting at 98.4% uptime.",
    lastTelemetryAudit: "2026-09-18 12:20 UTC (Doppler & In-situ Basin Sensor Mesh)"
  }
];

