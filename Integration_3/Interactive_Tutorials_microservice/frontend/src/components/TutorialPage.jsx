import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const TutorialPage = () => {
  const { id } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const getEmbedUrl = (url) => {
    try {
      // Handle YouTube URLs
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        // Extract video ID
        let videoId = '';
        if (url.includes('youtube.com/watch')) {
          const urlParams = new URLSearchParams(new URL(url).search);
          videoId = urlParams.get('v');
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      // Return original URL if not a YouTube URL or invalid format
      return url;
    } catch (err) {
      console.error('Error parsing video URL:', err);
      return url;
    }
  };

  useEffect(() => {
    fetchTutorial();
  }, [id]);

  const fetchTutorial = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutorials/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tutorial');
      }
      const data = await response.json();
      setTutorial(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (tutorial.modules) {
      // Complex structure
      const currentQuestionData = tutorial.modules[currentModule].questions[currentQuestion];
      setIsCorrect(answer === currentQuestionData.correctAnswer);
    } else {
      // Simple structure
      setIsCorrect(answer === tutorial.correctAnswer);
    }
  };

  const handleNext = () => {
    if (tutorial.modules) {
      // Complex structure
      if (currentQuestion < tutorial.modules[currentModule].questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else if (currentModule < tutorial.modules.length - 1) {
        setCurrentModule(prev => prev + 1);
        setCurrentQuestion(0);
      }
    } else {
      // Simple structure
      if (currentStep < tutorial.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
    setSelectedAnswer('');
    setShowResult(false);
  };

  const handlePrevious = () => {
    if (tutorial.modules) {
      // Complex structure
      if (currentQuestion > 0) {
        setCurrentQuestion(prev => prev - 1);
      } else if (currentModule > 0) {
        setCurrentModule(prev => prev - 1);
        setCurrentQuestion(tutorial.modules[currentModule - 1].questions.length - 1);
      }
    } else {
      // Simple structure
      if (currentStep > 0) {
        setCurrentStep(prev => prev - 1);
      }
    }
    setSelectedAnswer('');
    setShowResult(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Tutorial not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Back to Home link */}
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tutorials
        </Link>

        <h1 className="text-3xl font-bold mb-4">{tutorial.title}</h1>
        <p className="text-gray-600 mb-8">{tutorial.description}</p>

        {tutorial.videoUrl && (
          <div className="mb-8 aspect-w-16 aspect-h-9">
            <iframe
              src={getEmbedUrl(tutorial.videoUrl)}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            ></iframe>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>
              {tutorial.modules 
                ? `Module ${currentModule + 1}/${tutorial.modules.length}`
                : `Step ${currentStep + 1}/${tutorial.steps?.length || 1}`
              }
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${tutorial.modules
                  ? ((currentModule * 100) / Math.max(1, tutorial.modules.length - 1))
                  : ((currentStep * 100) / Math.max(1, (tutorial.steps?.length || 1) - 1))}%`
              }}
            ></div>
          </div>
        </div>

        {/* Navigation buttons - Always visible at the top */}
        <div className="flex justify-between gap-4 mb-6">
          <button
            onClick={handlePrevious}
            disabled={
              tutorial.modules
                ? currentModule === 0 && currentQuestion === 0
                : currentStep === 0
            }
            className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {((tutorial.modules && (currentQuestion < tutorial.modules[currentModule].questions.length - 1 ||
            currentModule < tutorial.modules.length - 1)) ||
            (!tutorial.modules && currentStep < tutorial.steps?.length - 1)) && (
            <button
              onClick={handleNext}
              disabled={tutorial.modules ? !showResult && !isCorrect : false}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>

        {/* Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          {tutorial.modules ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Module {currentModule + 1}: {tutorial.modules[currentModule].title}
              </h2>
              <p className="text-gray-700 mb-6">{tutorial.modules[currentModule].content}</p>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Question {currentQuestion + 1}: {tutorial.modules[currentModule].questions[currentQuestion].question}
                </h3>
                <div className="space-y-2">
                  {tutorial.modules[currentModule].questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showResult}
                      className={`w-full p-4 text-left rounded-lg border ${
                        showResult
                          ? option === tutorial.modules[currentModule].questions[currentQuestion].correctAnswer
                            ? 'bg-green-100 border-green-500'
                            : selectedAnswer === option
                            ? 'bg-red-100 border-red-500'
                            : 'bg-gray-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {showResult && (
                  <div className={`p-4 rounded-lg ${
                    isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {isCorrect ? 'Correct!' : 'Incorrect. Try again!'}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Step {currentStep + 1}</h2>
              <p className="text-gray-700 mb-6">{tutorial.steps?.[currentStep]}</p>

              {currentStep === (tutorial.steps?.length || 0) - 1 && tutorial.question && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{tutorial.question}</h3>
                  <div className="space-y-2">
                    {tutorial.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={showResult}
                        className={`w-full p-4 text-left rounded-lg border ${
                          showResult
                            ? option === tutorial.correctAnswer
                              ? 'bg-green-100 border-green-500'
                              : selectedAnswer === option
                              ? 'bg-red-100 border-red-500'
                              : 'bg-gray-50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {showResult && (
                    <div className={`p-4 rounded-lg ${
                      isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {isCorrect ? 'Correct!' : 'Incorrect. Try again!'}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Navigation buttons - Also at the bottom */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={handlePrevious}
            disabled={
              tutorial.modules
                ? currentModule === 0 && currentQuestion === 0
                : currentStep === 0
            }
            className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {((tutorial.modules && (currentQuestion < tutorial.modules[currentModule].questions.length - 1 ||
            currentModule < tutorial.modules.length - 1)) ||
            (!tutorial.modules && currentStep < tutorial.steps?.length - 1)) && (
            <button
              onClick={handleNext}
              disabled={tutorial.modules ? !showResult && !isCorrect : false}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialPage; 