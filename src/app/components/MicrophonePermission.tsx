import { useState, useEffect } from 'react';
import { Mic, AlertCircle, CheckCircle, Volume2 } from 'lucide-react';

interface MicrophonePermissionProps {
  onPermissionGranted: () => void;
}

export default function MicrophonePermission({ onPermissionGranted }: MicrophonePermissionProps) {
  const [permissionStatus, setPermissionStatus] = useState<'waiting' | 'requesting' | 'granted' | 'denied'>('waiting');
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  // Cleanup media stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  const handleRequestPermission = async () => {
    setPermissionStatus('requesting');
    
    try {
      // Request real microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      setPermissionStatus('granted');
    } catch (error) {
      console.error('Microphone access denied:', error);
      setPermissionStatus('denied');
    }
  };

  const handleTestMicrophone = () => {
    if (!mediaStream) return;
    
    setIsTestingMic(true);
    
    // Create audio context for visualization
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(mediaStream);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    microphone.connect(analyser);
    analyser.fftSize = 256;
    
    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average);
    };
    
    const intervalId = setInterval(updateLevel, 50);
    
    setTimeout(() => {
      setIsTestingMic(false);
      clearInterval(intervalId);
      setAudioLevel(0);
      audioContext.close();
    }, 3000);
  };

  const handleContinue = () => {
    if (permissionStatus === 'granted') {
      onPermissionGranted();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className={`inline-block p-4 rounded-full mb-4 ${
            permissionStatus === 'granted' 
              ? 'bg-green-100' 
              : permissionStatus === 'denied'
              ? 'bg-red-100'
              : 'bg-blue-100'
          }`}>
            {permissionStatus === 'granted' ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : permissionStatus === 'denied' ? (
              <AlertCircle className="w-12 h-12 text-red-600" />
            ) : (
              <Mic className="w-12 h-12 text-blue-600" />
            )}
          </div>
          <h1 className="mb-2 text-gray-900">Microphone Access Required</h1>
          <p className="text-gray-600">
            {permissionStatus === 'granted'
              ? 'Microphone access granted successfully!'
              : permissionStatus === 'denied'
              ? 'Microphone access was denied'
              : 'We need access to your microphone to conduct the voice-based viva examination'}
          </p>
        </div>

        {/* Permission Status */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="mb-4 text-gray-900">Why we need microphone access:</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">1</span>
              </div>
              <p className="text-gray-700">
                Record your voice responses to the viva questions
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">2</span>
              </div>
              <p className="text-gray-700">
                Enable automatic recording when you speak
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">3</span>
              </div>
              <p className="text-gray-700">
                Ensure clear audio quality for accurate evaluation
              </p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {permissionStatus === 'requesting' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-900">Requesting microphone access...</p>
          </div>
        )}

        {permissionStatus === 'granted' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-900">Microphone access granted successfully!</p>
            </div>
            
            {/* Microphone Test */}
            <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-700">Test your microphone</span>
                <button
                  onClick={handleTestMicrophone}
                  disabled={isTestingMic}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTestingMic ? 'Testing...' : 'Test Mic'}
                </button>
              </div>
              
              {isTestingMic && (
                <div className="mt-3 p-3 bg-teal-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-teal-600 animate-pulse" />
                    <div className="flex-1">
                      <p className="text-gray-700 mb-2">Speak now to test...</p>
                      <div className="flex items-center gap-1 h-6">
                        {[...Array(15)].map((_, i) => (
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
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {permissionStatus === 'denied' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-900">Microphone access was denied</p>
            </div>
            <p className="text-red-700">
              Please enable microphone access in your browser settings and refresh the page to continue with the viva examination.
            </p>
          </div>
        )}

        {/* Important Note */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-900 mb-1">Important:</p>
              <p className="text-yellow-800">
                Please ensure you are in a quiet environment with minimal background noise for the best recording quality.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {permissionStatus === 'waiting' && (
            <button
              onClick={handleRequestPermission}
              className="flex-1 bg-blue-500 text-white px-8 py-4 rounded-xl hover:bg-blue-600 transition-all duration-200 hover:shadow-lg"
            >
              Grant Microphone Access
            </button>
          )}

          {permissionStatus === 'granted' && (
            <button
              onClick={handleContinue}
              className="flex-1 bg-blue-500 text-white px-8 py-4 rounded-xl hover:bg-blue-600 transition-all duration-200 hover:shadow-lg"
            >
              Continue to Viva Examination
            </button>
          )}

          {permissionStatus === 'denied' && (
            <button
              onClick={handleRequestPermission}
              className="flex-1 bg-red-500 text-white px-8 py-4 rounded-xl hover:bg-red-600 transition-all duration-200 hover:shadow-lg"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}