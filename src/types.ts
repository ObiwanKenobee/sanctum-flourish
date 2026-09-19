export type LoopStage = 
  | "observatory"
  | "world-model"
  | "simulator"
  | "decisions"
  | "capital"
  | "operations"
  | "verification"
  | "failure-ledger"
  | "governance"
  | "scorecard";

export interface TelemetryReading {
  id: string;
  name: string;
  type: "IoT Hydrological" | "IoT Turbidity & E.coli Surrogate" | "Orbital Multispectral" | "Citizen Field Observation" | "Sub-surface Telemetry";
  lat: number;
  lng: number;
  value: number | string;
  unit: string;
  trend: string;
  status: "nominal" | "warning" | "critical" | "elevated";
  threshold: number;
  confidence: number; // 0 to 1
  uncertaintyBand: string;
  provenance: string;
  timestamp: string;
  historical: { time: string; value: number }[];
}

export interface WorldNode {
  id: string;
  label: string;
  category: "people" | "places" | "institutions" | "infrastructure" | "resources" | "capital" | "ecosystems" | "risks" | "outcomes";
  description: string;
  status: "resilient" | "stressed" | "critical" | "active";
  metrics: { [key: string]: string | number };
  dependencies: string[]; // IDs of nodes this depends on
  vulnerabilities: string[];
}

export interface SimulationParameters {
  rainfallSurge: number; // 0 to 100%
  upstreamIndustrialSpike: number; // 0 to 100%
  cartelPriceGouging: number; // 0 to 100%
  bioswalePreDeployment: boolean;
  solarKiosksOnline: number; // 0 to 12
  earlyWarningLeadHours: number; // 0 to 48
}

export interface SimulationResult {
  simulationId: string;
  floodRiskIndex: number;
  floodRiskCategory: string;
  choleraOutbreakProbPercent: number;
  householdEconomicStrainKshPerMonth: number;
  estimatedPopulationAtRisk: number;
  waterTreatedDailyLiters: number;
  ecologicalRetentionCapacityPercent: number;
  uncertaintyBands: {
    floodRisk: string;
    waterQuality: string;
    socioEconomicImpact: string;
  };
  assumptions: string[];
  unknowns: string[];
}

export interface DecisionOption {
  id: string;
  title: string;
  tier: "Alpha (Ecosystem)" | "Beta (Decentralized Infrastructure)" | "Gamma (Emergency Relief)";
  capitalRequiredKsh: number;
  timelineDays: number;
  evidence: string[];
  alternativesConsidered: string[];
  tradeOffs: {
    gains: string[];
    deteriorations: string[];
  };
  uncertaintyRating: "Low (±8%)" | "Moderate (±18%)" | "High (±32%)";
  stakeholdersBenefiting: string[];
  stakeholdersAtRisk: string[];
  reversibility: {
    score: number; // 1 to 10
    explanation: string;
  };
  timeHorizons: {
    immediate: string;
    fiveYear: string;
    generational: string;
  };
  status: "recommended" | "deliberating" | "executed" | "challenged";
}

export interface CapitalTranche {
  id: string;
  milestoneTitle: string;
  amountKsh: number;
  status: "unlocked_verified" | "active_in_progress" | "locked_pending_milestone";
  recipient: string;
  verificationTrigger: string;
  verifiedEvidence?: string;
  unlockedAt?: string;
  expenditureLedger: {
    item: string;
    costKsh: number;
    vendor: string;
    cryptoHash: string;
    citizenAuditApproved: boolean;
  }[];
}

export interface AgentActionLog {
  id: string;
  agentName: string;
  agentRole: string;
  boundedAuthority: string;
  timestamp: string;
  intent: string;
  authorization: string;
  action: string;
  actor: string;
  evidence: string;
  result: "success" | "escalated_to_human" | "rejected_by_governance" | "active";
  selfReflection: {
    attempted: string;
    why: string;
    authorityHeld: string;
    outcome: string;
    failureOrLimitation: string;
    requiredHumanRole: string;
  };
}

