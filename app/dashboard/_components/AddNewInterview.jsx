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

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExp, setJobExp] = useState("");

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(jobPosition, jobDesc, jobExp);
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
              <Button type="submit" onClick={onSubmit}>
                Start Interview
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
