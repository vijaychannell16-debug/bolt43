import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Heart, Moon, Music, Palette, Gamepad2, BookOpen, Target, Users, Shield, Play, Star, Plus, CreditCard as Edit, Trash2, Save, X, Search, Filter, Eye, CheckCircle, XCircle, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { Therapy, TherapyFormData } from '../types/therapy';
import {
  getAllTherapies,
  createTherapy,
  updateTherapy,
  deleteTherapy,
  toggleTherapyStatus
} from '../utils/therapyStorage';

const iconOptions = [
  { value: 'Brain', label: 'Brain', component: Brain },
  { value: 'Heart', label: 'Heart', component: Heart },
  { value: 'Moon', label: 'Moon', component: Moon },
  { value: 'Music', label: 'Music', component: Music },
  { value: 'Palette', label: 'Palette', component: Palette },
  { value: 'Gamepad2', label: 'Game', component: Gamepad2 },
  { value: 'BookOpen', label: 'Book', component: BookOpen },
  { value: 'Target', label: 'Target', component: Target },
  { value: 'Users', label: 'Users', component: Users },
  { value: 'Shield', label: 'Shield', component: Shield },
  { value: 'Play', label: 'Play', component: Play },
  { value: 'Star', label: 'Star', component: Star },
  { value: 'Eye', label: 'Eye', component: Eye }
];

