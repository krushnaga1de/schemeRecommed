import mongoose from 'mongoose';

const founderProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    industry: {
      type: String,
      required: true,
    },
    businessStage: {
      type: String,
      enum: ['idea', 'mvp', 'early_revenue', 'scaling'],
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    teamSize: {
      type: Number,
      required: true,
    },
    fundingNeeded: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    businessType: {
      type: String,
      enum: ['tech', 'manufacturing', 'services', 'agriculture', 'other'],
      required: true,
    },
    womenLed: {
      type: Boolean,
      default: false,
    },
    scStFounder: {
      type: Boolean,
      default: false,
    },
    differentlyAbledFounder: {
      type: Boolean,
      default: false,
    },
    dpiitRegistered: {
      type: String,
      enum: ['yes', 'no', 'not_sure'],
      default: 'not_sure',
    },
  },
  {
    timestamps: true,
  }
);

export const FounderProfile = mongoose.model('FounderProfile', founderProfileSchema);
