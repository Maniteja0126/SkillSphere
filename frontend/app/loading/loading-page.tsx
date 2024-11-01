"use client";

import { motion } from "framer-motion";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
      >
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <motion.div
              key={i}
              className="w-5 h-5 dark:bg-white bg-slate-950  rounded-full"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
};

export default LoadingPage;
