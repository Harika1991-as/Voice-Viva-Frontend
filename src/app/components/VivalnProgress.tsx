import { useState, useEffect } from 'react';
import { Volume2, Mic, ArrowRight, ArrowLeft, List, X, Clock } from 'lucide-react';
import {useRef } from "react";
const silenceTimerRef = useRef<number | null>(null);

interface VivaInProgressProps {
  onComplete: () => void;
  duration?: number; // Total duration in minutes
}

interface Answer {
  questionIndex: number;
  recorded: boolean;
  recordedAt?: number;
}

const questions = [
  'What is a data structure?',
  'Explain the difference between an array and a linked list.',
  'What is time complexity?',
  'Describe the working of a stack data structure.',
  'What is recursion and when should it be used?',
  'Explain binary search algorithm.',
  'What is the difference between BFS and DFS?',
  'Describe a hash table and its use cases.',
  'What is dynamic programming?',
  'Explain the concept of Big O notation.',
];

export default function VivaInProgress({ onComplete, duration = 30 }: VivaInProgressProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [systemSpeaking, setSystemSpeaking] = useState(true);
  const [studentSpeaking, setStudentSpeaking] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showNavigation, setShowNavigation] = useState(false);
  const silenceTimerRef = useRef<number | null>(null);

 

  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [canSubmit, setCanSubmit] = useState(false);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        // Enable submit button when 8 minutes are left (e.g., 30 min total - 8 min = 22 min elapsed)
        const minTimeBeforeSubmit = (duration - 8) * 60; // Convert to seconds
        if (newTime >= minTimeBeforeSubmit) {
          setCanSubmit(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate remaining time
  const remainingTime = duration * 60 - elapsedTime;
  const timeUntilSubmit = Math.max(0, (duration - 8) * 60 - elapsedTime);

  // Simulate system speaking animation and auto-start recording
  useEffect(() => {
    // Only auto-start for unanswered questions
    const isAnswered = isQuestionAnswered(currentQuestionIndex);
    
    if (!isAnswered) {
      setSystemSpeaking(true);
      setStudentSpeaking(false);
      
      // System speaks for 2 seconds, then auto-start recording
      const timer = setTimeout(() => {
        setSystemSpeaking(false);
        // Auto-start recording after question is read
        setStudentSpeaking(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // For answered questions, just show them without auto-speaking or recording
      setSystemSpeaking(false);
      setStudentSpeaking(false);
    }
  }, [currentQuestionIndex]);
  
  
  // Auto-stop recording after 3 seconds of silence (simulated)
  useEffect(() => {
  if (studentSpeaking) {
    silenceTimerRef.current = window.setTimeout(() => {
      handleStopRecording();
    }, 5000); // 5 seconds
  }

  return () => {
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };
}, [studentSpeaking, currentQuestionIndex]);

  const handleStopRecording = () => {
    setStudentSpeaking(false);
    
    // Save the answer
    const newAnswer: Answer = {
      questionIndex: currentQuestionIndex,
      recorded: true,
      recordedAt: Date.now(),
    };
    
    const updatedAnswers = answers.filter(a => a.questionIndex !== currentQuestionIndex);
    setAnswers([...updatedAnswers, newAnswer]);
  };
  const handleNextQuestion = () => {
  if (silenceTimerRef.current !== null) {
    window.clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
  }

  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setStudentSpeaking(false);
  } else {
    onComplete();
  }
};
  const handlePreviousQuestion = () => {
  if (silenceTimerRef.current !== null) {
    window.clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
  }

  if (currentQuestionIndex > 0) {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    setStudentSpeaking(false);
  }
};
 
  const handleNavigateToQuestion = (index: number) => {
  if (silenceTimerRef.current !== null) {
    window.clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
  }

  setCurrentQuestionIndex(index);
  setShowNavigation(false);
};

  const handleReRecord = () => {
    setStudentSpeaking(true);
  };

  const isQuestionAnswered = (index: number) => {
    return answers.some(a => a.questionIndex === index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Timer Banner */}
        <div className={`mb-6 rounded-xl shadow-sm p-4 flex items-center justify-between ${
          remainingTime <= 300 ? 'bg-red-100 border border-red-200' : 'bg-white'
        }`}>
          <div className="flex items-center gap-3">
            <Clock className={`w-6 h-6 ${remainingTime <= 300 ? 'text-red-600' : 'text-blue-500'}`} />
            <div>
              <p className="text-gray-700">Time Remaining</p>
              <p className={`text-2xl ${remainingTime <= 300 ? 'text-red-700' : 'text-gray-900'}`}>
                {formatTime(remainingTime)}
              </p>
            </div>
          </div>
          {!canSubmit && (
            <div className="text-right">
              <p className="text-gray-600">Submit enabled in</p>
              <p className="text-blue-600">{formatTime(timeUntilSubmit)}</p>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
              </span>
              <button
                onClick={() => setShowNavigation(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200"
              >
                <List className="w-4 h-4" />
                View All Questions
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-8">
            <h2 className="text-gray-900 mb-2">Question {currentQuestionIndex + 1}</h2>
            <p className="text-2xl text-gray-800">{questions[currentQuestionIndex]}</p>
          </div>

          {/* System Voice Indicator */}
          <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-4">
              <div className={`bg-blue-500 p-3 rounded-full ${systemSpeaking ? 'animate-pulse' : ''}`}>
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 mb-2">
                  {systemSpeaking ? 'System is asking the question' : 'Question reading complete'}
                </p>
                {/* System Waveform */}
                {systemSpeaking && (
                  <div className="flex items-center gap-1 h-8">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-blue-500 rounded-full animate-wave"
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.05}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student Voice Indicator */}
          <div className="mb-8 p-6 bg-teal-50 rounded-xl border border-teal-200">
            <div className="flex items-center gap-4">
              <div
                className={`bg-teal-500 p-3 rounded-full ${
                  studentSpeaking ? 'animate-pulse' : ''
                }`}
              >
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 mb-2">
                  {studentSpeaking ? 'Recording your answer...' : isQuestionAnswered(currentQuestionIndex) ? 'Answer recorded' : 'Waiting to record...'}
                </p>
                {/* Student Waveform */}
                {studentSpeaking && (
                  <div className="flex items-center gap-1 h-8">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-teal-500 rounded-full animate-wave"
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.05}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Re-record Button */}
          {isQuestionAnswered(currentQuestionIndex) && !studentSpeaking && (
            <div className="mb-6">
              <button
                onClick={handleReRecord}
                className="w-full bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-all duration-200 hover:shadow-lg"
              >
                Re-record Answer
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>
            
            <button
              onClick={handleNextQuestion}
              className="flex-1 flex items-center justify-center gap-3 bg-blue-500 text-white px-8 py-4 rounded-xl hover:bg-blue-600 transition-all duration-200 hover:shadow-lg"
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                'Complete Viva'
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <p className="text-gray-600">
            Recording auto-starts after question • Auto-stops when you pause speaking
          </p>
        </div>
      </div>

      {/* Navigation Overlay */}
      {showNavigation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-gray-900">Question Palette</h2>
                <p className="text-gray-600 mt-1">Click on a question number to navigate</p>
              </div>
              <button
                onClick={() => setShowNavigation(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[calc(80vh-140px)]">
              {/* Legend */}
              <div className="mb-6 flex flex-wrap gap-6 justify-center bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center text-white">1</div>
                  <span className="text-gray-700">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white">2</div>
                  <span className="text-gray-700">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 flex items-center justify-center text-gray-700">3</div>
                  <span className="text-gray-700">Not Answered</span>
                </div>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-10 gap-3">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigateToQuestion(index)}
                    className={`aspect-square rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                      index === currentQuestionIndex
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : isQuestionAnswered(index)
                        ? 'bg-teal-500 text-white hover:bg-teal-600'
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                    title={`Question ${index + 1}${isQuestionAnswered(index) ? ' (Answered)' : ''}${index === currentQuestionIndex ? ' (Current)' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-teal-50 p-4 rounded-xl text-center border border-teal-200">
                  <div className="text-3xl text-teal-600 mb-1">{answers.length}</div>
                  <div className="text-gray-700">Answered</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-200">
                  <div className="text-3xl text-blue-600 mb-1">{questions.length - answers.length}</div>
                  <div className="text-gray-700">Not Answered</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-200">
                  <div className="text-3xl text-gray-700 mb-1">{questions.length}</div>
                  <div className="text-gray-700">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}