import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
export const registerUser = async (userData) => {
    const { name, email, password, phone } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('Email already registered');
        error.statusCode = 400;
        throw error;
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const user = await User.create({
        name,
        email,
        passwordHash,
        phone,
        verificationToken,
        verificationTokenExpires
    });
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    const message = `
    <h1>Email Verification</h1>
    <p>Please go to this link to verify your email</p>
    <a href=${verifyUrl} clicktracking=off>${verifyUrl}</a>
  `;
    try {
        // In portfolio mode, we attempt to send email but don't crash if it fails
        if (process.env.SMTP_HOST) {
            await sendEmail({
                email: user.email,
                subject: 'Pizzaro - Email Verification',
                html: message,
            });
        }
    }
    catch (error) {
        console.error('Email sending failed, but user was created successfully:', error.message);
    }
    // Auto-verify for portfolio project
    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });
    return {
        success: true,
        message: 'Registration successful! You can now log in.',
    };
};
export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }
    // Bypassed email verification for portfolio ease-of-use
    // if (!user.isEmailVerified) {
    //   const error = new Error('Please verify your email first');
    //   (error as any).statusCode = 403;
    //   throw error;
    // }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }
    const token = generateToken(user._id);
    return {
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};
export const verifyEmail = async (token) => {
    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() }
    });
    if (!user) {
        const error = new Error('Invalid or expired verification token');
        error.statusCode = 400;
        throw error;
    }
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    return {
        success: true,
        message: 'Email verified successfully. You can now login.'
    };
};
export const forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('There is no user with that email');
        error.statusCode = 404;
        throw error;
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const message = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset. Please click the link below to reset your password:</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  `;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Pizzaro - Password Reset Token',
            html: message,
        });
        return {
            success: true,
            message: 'Email sent'
        };
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        const emailError = new Error('Email could not be sent');
        emailError.statusCode = 500;
        throw emailError;
    }
};
export const resetPassword = async (resetToken, newPassword) => {
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        const error = new Error('Invalid or expired reset token');
        error.statusCode = 400;
        throw error;
    }
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    const token = generateToken(user._id);
    return {
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};
