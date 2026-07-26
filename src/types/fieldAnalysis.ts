export interface FertilizerRecommendation {
  name: string;
  npkRatio?: string;
  purpose: string;
  dosage: string;
  applicationMethod: string;
}

export interface FieldDisease {
  name: string;
  severity: 'Low' | 'Medium' | 'High' | 'Emergency';
  spread: string;
  symptoms: string[];
  fertilizers: FertilizerRecommendation[];
  organicTreatments: string[];
  chemicalTreatments: string[];
}

export interface ImageWiseAnalysis {
  imageIndex: number;
  fileName: string;
  detectedDisease: string;
  severity: 'Low' | 'Medium' | 'High' | 'Emergency';
  confidence: number;
  description: string;
}

export interface FieldAnalysisResult {
  id?: string;
  overallHealth: number;
  severity: 'Low' | 'Medium' | 'High' | 'Emergency';
  spreadEstimate: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Emergency';
  diseases: FieldDisease[];
  recommendations: string[];
  urgentActions: string[];
  summary: string;
  imageWiseAnalysis: ImageWiseAnalysis[];
  imageURLs?: string[];
  createdAt?: any;
}
