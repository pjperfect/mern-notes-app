import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    // The owner of this note, stored as the owner's _id from the users collection.
    // Every query on notes filters by this field, which is what keeps notes private.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // makes "find all notes for user X" fast
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
  { timestamps: true } // adds createdAt and updatedAt automatically
);

const Note = mongoose.model('Note', noteSchema);

export default Note;
