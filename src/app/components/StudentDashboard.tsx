import { useState } from "react";
import { StudentAssignment } from "../App";
import {
  CircleUser,
  LogOut,
  BookOpen,
  CirclePlay
} from "lucide-react";

interface StudentDashboardProps {
  registrationNumber: string;
  studentAssignments: StudentAssignment[];
  onStartViva: () => void;
  onLogout: () => void;
}

export default function StudentDashboard({
  registrationNumber,
  studentAssignments,
  onStartViva,
  onLogout,
}: StudentDashboardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState("");

  const assignment = studentAssignments[0];

  const handleStartViva = () => {
    if (!assignment) {
      setError("No subject assigned to you");
      return;
    }

    // ✅ SAVE SUBJECT ID FOR VIVA PAGE
    localStorage.setItem(
      "selected_subject_id",
      String(assignment.subject_id)
    );

    onStartViva();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-900">Student Dashboard</h2>

          <div className="flex items-center gap-4">
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="bg-blue-100 p-3 rounded-full cursor-pointer">
                <CircleUser className="w-6 h-6 text-blue-600" />
              </div>

              {showTooltip && (
                <div className="absolute right-0 top-full mt-2 bg-gray-900 text-white px-4 py-2 rounded-lg whitespace-nowrap z-10">
                  {registrationNumber}
                </div>
              )}
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-gray-900">
            Welcome, {registrationNumber}
          </h1>
          <p className="text-gray-600">
            Prepare yourself for the viva examination
          </p>
        </div>

        {/* Assigned Subject */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h3 className="text-gray-900">Assigned Subject</h3>
          </div>

          <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-gray-600 mb-2">Subject Name</p>
            <p className="text-2xl text-blue-900">
              {assignment?.subject_name || "Not Assigned"}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleStartViva}
            className="flex-1 flex items-center justify-center gap-3 bg-blue-500 text-white px-8 py-4 rounded-xl hover:bg-blue-600 transition-all"
          >
            <CirclePlay className="w-6 h-6" />
            Start Viva
          </button>
        </div>
      </main>
    </div>
  );
}
