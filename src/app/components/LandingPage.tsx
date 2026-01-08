import { Mic, Headphones, CheckCircle, Shield, Zap, Users } from 'lucide-react';
interface LandingPageProps {
  onNavigate: () => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="max-w-6xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-16">
            {/* Illustration */}
            <div className="mb-10 flex justify-center items-center gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-10 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Mic className="w-20 h-20 text-white" />
                </div>
              </div>
              
              <div className="hidden md:block w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-teal-400 rounded-full blur-2xl opacity-30 animate-pulse animation-delay-1000"></div>
                <div className="relative bg-gradient-to-br from-teal-500 to-teal-600 p-10 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Headphones className="w-20 h-20 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-blue-900 bg-clip-text">
              Voice-Based Viva Examination System
            </h1>

            {/* Subtitle */}
            <p className="mb-4 text-gray-600 max-w-3xl mx-auto text-xl">
              Transform academic assessment with intelligent voice-based evaluations.
            </p>
            <p className="mb-12 text-gray-500 max-w-2xl mx-auto">
              Seamless, secure, and controller-driven oral examinations designed for the modern educational environment.
            </p>

            {/* Login Button */}
            <button
              onClick={onNavigate}
              className="group relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-16 py-5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-2xl hover:scale-105 transform"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Mic className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Voice Recognition</h3>
              <p className="text-gray-600">
                Advanced speech-to-text technology for accurate assessment
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="bg-teal-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Protected environment ensuring exam integrity
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Real-time Processing</h3>
              <p className="text-gray-600">
                Instant feedback and seamless question flow
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="bg-teal-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Easy Management</h3>
              <p className="text-gray-600">
                Comprehensive admin controls and reporting
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 flex justify-center gap-12 flex-wrap">
            <div className="text-center">
              <div className="text-4xl text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Automated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-teal-600 mb-2">24/7</div>
              <div className="text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-blue-600 mb-2">Secure</div>
              <div className="text-gray-600">Platform</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
            <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>

      
    </div>
   
  );
}