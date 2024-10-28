import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import { User , Purchases , Courses } from "../db";
import { userSchema  } from "../validator";
import jwt from 'jsonwebtoken';
import { JWT_USER_PASSWORD } from '../config'; 
import dotenv from 'dotenv';
import { loginRateLimiter , generalRateLimiter } from "../middleware/rateLimiter";
import { userMiddleware } from "../middleware/user";
import redisClient from "../redisClient";

dotenv.config(); 

const userRouter = Router();
userRouter.use(generalRateLimiter);

userRouter.post("/signup", async (req: Request, res: Response) => {
    const body = userSchema.safeParse(req.body);

    if (!body.success) {
        return res.status(400).json({ errors: body.error.errors });
    }

    const { email, password, firstName, lastName } = body.data;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

userRouter.post('/login',loginRateLimiter , async (req: Request, res: Response) => {
    const body = userSchema.safeParse(req.body);
    if (!body.success) {
        return res.status(400).json({ errors: body.error.errors });
    }

    const { email, password } = body.data;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_USER_PASSWORD);
        res.cookie('token' , token , {
            httpOnly :true,
            maxAge : 3600000,
            sameSite: 'strict',
        });
        res.json({ message: "Login successful" });
    } catch (error) {
        console.error("Error during user login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


userRouter.get('/purchases', userMiddleware, async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {

        const cachedPurchases = await redisClient.get(`purchases:${userId}`);
        if(cachedPurchases){
            return res.json(JSON.parse(cachedPurchases))
        }
        const purchases = await Purchases.find({ userId }).lean();
        const purchasedCourseIds: string[] = purchases.map(purchase => purchase.courseId.toString());

        const coursesData = await Courses.find({
            _id: { $in: purchasedCourseIds }
        }).lean();

        const responseData = {purchases , coursesData};
        await redisClient.setEx(`purchases:${userId}`, 3600 ,JSON.stringify(responseData));
        res.json(responseData);
        
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});



export default userRouter;
