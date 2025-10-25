export interface Therapy {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sessions: number;
  tags: string[];
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface TherapyFormData {
  title: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sessions: number;
  tags: string[];
  status: 'Active' | 'Inactive';
}