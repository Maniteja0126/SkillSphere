"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import axios from "axios";
export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName , setFirstName] = useState("");
  const [lastName , SetLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleSingUp() {
    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signup`, {
        firstName,
        lastName,
        email,
        password,
      });
      router.push("/auth/signin");
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center mt-14 ">
      <Card className="w-[350px] shadow-lg dark:shadow-lg  dark:shadow-slate-800 px-5">
        <CardHeader className="space-y-1 -ml-5">
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">First Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Mani"
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Last Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Teja"
              required
              onChange={(e) => SetLastName(e.target.value)}
            />
          </div>
          <div className="grid gap-2 mt-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="maniteja@gmail.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2 mt-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="*********"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="w-full mt-4"
            variant="default"
            type="submit"
            disabled={isLoading}
            onClick={handleSingUp}
          >
            {isLoading ? (
              <div className="animate-spin">
                <Loader2 />
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-gray-600 mt-2">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
