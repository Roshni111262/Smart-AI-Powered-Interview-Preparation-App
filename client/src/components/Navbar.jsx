import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Sun, Moon, LayoutDashboard, Trophy, MessageCircle, Share2, Mic, CreditCard, Ticket, Shield, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/discussions', label: 'Discussions', icon: MessageCircle },
  { to: '/share', label: 'Share', icon: Share2 },
  { to: '/mock-interview', label: 'Mock Interview', icon: Mic },
  { to: '/pricing', label: 'Pricing', icon: CreditCard },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const fullLinks = isAdmin ? [...navLinks, { to: '/admin', label: 'Admin', icon: Shield }] : navLinks;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Brand accent stripe — fixed height, consistent brand color */}
      <div
        className="h-1 w-full bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 dark:from-primary-500 dark:via-primary-400 dark:to-indigo-500"
        aria-hidden
      />
      <nav
        className="border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90"
        role="navigation"
        aria-label="Main"
      >
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <NavLink
            to="/"
            className="group flex min-w-0 shrink-0 items-center gap-3 rounded-xl py-1 pr-2 outline-none ring-primary-500 focus-visible:ring-2"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-md ring-1 ring-primary-600/20 dark:from-primary-500 dark:to-primary-700 dark:ring-primary-400/20">
              <Sparkles className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="hidden min-w-0 truncate text-[1.05rem] font-bold tracking-tight text-slate-900 dark:text-white sm:inline md:text-lg">
              Smart Interview Prep
            </span>
          </NavLink>

          {/* xl+: centered pill track — fixed link height via .nav-pill */}
          <div className="hidden min-w-0 flex-1 justify-center px-2 xl:flex">
            <div className="flex max-w-full items-center gap-1 rounded-2xl border border-slate-200/90 bg-slate-100/90 p-1.5 shadow-inner dark:border-slate-700/80 dark:bg-slate-900/60">
              {fullLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  title={label}
                  className={({ isActive }) =>
                    `nav-pill whitespace-nowrap ${isActive ? 'nav-pill-active' : 'nav-pill-idle'}`
                  }
                >
                  <Icon aria-hidden />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* md–lg: same pills, horizontal scroll (no hamburger) */}
          <div className="hidden min-w-0 flex-1 items-center justify-center md:flex xl:hidden">
            <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200/90 bg-slate-100/90 p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] shadow-inner dark:border-slate-700/80 dark:bg-slate-900/60 [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max items-center gap-1">
                {fullLinks.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    title={label}
                    className={({ isActive }) =>
                      `nav-pill whitespace-nowrap ${isActive ? 'nav-pill-active' : 'nav-pill-idle'}`
                    }
                  >
                    <Icon aria-hidden />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden h-9 max-w-[11rem] items-center truncate rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:flex">
              <span className="truncate">{user?.name}</span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-slate-600 transition hover:border-slate-200 hover:bg-slate-100 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-red-600 transition hover:border-red-100 hover:bg-red-50 dark:text-red-400 dark:hover:border-red-900/40 dark:hover:bg-red-950/40"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-slate-200 bg-white/98 dark:border-slate-800 dark:bg-slate-950/98 md:hidden animate-fade-in">
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
              {fullLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `nav-pill w-full justify-start ${isActive ? 'nav-pill-active' : 'nav-pill-idle'}`
                  }
                >
                  <Icon aria-hidden />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
