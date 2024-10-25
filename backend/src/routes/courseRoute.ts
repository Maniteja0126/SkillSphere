import { Request, Response, Router } from "express";
import { userMiddleware } from "../middleware/user";
import { User, Purchases, Courses } from "../db";
import { Connection, ParsedInstruction, PartiallyDecodedInstruction, PublicKey } from "@solana/web3.js";
import { RECEIVER_WALLET_ADDRESS } from "../config";
import dotenv from "dotenv";
import redisClient from "../redisClient";
import mongoose from "mongoose";
dotenv.config();

const courseRouter = Router();

const SOLANA_CONNECTION_URL = process.env.SOLANA_CONNECTION_URL || ""; 

if (!SOLANA_CONNECTION_URL) {
    throw new Error("SOLANA_CONNECTION_URL is not defined");
}

console.log(`Connecting to Solana at: ${SOLANA_CONNECTION_URL}`);
const connection = new Connection(SOLANA_CONNECTION_URL);

const receiverWalletAddress = RECEIVER_WALLET_ADDRESS;

function isParsedInstruction(
  instr: ParsedInstruction | PartiallyDecodedInstruction
): instr is ParsedInstruction {
  return (instr as ParsedInstruction).parsed !== undefined;
}

courseRouter.post('/purchase', userMiddleware, async (req: Request, res: Response) => {
    const userId = req.userId;
    const { courseId, transactionSignature } = req.body;
  
    if (!courseId || !transactionSignature) {
      return res.status(400).json({ message: "Course ID and transaction signature are required" });
    }
  
    try {
      const course = await Courses.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      const existingPurchase = await Purchases.findOne({signature :  transactionSignature });
      if (existingPurchase) {
        return res.status(400).json({ message: "This transaction has already been used for a purchase" });
      };
  
      const transaction = await connection.getParsedTransaction(transactionSignature, {
          commitment: 'finalized',
          maxSupportedTransactionVersion: 0
      });
  
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
  
  
      const transferInstruction = transaction.transaction.message.instructions.find((instr) => {
        console.log("Checking Instruction:", JSON.stringify(instr));
        return (
          isParsedInstruction(instr) &&
          instr.programId.toString() === "11111111111111111111111111111111" &&
          instr.parsed.type === "transfer" &&
          instr.parsed.info.destination === receiverWalletAddress
        );
      });
  
      if (!transferInstruction) {
        console.log("No valid transfer instruction found");
        return res.status(400).json({ message: "Invalid transaction: No valid transfer to receiver wallet." });
      }

  
      await Purchases.create({
        userId, 
        courseId,
        signature : transactionSignature,
      });
  
      console.log(`Course ${courseId} purchased by user ${userId} with transaction ${transactionSignature}`);
  
      return res.json({ message: "Course purchased successfully" });
  
    } catch (error) {
      console.error("Error processing purchase:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

courseRouter.get("/preview", async (req: Request, res: Response) => {
    const cachedCourses = await redisClient.get('allCourses');
    if(cachedCourses){
        console.log("Returning from the cashed data");
        return res.json(JSON.parse(cachedCourses));
    }
    try {
        const courses = await Courses.find({});
        await redisClient.setEx('allCourses' , 3600 , JSON.stringify(courses));

        res.json({ data: courses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

courseRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  try {
    const cachedCourse = await redisClient.get(id);
    if (cachedCourse) {
      console.log("Returning from cached data");
      return res.json(JSON.parse(cachedCourse));
    }

    const course = await Courses.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await redisClient.setEx(id, 3600, JSON.stringify(course)); 

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default courseRouter;
