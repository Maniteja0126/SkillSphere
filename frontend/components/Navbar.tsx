"use client";
import React from "react";
import { FloatingNav } from "./ui/floating-navbar";
import { IconHome, IconUser } from "@tabler/icons-react";


const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Courses",
    link: "/courses",
    icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
];

const Navbar = () => {

  return (
    <div className="flex justify-between">
      <FloatingNav navItems={navItems} />
    </div>
  );
};

export default Navbar;
