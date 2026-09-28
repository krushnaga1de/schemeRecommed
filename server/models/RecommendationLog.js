import mongoose from 'mongoose';

const recommendationLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    profileSnapshot: {
      type: mongoose.Schema.Types.Mixed, // Stores a snapshot of the FounderProfile at runtime
      required: true,
    },
    recommendedSchemes: [
      {
        schemeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Scheme',
          required: true,
        },
        matchScore: {
          type: Number,
          required: true,
        },
        explanation: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'generatedAt', // Overriding the default 'createdAt'
      updatedAt: false,
    },
  }
);

export const RecommendationLog = mongoose.model('RecommendationLog', recommendationLogSchema);
