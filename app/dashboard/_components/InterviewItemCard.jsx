import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { format } from "date-fns";

function InterviewItemCard({ interview }) {
  const router = useRouter();

  const onStart = () => {
    router.push("/dashboard/interview/"+interview?.mockId);
  };

  const onFeedbackPress = () => {
    router.push("/dashboard/interview/"+interview?.mockId+"/feedback");
  };

  return (
    <div className="border shadow-sm rounded-lg p-3 mb-2">
      <h2 className="font-bold text-blue-700">
        {interview?.jobPosition || "No Position Specified"}
      </h2>
      <h2 className="text-sm text-gray-500">
        {interview?.jobExperience
          ? `${interview.jobExperience} Years of Experience`
          : "Experience Not Provided"}
      </h2>
      <h2 className="text-xs text-gray-700">
        Created At:{" "}
        {interview?.createdAt
          ? format(new Date(interview.createdAt), "PPP")
          : "N/A"}
      </h2>
      <div className="flex justify-between mt-2 gap-5">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={onFeedbackPress}
        >
          Feedback
        </Button>
        <Button size="sm" className="bg-blue-800 text-white w-full" onClick={onStart}>
          Start
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
