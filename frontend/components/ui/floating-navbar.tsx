"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { IconSun, IconMoon, IconShoppingCart } from "@tabler/icons-react";
import { authState } from "@/recoil/atoms/authAtom";
import { useRecoilValue } from "recoil";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isLoggedIn } = useRecoilValue(authState);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  if (!isMounted) {
    return null; 
  }

  return (
    <div
      className={cn(
        "flex fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full backdrop-blur-md bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-50 shadow-lg z-[5000] pr-4 py-2 px-6 items-center",
        className
      )}
    >
      <Link href={"/"}>
        <div className="text-xl font-semibold text-black dark:text-white hidden sm:block">
          SkillSphere
        </div>
        <span className="block sm:hidden text-xl font-semibold">SS</span>
      </Link>

      <div className="flex-grow flex justify-center space-x-4 mx-4">
        {navItems.map((navItem, idx) => (
          <Link
            key={`link-${idx}`}
            href={navItem.link}
            className="relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </Link>
        ))}
      </div>

      <button
        className="ml-4 text-sm font-medium border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-5 py-2 rounded-full"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <IconSun /> : <IconMoon />}
      </button>

      {isLoggedIn ? (
        <Link
          href="/purchases"
          className="relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
        >
          <span className="block sm:hidden">
            <IconShoppingCart className="w-5 h-5" />
          </span>
          <span className="hidden sm:block text-sm">Purchases</span>
        </Link>
      ) : (
        <button
          className="text-sm font-medium border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-5 py-2 rounded-full"
          onClick={() => router.push("/auth/signin")}
        >
          <span>Login</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
        </button>
      )}
    </div>
  );
};
