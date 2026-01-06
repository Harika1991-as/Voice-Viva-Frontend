import { useState, useEffect } from 'react';
import { Subject } from '../App';
import { Plus, Pencil, Trash2, FileText, Eye } from 'lucide-react';
import AddSubjectModal from './modals/AddSubjectModal';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import Toast from './Toast';

interface SubjectsProps {
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
}

const API_URL = 'http://localhost:5000/api/admin/subjects';

export default function Subjects({ subjects, setSubjects }: SubjectsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  /* -------------------------------
     LOAD SUBJECTS ON PAGE LOAD
  ------------------------------- */
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
  try {
    const res = await fetch(API_URL, { credentials: 'include' });
    const data = await res.json();

    // ✅ NORMALIZE id to string
    const normalized = data.map((s: any) => ({
      ...s,
      id: String(s.id),
    }));

    setSubjects(normalized);
  } catch (err) {
    console.error('Failed to load subjects', err);
  }
};

  const filteredSubjects =
    selectedSubjectFilter === 'all'
      ? subjects
      : subjects.filter((s) => s.name === selectedSubjectFilter);

  /* -------------------------------
     ADD SUBJECT (OPTIMISTIC)
  ------------------------------- */
  const handleAddSubject = (formData: FormData) => {
    // ✅ 1. IMMEDIATE UI FEEDBACK
    setToast({
      message: 'Subject added successfully. Question generation started in background.',
      type: 'success',
    });

    // ✅ 2. CLOSE MODAL → BACK TO SUBJECTS PAGE
    setShowAddModal(false);

    // ✅ 3. FIRE BACKEND REQUEST (DO NOT AWAIT)
    fetch(API_URL, {
      method: 'POST',
      body: formData,
    })
      .then(async (res) => {
        if (res.status === 409) {
          setToast({
            message: 'Subject code already exists',
            type: 'error',
          });
          return;
        }

        if (!res.ok) {
          throw new Error();
        }

        // 🔄 Refresh silently
        fetchSubjects();
      })
      .catch((err) => {
        console.error(err);
        setToast({
          message: 'Subject added, but background processing failed',
          type: 'error',
        });
      });
  };

  /* -------------------------------
     EDIT SUBJECT
  ------------------------------- */
  const handleEditSubject = async (formData: FormData) => {
  if (!editingSubject) return;

  try {
    const res = await fetch(`${API_URL}/${editingSubject.id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!res.ok) throw new Error();

    await fetchSubjects();
    setEditingSubject(null);

    setToast({
      message: 'Subject updated successfully!',
      type: 'success',
    });
  } catch {
    setToast({
      message: 'Failed to update subject',
      type: 'error',
    });
  }
};

  /* -------------------------------
     DELETE SUBJECT
  ------------------------------- */
  const handleDeleteSubject = async () => {
    if (!deletingSubject) return;

    try {
      await fetch(`${API_URL}/${deletingSubject.id}`, {
        method: 'DELETE',
      });

      await fetchSubjects();
      setDeletingSubject(null);
      setToast({ message: 'Subject deleted successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to delete subject', type: 'error' });
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-gray-900">Subjects</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Subject
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
        <label className="block mb-2 text-gray-700">Filter by Subject</label>
        <select
          value={selectedSubjectFilter}
          onChange={(e) => setSelectedSubjectFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg w-64"
        >
          <option value="all">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden max-h-[70vh] overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-6 py-4 text-left text-gray-700">Subject Name</th>
              <th className="px-6 py-4 text-left text-gray-700">Subject Code</th>
              <th className="px-6 py-4 text-left text-gray-700">Syllabus PDF</th>
              <th className="px-6 py-4 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSubjects.map((subject) => (
              <tr key={subject.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{subject.name}</td>
                <td className="px-6 py-4">{subject.code}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <FileText className="w-4 h-4" />
                    <span>{subject.syllabusFile}</span>
                    <button
  className="ml-2 p-1 hover:bg-blue-50 rounded"
  onClick={() => {
    window.open(
      `http://localhost:5000/uploads/syllabus_pdfs/${subject.syllabusFile}`,
      '_blank'
    );
  }}
>
  <Eye className="w-4 h-4" />
</button>

                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button onClick={() => setEditingSubject(subject)}>
                      <Pencil className="w-5 h-5 text-blue-600" />
                    </button>
                    <button onClick={() => setDeletingSubject(subject)}>
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddSubjectModal
          onSave={handleAddSubject}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingSubject && (
        <AddSubjectModal
          subject={editingSubject}
          onSave={handleEditSubject}
          onClose={() => setEditingSubject(null)}
        />
      )}

      {deletingSubject && (
        <DeleteConfirmationModal
          title="Delete Subject"
          message={`Are you sure you want to delete "${deletingSubject.name}"?`}
          onConfirm={handleDeleteSubject}
          onCancel={() => setDeletingSubject(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
