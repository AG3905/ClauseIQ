// ClauseIQ - Global Type Definitions

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface ContractAnalysis {
  id: string;
  user_id: string;
  document_name: string;
  document_type: string;
  upload_date: string;
  status: 'processing' | 'completed' | 'failed';
  result?: AnalysisResult;
}

export interface AnalysisResult {
  summary: string;
  riskScore: number;
  verdict: 'safe' | 'review' | 'danger';
  verdictLabel: string;
  verdictReason: string;
  consequences: string[];
  topConcerns: string[];
  recommendedActions: string[];
  nextSteps: string[];
  redFlags: RedFlag[];
  clauses: Clause[];
  dates: ExtractedDate[];
  parties: Party[];
  negotiationSuggestions: NegotiationSuggestion[];
}

export interface RedFlag {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  clause?: string;
  impact: string;
}

export interface Clause {
  id: string;
  title: string;
  originalText: string;
  explanation: string;
  riskLevel: 'low' | 'medium' | 'high';
  legalImpact: string;
  negotiationSuggestion: string;
  rewriteOption: string;
}

export interface ExtractedDate {
  id: string;
  label: string;
  date: string;
  type: 'effective' | 'deadline' | 'renewal' | 'termination' | 'other';
  description: string;
}

export interface Party {
  id: string;
  name: string;
  role: string;
  responsibilities: string[];
}

export interface NegotiationSuggestion {
  id: string;
  clauseTitle: string;
  currentWording: string;
  suggestedWording: string;
  reason: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  references?: string[];
}

export interface ContractComparison {
  id: string;
  original_id: string;
  revised_id: string;
  changes: ComparisonChange[];
}

export interface ComparisonChange {
  id: string;
  type: 'added' | 'removed' | 'modified';
  section: string;
  original?: string;
  revised?: string;
  riskImpact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface Report {
  id: string;
  analysis_id: string;
  generated_at: string;
  format: 'pdf' | 'html';
  url?: string;
}

export interface DashboardStats {
  totalAnalyses: number;
  highRiskAlerts: number;
  avgRiskScore: number;
  recentAnalyses: ContractAnalysis[];
}

export type RiskLevel = 'low' | 'medium' | 'high';
export type Verdict = 'safe' | 'review' | 'danger';
