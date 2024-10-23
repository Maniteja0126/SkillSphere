import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { Admin, Purchases, Courses } from "../db";
import { adminSchema, courseSchema } from "../validator";
import jwt from "jsonwebtoken";
import { JWT_ADMIN_PASSWORD } from "../config";
import dotenv from "dotenv";
import { loginRateLimiter, generalRateLimiter } from "../middleware/rateLimiter";
import { adminMiddleware } from "../middleware/admin";
import redisClient from "../redisClient";

dotenv.config();

const adminRouter = Router();
adminRouter.use(generalRateLimiter);

adminRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        const body = adminSchema.safeParse(req.body);
        if (!body.success) {
            return res.status(400).json(body.error);
        }
        const { email, password, firstName, lastName } = body.data;
        const isAdminExists = await Admin.findOne({ email });

        if (isAdminExists) {
            return res.status(400).json({ error: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Admin.create({ email, password: hashedPassword, firstName, lastName });

        res.json({ message: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


adminRouter.post("/login", loginRateLimiter, async (req: Request, res: Response) => {
    try {
        const body = adminSchema.safeParse(req.body);
        if (!body.success) {
            return res.status(400).json(body.error);
        }

        const { email, password } = body.data;
        const user = await Admin.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ adminId: user._id }, JWT_ADMIN_PASSWORD);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000,
            sameSite: "strict",
        });

        res.json({ message: "Login successful" });
    } catch (error) {
        console.log("Error from admin login " , error);
        res.status(500).json({ message: "Internal server error" });
    }
});


adminRouter.post("/course",adminMiddleware, async (req: Request, res: Response) => {
    try {
        const adminId = req.adminId;
        const body = courseSchema.safeParse(req.body);

        if (!body.success) {
            return res.status(400).json(body.error);
        }

        const { title, description, price, imageUrl } = body.data;
        const course = await Courses.create({ title, description, price, imageUrl, creatorId: adminId });
        redisClient.del(`courses:${adminId}`);

        res.json({ message: "Course created successfully", courseId: course._id });
    } catch (error) {
        console.log("Error from admin course " , error);
        res.status(500).json({ message: "Internal server error" });
    }
});


adminRouter.put("/course", adminMiddleware, async (req: Request, res: Response) => {
    try {
        const adminId = req.adminId;
        const body = courseSchema.safeParse(req.body);

        if (!body.success) {
            return res.status(400).json(body.error);
        }

        const { title, description, price, imageUrl } = body.data;
        const { courseId } = req.body;

        const course = await Courses.findOneAndUpdate(
            { _id: courseId, creatorId: adminId },
            { title, description, price, imageUrl },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found or unauthorized" });
        }

        redisClient.del(`courses:${adminId}`);


        res.json({ message: "Course updated", courseId: course._id });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


adminRouter.get("/courses/bulk",adminMiddleware , async (req: Request, res: Response) => {
    const adminId = req.adminId;
    const cachedCourses = await redisClient.get(`courses:${adminId}`);
    if (cachedCourses) {
        console.log("Returning the courses from the cached data");
        return res.json(JSON.parse(cachedCourses));
    }
    try {

        const courses = await Courses.find({ creatorId: adminId });
        await redisClient.setEx(`courses:${adminId}` , 3600 , JSON.stringify(courses));
        res.json(courses);

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

adminRouter.delete('/course/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
        const adminId = req.adminId;
        const courseId = req.params.id;

        const course = await Courses.findOneAndDelete({ _id: courseId, creatorId: adminId });

        if (!course) {
            return res.status(404).json({ message: "Course not found or unauthorized" });
        }
        redisClient.del(`courses:${adminId}`);


        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


export default adminRouter;
