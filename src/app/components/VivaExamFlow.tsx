import { useState, useEffect, useRef } from "react";
import {
  Volume2,
  Mic,
  ArrowRight,
  ArrowLeft,
  List,
  X,
  Clock,
  CircleAlert,
  CircleCheck
} from "lucide-react";

interface VivaExamFlowProps {
  onComplete: () => void;
}

interface Answer {
  questionIndex: number;
  recorded: boolean;
}

interface Question {
  id: number;
  text: string;
}

export default function VivaExamFlow({ onComplete }: VivaExamFlowProps) {
  /* ================= CONFIG ================= */
  const [duration, setDuration] = useState<number>(30);

  /* ================= BACKEND STATE ================= */
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  /* ================= UI STATE ================= */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [systemSpeaking, setSystemSpeaking] = useState(false);
  const [studentSpeaking, setStudentSpeaking] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showSubmissionConfirm, setShowSubmissionConfirm] = useState(false);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const stopReasonRef = useRef<"normal" | "rerecord" | null>(null);

  /* ================= AUDIO REFS ================= */
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const isRecordingRef = useRef(false);
  const vivaStartedRef = useRef(false);
  const forceReadRef = useRef(false);
  const activeQuestionRef = useRef<Question | null>(null);


  /* ================= HELPERS ================= */
  const isQuestionAnswered = (index: number) =>
    answers.some(a => a.questionIndex === index);

  /* ================= TIME ================= */
  const remainingTime = duration * 60 - elapsedTime;
  const timeUntilSubmit = Math.max(0, (duration - 8) * 60 - elapsedTime);

  /* ================= START VIVA ================= */
  useEffect(() => {
    if (vivaStartedRef.current) return;
    vivaStartedRef.current = true;

    const startViva = async () => {
      const subjectId = localStorage.getItem("selected_subject_id");
      if (!subjectId) return;

      const res = await fetch("http://localhost:5000/api/viva/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subject_id: Number(subjectId) })
      });

      if (!res.ok) return;

      const data = await res.json();
      setSessionId(data.session_id);
      setQuestions(data.questions);
      setDuration(data.duration_minutes);

      // 🔥 auto read ONLY first unanswered question
      setSystemSpeaking(true);
    };

    startViva();
  }, []);

  /* ================= MIC INIT ================= */
  /* ================= MIC INIT ================= */
useEffect(() => {
  if (!sessionId || !questions.length || mediaRecorderRef.current) return;

  const initMic = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
  isRecordingRef.current = false;
  setStudentSpeaking(false);

  // 🔒 Session must exist
  if (!sessionId) {
    console.warn("Session missing, skipping answer save");
    stopReasonRef.current = null;
    return;
  }

  // ✅ Use frozen question (CRITICAL FIX)
  const question = activeQuestionRef.current;
  if (!question) {
    stopReasonRef.current = null;
    return;
  }

  const audioBlob = new Blob(audioChunksRef.current, {
    type: "audio/webm",
  });
  audioChunksRef.current = [];

  // ⛔ Ignore empty audio but keep flow alive
  if (audioBlob.size < 1000) {
    stopReasonRef.current = null;
    return;
  }

  const formData = new FormData();
  formData.append("audio", audioBlob);
  formData.append("question_id", question.id.toString());

  // 🔥 NON-BLOCKING BACKEND SAVE
  fetch(`http://localhost:5000/api/viva/${sessionId}/answer`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })
    .then((res) => {
      if (res.status === 403) {
        console.warn("Viva already submitted. Answer ignored.");
      }
    })
    .catch((err) => {
      console.error("Answer save failed:", err);
    });

  // ✅ Update UI immediately (no await)
  setAnswers((prev) => [
    ...prev.filter((a) => a.questionIndex !== currentQuestionIndex),
    { questionIndex: currentQuestionIndex, recorded: true },
  ]);

  // ✅ Preserve re-record logic
  if (stopReasonRef.current !== "rerecord") {
    setSystemSpeaking(false);
  }

  stopReasonRef.current = null;
};



// ✅ REQUIRED (you already had this)

// ✅ THIS WAS MISSING
    mediaRecorderRef.current = recorder;
  };

  // ✅ THIS WAS MISSING
  initMic();

  // ✅ THIS WAS MISSING
}, [sessionId, questions, currentQuestionIndex]);
  /* ================= TIMER ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => {
        if (prev >= (duration - 8) * 60) setCanSubmit(true);
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);

  /* ================= SPEECH ================= */
  /* ================= SPEECH (STEP 5 FIX) ================= */
