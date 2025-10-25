import { TherapyContent, TherapyWithContent, TherapyContentData } from '../types/therapyContent';

const STORAGE_KEY = 'therapy_contents';

export function getAllTherapyContents(): TherapyContent[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getTherapyContent(therapyId: string): TherapyContent | null {
  const contents = getAllTherapyContents();
  return contents.find(c => c.therapyId === therapyId) || null;
}

export function saveTherapyContent(
  therapyId: string,
  therapyType: keyof TherapyContentData,
  contentData: TherapyContentData[keyof TherapyContentData],
  existingId?: string
): TherapyContent {
  const contents = getAllTherapyContents();
  const now = new Date().toISOString();

  if (existingId) {
    const index = contents.findIndex(c => c.id === existingId);
    if (index !== -1) {
      contents[index] = {
        ...contents[index],
        contentData,
        version: contents[index].version + 1,
        updatedAt: now
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
      dispatchUpdateEvent();
      return contents[index];
    }
  }

  const newContent: TherapyContent = {
    id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    therapyId,
    therapyType,
    contentData,
    version: 1,
    isPublished: false,
    createdAt: now,
    updatedAt: now
  };

  contents.push(newContent);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
  dispatchUpdateEvent();
  return newContent;
}

export function publishTherapyContent(contentId: string, publish: boolean): boolean {
  const contents = getAllTherapyContents();
  const index = contents.findIndex(c => c.id === contentId);

  if (index !== -1) {
    contents[index].isPublished = publish;
    contents[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
    dispatchUpdateEvent();
    return true;
  }

  return false;
}

export function deleteTherapyContent(contentId: string): boolean {
  const contents = getAllTherapyContents();
  const filtered = contents.filter(c => c.id !== contentId);

  if (filtered.length !== contents.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    dispatchUpdateEvent();
    return true;
  }

  return false;
}

export function getDefaultContentForType(type: keyof TherapyContentData): TherapyContentData[keyof TherapyContentData] {
  const defaults: Record<keyof TherapyContentData, any> = {
    cbt_thought_records: {
      steps: [
        {
          id: '1',
          order: 1,
          title: 'Situation',
          prompt: 'What happened?',
          placeholder: 'Be specific about what happened, when, and where...'
        },
        {
          id: '2',
          order: 2,
          title: 'Automatic Thought',
          prompt: 'What went through your mind?',
          placeholder: 'What thought first came to mind?'
        },
        {
          id: '3',
          order: 3,
          title: 'Emotion',
          prompt: 'How did you feel?',
          placeholder: 'Name the emotion and rate its intensity (0-10)'
        },
        {
          id: '4',
          order: 4,
          title: 'Evidence',
          prompt: 'What evidence supports/contradicts this thought?',
          placeholder: 'List facts that support or challenge your thought'
        },
        {
          id: '5',
          order: 5,
          title: 'Balanced Thought',
          prompt: "What's a more balanced way to think about this?",
          placeholder: 'Reframe the thought with evidence in mind'
        },
        {
          id: '6',
          order: 6,
          title: 'New Emotion',
          prompt: 'How do you feel now?',
          placeholder: 'Rate your emotion after reframing (0-10)'
        }
      ],
      instructions: 'Follow each step to challenge and reframe negative thoughts using evidence-based cognitive restructuring.'
    },
    mindfulness_breathing: {
      breathingPatterns: [
        {
          id: '1',
          name: '4-7-8 Relaxation',
          description: 'Perfect for reducing anxiety and promoting sleep',
          inhale: 4,
          hold: 7,
          exhale: 8,
          duration: 5,
          difficulty: 'Beginner'
        },
        {
          id: '2',
          name: 'Box Breathing',
          description: 'Used by Navy SEALs for stress management',
          inhale: 4,
          hold: 4,
          exhale: 4,
          duration: 4,
          difficulty: 'Beginner'
        }
      ],
      mindfulnessExercises: [
        {
          id: '1',
          title: '5-4-3-2-1 Grounding',
          description: 'Notice 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste',
          duration: 5,
          instructions: [
            'Find a comfortable position',
            'Take a deep breath',
            'Look around and name 5 things you can see',
            'Listen and identify 4 sounds you can hear',
            'Notice 3 things you can touch',
            'Identify 2 things you can smell',
            'Notice 1 thing you can taste'
          ]
        }
      ]
    },
    relaxation_music: {
      audioTracks: [],
      categories: ['Calm', 'Focus', 'Sleep', 'Stress Relief', 'Meditation']
    },
    art_therapy: {
      artPrompts: [
        {
          id: '1',
          title: 'Draw Your Emotions',
          description: 'Express your current emotional state through colors and shapes',
          instructions: [
            'Choose colors that represent your feelings',
            'Draw freely without judgment',
            'Let your emotions guide your hand',
            'Reflect on what you created'
          ]
        }
      ],
      drawingTools: ['Pencil', 'Brush', 'Eraser', 'Color Picker', 'Fill']
    },
    video_therapy: {
      videos: []
    },
    exposure_therapy: {
      exposureLevels: [
        {
          id: '1',
          level: 1,
          title: 'Initial Exposure',
          description: 'Gentle introduction to the anxiety-provoking situation',
          duration: 10,
          intensity: 'Low',
          instructions: [
            'Start with visualization',
            'Rate your anxiety level (0-10)',
            'Practice relaxation techniques',
            'Gradually increase exposure time'
          ]
        }
      ],
      safetyPlan: 'Always consult with your therapist before beginning exposure exercises.'
    },
    stress_management: {
      techniques: [
        {
          id: '1',
          title: 'Progressive Muscle Relaxation',
          description: 'Systematically tense and relax muscle groups',
          steps: [
            'Find a quiet, comfortable place',
            'Start with your toes and feet',
            'Tense each muscle group for 5 seconds',
            'Release and feel the relaxation',
            'Move up through your body'
          ],
          duration: 15,
          category: 'Physical'
        }
      ]
    },
    gratitude: {
      prompts: [
        { id: '1', prompt: 'What made you smile today?', category: 'Daily' },
        { id: '2', prompt: 'Who are you grateful for and why?', category: 'Relationships' },
        { id: '3', prompt: 'What strength helped you today?', category: 'Personal Growth' }
      ],
      streakEnabled: true
    },
    tetris_therapy: {
      levels: [1, 2, 3, 4, 5],
      instructions: 'Play Tetris immediately after experiencing intrusive thoughts to reduce their frequency.',
      gameDuration: 10
    },
    act_therapy: {
      values: ['Relationships', 'Health', 'Career', 'Personal Growth', 'Creativity', 'Community'],
      exercises: [
        {
          id: '1',
          title: 'Values Clarification',
          description: 'Identify what truly matters to you',
          steps: [
            'Review the list of life domains',
            'Rank them by importance',
            'Write about why each matters',
            'Identify actions aligned with your values'
          ]
        }
      ]
    }
  };

  return defaults[type] || {};
}

function dispatchUpdateEvent() {
  window.dispatchEvent(new Event('therapy-contents-updated'));
}
