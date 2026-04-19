import { useState, useEffect } from 'react';
import { Mic, Play, ChevronRight, ChevronLeft, Eye, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function MockInterview() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [mockId, setMockId] = useState(null);
  const [myAnswer, setMyAnswer] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get('/interviews').then(({ data }) => setSessions(data)).catch(() => setSessions([])).finally(() => setLoading(false));
  }, []);

  const questions = selectedSession?.generatedQuestions || [];
  const currentQ = questions[currentIndex];

  const handleStart = async (session) => {
    try {
      const { data } = await api.post('/mock/start', { sessionId: session._id });
      setMockId(data._id);
      setSelectedSession(session);
      setCurrentIndex(0);
      setShowAnswer(false);
      setMyAnswer('');
      setResult(null);
      setStarted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setShowAnswer(false);
      setMyAnswer('');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setShowAnswer(false);
      setMyAnswer('');
    }
  };

  const submitAnswer = async () => {
    if (!mockId || !myAnswer.trim()) return;
    setSubmittingAnswer(true);
    try {
      await api.post('/mock/response', {
        mockId,
        questionIndex: currentIndex,
        userResponse: myAnswer.trim(),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleEnd = async () => {
    if (!mockId) {
      setSelectedSession(null);
      setStarted(false);
      return;
    }
    setCompleting(true);
    try {
      if (myAnswer.trim()) {
        await submitAnswer();
      }
      const { data } = await api.post('/mock/complete', { mockId });
      setResult(data);
      setMockId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  if (!started) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Mic className="w-8 h-8 text-primary-500" />
            Mock Interview Mode
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Practice answering questions one by one</p>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Select a session to practice</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">No sessions yet. Create one from the Dashboard.</p>
          ) : (
            <div className="grid gap-3">
              {sessions.map((s) => (
                <button
                  key={s._id}
                  onClick={() => handleStart(s)}
                  className="glass-card p-4 text-left flex items-center justify-between hover:ring-2 hover:ring-primary-500/50 transition-all"
                >
                  <span className="font-medium text-slate-800 dark:text-white">{s.role} ({s.experience})</span>
                  <Play className="w-5 h-5 text-primary-600" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="space-y-8">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Mock Interview Result</h2>
          <p className="text-slate-600 dark:text-slate-400">Final Score: <span className="font-semibold">{result.finalScore}</span></p>
          <p className="mt-3 text-slate-700 dark:text-slate-300">{result.summary}</p>
          <button
            onClick={() => {
              setSelectedSession(null);
              setStarted(false);
              setResult(null);
            }}
            className="btn-primary mt-6"
          >
            Back to Session Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          {selectedSession.role} • Question {currentIndex + 1} of {questions.length}
        </h1>
        <button onClick={handleEnd} disabled={completing} className="btn-secondary text-sm disabled:opacity-60">
          {completing ? 'Completing...' : 'End Practice'}
        </button>
      </div>

      <div className="glass-card p-8 min-h-[320px] flex flex-col">
        <div className="flex-1">
          <p className="text-xl font-medium text-slate-800 dark:text-white mb-6">
            {currentQ?.question}
          </p>
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Reveal Suggested Answer
            </button>
          ) : (
            <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-l-4 border-primary-500">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Suggested answer</p>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{currentQ?.answer}</p>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Your response</p>
            <textarea
              value={myAnswer}
              onChange={(e) => setMyAnswer(e.target.value)}
              className="input-field min-h-[100px] resize-y"
              placeholder="Type your interview answer here..."
            />
            <button
              onClick={submitAnswer}
              disabled={!myAnswer.trim() || submittingAnswer}
              className="btn-secondary mt-2 text-sm disabled:opacity-60"
            >
              {submittingAnswer ? 'Saving...' : 'Save Response'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          <span className="text-slate-500 dark:text-slate-400">
            {currentIndex + 1} / {questions.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
