import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Pin, PinOff, ArrowLeft, Loader2, Share2 } from 'lucide-react';
import api from '../services/api';

export default function SessionDetail() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [pinning, setPinning] = useState(null);

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    try {
      const { data } = await api.get(`/interviews/${id}`);
      setSession(data);
      const init = {};
      (data.generatedQuestions || []).forEach((_, i) => {
        init[i] = false;
      });
      setExpanded(init);
    } catch (err) {
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (i) => {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const togglePin = async (idx) => {
    setPinning(idx);
    try {
      const { data } = await api.patch('/interviews/pin', { sessionId: id, questionIndex: idx });
      setSession(data);
    } catch (err) {
      console.error(err);
    } finally {
      setPinning(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600 dark:text-slate-400">Session not found.</p>
        <Link to="/" className="mt-4 inline-block text-primary-600 dark:text-primary-400 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const questions = session.generatedQuestions || [];
  const pinned = questions.filter((q) => q.isPinned);
  const unpinned = questions.filter((q) => !q.isPinned);
  const ordered = [...pinned, ...unpinned].map((q, i) => {
    const origIdx = questions.indexOf(q);
    return { ...q, origIdx };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <Link
          to="/share"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
        >
          <Share2 className="w-4 h-4" />
          Share this session
        </Link>
      </div>

      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{session.role}</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {session.experience} • {questions.length} questions
        </p>
      </div>

      <div className="space-y-3">
        {ordered.map((q, displayIdx) => {
          const idx = q.origIdx;
          const isExpanded = expanded[idx] ?? false;
          return (
            <div
              key={idx}
              className={`glass-card overflow-hidden transition-all duration-200 ${
                q.isPinned ? 'ring-2 ring-primary-500/50 dark:ring-primary-400/50' : ''
              }`}
            >
              <div
                className="flex items-start gap-4 p-5 cursor-pointer"
                onClick={() => toggleExpand(idx)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin(idx);
                  }}
                  disabled={pinning !== null}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0 disabled:opacity-50"
                  title={q.isPinned ? 'Unpin' : 'Pin'}
                >
                  {pinning === idx ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  ) : q.isPinned ? (
                    <PinOff className="w-5 h-5 text-primary-600" />
                  ) : (
                    <Pin className="w-5 h-5 text-slate-400 hover:text-primary-600" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 dark:text-white">{q.question}</p>
                  {q.isPinned && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                      Pinned
                    </span>
                  )}
                </div>
                <div className="shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>
              {isExpanded && (
                <div className="px-5 pb-5 pt-0">
                  <div className="pl-14 border-l-2 border-primary-200 dark:border-primary-800 ml-2 pl-6">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {q.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
