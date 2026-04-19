import { useState } from 'react';
import { CheckCircle2, CreditCard } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Pricing() {
  const { user, refreshMe } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const isPremium = user?.subscription?.plan === 'premium' && user?.subscription?.status === 'active';

  const activatePremium = async (gateway) => {
    setLoading(true);
    setMessage('');
    try {
      const { data: payment } = await api.post('/payments/intent', {
        amount: 1499,
        currency: 'NPR',
        gateway,
        subscriptionPlan: 'premium',
      });
      await api.post('/payments/confirm', {
        paymentId: payment._id,
        providerTransactionId: `${gateway.toUpperCase()}-${Date.now()}`,
        success: true,
        featuresAccessed: ['Mock Interview', 'Advanced Analytics', 'Theater Module', 'Admin Insights'],
      });
      await refreshMe();
      setMessage('Premium activated successfully. You now have access to advanced features.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Plans & Billing</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Upgrade to premium for advanced interview simulations and analytics.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Free</h2>
          <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-white">NPR 0</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>AI session generation</li>
            <li>Pinned questions and notes</li>
            <li>Discussion participation</li>
          </ul>
        </div>

        <div className="glass-card p-6 ring-2 ring-primary-500/50">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Premium</h2>
          <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-white">NPR 1499 / month</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Mock interview mode</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Advanced analytics</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Priority AI explanations</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <button disabled={loading || isPremium} onClick={() => activatePremium('khalti')} className="btn-primary disabled:opacity-60 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Pay with Khalti
            </button>
            <button disabled={loading || isPremium} onClick={() => activatePremium('stripe')} className="btn-secondary disabled:opacity-60">
              Pay with Stripe
            </button>
          </div>
        </div>
      </div>

      {isPremium && <div className="glass-card p-4 text-green-600 dark:text-green-400">Your premium plan is active.</div>}
      {message && <div className="glass-card p-4 text-slate-700 dark:text-slate-200">{message}</div>}
    </div>
  );
}
