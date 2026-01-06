import { CircleAlert, CircleCheck, ArrowLeft, List } from 'lucide-react';

interface SubmissionConfirmationProps {
  onSubmit: () => void;
  onBack: () => void;
  onShowQuestionPalette?: () => void;
  canSubmit?: boolean;
  timeUntilSubmit?: string;
}

export default function SubmissionConfirmation({ 
  onSubmit, 
  onBack, 
  onShowQuestionPalette,
  canSubmit = true,
  timeUntilSubmit = ''
}: SubmissionConfirmationProps) {
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
              Submit button will be enabled in <span className="font-bold">{timeUntilSubmit}</span>
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
            onClick={onShowQuestionPalette || onBack}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <List className="w-5 h-5" />
            Review Questions
          </button>
          <button
            onClick={onSubmit}
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
    </div>
  );
}