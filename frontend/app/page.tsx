"use client";

import React from "react";
import HeroSection from "@/components/HeroSection";
import Courses from "./courses/page";

export default function Home() {
  return (
      <div className="flex flex-col">
        <div className="flex-grow min-h-screen flex items-center justify-center ">
          <HeroSection />
        </div>

        <div className="flex-grow flex items-center justify-center h-screen mt-10 px-4 sm:px-8">
          <Courses />
        </div>

        <footer className="flex items-center justify-center p-4 bg-white dark:bg-black"></footer>
      </div>
  );
}
