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
import { useSetRecoilState } from "recoil";
import { authState } from "@/recoil/atoms/authAtom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const setAuth = useSetRecoilState(authState);

  async function handleSignIn() {
    if (!email || !password) {
      toast({
        variant : 'destructive',
        title: 'Please fill in all fields',
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const user = response.data.user;
      setAuth({isLoggedIn : true , user});
      toast({
        title :'Logged in successfully!'
      });
      router.push("/");
    } catch (error) {
      toast({
        variant : "destructive",
        title :"Failed to sign in. Please try again."
      })
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center mt-5">
      <Card className="w-[350px] shadow-lg dark:shadow-lg dark:shadow-slate-800 px-5">
        <CardHeader className="space-y-1 -ml-5">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your email below to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
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
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="w-full mt-4"
            type="submit"
            disabled={isLoading}
            onClick={handleSignIn}
          >
            {isLoading ? (
              <div className="animate-spin">
                <Loader2 />
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-gray-600 mt-2">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
