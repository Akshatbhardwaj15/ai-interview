"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { use } from "react";
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({ params }) {
    const unwrappedParams = use(params); // Remove the second declaration of `unwrappedParams`.

    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewData] = useState();
    const[activeQuestionIndex, setActiveQuestionIndex] = useState(0);

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

            const jsonMockResp = JSON.parse(result[0].jsonMockResp)
            console.log(jsonMockResp)
            setMockInterviewData(jsonMockResp)
            setInterviewData(result[0]);

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
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2'>
                {/* Question */}
                <QuestionSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex}/>

                {/* Video/ Audio recording */}
                <RecordAnswerSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex} interviewData={interviewData}/>
            </div>
            <div className='flex justify-end gap-6'>
                    {activeQuestionIndex>0&&
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
                    {activeQuestionIndex!=mockInterviewQuestion?.length-1 && 
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
                    {activeQuestionIndex==mockInterviewQuestion?.length-1 && 
                    <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
                    <Button>End Interview</Button></Link>}
            </div>
        </div>
    );
}

export default StartInterview;
