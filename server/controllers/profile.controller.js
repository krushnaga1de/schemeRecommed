import { FounderProfile } from '../models/FounderProfile.js';

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
