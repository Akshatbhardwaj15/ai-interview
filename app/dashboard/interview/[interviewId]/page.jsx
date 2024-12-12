"use client"
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { use } from "react"; // Required for unwrapping the Promise
import Webcam from "react-webcam";



function Interview({ params }) {
  // Unwrap the promise using React.use()

  const [interviewData, setInterviewData] = useState()
  const [webcamEnabled, setWebcamEnabled] = useState(false)
 

  const unwrappedParams = use(params);

  useEffect(() => {
    console.log("Interview ID:", unwrappedParams.interviewId);
    GetInterviewDetails(unwrappedParams.interviewId);
  }, []);

  const GetInterviewDetails = async (interviewId) => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));


      setInterviewData(result[0])

      if (result.length === 0) {
        console.warn("No record found for this Interview ID.");
      } else {
        console.log("Query Result:", result);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }

  };

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">


        {interviewData ? (
          <div className="flex flex-col my-5">
            <div className="flex flex-col rounded-lg border gap-5">
              <h2 className="text-lg">
                <strong>Job Role/Job Position:</strong> {interviewData.jobPosition}
              </h2>
              <h2 className="text-lg">
                <strong>Job Description/Tech Stack:</strong> {interviewData.jobDesc}
              </h2>
              <h2 className="text-lg">
                <strong>Job Experience:</strong> {interviewData.jobExperience}
              </h2>
            </div>
            <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-200">
                <h2 className="flex gap-2 items-center"> <Lightbulb /><strong>Information</strong></h2>
                <h2 className="mt-3 text-yellow-500">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
            </div>
          </div>
        ) : (
          <p>Loading interview details...</p>
        )}

        <div>
          {webcamEnabled ? (<Webcam
            onUserMedia={() => setWebcamEnabled(true)}
            onUserMediaError={() => setWebcamEnabled(false)}
            mirrored={true}
            style={{
              height: 300,
              width: 300
            }} />)
            : (
              <div className="flex flex-col justify-center items-center">
                <WebcamIcon className="my-7 h-72 w-full bg-gray-300 rounded-lg border" />
                <Button  onClick={() => setWebcamEnabled(true)} className='bg-gray-200 w-full font-semibold text-black hover:text-white transition-all duration-200'>Enable Web Cam and Microphone</Button>
              </div>                                                                                                     
            )
          }
        </div>

      </div>
      <div className="flex justify-end items-end mt-3">
        <Link href={'/dashboard/interview/'+unwrappedParams.interviewId+'/start'}>
        <Button className="bg-blue-700">Start Interview</Button> 
        </Link>
            
      </div>
 
    </div>
  );
}

export default Interview;
