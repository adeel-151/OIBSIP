import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User';
require('dotenv').config();
const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const adminExists = await User.findOne({ email: 'admin@pizzaro.com' });
        if (adminExists) {
            console.log('Admin already exists!');
            process.exit(0);
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);
        await User.create({
            name: 'Super Admin',
            email: 'admin@pizzaro.com',
            passwordHash,
            role: 'SUPER_ADMIN',
            isEmailVerified: true
        });
        console.log('Super Admin created successfully. (Email: admin@pizzaro.com, Password: admin123)');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};
seedAdmin();
