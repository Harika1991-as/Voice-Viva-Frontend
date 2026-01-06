import { CheckCircle, Home } from 'lucide-react';

interface ThankYouPageProps {
  onFinish: () => void;
}

export default function ThankYouPage({ onFinish }: ThankYouPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="inline-block bg-green-100 p-6 rounded-full mb-6">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>

        <h1 className="mb-4 text-gray-900">
          Submission Successful!
        </h1>

        <p className="text-xl text-gray-700 mb-8">
          Thank you for attending the viva examination.
        </p>

        <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="mb-4 text-gray-900">What's Next?</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">
                Your responses have been recorded and submitted successfully
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">
                The evaluation process will begin shortly
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">
                Results will be available once the evaluation is complete
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">
                You will be notified when your results are ready
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onFinish}
          className="flex items-center justify-center gap-3 mx-auto bg-blue-500 text-white px-12 py-4 rounded-xl hover:bg-blue-600 transition-all duration-200 hover:shadow-lg"
        >
          <Home className="w-5 h-5" />
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
