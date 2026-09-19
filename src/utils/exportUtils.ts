import { FailureCase, VerificationAudit } from "../types";

/**
 * Escapes a field according to RFC 4180 rules for CSV
 */
function escapeCSV(field: string | number | undefined): string {
  if (field === undefined || field === null) return '""';
  const str = String(field);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Download a generated CSV file in the browser
 */
function downloadBlob(content: string, filename: string, mimeType = "text/csv;charset=utf-8;") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Failure Ledger to structured CSV
 */
export function exportFailureLedgerCSV(failures: FailureCase[]) {
  const headers = [
    "Failure Case ID",
    "Incident Date",
    "Category",
    "Event Headline",
    "Decision Maker at Inception",
    "Expected Outcome",
    "Actual Reality Outcome",
    "Unknowns & Blind Spots",
    "Failed Assumption",
    "Missed Signals",
    "Remedy & Architectural Rule Implemented"
  ];

  const rows = failures.map(f => [
    escapeCSV(f.id),
    escapeCSV(f.date),
    escapeCSV(f.category),
    escapeCSV(f.event),
    escapeCSV(f.decisionMaker),
    escapeCSV(f.expectedOutcome),
    escapeCSV(f.actualOutcome),
    escapeCSV(f.unknownsAtPlay),
    escapeCSV(f.failedAssumption),
    escapeCSV(f.missedSignals),
    escapeCSV(f.remedyImplemented)
  ].join(","));

  const csvContent = [headers.join(","), ...rows].join("\r\n");
  const filename = `atlas-failure-ledger-${new Date().toISOString().split("T")[0]}.csv`;
  downloadBlob(csvContent, filename);
}

/**
 * Export Verification Audits to structured CSV
 */
export function exportVerificationAuditsCSV(audits: VerificationAudit[]) {
  const headers = [
    "Audit ID",
    "Intervention Title",
    "Key Indicator",
    "Empirical Baseline",
    "Achieved Reality Outcome",
    "Measurement Methodology",
    "Third-Party Independent Inspector",
    "Cryptographic State Hash",
    "Confidence Score",
    "Date Verified",
    "Counterfactual Analysis Summary"
  ];

  const rows = audits.map(a => [
    escapeCSV(a.id),
    escapeCSV(a.intervention),
    escapeCSV(a.indicator),
    escapeCSV(a.baseline),
    escapeCSV(a.achievedOutcome),
    escapeCSV(a.empiricalMethod),
    escapeCSV(a.thirdPartyInspector),
    escapeCSV(a.cryptographicHash),
    escapeCSV(`${(a.confidenceScore * 100).toFixed(1)}%`),
    escapeCSV(a.dateVerified),
    escapeCSV(a.counterFactualAnalysis)
  ].join(","));

  const csvContent = [headers.join(","), ...rows].join("\r\n");
  const filename = `atlas-verification-audits-${new Date().toISOString().split("T")[0]}.csv`;
  downloadBlob(csvContent, filename);
}

/**
 * Generate a printable/PDF institutional audit dossier for the Failure Ledger
 */
export function exportFailureLedgerPDF(failures: FailureCase[]) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to generate the official printable audit report.");
    return;
  }

  const dateStr = new Date().toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Atlas Sanctum — Failure Ledger Institutional Memory Dossier</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; line-height: 1.45; margin: 0; padding: 24px; }
        .header { border-bottom: 2px solid #854d0e; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
        .title { font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin: 0; }
        .subtitle { font-size: 11px; color: #64748b; font-family: monospace; margin-top: 4px; }
        .meta-box { font-size: 11px; font-family: monospace; text-align: right; color: #334155; }
        .covenant-quote { background: #fefce8; border-left: 4px solid #ca8a04; padding: 10px 14px; margin-bottom: 24px; font-style: italic; font-size: 12px; color: #713f12; }
        .case-card { border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px; margin-bottom: 20px; page-break-inside: avoid; }
        .case-header { display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 10px; }
        .case-id { font-family: monospace; font-weight: bold; color: #991b1b; }
        .case-cat { font-family: monospace; font-size: 10px; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }
        .case-title { font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 8px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 11px; }
        .field-label { font-size: 9px; font-weight: bold; text-transform: uppercase; font-family: monospace; color: #64748b; margin-bottom: 2px; }
        .field-content { color: #334155; margin-bottom: 6px; }
        .remedy-box { background: #f0fdf4; border: 1px solid #86efac; padding: 8px 10px; border-radius: 4px; margin-top: 8px; font-size: 11px; color: #166534; }
        .footer { margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 12px; display: flex; justify-content: space-between; font-size: 9px; font-family: monospace; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">Atlas Sanctum — Failure Ledger</h1>
          <div class="subtitle">Institutional Memory Repository • Operating Laboratory: Nairobi Basin</div>
        </div>
        <div class="meta-box">
          <div>Report Generated: ${dateStr}</div>
          <div>Records Extracted: ${failures.length} Incident Post-Mortems</div>
          <div>Status: Immutable Append-Only</div>
        </div>
      </div>

      <div class="covenant-quote">
        "The purpose of this ledger is not blame. The purpose is institutional memory. Atlas becomes intelligent because it remembers what did not work. Every failure must become knowledge."
        <br>— The Covenant of the Builder (Charter Rule 08)
      </div>

      ${failures.map(f => `
        <div class="case-card">
          <div class="case-header">
            <div>
              <span class="case-id">${f.id}</span>
              <span style="font-size: 11px; color: #64748b; margin-left: 8px;">Date: ${f.date}</span>
            </div>
            <span class="case-cat">${f.category}</span>
          </div>
          <div class="case-title">${f.event}</div>

          <div class="grid">
            <div>
              <div class="field-label">1. Expected Outcome:</div>
              <div class="field-content">${f.expectedOutcome}</div>

              <div class="field-label">2. What Actually Happened:</div>
              <div class="field-content" style="color: #991b1b; font-weight: 500;">${f.actualOutcome}</div>

              <div class="field-label">Decision Maker at Inception:</div>
              <div class="field-content">${f.decisionMaker}</div>
            </div>

            <div>
              <div class="field-label">3. Unknowns & Hidden Blind Spots:</div>
              <div class="field-content">${f.unknownsAtPlay}</div>

              <div class="field-label">4. Failed Assumption:</div>
              <div class="field-content">${f.failedAssumption}</div>

              <div class="field-label">5. Signals Missed or Dismissed as Noise:</div>
              <div class="field-content">${f.missedSignals}</div>
            </div>
          </div>

          <div class="remedy-box">
            <div class="field-label" style="color: #15803d;">6. Architectural Remedy & Rule Instated:</div>
            <div>${f.remedyImplemented}</div>
          </div>
        </div>
      `).join("")}

      <div class="footer">
        <div>ATLAS SANCTUM COGNITIVE GOVERNANCE • CRYPTOGRAPHICALLY SECURED</div>
        <div>CONFIDENTIAL AUDIT DOSSIER • NAIROBI BASIN PILOT</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Generate a printable/PDF official Verification Audit Certificate
 */
export function exportVerificationAuditPDF(audit: VerificationAudit) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to generate the official printable audit report.");
    return;
  }

  const dateStr = new Date().toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Verification Certificate — ${audit.id}</title>
      <style>
        @page { size: A4; margin: 18mm; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; line-height: 1.5; margin: 0; padding: 24px; }
        .certificate-border { border: 3px double #047857; padding: 24px; border-radius: 8px; }
        .header { text-align: center; border-bottom: 2px solid #047857; padding-bottom: 16px; margin-bottom: 20px; }
        .org-name { font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #065f46; font-family: monospace; font-weight: bold; }
        .cert-title { font-size: 22px; font-weight: bold; color: #064e3b; margin: 6px 0; }
        .cert-ref { font-family: monospace; font-size: 11px; color: #64748b; }
        .axiom-quote { text-align: center; font-style: italic; font-size: 11px; color: #475569; margin: 12px 0 20px 0; }
        .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; font-family: monospace; color: #065f46; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 16px; margin-bottom: 8px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; }
        .table td { padding: 8px; border: 1px solid #e2e8f0; }
        .table td.label { width: 30%; background: #f8fafc; font-weight: bold; color: #475569; }
        .hash-box { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 4px; font-family: monospace; font-size: 10px; word-break: break-all; color: #1e293b; margin: 10px 0; }
        .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 36px; padding-top: 16px; border-top: 1px solid #cbd5e1; }
        .sig-block { font-size: 11px; }
        .sig-line { border-bottom: 1px dashed #64748b; height: 36px; margin-bottom: 6px; }
      </style>
    </head>
    <body>
      <div class="certificate-border">
        <div class="header">
          <div class="org-name">Atlas Sanctum Verification Layer • Nairobi Basin Living Lab</div>
          <h1 class="cert-title">Certificate of Verified Reality Delta</h1>
          <div class="cert-ref">Verification Audit Identifier: ${audit.id} • Date of Attestation: ${audit.dateVerified}</div>
        </div>

        <div class="axiom-quote">
          "Never confuse: activity with impact, spending with outcomes, claims with evidence. Reality must prove itself."
        </div>

        <div class="section-title">1. Verified Intervention & Metrics</div>
        <table class="table">
          <tr>
            <td class="label">Intervention Subject:</td>
            <td><strong>${audit.intervention}</strong></td>
          </tr>
          <tr>
            <td class="label">Primary Indicator Measured:</td>
            <td>${audit.indicator}</td>
          </tr>
          <tr>
            <td class="label">Empirical Baseline (Pre-Intervention):</td>
            <td style="color: #991b1b;">${audit.baseline}</td>
          </tr>
          <tr>
            <td class="label">Achieved Reality Delta:</td>
            <td style="color: #065f46; font-weight: bold;">${audit.achievedOutcome}</td>
          </tr>
          <tr>
            <td class="label">Empirical Methodology:</td>
            <td>${audit.empiricalMethod}</td>
          </tr>
          <tr>
            <td class="label">Third-Party Inspector:</td>
            <td>${audit.thirdPartyInspector}</td>
          </tr>
          <tr>
            <td class="label">Empirical Confidence Rating:</td>
            <td><strong>${(audit.confidenceScore * 100).toFixed(1)}% (ISO-17025 Standard)</strong></td>
          </tr>
        </table>

        <div class="section-title">2. Counterfactual Impact Evaluation</div>
        <div style="font-size: 11px; color: #334155; line-height: 1.5; margin-bottom: 14px;">
          ${audit.counterFactualAnalysis}
        </div>

        <div class="section-title">3. Cryptographic State Provenance</div>
        <div class="hash-box">
          <strong>SHA-256 State Verification Hash:</strong><br>
          ${audit.cryptographicHash}
        </div>

        <div class="signatures">
          <div class="sig-block">
            <div class="sig-line"></div>
            <strong>${audit.thirdPartyInspector}</strong><br>
            <span style="color: #64748b; font-size: 10px;">Independent Academic & Clinical Validator</span>
          </div>

          <div class="sig-block">
            <div class="sig-line"></div>
            <strong>Muungano wa Wanavijiji Trustee Council</strong><br>
            <span style="color: #64748b; font-size: 10px;">Grassroots Community Concurrence Signatory</span>
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Generate a printable/PDF comprehensive institutional audit book of ALL Verification Audits
 */
export function exportVerificationAuditsAllPDF(audits: VerificationAudit[]) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to generate the official printable audit report.");
    return;
  }

  const dateStr = new Date().toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Atlas Sanctum — Complete Verification Audits Ledger</title>
      <style>
        @page { size: A4; margin: 18mm; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; line-height: 1.45; margin: 0; padding: 24px; }
        .header { border-bottom: 2px solid #047857; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
        .title { font-size: 20px; font-weight: bold; text-transform: uppercase; color: #064e3b; margin: 0; }
        .subtitle { font-size: 11px; color: #64748b; font-family: monospace; margin-top: 4px; }
        .audit-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 24px; page-break-inside: avoid; }
        .audit-header { display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 10px; }
        .audit-id { font-family: monospace; font-weight: bold; color: #047857; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 11px; }
        .table td { padding: 6px 8px; border: 1px solid #e2e8f0; }
        .table td.label { width: 28%; background: #f8fafc; font-weight: bold; color: #475569; }
        .hash-box { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 6px 10px; border-radius: 4px; font-family: monospace; font-size: 9px; word-break: break-all; color: #1e293b; margin-top: 8px; }
        .footer { margin-top: 24px; border-top: 1px solid #cbd5e1; padding-top: 10px; display: flex; justify-content: space-between; font-size: 9px; font-family: monospace; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">Atlas Sanctum — Verification Audits Ledger</h1>
          <div class="subtitle">Complete Cryptographic Attestation Book • Nairobi Basin Living Lab</div>
        </div>
        <div style="font-size: 11px; font-family: monospace; text-align: right; color: #334155;">
          <div>Report Date: ${dateStr}</div>
          <div>Audited Proofs: ${audits.length} Records</div>
        </div>
      </div>

      ${audits.map(a => `
        <div class="audit-card">
          <div class="audit-header">
            <div>
              <span class="audit-id">${a.id}</span>
              <span style="font-size: 11px; color: #64748b; margin-left: 8px;">Date Verified: ${a.dateVerified}</span>
            </div>
            <span style="font-family: monospace; font-size: 11px; font-weight: bold; color: #047857;">
              Confidence: ${(a.confidenceScore * 100).toFixed(0)}%
            </span>
          </div>

          <h3 style="font-size: 14px; font-weight: bold; color: #0f172a; margin: 4px 0 10px 0;">${a.intervention}</h3>

          <table class="table">
            <tr>
              <td class="label">Indicator:</td>
              <td>${a.indicator}</td>
            </tr>
            <tr>
              <td class="label">Empirical Baseline:</td>
              <td style="color: #991b1b;">${a.baseline}</td>
            </tr>
            <tr>
              <td class="label">Achieved Reality Delta:</td>
              <td style="color: #047857; font-weight: bold;">${a.achievedOutcome}</td>
            </tr>
            <tr>
              <td class="label">Inspector & Method:</td>
              <td>${a.thirdPartyInspector} (${a.empiricalMethod})</td>
            </tr>
            <tr>
              <td class="label">Counterfactual Evaluation:</td>
              <td>${a.counterFactualAnalysis}</td>
            </tr>
          </table>

          <div class="hash-box">
            <strong>SHA-256 State Hash:</strong> ${a.cryptographicHash}
          </div>
        </div>
      `).join("")}

      <div class="footer">
        <div>ATLAS SANCTUM VERIFICATION CORE • CRYPTOGRAPHIC CONSENSUS</div>
        <div>INSTITUTIONAL AUDIT REGISTER • NAIROBI BASIN</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
