import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/60 backdrop-blur">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Smart Interview Prep</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              AI-powered interview training platform with role-based preparation, mock practice, and analytics.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 uppercase">Product</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">Dashboard</Link>
              <Link to="/mock-interview" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">Mock Interview</Link>
              <Link to="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">Pricing</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 uppercase">Community</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link to="/leaderboard" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">Leaderboard</Link>
              <Link to="/discussions" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">Discussions</Link>
              <Link to="/share" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">Share Links</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800/70 text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Smart Interview Prep. Built for real interview excellence.
        </div>
      </div>
    </footer>
  );
}
