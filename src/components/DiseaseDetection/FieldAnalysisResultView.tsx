'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Stethoscope, 
  Sprout, 
  AlertCircle, 
  FileText,
  Activity,
  Heart,
  Droplet,
  Beaker,
  FlameKindling
} from 'lucide-react';
import { FieldAnalysisResult } from '@/types/fieldAnalysis';

interface FieldAnalysisResultViewProps {
  result: FieldAnalysisResult;
  onReset: () => void;
}

export default function FieldAnalysisResultView({ result, onReset }: FieldAnalysisResultViewProps) {
  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'High': return 'text-danger bg-danger/10 border-danger/20';
      case 'Emergency': return 'text-danger bg-danger/10 border-danger/30 animate-pulse';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'Low': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-info bg-info/10 border-info/20';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  };

  const handleDownload = () => {
    const reportContent = `
=========================================
   CROPCARE AI COLLECTIVE FIELD REPORT
=========================================
Generated on: ${new Date().toLocaleString()}
Field Health: ${result.overallHealth}%
Severity Level: ${result.severity}
Estimated Disease Spread: ${result.spreadEstimate}
Risk Level: ${result.riskLevel}

SUMMARY:
${result.summary}

DETECTED DISEASES:
${result.diseases.map(d => `
- ${d.name} (${d.severity} Severity, Spread: ${d.spread})
  * Symptoms: ${d.symptoms.join(', ')}
  * Fertilizers:
    ${d.fertilizers.map(f => `  - ${f.name} (NPK: ${f.npkRatio || 'N/A'})
      Purpose: ${f.purpose}
      Dosage: ${f.dosage}
      Method: ${f.applicationMethod}`).join('\n')}
  * Organic Solutions:
    ${d.organicTreatments.map(o => `  - ${o}`).join('\n')}
  * Chemical Solutions:
    ${d.chemicalTreatments.map(c => `  - ${c}`).join('\n')}
`).join('\n')}

URGENT ACTIONS REQUIRED:
${result.urgentActions.map(action => `- [!] ${action}`).join('\n')}

GENERAL RECOMMENDATIONS:
${result.recommendations.map(r => `- ${r}`).join('\n')}

IMAGE-WISE BREAKDOWN:
${result.imageWiseAnalysis.map(img => `
* Image #${img.imageIndex + 1} (${img.fileName})
  - Detected: ${img.detectedDisease}
  - Severity: ${img.severity}
  - Confidence: ${img.confidence}%
  - Details: ${img.description}
`).join('\n')}

-----------------------------------------
Disclaimer: This field report is generated collectively by AI.
Please consult a local agricultural expert before applying chemical treatments.
=========================================
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CropCare_FieldReport_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* 1. Header & Summary Overview Card */}
      <div className="card border-primary/20 bg-primary/5 p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <ShieldCheck className="text-primary" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Field Analysis Complete</h3>
              <p className="text-text-muted text-sm">Collective Multi-Image Diagnosis</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onReset}
            className="btn btn-ghost border-primary/20 text-primary text-xs"
          >
            Reset Scanner
          </button>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
          <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim block mb-1">Field Health</span>
            <span className={`text-3xl font-extrabold ${getHealthColor(result.overallHealth)}`}>
              {result.overallHealth}%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim block mb-1">Spread Est.</span>
            <span className="text-3xl font-extrabold text-white">
              {result.spreadEstimate}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim block mb-1">Severity</span>
            <span className={`inline-block mt-2 badge px-3 py-1 rounded-lg border ${getSeverityColor(result.severity)}`}>
              {result.severity}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim block mb-1">Risk Level</span>
            <span className={`inline-block mt-2 badge px-3 py-1 rounded-lg border ${getSeverityColor(result.riskLevel)}`}>
              {result.riskLevel}
            </span>
          </div>
        </div>

        {/* AI Summary */}
        <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-dim mb-2">Field Health Summary</h4>
          <p className="text-sm text-text-muted italic leading-relaxed">
            "{result.summary}"
          </p>
        </div>
      </div>

      {/* 2. Urgent Actions Callout */}
      {result.urgentActions && result.urgentActions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-[24px] bg-danger/10 border border-danger/20 space-y-3"
        >
          <div className="flex items-center gap-2 text-danger font-bold uppercase tracking-widest text-xs">
            <AlertTriangle size={16} /> Urgent Interventions Required
          </div>
          <ul className="space-y-2">
            {result.urgentActions.map((action, i) => (
              <li key={i} className="text-sm text-white flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-danger rounded-full mt-1.5 shrink-0" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* 3. Grouped Diseases & Nutrient Deficiencies */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold flex items-center gap-2 text-white">
          <Activity size={20} className="text-primary" /> Grouped Diagnostic Profiles
        </h4>
        <div className="space-y-4">
          {result.diseases.map((disease, idx) => (
            <div key={idx} className="card border-white/5 bg-white/5 p-6 rounded-[28px] space-y-6">
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <h5 className="text-xl font-bold">{disease.name}</h5>
                  <p className="text-xs text-text-muted mt-1">Estimated Field Spread: <span className="text-white font-bold">{disease.spread}</span></p>
                </div>
                <span className={`badge px-3 py-1 rounded-xl border ${getSeverityColor(disease.severity)}`}>
                  {disease.severity} Risk
                </span>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <h6 className="text-xs font-bold uppercase tracking-wider text-warning flex items-center gap-1.5">
                  <AlertCircle size={14} /> Symptoms Observed
                </h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {disease.symptoms.map((symptom, sIdx) => (
                    <div key={sIdx} className="text-xs text-text-muted flex items-start gap-2 bg-black/10 p-2.5 rounded-xl border border-white/5">
                      <div className="w-1 h-1 bg-warning rounded-full mt-1.5 shrink-0" />
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fertilizer Recommendation */}
              {disease.fertilizers && disease.fertilizers.length > 0 && (
                <div className="space-y-3">
                  <h6 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Droplet size={14} /> Targeted Fertilizers
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {disease.fertilizers.map((fert, fIdx) => (
                      <div key={fIdx} className="bg-primary/5 border border-primary/20 p-4 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-primary text-sm">{fert.name}</span>
                          {fert.npkRatio && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                              NPK {fert.npkRatio}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted"><strong className="text-white">Purpose:</strong> {fert.purpose}</p>
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/5 text-text-dim">
                          <div>
                            <strong>Dosage:</strong>
                            <p className="text-white font-medium">{fert.dosage}</p>
                          </div>
                          <div>
                            <strong>Application:</strong>
                            <p className="text-white font-medium">{fert.applicationMethod}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organic & Chemical Treatments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2 bg-black/20 p-4 rounded-2xl border border-white/5">
                  <h6 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <Sprout size={14} /> Organic Alternatives
                  </h6>
                  <ul className="space-y-1.5">
                    {disease.organicTreatments.map((org, oIdx) => (
                      <li key={oIdx} className="text-xs text-text-muted flex items-start gap-1.5">
                        <div className="w-1 h-1 bg-accent rounded-full mt-1.5 shrink-0" />
                        <span>{org}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 bg-black/20 p-4 rounded-2xl border border-white/5">
                  <h6 className="text-xs font-bold uppercase tracking-wider text-danger flex items-center gap-1.5">
                    <Beaker size={14} /> Chemical Solutions
                  </h6>
                  <ul className="space-y-1.5">
                    {disease.chemicalTreatments.map((chem, cIdx) => (
                      <li key={cIdx} className="text-xs text-text-muted flex items-start gap-1.5">
                        <div className="w-1 h-1 bg-danger rounded-full mt-1.5 shrink-0" />
                        <span>{chem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. General Recommendations */}
      <div className="card border-accent/20 bg-accent/5 p-8 rounded-[28px] space-y-4">
        <h4 className="text-xl font-bold flex items-center gap-2 text-accent">
          <Sprout size={24} /> General Field Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="p-4 rounded-xl bg-black/20 border border-accent/10 text-xs text-text-main">
              {rec}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Image-Wise Diagnostics Breakdown */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold flex items-center gap-2 text-white">
          <FileText size={20} className="text-primary" /> Image-by-Image Diagnostic Cards
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.imageWiseAnalysis.map((img, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-text-dim">#{img.imageIndex + 1} - {img.fileName}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getSeverityColor(img.severity)}`}>
                  {img.severity}
                </span>
              </div>
              <div>
                <p className="text-xs text-text-muted">Detected Condition:</p>
                <p className="text-sm font-bold text-white mt-0.5">{img.detectedDisease}</p>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">"{img.description}"</p>
              <div className="flex justify-between items-center text-[10px] text-text-muted pt-2 border-t border-white/5">
                <span>Confidence score:</span>
                <span className="font-bold text-primary">{img.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button 
          type="button"
          onClick={handleDownload}
          className="btn btn-primary bg-accent text-black hover:bg-yellow-500 flex-1 py-4 text-sm font-bold"
        >
          Download Collective Field Report
        </button>
        <button 
          type="button"
          onClick={onReset}
          className="btn btn-ghost border-white/10 text-white flex-1 py-4 text-sm"
        >
          Diagnose New Field
        </button>
      </div>
    </motion.div>
  );
}
