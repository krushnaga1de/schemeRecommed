import { FounderProfile } from '../models/FounderProfile.js';
import { Scheme } from '../models/Scheme.js';
import { RecommendationLog } from '../models/RecommendationLog.js';
import { matchSchemes } from '../services/schemeMatcher.js';
import { generateExplanations } from '../services/aiExplainer.js';

export const generateRecommendations = async (req, res, next) => {
  try {
    const founder = await FounderProfile.findOne({ userId: req.user.userId });
    if (!founder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Founder profile not found. Please complete the questionnaire first.' 
      });
    }

    const allSchemes = await Scheme.find({ isActive: true });
    
    const shortlistedSchemes = matchSchemes(founder, allSchemes);
    
    if (shortlistedSchemes.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schemes currently match your profile.',
        data: { logId: null, schemes: [] }
      });
    }

    const schemesWithExplanations = await generateExplanations(founder, shortlistedSchemes);

    const logEntry = await RecommendationLog.create({
      userId: req.user.userId,
      profileSnapshot: founder.toObject(),
      recommendedSchemes: schemesWithExplanations.map(s => ({
        schemeId: s._id,
        matchScore: s.matchScore,
        explanation: s.explanation
      }))
    });

    res.status(200).json({
      success: true,
      message: 'Recommendations generated successfully.',
      data: {
        logId: logEntry._id,
        schemes: schemesWithExplanations
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const history = await RecommendationLog.find({ userId: req.user.userId })
      .sort({ generatedAt: -1 })
      .populate('recommendedSchemes.schemeId');

    res.status(200).json({
      success: true,
      data: { history }
    });
  } catch (error) {
    next(error);
  }
};
