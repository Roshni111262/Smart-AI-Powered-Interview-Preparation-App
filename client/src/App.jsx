import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SessionDetail from './pages/SessionDetail';
import Leaderboard from './pages/Leaderboard';
import PeerDiscussion from './pages/PeerDiscussion';
import ShareableLinks from './pages/ShareableLinks';
import MockInterview from './pages/MockInterview';
import SharedContent from './pages/SharedContent';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-pulse text-slate-500 dark:text-slate-400">Loading...</div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/shared/:token" element={<SharedContent />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="session/:id" element={<SessionDetail />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="discussions" element={<PeerDiscussion />} />
        <Route path="share" element={<ShareableLinks />} />
        <Route path="mock-interview" element={<MockInterview />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
