"use client";
import React from "react";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  Connection,
} from "@solana/web3.js";
import axios from "axios";
import LoadingPage from "@/app/loading/loading-page";
import { useRouter } from "next/navigation";
import { authState } from "@/recoil/atoms/authAtom";
import { useRecoilValue } from "recoil";

interface CourseData {
  title: string;
  price: number;
  imageUrl: string;
  description: string;
}

interface CoursePageProps {
  params: {
    id: string;
  };
}

const connection = new Connection("https://api.devnet.solana.com");
const receiverAddress = new PublicKey(
  "7gK5CPAaiJ6aEECZ1PKFxDa1cGn7wUSvqUeS7S8HbgnG"
);

const CoursePage = ({ params }: CoursePageProps) => {
  const { id } = params;
  const { data, loading } = useFetch<CourseData>(`/course/${id}`);
  const { toast } = useToast();
  const router = useRouter();
  const { isLoggedIn } = useRecoilValue(authState);

  const handlePurchase = async () => {
    if (!data) {
      toast({
        title: "Course data is not available.",
      });
      return;
    }

    if (!isLoggedIn) {
      toast({
        title: "Please login to purchase the course.",
      });
      router.push('/auth/signin');
      return;
    }

    const provider = (window as any).solana;

    if (!provider) {
      toast({
        title: "Please install Phantom Wallet to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      await provider.connect(); 

      const lamports = data.price * 1e9; 
      const { blockhash } = await connection.getLatestBlockhash();

      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: provider.publicKey,
      }).add(
        SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: receiverAddress,
          lamports,
        })
      );

      const { signature } = await provider.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signature, "finalized");

      const { data: res } = await axios.post(
        process.env.NEXT_PUBLIC_COURSE_PURCHASE_URL || "",
        {
          courseId: id,
          transactionSignature: signature,
        },
        { withCredentials: true }
      );

      toast({
        title: "Purchase successful!",
        description: res.message,
      });
      router.push('/purchases');
    } catch (error) {
      console.error("Error during purchase:", error);
      toast({
        title: "Purchase failed. Please try again.",
      });
    }
  };

  if (loading) return <LoadingPage />;

  if (!data) {
    return <p className="m-auto flex justify-center">No course data available.</p>;
  }

  return (
    <div className="min-h-screen">
      <div className="w-full h-56 bg-blue-800"></div>

      <div className="w-full flex flex-col md:flex-row justify-between -mt-20 px-4 md:px-12">
        <div className="font-semibold text-3xl tracking-wide mb-4 md:mb-0">
          <h1>{data.title}</h1>
        </div>

        <Card className="shadow-lg rounded-lg w-full md:w-1/3">
          <CardContent>
            <Image
              src={data.imageUrl}
              alt={data.title}
              className="w-full h-64 object-cover rounded-t-lg"
              width={500}
              height={200}
            />
          </CardContent>
          <div className="p-6 flex justify-between items-center border-t">
            <div>
              <span className="block text-sm text-gray-500">Price</span>
              <p className="text-lg font-bold">{data.price} SOL</p>
            </div>
            <Button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              onClick={handlePurchase}
            >
              Buy Now
            </Button>
          </div>
        </Card>
      </div>

      <div className="px-4 md:px-10 lg:ml-2 lg:-mt-44 max-w-3xl mx-auto tracking-wider">
        <h2 className="text-2xl font-bold mb-4">Course Description</h2>
        <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-white">
          {data.description}
        </p>
      </div>
    </div>
  );
};

export default CoursePage;
