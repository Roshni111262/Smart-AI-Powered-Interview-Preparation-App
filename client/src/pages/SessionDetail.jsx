import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Pin, PinOff, ArrowLeft, Loader2, Share2, Sparkles, Save, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function SessionDetail() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [pinning, setPinning] = useState(null);
  const [explainingIndex, setExplainingIndex] = useState(null);
  const [explanations, setExplanations] = useState({});
  const [notesByQuestion, setNotesByQuestion] = useState({});
  const [noteInputs, setNoteInputs] = useState({});
  const [savingNoteFor, setSavingNoteFor] = useState(null);
  const [deletingNoteFor, setDeletingNoteFor] = useState(null);

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
      const explanationMap = {};
      (data.generatedQuestions || []).forEach((q, i) => {
        if (q.explanation) explanationMap[i] = q.explanation;
      });
      setExplanations(explanationMap);
      await fetchNotes();
    } catch (err) {
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    const { data } = await api.get(`/notes?sessionId=${id}`);
    const map = {};
    const inputs = {};
    data.forEach((n) => {
      map[n.questionIndex] = n;
      inputs[n.questionIndex] = n.content;
    });
    setNotesByQuestion(map);
    setNoteInputs((prev) => ({ ...prev, ...inputs }));
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

  const explain = async (idx, questionText) => {
    if (!questionText) return;
    setExplainingIndex(idx);
    try {
      const { data } = await api.post('/interviews/explain', {
        question: questionText,
        role: session.role,
        experience: session.experience,
        sessionId: id,
        questionIndex: idx,
        saveToSession: true,
      });
      setExplanations((prev) => ({ ...prev, [idx]: data.explanation }));
    } catch (err) {
      console.error(err);
      setExplanations((prev) => ({
        ...prev,
        [idx]: 'Unable to generate explanation right now. Please try again.',
      }));
    } finally {
      setExplainingIndex(null);
    }
  };

  const saveNote = async (questionIndex) => {
    const content = (noteInputs[questionIndex] || '').trim();
    if (!content) return;
    setSavingNoteFor(questionIndex);
    try {
      const existing = notesByQuestion[questionIndex];
      let saved;
      if (existing) {
        const { data } = await api.put(`/notes/${existing._id}`, { content });
        saved = data;
      } else {
        const { data } = await api.post('/notes', {
          sessionId: id,
          questionIndex,
          content,
        });
        saved = data;
      }
      setNotesByQuestion((prev) => ({ ...prev, [questionIndex]: saved }));
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNoteFor(null);
    }
  };

  const deleteNote = async (questionIndex) => {
    const existing = notesByQuestion[questionIndex];
    if (!existing) return;
    setDeletingNoteFor(questionIndex);
    try {
      await api.delete(`/notes/${existing._id}`);
      setNotesByQuestion((prev) => {
        const copy = { ...prev };
        delete copy[questionIndex];
        return copy;
      });
      setNoteInputs((prev) => ({ ...prev, [questionIndex]: '' }));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingNoteFor(null);
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
                <div className="px-5 pb-5 pt-0 space-y-4">
                  <div className="pl-14 border-l-2 border-primary-200 dark:border-primary-800 ml-2 pl-6">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {q.answer}
                    </p>
                  </div>
                  <div className="pl-14 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        explain(idx, q.question);
                      }}
                      disabled={explainingIndex === idx}
                      className="btn-secondary text-sm flex items-center gap-2 disabled:opacity-60"
                    >
                      {explainingIndex === idx ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      {explainingIndex === idx ? 'Generating explanation...' : 'Explain with AI'}
                    </button>
                    {explanations[idx] && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                          AI explanation
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">
                          {explanations[idx]}
                        </p>
                      </div>
                    )}
                    <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                        Personal Note
                      </p>
                      <textarea
                        value={noteInputs[idx] || ''}
                        onChange={(e) =>
                          setNoteInputs((prev) => ({ ...prev, [idx]: e.target.value }))
                        }
                        rows={3}
                        className="input-field text-sm"
                        placeholder="Write your notes for this question..."
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            saveNote(idx);
                          }}
                          disabled={savingNoteFor === idx || !(noteInputs[idx] || '').trim()}
                          className="btn-secondary text-sm flex items-center gap-1 disabled:opacity-60"
                        >
                          {savingNoteFor === idx ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Save Note
                        </button>
                        {notesByQuestion[idx] && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(idx);
                            }}
                            disabled={deletingNoteFor === idx}
                            className="btn-secondary text-sm flex items-center gap-1 text-red-600 dark:text-red-400"
                          >
                            {deletingNoteFor === idx ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
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
