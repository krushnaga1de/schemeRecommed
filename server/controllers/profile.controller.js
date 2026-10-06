import { FounderProfile } from '../models/FounderProfile.js';
import { User } from '../models/User.js';
import { Scheme } from '../models/Scheme.js';
export const upsertProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profileData = { ...req.body, userId };

    const profile = await FounderProfile.findOneAndUpdate(
      { userId },
      profileData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile saved successfully.',
      data: { profile }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await FounderProfile.findOne({ userId: req.user.userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }
    res.status(200).json({ success: true, data: { profile } });
  } catch (error) {
    next(error);
  }
};

export const toggleSavedScheme = async (req, res, next) => {
  try {
    const { schemeId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isSaved = user.savedSchemes.includes(schemeId);
    
    if (isSaved) {
      user.savedSchemes = user.savedSchemes.filter(id => id.toString() !== schemeId.toString());
    } else {
      user.savedSchemes.push(schemeId);
    }
    
    await user.save();

    res.status(200).json({ success: true, isSaved: !isSaved, message: !isSaved ? 'Scheme saved' : 'Scheme removed from saved' });
  } catch (error) {
    next(error);
  }
};

export const getSavedSchemes = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('savedSchemes');
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, data: { schemes: user.savedSchemes } });
  } catch (error) {
    next(error);
  }
};
