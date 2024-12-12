"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAPIModal";
import { Loader2, LoaderCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import { useRouter } from "next/navigation";


function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExp, setJobExp] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([])
  const {user} = useUser()
  const router = useRouter()


  const onSubmit = async(e) => {
    setLoading(true)
    e.preventDefault()
    console.log(jobPosition, jobDesc, jobExp);

    const InputPrompt = "Job Position: "+jobPosition+", Job Description: "+jobDesc+", Years of Experience: "+jobExp+", Depends on this information please give me "+process.env.NEXT_PUBLIC_QUESTION_LIMIT+" Interview question with Answered in Json Format, Give Question and Answered as field in JSON";

    const result = await chatSession.sendMessage(InputPrompt)
    const MockJsonResp = (result.response.text()).replace('```json', '').replace('```','');
    console.log(JSON.parse(MockJsonResp))
    setJsonResponse(MockJsonResp);
  
    if(MockJsonResp){
    const resp = await db.insert(MockInterview)
    .values({
      mockId:uuidv4(), 
      jsonMockResp:MockJsonResp,
      jobPosition:jobPosition,
      jobDesc:jobDesc,
      jobExperience:jobExp,
      createdBy:user?.primaryEmailAddress?.emailAddress,
      createdAt:moment().format('DD-MM-YYYY')
    }).returning({mockId:MockInterview.mockId})
  
    console.log("Inserted ID", resp)
    if(resp) //succesful
    {
      setOpenDialog(false)
      router.push('/dashboard/interview/'+resp[0]?.mockId)   //resp ko catch krne ke baad interview ke page pe bhej do. (mockid ke according sb hota hai)
    }
  }
  else{
    console.log("ERROR")
  }
    setLoading(false)
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lgg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+Add New</h2>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tell us more about your job.</DialogTitle>
            <DialogDescription>
              Please provide details about the job position, description, and experience.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div>
              <div className="mt-5 my-4">
                <label>Job Role/Job Position</label>
                <Input
                  placeholder="Ex. Full Stack Developer."
                  required
                  onChange={(event) => setJobPosition(event.target.value)}
                />
              </div>

              <div className="my-4">
                <label>Job Description/ Tech Stack (In Short)</label>
                <Textarea
                  placeholder="Ex. Full Stack Developer"
                  required
                  onChange={(event) => setJobDesc(event.target.value)}
                />
              </div>
              <div className="my-5">
                <label>Years of experience</label>
                <Input
                  placeholder="Ex. 5 years"
                  max={100}
                  required
                  onChange={(event) => setJobExp(event.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-5 justify-end">
              <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading? (
                <>
                <LoaderCircle/>'Generating from AI'
                </>
                ) : (
                  'Start Interview'
               ) }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
