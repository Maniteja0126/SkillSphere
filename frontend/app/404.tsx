"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="text-center">
        <motion.h1
          className="text-6xl font-extrabold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          404
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-gray-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </motion.p>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/">
            <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg text-white font-medium hover:shadow-xl transition duration-300">
              Go Home
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPage;
