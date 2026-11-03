import { useEffect, useState } from 'react';
import { api } from '../api.js';
import NoteCard from '../components/NoteCard.jsx';
import NoteForm from '../components/NoteForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadNotes() {
      try {
        const data = await api('/notes', { token: user.token });
        if (!ignore) setNotes(data);
      } catch (err) {
        if (ignore) return;
        if (err.status === 401) logout();
        else setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadNotes();
    return () => {
      ignore = true;
    };
  }, [user.token, logout]);

  async function withAuth(action) {
    try {
      return await action();
    } catch (err) {
      if (err.status === 401) logout();
      throw err;
    }
  }

  const createNote = (values) =>
    withAuth(async () => {
      const note = await api('/notes', {
        method: 'POST',
        body: values,
        token: user.token,
      });
      setNotes((prev) => [note, ...prev]);
    });

  const updateNote = (id, values) =>
    withAuth(async () => {
      const updated = await api(`/notes/${id}`, {
        method: 'PUT',
        body: values,
        token: user.token,
      });
      setNotes((prev) => [updated, ...prev.filter((n) => n._id !== id)]);
    });

  const deleteNote = (id) =>
    withAuth(async () => {
      await api(`/notes/${id}`, { method: 'DELETE', token: user.token });
      setNotes((prev) => prev.filter((n) => n._id !== id));
    });

  return (
    <div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <h1 className="text-xl font-semibold">My Notes</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium hover:bg-slate-100"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <h2 className="mb-3 text-lg font-medium">New note</h2>
          <NoteForm
            onSubmit={createNote}
            submitLabel="Add note"
            clearOnSubmit
          />
        </section>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-6 text-slate-500">Loading your notes...</p>
        ) : notes.length === 0 ? (
          <p className="mt-6 text-slate-500">
            No notes yet. Add your first one above.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <li key={note._id}>
                <NoteCard
                  note={note}
                  onUpdate={updateNote}
                  onDelete={deleteNote}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
