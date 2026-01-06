import { useState, useEffect } from 'react';
import { Subject, StudentAssignment } from '../App';
import { Key } from 'lucide-react';
import Toast from './Toast';

interface StudentAssignmentPageProps {
  subjects: Subject[];
  studentAssignments: StudentAssignment[];
  setStudentAssignments: (assignments: StudentAssignment[]) => void;
}

export default function StudentAssignmentPage({
  subjects,
  studentAssignments,
  setStudentAssignments,
}: StudentAssignmentPageProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [formData, setFormData] = useState({
    registrationNumber: '',
    assignedSubject: '',
  });
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  /* ================= FETCH ASSIGNMENTS ================= */
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/admin/student-assignments');
    const data = await res.json();

    const mapped: StudentAssignment[] = data.map((a: any) => ({
      id: a.id.toString(),
      registrationNumber: a.registration_number,
      assignedSubject: a.subject_name,
      password: a.plain_password, // ✅ NOW WORKS
    }));

    setStudentAssignments(mapped);
  } catch {
    setToast({ message: 'Failed to load student assignments', type: 'error' });
  }
};

  /* ================= PASSWORD GENERATOR ================= */
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = 'STU';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  /* ================= ASSIGN STUDENT ================= */
  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.registrationNumber || !formData.assignedSubject) {
      setToast({ message: 'Please fill all fields', type: 'error' });
      return;
    }

    const subject = subjects.find((s) => s.name === formData.assignedSubject);
    if (!subject) {
      setToast({ message: 'Invalid subject selected', type: 'error' });
      return;
    }

    const password = generatePassword();

    try {
      const res = await fetch('http://localhost:5000/api/admin/student-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_number: formData.registrationNumber,
          subject_id: subject.id,
          password: password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Assignment failed');
      }

      await fetchAssignments();

      setGeneratedPassword(password);
      setFormData({ registrationNumber: '', assignedSubject: '' });
      setToast({ message: 'Student assigned successfully!', type: 'success' });

    } catch (e: any) {
      setToast({ message: e.message, type: 'error' });
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredAssignments = studentAssignments.filter((assignment) => {
    const subjectMatch =
      selectedSubject === 'all' || assignment.assignedSubject === selectedSubject;

    const studentMatch =
      selectedStudent === 'all' ||
      assignment.registrationNumber
        .toLowerCase()
        .includes(selectedStudent.toLowerCase());

    return subjectMatch && studentMatch;
  });

  return (
    <div>
      <h1 className="mb-6 text-gray-900">Student Assignment</h1>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-gray-700">Filter by Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ MANUAL STUDENT FILTER */}
          <div>
            <label className="block mb-2 text-gray-700">Filter by Student</label>
            <input
              type="text"
              value={selectedStudent === 'all' ? '' : selectedStudent}
              onChange={(e) =>
                setSelectedStudent(e.target.value.trim() || 'all')
              }
              placeholder="Enter registration number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Assignment Form */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
        <h3 className="mb-4 text-gray-900">Assign Student to Subject</h3>

        <form onSubmit={handleAssign} className="grid grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 text-gray-700">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <input
              value={formData.registrationNumber}
              onChange={(e) =>
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">
              Assigned Subject <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.assignedSubject}
              onChange={(e) =>
                setFormData({ ...formData, assignedSubject: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 hover:shadow-lg"
            >
              Assign
            </button>
          </div>
        </form>

        {generatedPassword && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-900">Password Generated</p>
                <p className="text-green-700 font-mono text-lg">{generatedPassword}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-gray-700">Registration Number</th>
              <th className="px-6 py-4 text-left text-gray-700">Password</th>
              <th className="px-6 py-4 text-left text-gray-700">Assigned Subject</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredAssignments.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">{a.registrationNumber}</td>
                <td className="px-6 py-4 font-mono text-blue-600">{a.password}</td>
                <td className="px-6 py-4">{a.assignedSubject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
