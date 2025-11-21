export enum Agency {
  TEAM_ALPHA = 'Trust & Safety',
  TEAM_BETA = 'Auto-Mod',
  TEAM_GAMMA = 'Cyber Cell'
}

export enum ThreatLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum Platform {
  TWITTER = 'Twitter',
  INSTAGRAM = 'Instagram',
  FACEBOOK = 'Facebook',
  TELEGRAM = 'Telegram'
}

export interface SuspectProfile {
  username: string;
  platform: Platform;
  bio: string;
  recentPosts: string;
  avatarUrl?: string;
}

export interface ScanResult {
  trustScore: number;
  isSuspicious: boolean;
  flags: string[];
  analysis: string;
  threatLevel: ThreatLevel;
  suggestedAction: string;
}

export interface EvidenceRecord {
  id: string;
  timestamp: string;
  targetUser: string;
  platform: Platform;
  actionTaken: string;
  hash: string; // Simulating blockchain hash
  agency: Agency;
  status: 'Pending' | 'Verified' | 'Escalated';
}

export interface DashboardStats {
  activeThreats: number;
  accountsScanned: number;
  takedownsExecuted: number;
  avgTrustScore: number;
}