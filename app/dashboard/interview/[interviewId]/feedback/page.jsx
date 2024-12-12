"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { index } from "drizzle-orm/mysql-core";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; 

function Feedback({ params }) {
  const [feedback, setFeedback] = useState([]);
  const router=useRouter()
  const [interviewId, setInterviewId] = useState(null);

  // Unwrap params using React.use()
  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setInterviewId(resolvedParams.interviewId);
    }
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (interviewId) {
      GetFeedback();
    }
  }, [interviewId]);

  const GetFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(UserAnswer.id);

      console.log(result);
      setFeedback(result);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

   
  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
      <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
      
      {feedback?.length==0?
      <h2 className="font-bold text-xl text-gray-500">No Interview Feedback Available</h2>
       :
      <>
      <h2 className="text-blue-700 text-lg my-3">
        Your overall interview rating: <strong>7/10</strong>
      </h2>

      <h2 className="text-sm text-gray-500">Find below interview details:</h2>
      {feedback && feedback.length > 0 ? (
        feedback.map((item, index) => (
          <Collapsible key={index} className="mt-7">
            <CollapsibleTrigger className="p-2 bg-gray-400 rounded-lg flex justify-between my-2 text-left gap-7 w-full">
              Question: {item.question} <ChevronsUpDown className="h-4 w-4"/>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                <h2 className="text-red-500 p-2 border rounded-lg"><strong>Rating: </strong>{item.rating}</h2>
                <h2 className="p-2 border rounded-lg bg-red-200 text-sm text-red-900"><strong>Your Answer: </strong>{item.userAns}</h2>
                <h2 className="p-2 border rounded-lg bg-blue-200 text-sm text-red-900"><strong>Correct Answer: </strong>{item.correctAns}</h2>
                <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-green-900"><strong>Feedback: </strong>{item.feedback}</h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))
      ) : (
        <p className="text-gray-500">No feedback available.</p>
      )}
</> }

      <Button onClick={() => router.replace('/dashboard')} className='bg-blue-800'>Go Home</Button>
    </div>
  );
}

export default Feedback;
