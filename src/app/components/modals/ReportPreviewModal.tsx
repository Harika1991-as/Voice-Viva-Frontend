import { X, FileText } from 'lucide-react';

type Report = {
  id: number;
  registrationNumber: string;
  subject: string;
  marks: number;
  date: string;

  // ✅ values from backend
  totalQuestions?: number;
  maxMarks?: number;
  percentage?: number;
};

interface ReportPreviewModalProps {
  report: Report;
  onClose: () => void;
}

export default function ReportPreviewModal({
  report,
  onClose,
}: ReportPreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="text-gray-900">Viva Report</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-600">
                Registration Number
              </label>
              <p className="text-gray-900">{report.registrationNumber}</p>
            </div>

            <div>
              <label className="block mb-2 text-gray-600">Subject</label>
              <p className="text-gray-900">{report.subject}</p>
            </div>

            <div>
              <label className="block mb-2 text-gray-600">
                Marks Obtained
              </label>
              <p className="text-gray-900 text-2xl font-semibold text-green-600">
                {Number(report.marks).toFixed(2)}
              </p>
            </div>

            <div>
              <label className="block mb-2 text-gray-600">Date</label>
              <p className="text-gray-900">{report.date}</p>
            </div>
          </div>

          {/* ✅ FIXED PERFORMANCE SUMMARY */}
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="mb-3 text-gray-900">Performance Summary</h4>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Questions</span>
                <span className="text-gray-900">
                  {report.totalQuestions ?? '—'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Total Marks</span>
                <span className="text-gray-900">
                  {report.maxMarks ?? '—'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Percentage</span>
                <span className="text-gray-900">
                  {report.percentage !== undefined
                    ? `${report.percentage.toFixed(2)}%`
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
