import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be longer than 100 characters'],
    },
    content: {
      type: String,
      default: '',
      trim: true,
      maxlength: [5000, 'Content cannot be longer than 5000 characters'],
    },
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;
