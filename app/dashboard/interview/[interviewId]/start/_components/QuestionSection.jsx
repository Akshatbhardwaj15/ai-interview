import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {
  // Correctly define textToSpeech function
  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech); // Fix method name
    } else {
      alert("Sorry, Your browser doesn't support this feature.");
    }
  };

  return (
    mockInterviewQuestion && (
      <div className="p-5 border rounded-lg my-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {mockInterviewQuestion.map((question, index) => (
            <h2
              key={index}
              className={`p-2 border rounded-full text-xs md:text-sm text-center cursor-pointer ${
                activeQuestionIndex === index ? 'bg-primary text-white' : ''
              }`}
            >
              Question #{index + 1}
            </h2>
          ))}
        </div>

        {/* Render the active question and answer */}
        {mockInterviewQuestion[activeQuestionIndex] && (
          <div>
            <h2 className="my-5 text-md md:text-lg font-bold mt-20">
              {mockInterviewQuestion[activeQuestionIndex]?.Question}
            </h2>
            {/* Add functionality to speak the question */}
            <Volume2
              className="cursor-pointer"
              onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.Question)} // Fix onClick
            />
            <div className="border rounded-lg p-5 bg-blue-100 mt-2">
              <h2 className="flex gap-2 items-center text-blue-700">
                <Lightbulb /> {/* Use Lightbulb icon correctly */}
                <strong>Note:</strong>
              </h2>
              <h2 className="text-sm text-blue-700 my-2">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
              
            </div>
            
          </div>
        )}
      </div>
    )
  );
}

export default QuestionsSection;
