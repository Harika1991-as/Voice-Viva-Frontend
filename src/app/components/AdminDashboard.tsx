import { useState, useEffect } from 'react';
import { Subject, StudentAssignment } from '../App';

import {
  BookOpen,
  Users,
  Settings,
  FileText,
  CircleUser,
  LogOut,
} from 'lucide-react';

import Subjects from './Subjects';
import StudentAssignmentPage from './StudentAssignmentPage';
import VivaConfiguration from './VivaConfiguration';
import Reports from './Reports';
import AdminProfile from './AdminProfile';

interface AdminDashboardProps {
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
  studentAssignments: StudentAssignment[];
  setStudentAssignments: (assignments: StudentAssignment[]) => void;
  onLogout: () => void;
}

type Report = {
  id: number;
  registrationNumber: string;
  subject: string;
  marks: number;
  date: string;
};

export default function AdminDashboard({
  subjects,
  setSubjects,
  studentAssignments,
  setStudentAssignments,
  onLogout,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('subjects');

  // ✅ reports state (INSIDE component)
  const [reports, setReports] = useState<Report[]>([]);

  // ✅ fetch reports once
  useEffect(() => {
    fetch('http://localhost:5000/api/admin/reports', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('ADMIN REPORTS:', data);
        setReports(data);
      })
      .catch((err) => {
        console.error('Failed to load admin reports', err);
      });
  }, []);

  const menuItems = [
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'student-assignment', label: 'Student Assignment', icon: Users },
    { id: 'viva-configuration', label: 'Viva Configuration', icon: Settings },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'admin-profile', label: 'Admin Profile', icon: CircleUser },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'subjects':
        return <Subjects subjects={subjects} setSubjects={setSubjects} />;

      case 'student-assignment':
        return (
          <StudentAssignmentPage
            subjects={subjects}
            studentAssignments={studentAssignments}
            setStudentAssignments={setStudentAssignments}
          />
        );

      case 'viva-configuration':
        return (
          <VivaConfiguration
            subjects={subjects}
            vivaConfigs={[]}
            setVivaConfigs={() => {}}
          />
        );

      case 'reports':
        return <Reports reports={reports} subjects={subjects} />;

      case 'admin-profile':
        return <AdminProfile />;

      default:
        return <Subjects subjects={subjects} setSubjects={setSubjects} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Admin Dashboard</h2>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 mt-8"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  );
}
