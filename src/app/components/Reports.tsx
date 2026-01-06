import { useState } from 'react';
import { Eye, Download } from 'lucide-react';
import ReportPreviewModal from './modals/ReportPreviewModal';

type Report = {
  id: number;
  registrationNumber: string;
  subject: string;
  marks: number;
  date: string;
  totalQuestions: number;
  maxTotalScore: number;
  percentage: number;
};

type Subject = {
  id: number;
  name: string;
};

interface ReportsProps {
  reports: Report[];
  subjects: Subject[];
}

export default function Reports({ reports, subjects }: ReportsProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  const filteredReports = reports.filter((report) => {
    const subjectMatch =
      selectedSubject === 'all' || report.subject === selectedSubject;
    const studentMatch =
      selectedStudent === 'all' ||
      report.registrationNumber === selectedStudent;
    return subjectMatch && studentMatch;
  });

  const uniqueStudents = Array.from(
    new Set(reports.map((r) => r.registrationNumber))
  );

  const handleDownloadReports = () => {
    window.open(
      'http://localhost:5000/api/admin/reports/download-all',
      '_blank'
    );
  };

  const handleDownloadSingleReport = (
    report: Report,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    window.open(
      `http://localhost:5000/api/admin/reports/${report.id}/download`,
      '_blank'
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-gray-900">Reports</h1>
        <button
          onClick={handleDownloadReports}
          className="flex items-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-all duration-200 hover:shadow-lg"
        >
          <Download className="w-5 h-5" />
          Download Reports
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-gray-700">
              Filter by Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-700">
              Filter by Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="all">All Students</option>
              {uniqueStudents.map((student) => (
                <option key={student} value={student}>
                  {student}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">Registration Number</th>
              <th className="px-6 py-4 text-left">Subject</th>
              <th className="px-6 py-4 text-left">Marks</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <tr
                key={report.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setPreviewReport(report)}
              >
                <td className="px-6 py-4">{report.registrationNumber}</td>
                <td className="px-6 py-4">{report.subject}</td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    {Number(report.marks).toFixed(2)}
                  </span>
                </td>

                <td className="px-6 py-4">{report.date}</td>

                {/* 🔴 FIX: STOP PROPAGATION HERE */}
                <td
                  className="px-6 py-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPreviewReport(report)}
                      className="text-blue-600 flex items-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      View
                    </button>

                    <button
                      onClick={(e) =>
                        handleDownloadSingleReport(report, e)
                      }
                      className="text-teal-600 flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewReport && (
        <ReportPreviewModal
          report={previewReport}
          onClose={() => setPreviewReport(null)}
        />
      )}
    </div>
  );
}
