import { useState } from 'react';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

export default function NoteForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  clearOnSubmit = false,
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSubmit({ title, content });
      if (clearOnSubmit) {
        setTitle('');
        setContent('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label
          htmlFor={`title-${initial?._id ?? 'new'}`}
          className="block text-sm font-medium"
        >
          Title
        </label>
        <input
          id={`title-${initial?._id ?? 'new'}`}
          type="text"
          required
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor={`content-${initial?._id ?? 'new'}`}
          className="block text-sm font-medium"
        >
          Content
        </label>
        <textarea
          id={`content-${initial?._id ?? 'new'}`}
          rows={4}
          maxLength={5000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={inputClass}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
