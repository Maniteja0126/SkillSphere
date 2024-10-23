import { Response , Request , NextFunction } from "express";
import { JWT_USER_PASSWORD } from "../config";
import jwt from "jsonwebtoken";

export const userMiddleware = (req : Request , res :Response , next : NextFunction) =>{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message : "Unauthorized"})
    try{
        const decoded = jwt.verify(token , JWT_USER_PASSWORD) as {userId : string} ;

        req.userId = decoded.userId;
        next();
    }catch(err){
        return res.status(500).json({message : "Internal Server Error"})
    }
}