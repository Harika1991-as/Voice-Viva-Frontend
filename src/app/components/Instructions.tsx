import { CircleCheck, CircleX, Mic, Volume2 } from 'lucide-react';

interface InstructionsProps {
  onProceed: () => void;
}

export default function Instructions({ onProceed }: InstructionsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-blue-100 p-4 rounded-full mb-4">
            <Volume2 className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="mb-2 text-gray-900">Viva Examination Instructions</h1>
          <p className="text-gray-600">Please read carefully before proceeding</p>
        </div>

        {/* Audio-Only Viva Rules */}
        <div className="mb-8 space-y-6">
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 rounded-full p-2 mt-1">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="mb-2 text-gray-900">Audio-Only Examination</h3>
                <p className="text-gray-700">
                  This is a voice-based viva. The system will ask questions using text-to-speech,
                  and you must answer verbally. Your responses will be recorded automatically.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-start gap-4">
              <CircleX className="w-8 h-8 text-red-600 mt-1" />
              <div>
                <h3 className="mb-2 text-gray-900">No Skipping Questions</h3>
                <p className="text-gray-700">
                  You cannot skip any question. You must answer each question before proceeding to
                  the next one. Think carefully before responding.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-start gap-4">
              <CircleX className="w-8 h-8 text-yellow-600 mt-1" />
              <div>
                <h3 className="mb-2 text-gray-900">No Text Input</h3>
                <p className="text-gray-700">
                  This examination does not allow text-based answers. All responses must be given
                  verbally through your microphone.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-teal-50 rounded-xl border border-teal-200">
            <div className="flex items-start gap-4">
              <CircleCheck className="w-8 h-8 text-teal-600 mt-1" />
              <div>
                <h3 className="mb-2 text-gray-900">System-Controlled</h3>
                <p className="text-gray-700">
                  The viva is controlled by the system. Questions will be presented one at a time.
                  Click "Next Question" after you have finished answering to proceed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Guidelines */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="mb-4 text-gray-900">Additional Guidelines</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="bg-gray-400 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Ensure you are in a quiet environment</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-gray-400 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">
                Check that your microphone is working properly (permission bypass enabled for demo)
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-gray-400 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Speak clearly and audibly</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-gray-400 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">The viva will end once all questions are answered</p>
            </li>
          </ul>
        </div>

        {/* Proceed Button */}
        <button
          onClick={onProceed}
          className="w-full bg-blue-500 text-white px-8 py-4 rounded-xl hover:bg-blue-600 transition-all duration-200 hover:shadow-lg"
        >
          I Understand, Proceed to Viva
        </button>
      </div>
    </div>
  );
}