const colorOptions = [
  { value: 'from-purple-500 to-pink-500', label: 'Purple to Pink', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { value: 'from-blue-500 to-cyan-500', label: 'Blue to Cyan', preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
  { value: 'from-green-500 to-teal-500', label: 'Green to Teal', preview: 'bg-gradient-to-r from-green-500 to-teal-500' },
  { value: 'from-teal-500 to-green-500', label: 'Teal to Green', preview: 'bg-gradient-to-r from-teal-500 to-green-500' },
  { value: 'from-orange-500 to-red-500', label: 'Orange to Red', preview: 'bg-gradient-to-r from-orange-500 to-red-500' },
  { value: 'from-pink-500 to-rose-500', label: 'Pink to Rose', preview: 'bg-gradient-to-r from-pink-500 to-rose-500' },
  { value: 'from-teal-500 to-cyan-500', label: 'Teal to Cyan', preview: 'bg-gradient-to-r from-teal-500 to-cyan-500' },
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow to Orange', preview: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
  { value: 'from-red-500 to-pink-500', label: 'Red to Pink', preview: 'bg-gradient-to-r from-red-500 to-pink-500' },
  { value: 'from-cyan-500 to-blue-500', label: 'Cyan to Blue', preview: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
  { value: 'from-purple-500 to-blue-500', label: 'Purple to Blue', preview: 'bg-gradient-to-r from-purple-500 to-blue-500' },
  { value: 'from-blue-500 to-indigo-500', label: 'Blue to Indigo', preview: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
  { value: 'from-pink-500 to-purple-500', label: 'Pink to Purple', preview: 'bg-gradient-to-r from-pink-500 to-purple-500' }
];

const categoryOptions = [
  'CBT', 'Mindfulness', 'Stress', 'Positive Psychology', 'Music Therapy',
  'Game Therapy', 'Art Therapy', 'Exposure', 'Video Therapy', 'ACT',
  'Sleep', 'Addiction', 'Meditation', 'PTSD', 'Anxiety', 'Depression'
];

function AdminTherapyManagement() {
  const navigate = useNavigate();
  const [therapies, setTherapies] = useState<Therapy[]>([]);
  const [filteredTherapies, setFilteredTherapies] = useState<Therapy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingTherapy, setEditingTherapy] = useState<Therapy | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<TherapyFormData>({
    title: '',
    description: '',
    category: 'CBT',
    icon: 'Brain',
    color: 'from-purple-500 to-blue-500',
    duration: '',
    difficulty: 'Beginner',
    sessions: 0,
    tags: [],
    status: 'Active'
  });

  useEffect(() => {
    loadTherapies();
    window.addEventListener('therapies-updated', loadTherapies);
    return () => window.removeEventListener('therapies-updated', loadTherapies);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [therapies, searchTerm, filterStatus, filterDifficulty]);

  const loadTherapies = () => {
    setTherapies(getAllTherapies());
  };

  const applyFilters = () => {
    let filtered = [...therapies];

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    if (filterDifficulty !== 'All') {
      filtered = filtered.filter(t => t.difficulty === filterDifficulty);
    }

    setFilteredTherapies(filtered);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'CBT',
      icon: 'Brain',
      color: 'from-purple-500 to-blue-500',
      duration: '',
      difficulty: 'Beginner',
      sessions: 0,
      tags: [],
      status: 'Active'
    });
    setTagInput('');
    setEditingTherapy(null);
  };

  const handleOpenModal = (therapy?: Therapy) => {
    if (therapy) {
      setEditingTherapy(therapy);
      setFormData({
        title: therapy.title,
        description: therapy.description,
        category: therapy.category,
        icon: therapy.icon,
        color: therapy.color,
        duration: therapy.duration,
        difficulty: therapy.difficulty,
        sessions: therapy.sessions,
        tags: therapy.tags,
        status: therapy.status
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(resetForm, 300);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (!formData.duration.trim()) {
      toast.error('Duration is required');
      return false;
    }
    if (formData.sessions <= 0) {
      toast.error('Sessions must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingTherapy) {
      const updated = updateTherapy(editingTherapy.id, formData);
      if (updated) {
        toast.success('Therapy updated successfully!');
        handleCloseModal();
      }
    } else {
      createTherapy(formData);
      toast.success('Therapy created successfully!');
      handleCloseModal();
    }
  };

  const handleDelete = (id: string) => {
    if (deleteTherapy(id)) {
      toast.success('Therapy deleted successfully!');
      setShowDeleteConfirm(null);
    } else {
      toast.error('Failed to delete therapy');
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = toggleTherapyStatus(id);
    if (updated) {
      toast.success(`Therapy ${updated.status === 'Active' ? 'activated' : 'deactivated'} successfully!`);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.component : Brain;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500 text-white';
      case 'Intermediate':
        return 'bg-yellow-500 text-white';
      case 'Advanced':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const stats = {
    total: therapies.length,
    active: therapies.filter(t => t.status === 'Active').length,
    inactive: therapies.filter(t => t.status === 'Inactive').length
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Therapy Management
            </h1>
            <p className="text-blue-100 mb-6">
              Create, edit, and manage all therapy modules with comprehensive control
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <p className="text-blue-100 text-sm mb-1">Total Therapies</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <p className="text-blue-100 text-sm mb-1">Active</p>
                <p className="text-3xl font-bold text-white">{stats.active}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <p className="text-blue-100 text-sm mb-1">Inactive</p>
                <p className="text-3xl font-bold text-white">{stats.inactive}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search therapies by title, description, category, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenModal()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Therapy</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredTherapies.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No therapies found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTherapies.map((therapy, index) => {
                const IconComponent = getIconComponent(therapy.icon);
                return (
                  <motion.div
                    key={therapy.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${therapy.color} flex items-center justify-center`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/admin/therapy-content/${therapy.id}`)}
                          className="p-2 text-teal-400 hover:bg-teal-400 hover:bg-opacity-10 rounded-lg transition-colors"
                          title="Edit Content"
                        >
                          <Settings className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleStatus(therapy.id)}
                          className={`p-2 rounded-lg transition-colors ${therapy.status === 'Active'
                            ? 'text-green-400 hover:bg-green-400 hover:bg-opacity-10'
                            : 'text-gray-500 hover:bg-gray-700'
                            }`}
                          title={therapy.status === 'Active' ? 'Active' : 'Inactive'}
                        >
                          {therapy.status === 'Active' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleOpenModal(therapy)}
                          className="p-2 text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowDeleteConfirm(therapy.id)}
                          className="p-2 text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      {therapy.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {therapy.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium">
                        {therapy.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(therapy.difficulty)}`}>
                        {therapy.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <span>{therapy.duration}</span>
                      <span>{therapy.sessions} sessions</span>
                    </div>

                    {therapy.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {therapy.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {editingTherapy ? 'Edit Therapy' : 'Add New Therapy'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter therapy title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categoryOptions.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Describe what this therapy does..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Icon
                      </label>
                      <select
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {iconOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Color Gradient
                      </label>
                      <select
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {colorOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Duration <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 15-30 min"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sessions <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.sessions}
                        onChange={(e) => setFormData({ ...formData, sessions: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Number of sessions"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type a tag and press Enter"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddTag}
                        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Add
                      </motion.button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm"
                          >
                            #{tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.status === 'Active'}
                          onChange={() => setFormData({ ...formData, status: 'Active' })}
                          className="mr-2"
                        />
                        <span className="text-white">Active</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.status === 'Inactive'}
                          onChange={() => setFormData({ ...formData, status: 'Inactive' })}
                          className="mr-2"
                        />
                        <span className="text-white">Inactive</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>{editingTherapy ? 'Update Therapy' : 'Create Therapy'}</span>
                    </motion.button>
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this therapy? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                  >
                    Delete
                  </motion.button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminTherapyManagement;