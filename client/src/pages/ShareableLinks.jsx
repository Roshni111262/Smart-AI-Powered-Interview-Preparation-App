import { useState, useEffect } from 'react';
import { Share2, Link2, Copy, Check, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function ShareableLinks() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/interviews').then(({ data }) => setSessions(data)).catch(() => setSessions([])).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!selectedSession) return;
    setCreating(true);
    setShareUrl('');
    try {
      const { data } = await api.post('/share', {
        sessionId: selectedSession,
        questionIndex: questionIndex >= 0 ? questionIndex : undefined,
      });
      setShareUrl(data.url);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const copyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const session = sessions.find((s) => s._id === selectedSession);
  const questions = session?.generatedQuestions || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Share2 className="w-8 h-8 text-primary-500" />
          Shareable Links
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Create links to share sessions or specific questions</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Session</label>
          <select
            value={selectedSession}
            onChange={(e) => {
              setSelectedSession(e.target.value);
              setQuestionIndex(-1);
              setShareUrl('');
            }}
            className="input-field"
            disabled={loading}
          >
            <option value="">Choose a session...</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>{s.role} ({s.experience})</option>
            ))}
          </select>
        </div>

        {selectedSession && questions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Share</label>
            <select
              value={questionIndex}
              onChange={(e) => {
                setQuestionIndex(Number(e.target.value));
                setShareUrl('');
              }}
              className="input-field"
            >
              <option value={-1}>Entire session (all questions)</option>
              {questions.map((q, i) => (
                <option key={i} value={i}>Question {i + 1}: {q.question.slice(0, 50)}...</option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleCreate}
          disabled={!selectedSession || creating}
          className="btn-primary flex items-center gap-2"
        >
          {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Link2 className="w-5 h-5" />}
          {creating ? 'Creating...' : 'Create Share Link'}
        </button>

        {shareUrl && (
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-3">
            <input readOnly value={shareUrl} className="input-field flex-1 text-sm" />
            <button onClick={copyLink} className="btn-secondary flex items-center gap-2 shrink-0">
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
