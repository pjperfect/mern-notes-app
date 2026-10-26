import mongoose from 'mongoose';
import Note from '../models/Note.js';

// Every function below runs AFTER the protect middleware, so req.user is the
// logged-in user. Every database query includes `user: req.user._id`. That
// condition is what makes notes private: a user can only ever read, change or
// delete documents that belong to them.

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim() !== '';

// Turns a Mongoose failure caused by bad input into a 400 with one readable
// message. Anything else is our fault, so it becomes a 500.
const sendError = (res, err) => {
  if (err.name === 'ValidationError') {
    const first = Object.values(err.errors)[0];
    return res.status(400).json({ message: first.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid data in request' });
  }
  res.status(500).json({ message: err.message });
};

// GET /api/notes  -> all notes belonging to the logged-in user, newest first
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });
    res.json(notes);
  } catch (err) {
    sendError(res, err);
  }
};

// POST /api/notes  -> create a note owned by the logged-in user
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body || {};

    if (!isNonEmptyString(title)) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // The owner comes from the verified token (req.user), never from the request body.
    const note = await Note.create({ user: req.user._id, title, content });

    res.status(201).json(note);
  } catch (err) {
    sendError(res, err);
  }
};

// PUT /api/notes/:id  -> update one of the logged-in user's notes
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Matching BOTH the id and the owner: someone else's note is "not found".
    const note = await Note.findOne({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const { title, content } = req.body || {};

    // Only change the fields that were actually sent.
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    await note.save(); // runs the schema validation (required title, max lengths)

    res.json(note);
  } catch (err) {
    sendError(res, err);
  }
};

// DELETE /api/notes/:id  -> delete one of the logged-in user's notes
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted', id });
  } catch (err) {
    sendError(res, err);
  }
};
