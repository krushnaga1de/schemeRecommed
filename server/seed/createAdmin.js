import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/startup-schemes';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected for Admin Seed');

    const adminEmail = 'admin@startupscheme.gov.in';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️ Admin user already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@123', salt);

    await User.create({
      name: 'System Admin',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      isVerified: true
    });

    console.log('✅ Admin user created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: Admin@123`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin:', error);
    process.exit(1);
  }
};

createAdmin();
