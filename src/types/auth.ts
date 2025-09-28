export type UserRole = 'worker' | 'supervisor' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  department?: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ICInspection {
  id: string;
  workerEmail: string;
  workerName: string;
  batchNumber: string;
  icImage: string;
  extractedText: string;
  status: 'authentic' | 'suspicious' | 'fake';
  confidence: number;
  timestamp: Date;
  notes?: string;
  supervisorReview?: {
    reviewedBy: string;
    action: 'approved' | 'rejected';
    comments: string;
    reviewedAt: Date;
  };
}

export interface DashboardStats {
  totalScans: number;
  authenticCount: number;
  suspiciousCount: number;
  fakeCount: number;
  pendingReview: number;
}