export interface FailureCase {
  id: string;
  date: string;
  event: string;
  expectedOutcome: string;
  actualOutcome: string;
  unknownsAtPlay: string;
  failedAssumption: string;
  decisionMaker: string;
  missedSignals: string;
  remedyImplemented: string;
  category: "Hydrological" | "Socio-Economic" | "Sensor Drift" | "Institutional Coordination";
}

export interface VerificationAudit {
  id: string;
  intervention: string;
  indicator: string;
  baseline: string;
  achievedOutcome: string;
  empiricalMethod: string;
  thirdPartyInspector: string;
  cryptographicHash: string;
  confidenceScore: number;
  dateVerified: string;
  counterFactualAnalysis: string;
  longitudinalTrend?: {
    day: string;
    date: string;
    counterfactualBaseline: number;
    monitoredValue: number;
    lowerBound: number;
    upperBound: number;
    unit: string;
    eventMarker?: string;
  }[];
}

export interface GeoJsonRiskFeature {
  type: "Feature";
  id: string;
  geometry: {
    type: "Point" | "Polygon";
    coordinates: [number, number] | [number, number][][];
  };
  properties: {
    id: string;
    name: string;
    riskType: "flood_inundation" | "industrial_plume" | "pathogen_hotspot" | "cartel_extortion" | "landslide_hazard";
    severity: "critical" | "severe" | "warning" | "advisory";
    headline: string;
    detail: string;
    affectedPopulation: number;
    sensorId?: string;
    mitigationAction: string;
    timestamp: string;
  };
}

export interface GeoJsonRiskCollection {
  type: "FeatureCollection";
  features: GeoJsonRiskFeature[];
}

export interface GovernancePrinciple {
  id: string;
  axiom: string;
  status: "guaranteed" | "monitored" | "actionable";
  prohibition: string;
  challengeMechanism: string;
  lastAuditDate: string;
}

export interface ResourceScarcityPoint {
  year: number; // 2026 to 2036
  label: string; // e.g., "2026", "2027"
  waterDeficitPercent: number; // 0-100%
  waterDeficitMLD: number; // Million Liters/day deficit
  electricityGridStressPercent: number; // 0-100%
  wasteCapacityExhaustionPercent: number; // 0-100%
  compositeScarcityIndex: number; // 0-100
  tippingPointAlert?: string;
}

export interface CivScaleMilestone {
  id: string;
  year: number;
  period: "historical" | "current" | "strategic_future";
  date: string;
  title: string;
  category: "ecological" | "infrastructure" | "governance" | "community";
  status: "verified_completed" | "in_progress" | "mandated_deadline" | "tail_risk_horizon";
  description: string;
  agencyYield: string;
  physicalMetric: string;
  provenanceSource: string;
  isZoomCritical?: boolean;
}

export interface CommunitySentimentNode {
  id: string;
  wardName: string;
  lat: number;
  lng: number;
  overallSentiment: "positive" | "neutral" | "tense" | "critical_unrest";
  socialCohesionScore: number; // 0 to 100
  grievanceCount: number;
  grievanceResolutionRate: number; // %
  topCommunityConcern: string;
  wardenBarazaFeedback: string;
  cartelExtortionResistanceIndex: number; // 0 to 100
  cooperativeTrustIndex: number; // 0 to 100
  sampleCitizenQuotations: string[];
}

export interface PriorityFloorStatus {
  id: string;
  title: string;
  category: "water_access" | "flood_safety" | "economic_extortion" | "pathogen_toxicity" | "drainage_flow";
  floorThresholdLabel: string;
  currentObservedValue: string;
  currentNumericValue: number;
  thresholdNumericValue: number;
  unit: string;
  direction: "greater_than_or_equal" | "less_than_or_equal";
  status: "guaranteed_held" | "near_breach_warning" | "breached_critical";
  populationAffected: number;
  mitigationTriggerProtocol: string;
  lastTelemetryAudit: string;
}
