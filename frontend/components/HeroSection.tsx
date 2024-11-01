"use client";

import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import block from "@/app/block.png";
import web from "@/app/web.png";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection = () => {
  const { scrollY } = useScroll();

  const wiggleX = useTransform(scrollY, [0, 100, 200], [-5, 5, -5]);
  const scrollYTransform = useTransform(scrollY, [0, 300], [0, 50]);

  return (
    <motion.div
      className="flex flex-col md:flex-row justify-center items-center p-4 md:p-8 mt-20" 
      style={{ x: wiggleX, y: scrollYTransform }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <motion.div
        className="w-32 h-32 mb-4 md:mb-0 md:w-40" 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image src={block} alt="block image"  />
      </motion.div>

      <div className="flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="border-neutral-200 dark:border-white/[0.2] text-black dark:text-white"
        >
          <h1 className="text-2xl md:text-4xl font-semibold tracking-wide">
            Start Your Web and Web3 Journey with us
          </h1>
          <div className="font-medium text-md md:text-lg leading-snug text-gray-700 dark:text-white/50 mt-2">
            Join Our courses and get firsthand knowledge about web and web3
          </div>
        </motion.div>

        <div className="text-center mt-4"> 
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center inline-flex items-center justify-center"
          >
            <Button className="text-white text-sm font-medium relative px-6 py-3 bg-gradient-to-r from-pink-600 to-blue-600 rounded-full shadow-md hover:shadow-lg transition duration-300">
              View Courses
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="w-32 h-32 mt-4 md:mt-0 md:w-40" 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Image src={web} alt="web image" layout="responsive" objectFit="contain" />
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
