import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JWT_ADMIN_PASSWORD } from '../config';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD) as { adminId: string };
        req.adminId = decoded.adminId; 
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).json({ message: "Forbidden: Invalid token" });   
    }
};
