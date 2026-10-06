import { Scheme } from '../models/Scheme.js';
import { User } from '../models/User.js';
import { RecommendationLog } from '../models/RecommendationLog.js';

export const createScheme = async (req, res, next) => {
  try {
    const schemeData = { ...req.body, createdBy: req.user.userId };
    const scheme = await Scheme.create(schemeData);
    res.status(201).json({ success: true, message: 'Scheme created', data: { scheme } });
  } catch (error) {
    next(error);
  }
};

export const getSchemes = async (req, res, next) => {
  try {
    const { state, sector, status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (state) query.state = state;
    if (sector) query.sectorTags = sector;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const skip = (page - 1) * limit;

    const schemes = await Scheme.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Scheme.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        schemes,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found.' });
    res.status(200).json({ success: true, message: 'Scheme updated', data: { scheme } });
  } catch (error) {
    next(error);
  }
};

export const deleteScheme = async (req, res, next) => {
  try {
    // Soft delete per PRD requirements
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found.' });
    res.status(200).json({ success: true, message: 'Scheme deactivated.' });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) query.role = role;

    // Never expose password data
    const users = await User.find(query).select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { users } });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const totalFounders = await User.countDocuments({ role: 'founder' });
    const totalSchemes = await Scheme.countDocuments();
    const activeSchemes = await Scheme.countDocuments({ isActive: true });
    const totalRecommendations = await RecommendationLog.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalFounders,
        totalSchemes,
        activeSchemes,
        totalRecommendations
      }
    });
  } catch (error) {
    next(error);
  }
};


