import { useState } from 'react';
import { Subject, VivaConfig } from '../App';
import { ChevronDown } from 'lucide-react';
import Toast from './Toast';

interface VivaConfigurationProps {
  subjects: Subject[];
  vivaConfigs: VivaConfig[];
  setVivaConfigs: (configs: VivaConfig[]) => void;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard';

export default function VivaConfiguration({
  subjects,
  vivaConfigs,
  setVivaConfigs,
}: VivaConfigurationProps) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [duration, setDuration] = useState(30);
  const [totalMarks, setTotalMarks] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel | ''>('');
  const [difficultyLevels, setDifficultyLevels] = useState({
    easy: { marks: 0, questions: 0 },
    medium: { marks: 0, questions: 0 },
    hard: { marks: 0, questions: 0 },
  });
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const marksPerQuestion = {
    easy: 2,
    medium: 5,
    hard: 10,
  };

  const calculateQuestions = (marks: number, level: DifficultyLevel) => {
    return Math.floor(marks / marksPerQuestion[level]);
  };

  const handleMarksChange = (level: DifficultyLevel, marks: number) => {
    setDifficultyLevels({
      ...difficultyLevels,
      [level]: {
        marks,
        questions: calculateQuestions(marks, level),
      },
    });
  };

  const getTotalMarks = () =>
    difficultyLevels.easy.marks +
    difficultyLevels.medium.marks +
    difficultyLevels.hard.marks;

  const getTotalQuestions = () =>
    difficultyLevels.easy.questions +
    difficultyLevels.medium.questions +
    difficultyLevels.hard.questions;

  /* ================= SAVE CONFIG (BACKEND) ================= */
  const handleSave = async () => {
    if (!selectedSubject) {
      setToast({ message: 'Please select a subject', type: 'error' });
      return;
    }

    const subject = subjects.find((s) => s.name === selectedSubject);
    if (!subject) {
      setToast({ message: 'Invalid subject selected', type: 'error' });
      return;
    }

    const calculatedTotal = getTotalMarks();
    if (calculatedTotal !== totalMarks) {
      setToast({
        message: 'Total marks must match sum of all difficulty levels',
        type: 'error',
      });
      return;
    }

    try {
      const res = await fetch(
        'http://localhost:5000/api/admin/viva-config',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject_id: subject.id,
            duration_minutes: duration,
            total_marks: totalMarks,
            easy_marks: difficultyLevels.easy.marks,
            medium_marks: difficultyLevels.medium.marks,
            hard_marks: difficultyLevels.hard.marks,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save configuration');

      const newConfig: VivaConfig = {
        id: subject.id,
        subject: selectedSubject,
        duration,
        totalMarks,
        easy: difficultyLevels.easy,
        medium: difficultyLevels.medium,
        hard: difficultyLevels.hard,
      };

      const existingIndex = vivaConfigs.findIndex(
        (c) => c.subject === selectedSubject
      );

      if (existingIndex >= 0) {
        const updated = [...vivaConfigs];
        updated[existingIndex] = newConfig;
        setVivaConfigs(updated);
      } else {
        setVivaConfigs([...vivaConfigs, newConfig]);
      }

      setToast({ message: 'Viva configuration saved successfully!', type: 'success' });
    } catch (e: any) {
      setToast({ message: e.message, type: 'error' });
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-gray-900">Viva Configuration</h1>

      {/* Viva Details Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
        <h3 className="mb-4 text-gray-900">Viva Details</h3>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 text-gray-700">
              Subject Selection <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-700">
              Viva Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">
              Total Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              min="1"
              placeholder="Enter total marks"
              required
            />
          </div>
        </div>
      </div>

      {/* Difficulty Level Configuration */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
        <h3 className="mb-4 text-gray-900">Difficulty Level Configuration</h3>

        <div className="mb-6">
          <label className="block mb-2 text-gray-700">
            Select Difficulty Level <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | '')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
            >
              <option value="">Select difficulty level</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Display selected difficulty level configuration */}
        {selectedDifficulty && (
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="mb-4 text-gray-900 capitalize">
              {selectedDifficulty} Level Configuration
            </h4>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-700">
                  Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={difficultyLevels[selectedDifficulty].marks}
                  onChange={(e) =>
                    handleMarksChange(selectedDifficulty, Number(e.target.value))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min="0"
                  placeholder="Enter marks"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">
                  Number of Questions (Auto-calculated)
                </label>
                <input
                  type="number"
                  value={difficultyLevels[selectedDifficulty].questions}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>
            </div>

            <p className="mt-4 text-gray-600">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Number of questions is automatically calculated by the system (
              {selectedDifficulty === 'easy' && '2 marks per question'}
              {selectedDifficulty === 'medium' && '5 marks per question'}
              {selectedDifficulty === 'hard' && '10 marks per question'}
              ).
            </p>
          </div>
        )}

        {/* Summary of all configured levels */}
        {(difficultyLevels.easy.marks > 0 ||
          difficultyLevels.medium.marks > 0 ||
          difficultyLevels.hard.marks > 0) && (
          <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="mb-4 text-gray-900">Configured Levels Summary</h4>
            <div className="space-y-2">
              {difficultyLevels.easy.marks > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Easy Level:</span>
                  <span>
                    {difficultyLevels.easy.marks} marks, {difficultyLevels.easy.questions}{' '}
                    questions
                  </span>
                </div>
              )}
              {difficultyLevels.medium.marks > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Medium Level:</span>
                  <span>
                    {difficultyLevels.medium.marks} marks, {difficultyLevels.medium.questions}{' '}
                    questions
                  </span>
                </div>
              )}
              {difficultyLevels.hard.marks > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Hard Level:</span>
                  <span>
                    {difficultyLevels.hard.marks} marks, {difficultyLevels.hard.questions}{' '}
                    questions
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
        <h3 className="mb-4 text-gray-900">Summary</h3>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 text-gray-700">Total Questions</label>
            <input
              type="number"
              value={getTotalQuestions()}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">Total Marks</label>
            <input
              type="number"
              value={getTotalMarks()}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 hover:shadow-lg"
        >
          Save Configuration
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}