"use client";

import React from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import useFetch from "@/hooks/useFetch";
import LoadingPage from "../loading/loading-page";

interface CourseData {
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  _id: string;
}

const Courses = () => {
  const { data, loading } = useFetch<CourseData[]>(`/course/preview`);

  const courseItems = Array.isArray(data) ? data : data ? [data] : [];

  if (loading) return <LoadingPage />;


  return (
    <div className="max-w-5xl mx-auto px-8 mt-20 ">
      <HoverEffect items={courseItems} />
    </div>
  );
};

export default Courses;
