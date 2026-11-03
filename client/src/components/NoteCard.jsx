import { useState } from 'react';
import NoteForm from './NoteForm.jsx';

export default function NoteCard({ note, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleSave(values) {
    await onUpdate(note._id, values);
    setEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm('Delete this note?')) return;
    setError('');
    setDeleting(true);
    try {
      await onDelete(note._id);
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-blue-300">
        <NoteForm
          initial={note}
          submitLabel="Save changes"
          onSubmit={handleSave}
          onCancel={() => setEditing(false)}
        />
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="wrap-break-word text-lg font-medium">{note.title}</h3>
      {note.content && (
        <p className="mt-2 whitespace-pre-wrap wrap-break-word text-slate-600">
          {note.content}
        </p>
      )}

      <div className="mt-auto pt-4">
        <time
          className="block text-xs text-slate-400"
          dateTime={note.updatedAt}
        >
          Updated {new Date(note.updatedAt).toLocaleString()}
        </time>

        {error && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
}
