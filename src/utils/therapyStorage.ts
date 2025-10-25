import { Therapy, TherapyFormData } from '../types/therapy';

const STORAGE_KEY = 'mindcare_therapies';

const defaultTherapies: Therapy[] = [
  {
    id: '1',
    title: 'CBT Thought Records',
    description: 'Cognitive Behavioral Therapy techniques to identify and change negative thought patterns',
    category: 'CBT',
    icon: 'BookOpen',
    color: 'from-purple-500 to-pink-500',
    duration: '15-20 min',
    difficulty: 'Beginner',
    sessions: 12,
    tags: ['cbt', 'cognitive', 'thoughts'],
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Mindfulness & Breathing',
    description: 'Evidence-based breathing techniques for anxiety relief and mental clarity',
    category: 'Mindfulness',
    icon: 'Brain',
    color: 'from-blue-500 to-cyan-500',
    duration: '10-30 min',
    difficulty: 'Beginner',
    sessions: 15,
    tags: ['mindfulness', 'breathing', 'relaxation'],
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Stress Management',
    description: 'Learn effective coping strategies for managing daily stress and pressure',
    category: 'Stress',
    icon: 'Target',
    color: 'from-teal-500 to-green-500',
    duration: '15-20 min',
    difficulty: 'Beginner',
    sessions: 8,
    tags: ['stress', 'coping', 'management'],
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Gratitude Journal',
    description: 'Daily gratitude practices to cultivate positivity and appreciation',
    category: 'Positive Psychology',
    icon: 'Heart',
    color: 'from-green-500 to-teal-500',
    duration: '5-10 min',
    difficulty: 'Beginner',
    sessions: 21,
    tags: ['gratitude', 'journal', 'positivity'],
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Relaxation Music',
    description: 'Curated audio library for relaxation and focus',
    category: 'Music Therapy',
    icon: 'Music',
    color: 'from-purple-500 to-blue-500',
    duration: 'Variable',
    difficulty: 'Beginner',
    sessions: 20,
    tags: ['music', 'relaxation', 'audio'],
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Tetris Therapy',
    description: 'Gamified stress relief and cognitive enhancement through mindful puzzle-solving',
    category: 'Game Therapy',
    icon: 'Gamepad2',
    color: 'from-cyan-500 to-blue-500',
    duration: '10-15 min',
    difficulty: 'Beginner',
    sessions: 12,
    tags: ['game', 'tetris', 'cognitive'],
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    title: 'Art & Color Therapy',
    description: 'Creative expression through digital art and therapeutic coloring',
    category: 'Art Therapy',
    icon: 'Palette',
    color: 'from-pink-500 to-purple-500',
    duration: '20-30 min',
    difficulty: 'Beginner',
    sessions: 10,
    tags: ['art', 'color', 'creative'],
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    title: 'Exposure Therapy',
    description: 'Gradual exposure techniques for anxiety and phobias with safety protocols',
    category: 'Exposure',
    icon: 'Eye',
    color: 'from-orange-500 to-red-500',
    duration: '30-45 min',
    difficulty: 'Advanced',
    sessions: 12,
    tags: ['exposure', 'anxiety', 'phobia'],
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    title: 'Video Therapy',
    description: 'Professional therapeutic video content with licensed therapists',
    category: 'Video Therapy',
    icon: 'Play',
    color: 'from-blue-500 to-indigo-500',
    duration: '20-40 min',
    difficulty: 'Intermediate',
    sessions: 16,
    tags: ['video', 'guided', 'therapy'],
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    title: 'Acceptance & Commitment Therapy',
    description: 'ACT principles for psychological flexibility and values-based living',
    category: 'ACT',
    icon: 'Star',
    color: 'from-teal-500 to-cyan-500',
    duration: '25-35 min',
    difficulty: 'Intermediate',
    sessions: 14,
    tags: ['act', 'acceptance', 'mindfulness'],
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getAllTherapies = (): Therapy[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTherapies));
    return defaultTherapies;
  }
  return JSON.parse(stored);
};

export const getTherapyById = (id: string): Therapy | undefined => {
  const therapies = getAllTherapies();
  return therapies.find(t => t.id === id);
};

export const createTherapy = (data: TherapyFormData): Therapy => {
  const therapies = getAllTherapies();
  const newTherapy: Therapy = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  therapies.push(newTherapy);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(therapies));
  window.dispatchEvent(new Event('therapies-updated'));
  return newTherapy;
};

export const updateTherapy = (id: string, data: Partial<TherapyFormData>): Therapy | null => {
  const therapies = getAllTherapies();
  const index = therapies.findIndex(t => t.id === id);
  if (index === -1) return null;

  therapies[index] = {
    ...therapies[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(therapies));
  window.dispatchEvent(new Event('therapies-updated'));
  return therapies[index];
};

export const deleteTherapy = (id: string): boolean => {
  const therapies = getAllTherapies();
  const filtered = therapies.filter(t => t.id !== id);
  if (filtered.length === therapies.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event('therapies-updated'));
  return true;
};

export const toggleTherapyStatus = (id: string): Therapy | null => {
  const therapy = getTherapyById(id);
  if (!therapy) return null;

  return updateTherapy(id, {
    status: therapy.status === 'Active' ? 'Inactive' : 'Active'
  });
};