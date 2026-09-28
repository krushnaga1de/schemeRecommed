import mongoose from 'mongoose';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Scheme } from '../models/Scheme.js';
import { User } from '../models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedSchemes = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/startup-schemes';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected for Scheme Seed');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ No admin user found! Please run `node seed/createAdmin.js` first.');
      process.exit(1);
    }

    const data = await fs.readFile(path.join(__dirname, 'schemes.json'), 'utf-8');
    const schemes = JSON.parse(data);

    // Attach the admin ID as the creator
    const schemesToInsert = schemes.map(scheme => ({
      ...scheme,
      createdBy: admin._id
    }));

    await Scheme.deleteMany(); // Clear existing schemes to prevent duplicates during seed
    await Scheme.insertMany(schemesToInsert);

    console.log(`✅ Successfully seeded ${schemes.length} schemes!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed schemes:', error);
    process.exit(1);
  }
};

seedSchemes();
