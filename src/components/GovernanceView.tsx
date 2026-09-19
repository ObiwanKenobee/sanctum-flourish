import React, { useState } from "react";
import { 
  Scale, 
  ShieldAlert, 
  UserCheck, 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  WifiOff,
  Globe,
  Lock
} from "lucide-react";
import { GovernancePrinciple } from "../types";

interface GovernanceViewProps {
  principles: GovernancePrinciple[];
  priorityFloorMode: boolean;
  onTogglePriorityFloor: () => void;
}

export const GovernanceView: React.FC<GovernanceViewProps> = ({
  principles,
  priorityFloorMode,
  onTogglePriorityFloor
}) => {
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [challengeText, setChallengeText] = useState("");
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>("GOV-01");

  const handleSubmitChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeText.trim()) return;
    setChallengeSubmitted(true);
    setTimeout(() => {
      setChallengeSubmitted(false);
      setChallengeText("");
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Governance Mandate Banner */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-4 lg:p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Scale className="w-4 h-4" />
              </span>
              <h2 className="font-['Syne'] text-lg font-bold text-[#F8FAFC]">
                Moral Governance & The Priority Floor Charter
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                Constitutional Restraints Enforced
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
              Atlas constrains power to protect human dignity, truthfulness, and ecological stewardship.
              <span className="text-amber-400 font-semibold ml-1">
                Every automated recommendation possesses a sovereign path to: Inspect → Challenge → Override → Appeal → Audit.
              </span>
            </p>
          </div>

          <button
            onClick={onTogglePriorityFloor}
            className={`px-3 py-2 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all ${
              priorityFloorMode
                ? "bg-amber-950/80 border-amber-500 text-amber-300 font-bold"
                : "bg-[#141A24] border-[#222C3D] text-[#94A3B8] hover:text-[#CBD5E1]"
            }`}
          >
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>{priorityFloorMode ? "Priority Floor: ACTIVE" : "Toggle Priority Floor Mode"}</span>
          </button>
        </div>
      </div>

      {/* Priority Floor Axiom Callout */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-[#141B26] to-emerald-950/30 border border-amber-500/40 text-xs">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
              Universal Design Axiom: The Priority Floor
            </span>
            <p className="text-[#CBD5E1] text-xs leading-relaxed">
              <em>"The strength of the system is measured partly by what happens to those with the least power."</em>
              Designed for reality: low bandwidth, intermittent electricity, inexpensive mobile devices, fragmented data, multilingual populations (Swahili/English/Sheng), and informal community economies.
            </p>
          </div>
        </div>
      </div>

      {/* Constitutional Principles & Prohibitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {principles.map((p) => (
          <div key={p.id} className="bg-[#10151E] border border-[#232D3F] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-bold">{p.id}</span>
              <span className="text-[10px] font-mono uppercase bg-emerald-950/70 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                ● {p.status}
              </span>
            </div>

            <h3 className="text-sm font-bold text-[#F8FAFC] leading-snug">
              {p.axiom}
            </h3>

            <div className="pt-2 border-t border-[#1C2534] space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold block">
                  Explicit Legal & Algorithmic Prohibition:
                </span>
                <p className="text-[#94A3B8] text-[11px] mt-0.5">
                  {p.prohibition}
                </p>
              </div>

              <div className="bg-[#0C1017] p-2.5 rounded border border-[#1C2534]">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block">
                  Community Challenge & Audit Path:
                </span>
                <p className="text-[#CBD5E1] text-[11px] mt-0.5">
                  {p.challengeMechanism}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Public Citizen Right to Challenge & Override Tribunal */}
      <div className="bg-[#10151E] border border-[#232D3F] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#1C2330]">
          <UserCheck className="w-4 h-4 text-amber-400" />
          <h3 className="font-['Syne'] text-base font-bold text-[#F8FAFC]">
            Citizen & Operator Right to Challenge / Formal Override Petition
          </h3>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Any community member, warden, or operator can challenge an algorithmic recommendation, contest a sensor reading, or appeal an automated capital allocation. All petitions are permanently entered into the public tribunal log.
        </p>

        {challengeSubmitted ? (
          <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block">Petition Formalized and Entered into Public Audit Log.</span>
              <span>Case ID: PET-{Date.now().toString(36).toUpperCase()} — Assigned to Community Review Panel (Muungano Trustee). Automated actions on contested node halted.</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitChallenge} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-[#94A3B8] block mb-1">Contested Principle or System</label>
                <select 
                  value={selectedPrinciple}
                  onChange={(e) => setSelectedPrinciple(e.target.value)}
                  className="w-full bg-[#141A24] border border-[#232D3F] rounded-lg p-2 text-[#CBD5E1] text-xs"
                >
                  <option value="GOV-01">GOV-01: Priority Floor & Human Dignity</option>
                  <option value="GOV-02">GOV-02: Truthfulness & Non-Prophetic Simulation</option>
                  <option value="GOV-03">GOV-03: Anti-Surveillance & Community Agency</option>
                  <option value="GOV-04">GOV-04: Radical Transparency & Failure Memory</option>
                  <option value="DATA-01">In-Situ Sensor Inaccuracy / Data Dispute</option>
                </select>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Petitioner Affiliation / Role</label>
                <input 
                  type="text"
                  placeholder="e.g. Mukuru Kwa Njenga Community Elder / Ward Volunteer"
                  defaultValue="Community Health Warden (Ward 6)"
                  className="w-full bg-[#141A24] border border-[#232D3F] rounded-lg p-2 text-[#CBD5E1] text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[#94A3B8] block mb-1 text-xs font-mono">Detailed Grounds for Challenge / Appeal</label>
              <textarea
                rows={3}
                value={challengeText}
                onChange={(e) => setChallengeText(e.target.value)}
                placeholder="State the observed reality contradiction, disproportionate burden on vulnerable residents, or unconsidered environmental factor..."
                className="w-full bg-[#141A24] border border-[#232D3F] rounded-lg p-3 text-[#CBD5E1] text-xs placeholder:text-[#64748B]"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0A0D13] font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-950/40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Sovereign Challenge to Tribunal</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
