import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, Zap, Loader2, ChevronRight } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get('/interviews');
      setSessions(data);
    } catch (err) {
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!role.trim() || !experience) {
      setError('Please fill role and experience');
      return;
    }
    setError('');
    setCreating(true);
    try {
      const { data } = await api.post('/interviews', { role: role.trim(), experience });
      setSessions((prev) => [data, ...prev]);
      setShowForm(false);
      setRole('');
      setExperience('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Create and manage your interview preparation sessions</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">New Session</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Generate AI-powered interview Q&A</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 shrink-0"
          >
            <Plus className="w-5 h-5" />
            Create Session
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mt-6 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-4 animate-fade-in">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Role / Position
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="input-field pl-10"
                    placeholder="e.g. Software Engineer, Product Manager"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Experience Level
                </label>
                <div className="relative">
                  <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="input-field pl-10"
                  >
                    <option value="">Select level</option>
                    {experienceLevels.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={creating} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                {creating ? 'Generating...' : 'Generate Q&A'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Your Sessions</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
            <p className="text-slate-600 dark:text-slate-400">No sessions yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((s) => (
              <Link
                key={s._id}
                to={`/session/${s._id}`}
                className="glass-card p-5 flex items-center justify-between hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white">{s.role}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {s.experience} • {s.generatedQuestions?.length || 0} questions
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
