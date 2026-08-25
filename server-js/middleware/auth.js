import jwt from 'jsonwebtoken';
import User from '../models/User';
export const authenticateUser = async (req, res, next) => {
    try {
        let token;
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Fallback for non-browser clients
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-passwordHash');
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }
            next();
        }
        catch (error) {
            return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
        }
    }
    catch (error) {
        next(error);
    }
};
export const authenticateAdmin = async (req, res, next) => {
    try {
        let token;
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Fallback for non-browser clients
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-passwordHash');
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }
            if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
                return res.status(403).json({ success: false, message: 'Not authorized as an admin' });
            }
            next();
        }
        catch (error) {
            return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
        }
    }
    catch (error) {
        next(error);
    }
};
