"use client";
import { Button } from '@/components/ui/button';
import Webcam from 'react-webcam';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from "sonner"
import { chatSession } from '@/utils/GeminiAPIModal';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import moment from 'moment';


function RecordAnswerSection({mockInterviewQuestion, activeQuestionIndex, interviewData}) {
    const [userAnswer, setUserAnswer] = useState('');
    const {user} = useUser()
    const [Loading, setLoading] = useState(false)
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    useEffect(() => {
        if (results.length > 0) {
            setUserAnswer((prevAns) => prevAns + results[results.length - 1].transcript);       
        }
    }, [results]);

    useEffect(() => {
        if(!isRecording&&userAnswer?.length>10)
        {
            UpdateUserAnswer();
        }
    },[userAnswer])

    const StartStopRecording=async() => {
        if(isRecording){  
            stopSpeechToText()
        }   
        else
        {
            startSpeechToText();
        }
    }

    const UpdateUserAnswer= async()=>{
       console.log(userAnswer)
        setLoading(true)
        const feedbackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.Question+", User Answer:"+userAnswer+"Depends on question and user answer for give interview question"+
        " please give us rating for answer and feedback as area of improvement if any"+"in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";
        
        const result = await chatSession.sendMessage(feedbackPrompt);

        const mockJsonResp = (result.response.text()).replace('```json', '').replace('```','');
        console.log(mockJsonResp);
        const JsonFeedbackResp=JSON.parse(mockJsonResp)

        const resp = await db.insert(UserAnswer)
        .values({
            mockIdRef : interviewData?.mockId,
            question:mockInterviewQuestion[activeQuestionIndex]?.Question,
            correctAns:mockInterviewQuestion[activeQuestionIndex]?.Answer,
            userAns:userAnswer,
            feedback:JsonFeedbackResp?.feedback,
            rating:JsonFeedbackResp?.rating,
            userEmail:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM-yyyy')
        })

        if(resp)
        {
            toast('User message stored successfully')
            setUserAnswer('');
            setResults([]);
        }
        setResults([]);

        setLoading(false);
    }
    
    return (
        <div className="flex flex-col items-center justify-center">
            {/* Webcam Section */}
            <div className="flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5 relative">
                <Image
                    src="/webcam.png"
                    width={200}
                    height={200}
                    className="absolute opacity-50"
                    alt="Camera"
                />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: "100%",
                        zIndex: 10,
                    }}
                />
            </div>

            {/* Recording Button */}
            <Button
                disabled={Loading}
                variant="outline"
                className="my-10 flex items-center space-x-2"
                onClick={StartStopRecording}
            >
                {isRecording ? (
                    <div className="flex items-center space-x-2 text-red-600">
                        <Mic />
                        Stop Recording...
                    </div>
                ) : (
                    'Record Answer'
                )}
            </Button>    
        </div>
    );
}

export default RecordAnswerSection;
