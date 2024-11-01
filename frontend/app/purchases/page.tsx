"use client";

import React from "react";
import useFetch from "@/hooks/useFetch";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import LoadingPage from "../loading/loading-page";
import { error } from "console";
interface CourseData {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface DataResponse {
  purchases: CourseData[];
  coursesData: CourseData[];
}

const PurchasedCourses = () => {
  const { data, loading } = useFetch<DataResponse>(`/user/purchases`);

  if (loading) <LoadingPage />;


  return (
    <div className="max-w-5xl mx-auto px-4 mt-36">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data?.coursesData.map((course) => (
          <Card
            key={course._id}
            className="shadow-md hover:shadow-lg transition-shadow bg-gray-200 dark:bg-gray-900 cursor-pointer"
          >
            <CardContent>
              <div className="relative w-full h-48">
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  width={500}
                  height={200}
                  priority
                  className="object-cover rounded-lg"
                />
              </div>
              <CardTitle className="mt-4 text-lg font-semibold">
                {course.title}
              </CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PurchasedCourses;
