import mongoose from 'mongoose';
import Note from '../models/Note.js';

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim() !== '';

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

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body || {};

    if (!isNonEmptyString(title)) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = await Note.create({ user: req.user._id, title, content });

    res.status(201).json(note);
  } catch (err) {
    sendError(res, err);
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const note = await Note.findOne({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const { title, content } = req.body || {};

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    await note.save();

    res.json(note);
  } catch (err) {
    sendError(res, err);
  }
};

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
