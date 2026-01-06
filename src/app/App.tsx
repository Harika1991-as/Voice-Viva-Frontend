import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import Instructions from './components/Instructions';
import MicrophonePermission from './components/MicrophonePermission';
import VivaExamFlow from './components/VivaExamFlow';
import ThankYouPage from './components/ThankYouPage';

export type UserRole = 'admin' | 'student' | null;

export interface Subject {
  id: string;
  name: string;
  code: string;
  syllabusFile: string;
}

export interface StudentAssignment {
  registrationNumber: string;
  subject_id: number;
  subject_name: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentStudent, setCurrentStudent] = useState('');

  /* ---------------- ADMIN SUBJECTS ---------------- */
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/subjects', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(setSubjects)
      .catch(console.error);
  }, []);

  /* ---------------- STUDENT ASSIGNMENT ---------------- */
  const [studentAssignments, setStudentAssignments] = useState<StudentAssignment[]>([]);
  const fetchAssignedSubject = async () => {
  try {
    const res = await fetch(
      'http://localhost:5000/api/student/assigned-subject',
      {
        credentials: 'include',
      }
    );

    const data = await res.json();

    if (res.ok) {
      setStudentAssignments([{
        registrationNumber: data.registration_number,
        subject_id: data.subject_id,
        subject_name: data.subject_name
      }]);
    } else {
      setStudentAssignments([]);
    }
  } catch (err) {
    console.error(err);
    setStudentAssignments([]);
  }
};

  /* ---------------- AUTH ---------------- */
  const handleLogin = (role: UserRole, studentReg?: string) => {
  setUserRole(role);

  if (role === 'admin') {
    setCurrentScreen('admin-dashboard');
    return;
  }

  if (role === 'student') {
    setCurrentStudent(studentReg || '');
    setCurrentScreen('student-dashboard');
  }
};
useEffect(() => {
  if (userRole === 'student' && currentScreen === 'student-dashboard') {
    fetchAssignedSubject();
  }
}, [userRole, currentScreen]);

useEffect(() => {
  if (!currentStudent || userRole !== 'student') return;
  }, [currentStudent, userRole]);


  const handleLogout = () => {
    setUserRole(null);
    setCurrentStudent('');
    setStudentAssignments([]);
    setCurrentScreen('landing');
  };

  const navigate = (screen: string) => setCurrentScreen(screen);

  /* ---------------- RENDER ---------------- */
  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onNavigate={() => navigate('login')} />;

      case 'login':
        return <Login onLogin={handleLogin} onBack={() => navigate('landing')} />;

      case 'admin-dashboard':
        return (
          <AdminDashboard
            subjects={subjects}
            setSubjects={setSubjects}
            studentAssignments={studentAssignments}
            setStudentAssignments={setStudentAssignments}
            vivaConfigs={[]}
            setVivaConfigs={() => {}}
            reports={[]}
            onLogout={handleLogout}
          />
        );

      case 'student-dashboard':
        return (
          <StudentDashboard
            registrationNumber={currentStudent}
            studentAssignments={studentAssignments}
            onStartViva={() => navigate('instructions')}
            onLogout={handleLogout}
          />
        );

      case 'instructions':
        return <Instructions onProceed={() => navigate('microphone-permission')} />;

      case 'microphone-permission':
        return <MicrophonePermission onPermissionGranted={() => navigate('viva-in-progress')} />;

      case 'viva-in-progress':
        return <VivaExamFlow onComplete={() => navigate('thank-you')} />;

      case 'thank-you':
        return <ThankYouPage onFinish={() => navigate('student-dashboard')} />;

      default:
        return <LandingPage onNavigate={() => navigate('login')} />;
    }
  };

  return <div className="min-h-screen bg-white">{renderScreen()}</div>;
}
