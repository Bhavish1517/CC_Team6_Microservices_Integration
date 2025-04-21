import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Tutorial = ({ tutorial }) => {
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState(0);
  const [moduleProgress, setModuleProgress] = useState(
    tutorial.modules.map(module => ({
      completed: false,
      currentQuestion: 0,
      answers: new Array(module.questions.length).fill(null)
    }))
  );

  const checkAnswer = (questionIndex) => {
    const newProgress = [...moduleProgress];
    const currentModuleProgress = newProgress[currentModule];
    const currentQuestion = tutorial.modules[currentModule].questions[questionIndex];
    
    if (currentModuleProgress.answers[questionIndex] === currentQuestion.correctAnswer) {
      // If all questions are answered correctly, mark module as completed
      const allCorrect = currentModuleProgress.answers.every((answer, idx) => 
        answer === tutorial.modules[currentModule].questions[idx].correctAnswer
      );
      if (allCorrect) {
        currentModuleProgress.completed = true;
      }
    }
    
    setModuleProgress(newProgress);
  };

  // Function to get embed URL from video URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
    }
    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/(?:vimeo\.com\/|video\/)(\d+)/);
      return videoId ? `https://player.vimeo.com/video/${videoId[1]}` : url;
    }
    return url;
  };

  const handleModuleChange = (index) => {
    if (index < 0 || index >= tutorial.modules.length) return;
    setCurrentModule(index);
  };

  const currentModuleData = tutorial.modules[currentModule];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </button>
        <div className="flex space-x-4">
          <button
            onClick={() => handleModuleChange(currentModule - 1)}
            disabled={currentModule === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Previous Module
          </button>
          <button
            onClick={() => handleModuleChange(currentModule + 1)}
            disabled={currentModule === tutorial.modules.length - 1}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next Module
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {tutorial.modules.map((module, index) => (
          <button
            key={index}
            onClick={() => handleModuleChange(index)}
            className={`p-4 rounded-lg border ${
              index === currentModule
                ? 'border-blue-600 bg-blue-50'
                : moduleProgress[index].completed
                ? 'border-green-600 bg-green-50'
                : 'border-gray-300'
            }`}
          >
            <div className="text-sm font-medium">Module {index + 1}</div>
            <div className="text-xs mt-1">{module.title}</div>
          </button>
        ))}
      </div>

      <div className="border p-6 rounded-xl shadow-sm space-y-6">
        <h2 className="text-2xl font-bold mb-4">{currentModuleData.title}</h2>

        {tutorial.videoUrl && (
          <div className="relative pb-[56.25%] h-0 mb-6">
            <iframe
              src={getEmbedUrl(tutorial.videoUrl)}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
              title={tutorial.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}

        <div className="prose max-w-none mb-6">
          {currentModuleData.content}
        </div>

        <div className="space-y-8">
          {currentModuleData.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="border p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Question {questionIndex + 1}</h3>
              <p className="mb-4">{question.question}</p>
              
              <div className="space-y-2">
                {question.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex items-center">
                    <input
                      type="radio"
                      name={`q-${currentModule}-${questionIndex}`}
                      value={opt}
                      onChange={() => {
                        const newProgress = [...moduleProgress];
                        newProgress[currentModule].answers[questionIndex] = opt;
                        setModuleProgress(newProgress);
                      }}
                      checked={moduleProgress[currentModule].answers[questionIndex] === opt}
                      disabled={moduleProgress[currentModule].answers[questionIndex] !== null}
                      className="mr-2"
                    />
                    <label>{opt}</label>
                  </div>
                ))}
              </div>

              {moduleProgress[currentModule].answers[questionIndex] === null ? (
                <button
                  onClick={() => checkAnswer(questionIndex)}
                  disabled={!moduleProgress[currentModule].answers[questionIndex]}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Submit Answer
                </button>
              ) : (
                <div className={`mt-4 ${
                  moduleProgress[currentModule].answers[questionIndex] === question.correctAnswer
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {moduleProgress[currentModule].answers[questionIndex] === question.correctAnswer
                    ? 'Correct!'
                    : `Incorrect. The correct answer is: ${question.correctAnswer}`}
                </div>
              )}
            </div>
          ))}
        </div>

        {moduleProgress[currentModule].completed && (
          <div className="mt-6 p-4 bg-green-50 border border-green-600 rounded-lg">
            <p className="text-green-600 font-medium">
              Congratulations! You've completed this module.
              {currentModule < tutorial.modules.length - 1 && " You can now move on to the next module."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorial;