useEffect(() => {
  if (
    showSubmissionConfirm ||
    !systemSpeaking ||
    !questions[currentQuestionIndex]
  ) {
    return;
  }

  // ❗ Block TTS ONLY if answered AND NOT forced
  if (
    isQuestionAnswered(currentQuestionIndex) &&
    !forceReadRef.current
  ) {
    return;
  }

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(
    questions[currentQuestionIndex].text
  );

  utterance.rate = 0.9;

  utterance.onend = () => {
    forceReadRef.current = false; // reset
    setSystemSpeaking(false);
    startRecording(); // auto start recording
  };

  speechSynthesis.speak(utterance);

  return () => speechSynthesis.cancel();
}, [systemSpeaking, currentQuestionIndex]);

  /* ================= RECORDING ================= */
  const startRecording = () => {
  const recorder = mediaRecorderRef.current;
  if (!recorder || recorder.state !== "inactive") return;

  // 🔒 Freeze question for this recording
  activeQuestionRef.current = questions[currentQuestionIndex];

  audioChunksRef.current = [];
  recorder.start();
  isRecordingRef.current = true;
  setStudentSpeaking(true);

  startSilenceDetection();

  // ⏱ Hard safety cap (15s max)
  setTimeout(() => {
    if (recorder.state === "recording") stopRecording();
  }, 15000);
};


  const stopRecording = (reason: "normal" | "rerecord" = "normal") => {
  const recorder = mediaRecorderRef.current;
  if (!recorder || recorder.state !== "recording") return;

  // ✅ MARK ANSWER IMMEDIATELY (UI FIRST)
  setAnswers(prev => [
    ...prev.filter(a => a.questionIndex !== currentQuestionIndex),
    { questionIndex: currentQuestionIndex, recorded: true }
  ]);

  stopReasonRef.current = reason;
  recorder.stop();
  isRecordingRef.current = false;

  if (silenceTimerRef.current) {
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
  }
};



  /* ================= SILENCE DETECTION ================= */
  const startSilenceDetection = () => {
  const analyser = analyserRef.current;
  if (!analyser) return;

  const data = new Uint8Array(analyser.fftSize);
  let silenceStart: number | null = null;

  const SILENCE_THRESHOLD = 0.015;
  const MAX_SILENCE_MS = 10000; // ✅ 10 seconds

  const check = () => {
    if (!isRecordingRef.current) return;

    analyser.getByteTimeDomainData(data);
    let sum = 0;

    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }

    const volume = Math.sqrt(sum / data.length);

    if (volume < SILENCE_THRESHOLD) {
      if (!silenceStart) {
        silenceStart = Date.now();
      } else if (Date.now() - silenceStart >= MAX_SILENCE_MS) {
        stopRecording(); // ✅ auto-stop after 10s silence
        return;
      }
    } else {
      silenceStart = null; // reset on speech
    }

    requestAnimationFrame(check);
  };

  requestAnimationFrame(check);
};


  /* ================= NAVIGATION ================= */
  const handleNextQuestion = () => {
  // stop everything first (just like static version)
  speechSynthesis.cancel();

  if (isRecordingRef.current) {
    stopRecording("normal");
  }

  setStudentSpeaking(false);
  setSystemSpeaking(false);

  if (currentQuestionIndex < questions.length - 1) {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);

    // auto-read ONLY if unanswered
    if (!isQuestionAnswered(nextIndex)) {
      setTimeout(() => setSystemSpeaking(true), 200);
    }
  } else {
    setShowSubmissionConfirm(true);
  }
};



  const handlePreviousQuestion = () => {
  speechSynthesis.cancel();

  if (isRecordingRef.current) {
    stopRecording("normal");
  }

  setStudentSpeaking(false);
  setSystemSpeaking(false);

  if (currentQuestionIndex > 0) {
    const prevIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(prevIndex);

    if (!isQuestionAnswered(prevIndex)) {
      setTimeout(() => setSystemSpeaking(true), 200);
    }
  }
};



  const handleNavigateToQuestion = (index: number) => {
  speechSynthesis.cancel();

  if (isRecordingRef.current) {
    stopRecording("normal");
  }

  setShowSubmissionConfirm(false);
  setShowNavigation(false);
  setStudentSpeaking(false);
  setSystemSpeaking(false);
  setCurrentQuestionIndex(index);

  if (!isQuestionAnswered(index)) {
    setTimeout(() => setSystemSpeaking(true), 200);
  }
};


  const handleReRecord = () => {
  // Stop anything ongoing
  speechSynthesis.cancel();

  if (isRecordingRef.current) {
    stopRecording("rerecord");
  }

  // Remove old answer (so UI behaves like unanswered)
  setAnswers(prev =>
    prev.filter(a => a.questionIndex !== currentQuestionIndex)
  );

  // 🔥 Force TTS even though it was answered
  forceReadRef.current = true;

  setStudentSpeaking(false);
  setSystemSpeaking(true); // triggers TTS
};

