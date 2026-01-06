import { useState } from 'react';
import { CircleUser, Lock } from 'lucide-react';
import Toast from './Toast';

export default function AdminProfile() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    /* ---------------- VALIDATION ---------------- */
    if (passwords.new !== passwords.confirm) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }

    if (passwords.new.length < 6) {
      setToast({
        message: 'Password must be at least 6 characters',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      /* ---------------- API CALL ---------------- */
      const res = await fetch(
  'http://localhost:5000/api/admin/change-password',
  {
    method: 'POST',
    credentials: 'include', // 🔥 MUST
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      current: passwords.current,
      new: passwords.new,
      confirm: passwords.confirm,
    }),
  }
);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      /* ---------------- SUCCESS ---------------- */
      setToast({
        message: 'Password changed successfully',
        type: 'success',
      });

      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      setToast({
        message: err.message || 'Something went wrong',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-gray-900">Admin Profile</h1>

      {/* Profile Info */}
      <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="bg-blue-100 p-6 rounded-full">
            <CircleUser className="w-16 h-16 text-blue-600" />
          </div>
          <div>
            <h2 className="text-gray-900">Administrator</h2>
            <p className="text-gray-600">Admin ID: admin</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-gray-700">Admin Name</label>
            <input
              type="text"
              value="Administrator"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">Admin ID</label>
            <input
              type="text"
              value="admin"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-gray-700" />
          <h3 className="text-gray-900">Change Password</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-700">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              required
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              required
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              required
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Password'}
          </button>
        </form>
      </div>

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
