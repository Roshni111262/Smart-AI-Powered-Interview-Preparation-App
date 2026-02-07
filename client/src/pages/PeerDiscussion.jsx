import { useState, useEffect } from 'react';
import { MessageCircle, Send, Plus, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';

export default function PeerDiscussion() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [replying, setReplying] = useState(null);

  const fetchDiscussions = () => {
    api.get('/discussions').then(({ data }) => setDiscussions(data)).catch(() => setDiscussions([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/discussions', { title: title.trim(), content: content.trim() });
      setTitle('');
      setContent('');
      setShowForm(false);
      fetchDiscussions();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (id) => {
    const text = replyText[id]?.trim();
    if (!text) return;
    setReplying(id);
    try {
      await api.post(`/discussions/${id}/reply`, { content: text });
      setReplyText((p) => ({ ...p, [id]: '' }));
      setExpanded(id);
      fetchDiscussions();
    } catch (err) {
      console.error(err);
    } finally {
      setReplying(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MessageCircle className="w-8 h-8 text-primary-500" />
            Peer Discussions
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Start or join discussions about interview prep</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 shrink-0">
          <Plus className="w-5 h-5" />
          New Discussion
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass-card p-6 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Discussion title"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-field min-h-[100px] resize-y"
            placeholder="What would you like to discuss?"
            required
          />
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Post
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
          </div>
        ) : discussions.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <MessageCircle className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
            <p className="text-slate-600 dark:text-slate-400">No discussions yet. Start the first one!</p>
          </div>
        ) : (
          discussions.map((d) => (
            <div key={d._id} className="glass-card overflow-hidden">
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpanded(expanded === d._id ? null : d._id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white">{d.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">by {d.userName}</p>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{d.content}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm text-slate-500">{d.replies?.length || 0} replies</span>
                    {expanded === d._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>
              {expanded === d._id && (
                <div className="border-t border-slate-200 dark:border-slate-700 p-5 bg-slate-50/50 dark:bg-slate-800/30">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap mb-4">{d.content}</p>
                  <div className="space-y-3">
                    {(d.replies || []).map((r, i) => (
                      <div key={i} className="pl-4 border-l-2 border-primary-200 dark:border-primary-800">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{r.userName}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">{r.content}</p>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-4">
                      <input
                        value={replyText[d._id] || ''}
                        onChange={(e) => setReplyText((p) => ({ ...p, [d._id]: e.target.value }))}
                        className="input-field flex-1"
                        placeholder="Write a reply..."
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleReply(d._id); }}
                        disabled={replying === d._id || !replyText[d._id]?.trim()}
                        className="btn-primary shrink-0"
                      >
                        {replying === d._id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reply'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
