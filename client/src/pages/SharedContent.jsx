import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function SharedContent() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/share/${token}`)
      .then(({ data }) => setData(data))
      .catch(() => setError('Link not found or expired'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <p className="text-slate-600 dark:text-slate-400 mb-4">{error || 'Content not found'}</p>
        <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
          Go to Smart Interview Prep
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline mb-8"
        >
          <ExternalLink className="w-4 h-4" />
          Try Smart Interview Prep
        </Link>

        <div className="glass-card p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            {data.role} • {data.experience}
          </p>
          {data.type === 'question' ? (
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                Shared Question
              </h1>
              <p className="font-medium text-slate-800 dark:text-white mb-3">{data.question.question}</p>
              <div className="pl-4 border-l-2 border-primary-200 dark:border-primary-800">
                <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap">
                  {data.question.answer}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                Shared Session
              </h1>
              <div className="space-y-4">
                {(data.questions || []).map((q, i) => (
                  <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                    <p className="font-medium text-slate-800 dark:text-white">{q.question}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 whitespace-pre-wrap">
                      {q.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
