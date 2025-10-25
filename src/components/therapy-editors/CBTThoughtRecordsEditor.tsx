import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, MoveUp, MoveDown, GripVertical } from 'lucide-react';
import { CBTStep } from '../../types/therapyContent';

interface CBTThoughtRecordsEditorProps {
  data: { steps: CBTStep[]; instructions: string };
  onChange: (data: { steps: CBTStep[]; instructions: string }) => void;
}

export default function CBTThoughtRecordsEditor({ data, onChange }: CBTThoughtRecordsEditorProps) {
  const addStep = () => {
    const newStep: CBTStep = {
      id: `step_${Date.now()}`,
      order: data.steps.length + 1,
      title: 'New Step',
      prompt: 'Enter your prompt here',
      placeholder: 'Enter placeholder text...'
    };
    onChange({ ...data, steps: [...data.steps, newStep] });
  };

  const removeStep = (id: string) => {
    const filtered = data.steps.filter(s => s.id !== id);
    const reordered = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
    onChange({ ...data, steps: reordered });
  };

  const updateStep = (id: string, field: keyof CBTStep, value: string) => {
    const updated = data.steps.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    );
    onChange({ ...data, steps: updated });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === data.steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...data.steps];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[index]];

    const reordered = newSteps.map((s, idx) => ({ ...s, order: idx + 1 }));
    onChange({ ...data, steps: reordered });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Instructions
        </label>
        <textarea
          value={data.instructions}
          onChange={(e) => onChange({ ...data, instructions: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter instructions for completing this therapy..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">CBT Process Steps</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addStep}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Step</span>
          </motion.button>
        </div>

        <div className="space-y-3">
          {data.steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex items-start space-x-3">
                <div className="flex flex-col space-y-1 mt-2">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                  <span className="text-xs text-gray-400 font-bold">#{step.order}</span>
                </div>

                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Step title"
                  />

                  <input
                    type="text"
                    value={step.prompt}
                    onChange={(e) => updateStep(step.id, 'prompt', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Prompt question"
                  />

                  <textarea
                    value={step.placeholder}
                    onChange={(e) => updateStep(step.id, 'placeholder', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Placeholder text for user input"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => moveStep(index, 'up')}
                    disabled={index === 0}
                    className={`p-2 rounded ${
                      index === 0
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-blue-400 hover:bg-blue-400 hover:bg-opacity-10'
                    }`}
                  >
                    <MoveUp className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => moveStep(index, 'down')}
                    disabled={index === data.steps.length - 1}
                    className={`p-2 rounded ${
                      index === data.steps.length - 1
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-blue-400 hover:bg-blue-400 hover:bg-opacity-10'
                    }`}
                  >
                    <MoveDown className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeStep(step.id)}
                    className="p-2 text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
