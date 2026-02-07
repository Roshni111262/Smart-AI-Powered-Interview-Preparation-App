import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaderboard').then(({ data }) => setData(data)).catch(() => setData([])).finally(() => setLoading(false));
  }, []);

  const badges = { 1: 'gold', 2: 'silver', 3: 'bronze' };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Trophy className="w-8 h-8 text-amber-500" />
          Leaderboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Top performers by sessions and questions practiced</p>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-slate-600 dark:text-slate-400">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No entries yet. Create interview sessions to appear on the leaderboard!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {data.map((entry) => (
              <div
                key={entry.rank}
                className="flex items-center gap-6 p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="w-12 flex justify-center">
                  {badges[entry.rank] === 'gold' && <Medal className="w-8 h-8 text-amber-400" />}
                  {badges[entry.rank] === 'silver' && <Medal className="w-8 h-8 text-slate-400" />}
                  {badges[entry.rank] === 'bronze' && <Medal className="w-8 h-8 text-amber-700" />}
                  {!badges[entry.rank] && (
                    <span className="text-lg font-bold text-slate-400">{entry.rank}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-white">{entry.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    {entry.sessionsCompleted} sessions • {entry.questionsPracticed} questions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-500" />
                  <span className="font-bold text-slate-800 dark:text-white">{entry.score}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
