import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Eye, CheckCircle, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { TherapyWithContent, TherapyContentData } from '../types/therapyContent';
import { Therapy } from '../types/therapy';
import { getAllTherapies, updateTherapy } from '../utils/therapyStorage';
import {
  getTherapyContent,
  saveTherapyContent,
  publishTherapyContent,
  getDefaultContentForType
} from '../utils/therapyContentStorage';

import CBTThoughtRecordsEditor from '../components/therapy-editors/CBTThoughtRecordsEditor';
import MindfulnessBreathingEditor from '../components/therapy-editors/MindfulnessBreathingEditor';
import RelaxationMusicEditor from '../components/therapy-editors/RelaxationMusicEditor';

const therapyTypeOptions: { value: keyof TherapyContentData; label: string }[] = [
  { value: 'cbt_thought_records', label: 'CBT Thought Records' },
  { value: 'mindfulness_breathing', label: 'Mindfulness & Breathing' },
  { value: 'relaxation_music', label: 'Relaxation Music' },
  { value: 'art_therapy', label: 'Art & Color Therapy' },
  { value: 'video_therapy', label: 'Video Therapy' },
  { value: 'exposure_therapy', label: 'Exposure Therapy' },
  { value: 'stress_management', label: 'Stress Management' },
  { value: 'gratitude', label: 'Gratitude Journal' },
  { value: 'tetris_therapy', label: 'Tetris Therapy' },
  { value: 'act_therapy', label: 'ACT Therapy' }
];

function AdminTherapyContentEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [therapy, setTherapy] = useState<Therapy | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'content'>('general');
  const [showPreview, setShowPreview] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    title: '',
    description: '',
    duration: '',
    sessions: 0,
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    category: '',
    icon: 'Brain',
    color: 'from-blue-500 to-cyan-500',
    tags: [] as string[],
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [therapyType, setTherapyType] = useState<keyof TherapyContentData>('cbt_thought_records');
  const [contentData, setContentData] = useState<any>(null);
  const [contentId, setContentId] = useState<string | undefined>(undefined);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (id) {
      const therapies = getAllTherapies();
      const found = therapies.find(t => t.id === id);
      if (found) {
        setTherapy(found);
        setGeneralSettings({
          title: found.title,
          description: found.description,
          duration: found.duration,
          sessions: found.sessions,
          difficulty: found.difficulty,
          category: found.category,
          icon: found.icon,
          color: found.color,
          tags: found.tags,
          status: found.status
        });

        const content = getTherapyContent(id);
        if (content) {
          setTherapyType(content.therapyType);
          setContentData(content.contentData);
          setContentId(content.id);
          setIsPublished(content.isPublished);
        } else {
          setContentData(getDefaultContentForType(therapyType));
        }
      }
    }
  }, [id]);

  useEffect(() => {
    if (!contentData) {
      setContentData(getDefaultContentForType(therapyType));
    }
  }, [therapyType]);

  const handleSaveGeneral = () => {
    if (!id || !therapy) return;

    const updated = updateTherapy(id, generalSettings);
    if (updated) {
      setTherapy(updated);
      toast.success('General settings saved!');
    }
  };

  const handleSaveContent = () => {
    if (!id) return;

    const saved = saveTherapyContent(id, therapyType, contentData, contentId);
    setContentId(saved.id);
    setIsPublished(saved.isPublished);
    toast.success('Therapy content saved!');
  };

  const handlePublish = () => {
    if (!contentId) {
      toast.error('Please save content first');
      return;
    }

    const newPublishState = !isPublished;
    if (publishTherapyContent(contentId, newPublishState)) {
      setIsPublished(newPublishState);
      toast.success(newPublishState ? 'Content published!' : 'Content unpublished!');
    }
  };

  const renderContentEditor = () => {
    if (!contentData) return null;

    switch (therapyType) {
      case 'cbt_thought_records':
        return (
          <CBTThoughtRecordsEditor
            data={contentData}
            onChange={setContentData}
          />
        );
      case 'mindfulness_breathing':
        return (
          <MindfulnessBreathingEditor
            data={contentData}
            onChange={setContentData}
          />
        );
      case 'relaxation_music':
        return (
          <RelaxationMusicEditor
            data={contentData}
            onChange={setContentData}
          />
        );
      default:
        return (
          <div className="bg-gray-700 rounded-lg p-8 text-center border border-dashed border-gray-600">
            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">Content editor for "{therapyTypeOptions.find(t => t.value === therapyType)?.label}" coming soon</p>
            <p className="text-gray-500 text-sm">You can still save general settings for this therapy type</p>
          </div>
        );
    }
  };

  if (!therapy) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading therapy...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/admin/therapy-management')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Therapy Management</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Edit Therapy Content
              </h1>
              <p className="text-gray-400">{therapy.title}</p>
            </div>

            <div className="flex items-center space-x-3">
              {isPublished && (
                <span className="flex items-center space-x-2 px-4 py-2 bg-green-900 bg-opacity-30 border border-green-700 rounded-lg text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Published</span>
                </span>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPreview(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'general'
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
              }`}
            >
              General Settings
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'content'
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
              }`}
            >
              Therapy Flow Editor
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'general' ? (
              <motion.div
                key="general"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={generalSettings.title}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, title: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={generalSettings.category}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={generalSettings.description}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={generalSettings.duration}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, duration: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 15-30 min"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sessions <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={generalSettings.sessions}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, sessions: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={generalSettings.difficulty}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, difficulty: e.target.value as any })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveGeneral}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-teal-600"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save General Settings</span>
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Therapy Type
                  </label>
                  <select
                    value={therapyType}
                    onChange={(e) => setTherapyType(e.target.value as keyof TherapyContentData)}
                    className="w-full md:w-96 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {therapyTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  {renderContentEditor()}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePublish}
                    disabled={!contentId}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold ${
                      isPublished
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gradient-to-r from-teal-500 to-green-500 text-white hover:from-teal-600 hover:to-green-600'
                    } ${!contentId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>{isPublished ? 'Unpublish' : 'Publish'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveContent}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Content</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Preview Mode</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="text-xl font-bold text-white mb-2">{generalSettings.title}</h4>
                <p className="text-gray-300 mb-4">{generalSettings.description}</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-sm">
                    {generalSettings.category}
                  </span>
                  <span className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm">
                    {generalSettings.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-sm">
                    {generalSettings.duration}
                  </span>
                  <span className="px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-sm">
                    {generalSettings.sessions} sessions
                  </span>
                </div>
              </div>

              <div className="mt-6 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  Preview shows general settings. Full therapy flow preview coming soon!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminTherapyContentEditor;
