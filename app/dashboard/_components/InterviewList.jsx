"use client";
import { db } from "@/utils/db"; // Adjust the import based on your project structure
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { MockInterview } from "@/utils/schema"; // Import MockInterview correctly
import InterviewItemCard from "./InterviewItemCard";

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    const result = await db
      .select()
      .from(MockInterview) // Correct table name
      .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)) // Correct email field
      .orderBy(desc(MockInterview.id)); // Correct field reference

    console.log(result);
    setInterviewList(result);

  };

  return (
    <div >
      <h2 className="font-medium text-xl">Previous Mock Interviews</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {interviewList &&
        interviewList.map((interview, index) => (
          <InterviewItemCard interview={interview} key={index} />
        ))}            
      </div>
    </div>
  );
}

export default InterviewList;
