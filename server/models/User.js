import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['founder', 'admin'],
      default: 'founder',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    savedSchemes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme'
    }],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
