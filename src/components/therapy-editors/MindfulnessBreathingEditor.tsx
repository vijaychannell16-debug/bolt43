import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Wind } from 'lucide-react';
import { BreathingPattern, MindfulnessExercise } from '../../types/therapyContent';

interface MindfulnessBreathingEditorProps {
  data: { breathingPatterns: BreathingPattern[]; mindfulnessExercises: MindfulnessExercise[] };
  onChange: (data: { breathingPatterns: BreathingPattern[]; mindfulnessExercises: MindfulnessExercise[] }) => void;
}

export default function MindfulnessBreathingEditor({ data, onChange }: MindfulnessBreathingEditorProps) {
  const addBreathingPattern = () => {
    const newPattern: BreathingPattern = {
      id: `pattern_${Date.now()}`,
      name: 'New Pattern',
      description: 'Breathing pattern description',
      inhale: 4,
      hold: 4,
      exhale: 4,
      duration: 5,
      difficulty: 'Beginner'
    };
    onChange({ ...data, breathingPatterns: [...data.breathingPatterns, newPattern] });
  };

  const removeBreathingPattern = (id: string) => {
    onChange({
      ...data,
      breathingPatterns: data.breathingPatterns.filter(p => p.id !== id)
    });
  };

  const updateBreathingPattern = (id: string, field: keyof BreathingPattern, value: any) => {
    onChange({
      ...data,
      breathingPatterns: data.breathingPatterns.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    });
  };

  const addExercise = () => {
    const newExercise: MindfulnessExercise = {
      id: `exercise_${Date.now()}`,
      title: 'New Exercise',
      description: 'Exercise description',
      duration: 5,
      instructions: ['Step 1', 'Step 2', 'Step 3']
    };
    onChange({ ...data, mindfulnessExercises: [...data.mindfulnessExercises, newExercise] });
  };

  const removeExercise = (id: string) => {
    onChange({
      ...data,
      mindfulnessExercises: data.mindfulnessExercises.filter(e => e.id !== id)
    });
  };

  const updateExercise = (id: string, field: keyof MindfulnessExercise, value: any) => {
    onChange({
      ...data,
      mindfulnessExercises: data.mindfulnessExercises.map(e =>
        e.id === id ? { ...e, [field]: value } : e
      )
    });
  };

  const updateExerciseInstructions = (id: string, instructions: string[]) => {
    updateExercise(id, 'instructions', instructions);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Wind className="w-5 h-5" />
            <span>Breathing Patterns</span>
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addBreathingPattern}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pattern</span>
          </motion.button>
        </div>

        <div className="space-y-4">
          {data.breathingPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex items-start justify-between mb-3">
                <input
                  type="text"
                  value={pattern.name}
                  onChange={(e) => updateBreathingPattern(pattern.id, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Pattern name"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeBreathingPattern(pattern.id)}
                  className="ml-2 p-2 text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>

              <textarea
                value={pattern.description}
                onChange={(e) => updateBreathingPattern(pattern.id, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 mb-3 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description"
              />

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Inhale (s)</label>
                  <input
                    type="number"
                    value={pattern.inhale}
                    onChange={(e) => updateBreathingPattern(pattern.id, 'inhale', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Hold (s)</label>
                  <input
                    type="number"
                    value={pattern.hold}
                    onChange={(e) => updateBreathingPattern(pattern.id, 'hold', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Exhale (s)</label>
                  <input
                    type="number"
                    value={pattern.exhale}
                    onChange={(e) => updateBreathingPattern(pattern.id, 'exhale', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={pattern.duration}
                    onChange={(e) => updateBreathingPattern(pattern.id, 'duration', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Difficulty</label>
                  <select
                    value={pattern.difficulty}
                    onChange={(e) => updateBreathingPattern(pattern.id, 'difficulty', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Quick Mindfulness Exercises</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addExercise}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Exercise</span>
          </motion.button>
        </div>

        <div className="space-y-4">
          {data.mindfulnessExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex items-start justify-between mb-3">
                <input
                  type="text"
                  value={exercise.title}
                  onChange={(e) => updateExercise(exercise.id, 'title', e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Exercise title"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeExercise(exercise.id)}
                  className="ml-2 p-2 text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <textarea
                  value={exercise.description}
                  onChange={(e) => updateExercise(exercise.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description"
                />
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={exercise.duration}
                    onChange={(e) => updateExercise(exercise.id, 'duration', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Instructions (one per line)</label>
                <textarea
                  value={exercise.instructions.join('\n')}
                  onChange={(e) => updateExerciseInstructions(exercise.id, e.target.value.split('\n').filter(i => i.trim()))}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="Enter each instruction on a new line"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}