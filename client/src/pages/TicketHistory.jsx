import { useEffect, useState } from 'react';
import api from '../services/api';

export default function TicketHistory() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/tickets/me')
      .then(({ data }) => setTickets(data))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Ticket History</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Last 6 months of your tickets and feature access history.</p>
      </div>
      <div className="glass-card overflow-x-auto">
        {loading ? (
          <div className="p-8 text-slate-600 dark:text-slate-300">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-slate-600 dark:text-slate-300">No ticket records found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left p-3">Ticket ID</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Payment Status</th>
                <th className="text-left p-3">Features Accessed</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="p-3">{ticket.ticketId}</td>
                  <td className="p-3">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 capitalize">{ticket.paymentStatus}</td>
                  <td className="p-3">{ticket.featuresAccessed?.join(', ') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
