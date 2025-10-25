import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Music2, Link as LinkIcon } from 'lucide-react';
import { AudioTrack } from '../../types/therapyContent';

interface RelaxationMusicEditorProps {
  data: { audioTracks: AudioTrack[]; categories: string[] };
  onChange: (data: { audioTracks: AudioTrack[]; categories: string[] }) => void;
}

export default function RelaxationMusicEditor({ data, onChange }: RelaxationMusicEditorProps) {
  const [newCategory, setNewCategory] = React.useState('');

  const addTrack = () => {
    const newTrack: AudioTrack = {
      id: `track_${Date.now()}`,
      title: 'New Audio Track',
      url: '',
      duration: 300,
      mood: data.categories[0] || 'Calm',
      description: 'Audio track description'
    };
    onChange({ ...data, audioTracks: [...data.audioTracks, newTrack] });
  };

  const removeTrack = (id: string) => {
    onChange({
      ...data,
      audioTracks: data.audioTracks.filter(t => t.id !== id)
    });
  };

  const updateTrack = (id: string, field: keyof AudioTrack, value: any) => {
    onChange({
      ...data,
      audioTracks: data.audioTracks.map(t =>
        t.id === id ? { ...t, [field]: value } : t
      )
    });
  };

  const addCategory = () => {
    if (newCategory.trim() && !data.categories.includes(newCategory.trim())) {
      onChange({ ...data, categories: [...data.categories, newCategory.trim()] });
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    onChange({ ...data, categories: data.categories.filter(c => c !== category) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Mood Categories</h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add new category (e.g., Focus, Sleep)"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addCategory}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
          >
            Add
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.categories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-900 text-teal-200 rounded-full text-sm"
            >
              {category}
              <button
                onClick={() => removeCategory(category)}
                className="hover:text-white"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Music2 className="w-5 h-5" />
            <span>Audio Tracks</span>
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTrack}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Track</span>
          </motion.button>
        </div>

        {data.audioTracks.length === 0 ? (
          <div className="bg-gray-700 rounded-lg p-8 text-center border border-dashed border-gray-600">
            <Music2 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No audio tracks added yet</p>
            <p className="text-gray-500 text-sm mt-1">Click "Add Track" to upload or link audio files</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.audioTracks.map((track) => (
              <div
                key={track.id}
                className="bg-gray-700 rounded-lg p-4 border border-gray-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={track.title}
                      onChange={(e) => updateTrack(track.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 mb-2 bg-gray-600 border border-gray-500 rounded text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Track title"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeTrack(track.id)}
                    className="ml-2 p-2 text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={track.url}
                      onChange={(e) => updateTrack(track.id, 'url', e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Audio URL (e.g., https://example.com/audio.mp3)"
                    />
                  </div>

                  <textarea
                    value={track.description}
                    onChange={(e) => updateTrack(track.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Track description"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Duration (seconds)</label>
                      <input
                        type="number"
                        value={track.duration}
                        onChange={(e) => updateTrack(track.id, 'duration', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Mood Category</label>
                      <select
                        value={track.mood}
                        onChange={(e) => updateTrack(track.id, 'mood', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {data.categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
        <h4 className="text-blue-200 font-semibold mb-2">Audio File Guidelines</h4>
        <ul className="text-blue-300 text-sm space-y-1">
          <li>• Use direct links to audio files (.mp3, .wav, .ogg)</li>
          <li>• Recommended: Host files on cloud storage with public access</li>
          <li>• Test audio URLs before publishing</li>
          <li>• Duration is in seconds (e.g., 300 = 5 minutes)</li>
        </ul>
      </div>
    </div>
  );
}