const submitViva = async () => {
  if (!sessionId) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/viva/${sessionId}/submit`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) {
      console.error("Submit failed:", res.status);
      return;
    }

    console.log("✅ Viva submitted successfully");
    onComplete(); // redirect / show completion screen

  } catch (err) {
    console.error("❌ Viva submit error:", err);
  }
};

const handleSubmit = () => {
  submitViva();   // 🔥 THIS WAS MISSING
};



  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60)
      .toString()
      .padStart(2, "0")}`;

  /* ================= LOADING ================= */
  if (!questions.length) {
    return <div className="p-10 text-center">Loading Viva Questions...</div>;
  }

  /* ================= UI ================= */
  /* 🔽 YOUR UI CONTINUES EXACTLY AS YOU PROVIDED 🔽 */
   // Submission Confirmation Screen
  if (showSubmissionConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-yellow-100 p-4 rounded-full mb-4">
              <CircleAlert className="w-12 h-12 text-yellow-600" />
            </div>
            <h1 className="mb-2 text-gray-900">Submit Viva Examination?</h1>
            <p className="text-gray-600">Please confirm before submitting</p>
          </div>

          {!canSubmit && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-900 text-center">
                Submit button will be enabled in <span className="font-bold">{formatTime(timeUntilSubmit)}</span>
              </p>
              <p className="text-blue-700 text-center mt-1">
                You can review your answers using the question palette while waiting
              </p>
            </div>
          )}

          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <p className="text-gray-800 mb-6">
              Are you sure you want to submit the viva examination? Once submitted, you will not be
              able to make any changes.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CircleCheck className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">All questions have been answered</span>
              </div>
              <div className="flex items-center gap-3">
                <CircleCheck className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Your responses have been recorded</span>
              </div>
              <div className="flex items-center gap-3">
                <CircleCheck className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Ready for evaluation</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowNavigation(true)}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <List className="w-5 h-5" />
              Review Questions
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex-1 px-8 py-4 rounded-xl transition-all duration-200 ${
                canSubmit 
                  ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Viva
            </button>
          </div>
        </div>

        {/* Question Palette Overlay */}
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
                <div className="mb-6 flex flex-wrap gap-6 justify-center bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center text-white">1</div>
                    <span className="text-gray-700">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 flex items-center justify-center text-gray-700">2</div>
                    <span className="text-gray-700">Not Answered</span>
                  </div>
                </div>

                <div className="grid grid-cols-10 gap-3">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigateToQuestion(index)}
                      className={`aspect-square rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                        isQuestionAnswered(index)
                          ? 'bg-teal-500 text-white hover:bg-teal-600'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

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

  // Main Viva Screen
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
            <p className="text-2xl text-gray-800">
  {questions[currentQuestionIndex]?.text}
</p>

          </div>

          {/* System Voice */}
          <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-4">
              <div className={`bg-blue-500 p-3 rounded-full ${systemSpeaking ? 'animate-pulse' : ''}`}>
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 mb-2">
                  {systemSpeaking ? 'System is asking the question' : 'Question reading complete'}
                </p>
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

          {/* Student Voice (Click to Stop Recording) */}
<button
  onClick={() => studentSpeaking && stopRecording()}
  disabled={!studentSpeaking}
  className={`mb-8 p-6 rounded-xl border w-full text-left transition-all duration-200 ${
    studentSpeaking
      ? 'bg-teal-50 border-teal-200 cursor-pointer hover:bg-teal-100 hover:border-teal-300 hover:shadow-lg'
      : 'bg-teal-50 border-teal-200 cursor-default'
  }`}
>
  <div className="flex items-center gap-4">
    <div className={`bg-teal-500 p-3 rounded-full ${studentSpeaking ? 'animate-pulse' : ''}`}>
      <Mic className="w-6 h-6 text-white" />
    </div>

    <div className="flex-1">
      <p className="text-gray-900 mb-2">
        {studentSpeaking
          ? 'Recording your answer... (Click to stop)'
          : isQuestionAnswered(currentQuestionIndex)
          ? 'Answer recorded'
          : 'Waiting to record...'}
      </p>

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
</button>
          {/* Re-record */}
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

          {/* Navigation */}
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
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

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



