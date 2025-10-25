export interface CBTStep {
  id: string;
  order: number;
  title: string;
  prompt: string;
  placeholder: string;
}

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface MindfulnessExercise {
  id: string;
  title: string;
  description: string;
  duration: number;
  instructions: string[];
}

export interface AudioTrack {
  id: string;
  title: string;
  url: string;
  duration: number;
  mood: string;
  description: string;
}

export interface ArtPrompt {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  instructions: string[];
  colorPalette?: string[];
}

export interface VideoContent {
  id: string;
  title: string;
  url: string;
  duration: number;
  description: string;
  thumbnailUrl?: string;
}

export interface ExposureLevel {
  id: string;
  level: number;
  title: string;
  description: string;
  duration: number;
  intensity: 'Low' | 'Medium' | 'High';
  instructions: string[];
}

export interface StressManagementTechnique {
  id: string;
  title: string;
  description: string;
  steps: string[];
  duration: number;
  category: string;
}

export interface GratitudePrompt {
  id: string;
  prompt: string;
  category: string;
}

export type TherapyContentData = {
  cbt_thought_records: {
    steps: CBTStep[];
    instructions: string;
  };
  mindfulness_breathing: {
    breathingPatterns: BreathingPattern[];
    mindfulnessExercises: MindfulnessExercise[];
  };
  relaxation_music: {
    audioTracks: AudioTrack[];
    categories: string[];
  };
  art_therapy: {
    artPrompts: ArtPrompt[];
    drawingTools: string[];
  };
  video_therapy: {
    videos: VideoContent[];
  };
  exposure_therapy: {
    exposureLevels: ExposureLevel[];
    safetyPlan: string;
  };
  stress_management: {
    techniques: StressManagementTechnique[];
  };
  gratitude: {
    prompts: GratitudePrompt[];
    streakEnabled: boolean;
  };
  tetris_therapy: {
    levels: number[];
    instructions: string;
    gameDuration: number;
  };
  act_therapy: {
    values: string[];
    exercises: {
      id: string;
      title: string;
      description: string;
      steps: string[];
    }[];
  };
};

export interface TherapyContent {
  id: string;
  therapyId: string;
  therapyType: keyof TherapyContentData;
  contentData: TherapyContentData[keyof TherapyContentData];
  version: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TherapyWithContent {
  id: string;
  title: string;
  description: string;
  category: string;
  type: keyof TherapyContentData;
  icon: string;
  color: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sessions: number;
  tags: string[];
  status: 'Active' | 'Inactive';
  content?: TherapyContent;
  createdAt: string;
  updatedAt: string;
}
