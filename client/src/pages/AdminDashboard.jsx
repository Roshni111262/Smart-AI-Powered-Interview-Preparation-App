import { useEffect, useState } from 'react';
import api from '../services/api';

const SECTION_SCROLL = 'scroll-mt-28';

function StatCard({ label, value, href }) {
  const inner = (
    <>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        className="glass-card p-4 block transition hover:ring-2 hover:ring-primary-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        {inner}
      </a>
    );
  }
  return <div className="glass-card p-4">{inner}</div>;
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [occupancy, setOccupancy] = useState([]);

  const navItems = [
    { id: 'admin-overview', label: 'Overview' },
    { id: 'admin-users', label: 'Users' },
    { id: 'admin-payments', label: 'Payments' },
    { id: 'admin-discussions', label: 'Discussions' },
    { id: 'admin-tickets', label: 'Tickets' },
    { id: 'admin-leaderboard', label: 'Leaderboard' },
    { id: 'admin-theater', label: 'Theater Analytics' },
  ];

  const fetchAll = async () => {
    const [ov, us, ps, ts, ds, occ] = await Promise.all([
      api.get('/admin/overview'),
      api.get('/admin/users'),
      api.get('/admin/payments'),
      api.get('/admin/tickets'),
      api.get('/admin/discussions'),
      api.get('/theaters/occupancy/top'),
    ]);
    setOverview(ov.data);
    setUsers(us.data);
    setPayments(ps.data);
    setTickets(ts.data);
    setDiscussions(ds.data);
    setOccupancy(occ.data);
  };

  useEffect(() => {
    fetchAll().catch(() => {});
  }, []);

  const blockUser = async (userId, isBlocked) => {
    await api.patch(`/admin/users/${userId}/block`, { isBlocked: !isBlocked });
    fetchAll();
  };

  const deleteUser = async (userId) => {
    await api.delete(`/admin/users/${userId}`);
    fetchAll();
  };

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <aside className="glass-card p-4 h-fit lg:sticky lg:top-28">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-3">Admin Panel</h2>
        <nav className="flex flex-col gap-1 text-sm" aria-label="Admin sections">
          {navItems.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-lg px-3 py-2.5 text-slate-700 transition hover:bg-primary-50 hover:text-primary-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="space-y-8 min-w-0">
        <h1 id="admin-title" className="text-3xl font-bold text-slate-800 dark:text-white">
          Admin Dashboard
        </h1>

        <section id="admin-overview" className={SECTION_SCROLL}>
          <h2 className="sr-only">Overview</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Users" value={overview?.stats?.users ?? '-'} href="#admin-users" />
            <StatCard label="Premium Users" value={overview?.stats?.premiumUsers ?? '-'} href="#admin-users" />
            <StatCard label="Revenue" value={`NPR ${overview?.stats?.totalRevenue ?? 0}`} href="#admin-payments" />
            <StatCard
              label="Paid Transactions"
              value={overview?.stats?.paidTransactions ?? '-'}
              href="#admin-payments"
            />
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-6">
          <section id="admin-theater" className={`glass-card p-4 ${SECTION_SCROLL}`}>
            <a href="#admin-theater" className="group block">
              <h2 className="font-semibold text-slate-800 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                Top Theater Occupancy (Paid seats only)
              </h2>
            </a>
            <div className="space-y-3">
              {occupancy.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No theater data.</p>
              ) : (
                occupancy.map((item) => (
                  <div key={item.theaterId}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.theaterName}</span>
                      <span>{item.occupancyPercent}%</span>
                    </div>
                    <div
                      className="h-2 rounded bg-slate-200 dark:bg-slate-700"
                      role="img"
                      aria-label={`${item.theaterName} occupancy ${item.occupancyPercent} percent`}
                    >
                      <div
                        className="h-2 rounded bg-primary-500"
                        style={{ width: `${Math.min(item.occupancyPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section id="admin-leaderboard" className={`glass-card p-4 ${SECTION_SCROLL}`}>
            <a href="#admin-leaderboard" className="group block">
              <h2 className="font-semibold text-slate-800 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                Leaderboard Snapshot
              </h2>
            </a>
            <div className="space-y-2">
              {(overview?.leaderboard || []).length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No leaderboard entries.</p>
              ) : (
                (overview?.leaderboard || []).map((item) => (
                  <a
                    key={item._id}
                    href="#admin-leaderboard"
                    className="block rounded-lg px-2 py-1.5 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {item.user?.name || 'Unknown'} — Mock Avg {item.averageMockScore || 0}
                  </a>
                ))
              )}
            </div>
          </section>
        </div>

        <section id="admin-users" className={`glass-card p-4 overflow-x-auto ${SECTION_SCROLL}`}>
          <a href="#admin-users" className="group inline-block mb-3">
            <h2 className="font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Manage Users
            </h2>
          </a>
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Plan</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">
                    <a href={`mailto:${u.email}`} className="text-primary-600 hover:underline dark:text-primary-400">
                      {u.email}
                    </a>
                  </td>
                  <td className="p-2 capitalize">{u.role}</td>
                  <td className="p-2 capitalize">{u.subscription?.plan || 'free'}</td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => blockUser(u._id, u.isBlocked)}
                        className="btn-secondary text-xs py-2 px-3"
                      >
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(u._id)}
                        className="btn-secondary text-xs py-2 px-3 text-red-600 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="admin-payments" className={`glass-card p-4 overflow-x-auto ${SECTION_SCROLL}`}>
          <a href="#admin-payments" className="group inline-block mb-3">
            <h2 className="font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Payments ({payments.length})
            </h2>
          </a>
          {payments.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No payment records.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Gateway</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="p-2">{p.user?.name || p.user?._id || '—'}</td>
                    <td className="p-2">
                      {p.currency || 'NPR'} {p.amount}
                    </td>
                    <td className="p-2 capitalize">{p.status}</td>
                    <td className="p-2 capitalize">{p.gateway}</td>
                    <td className="p-2">{p.createdAt ? new Date(p.createdAt).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section id="admin-discussions" className={`glass-card p-4 overflow-x-auto ${SECTION_SCROLL}`}>
          <a href="#admin-discussions" className="group inline-block mb-3">
            <h2 className="font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Discussions ({discussions.length})
            </h2>
          </a>
          {discussions.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No discussions.</p>
          ) : (
            <ul className="space-y-3">
              {discussions.map((d) => (
                <li
                  key={d._id}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-slate-700 dark:bg-slate-900/40"
                >
                  <p className="font-medium text-slate-800 dark:text-white">{d.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {d.userName} · {d.createdAt ? new Date(d.createdAt).toLocaleString() : ''}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{d.content}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="admin-tickets" className={`glass-card p-4 overflow-x-auto ${SECTION_SCROLL}`}>
          <a href="#admin-tickets" className="group inline-block mb-3">
            <h2 className="font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Tickets ({tickets.length})
            </h2>
          </a>
          {tickets.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No tickets.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="p-2 text-left">Ticket ID</th>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Payment</th>
                  <th className="p-2 text-left">Features</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t._id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="p-2 font-mono text-xs">{t.ticketId}</td>
                    <td className="p-2">{t.user?.name || '—'}</td>
                    <td className="p-2 capitalize">{t.paymentStatus}</td>
                    <td className="p-2">{(t.featuresAccessed || []).join(', ') || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <div className="grid sm:grid-cols-3 gap-4">
          <a
            href="#admin-payments"
            className="glass-card p-4 block transition hover:ring-2 hover:ring-primary-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <h3 className="font-semibold mb-2 text-slate-800 dark:text-white">Payments</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{payments.length} records — open section</p>
          </a>
          <a
            href="#admin-tickets"
            className="glass-card p-4 block transition hover:ring-2 hover:ring-primary-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <h3 className="font-semibold mb-2 text-slate-800 dark:text-white">Tickets</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{tickets.length} records — open section</p>
          </a>
          <a
            href="#admin-discussions"
            className="glass-card p-4 block transition hover:ring-2 hover:ring-primary-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <h3 className="font-semibold mb-2 text-slate-800 dark:text-white">Discussions</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{discussions.length} records — open section</p>
          </a>
        </div>
      </div>
    </div>
  );
}
