import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    issuingBody: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['central', 'state'],
      required: true,
    },
    state: {
      type: String,
      default: null,
    },
    sectorTags: {
      type: [String],
      index: true,
    },
    businessStageEligibility: {
      type: [String],
      enum: ['idea', 'mvp', 'early_revenue', 'scaling'],
    },
    eligibilityCriteria: {
      minTeamSize: { type: Number, default: 0 },
      maxTeamSize: { type: Number, default: 999999 },
      dpiitRequired: { type: Boolean, default: false },
      specialCategoryOnly: {
        type: [String],
        enum: ['women', 'sc_st', 'differently_abled'],
      },
      other: { type: String, default: '' },
    },
    fundingAmount: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    fundingType: {
      type: String,
      enum: ['grant', 'loan', 'subsidy', 'equity', 'other'],
      required: true,
    },
    applicationLink: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      default: null, // null implies rolling
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index as mentioned in DESIGN.md
schemeSchema.index({ isActive: 1, sectorTags: 1, state: 1 });

export const Scheme = mongoose.model('Scheme', schemeSchema);
