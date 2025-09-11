// Employee Profile Dashboard Page
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '../../../lib/supabaseBrowserClient';

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  location: string;
  availability: string; // text column in DB: "Available" | "Busy"
}

export default function EmployeeProfilePage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<EmployeeProfile | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/employee');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/employee/profile', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const result = await res.json();
        if (!result.success) {
          setError(result.error || 'Could not fetch profile.');
          setLoading(false);
          return;
        }
        setProfile(result.profile);
        setForm(result.profile);
      } catch (e: any) {
        setError(e.message || 'Could not fetch profile.');
      }
      setLoading(false);
    };
    checkSession();
  }, [router]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!form) return;
    setLoading(true);
    setError('');
    // TODO: call update API to persist changes
    setProfile(form);
    setEditMode(false);
    setLoading(false);
  };

  const handleLogout = async () => {
    router.push('/auth/employee');
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader" /> Loading...
      </div>
    );
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {profile.name}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="border-b mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">ID:</label>
            <span className="ml-2">{profile.id}</span>
          </div>
          <div>
            <label className="font-semibold">Name:</label>
            {editMode ? (
              <input
                name="name"
                value={form?.name || ''}
                onChange={handleChange}
                className="input"
              />
            ) : (
              <span className="ml-2">{profile.name}</span>
            )}
          </div>
          <div>
            <label className="font-semibold">Email:</label>
            <span className="ml-2">{profile.email}</span>
          </div>
          <div>
            <label className="font-semibold">Department:</label>
            {editMode ? (
              <input
                name="department"
                value={form?.department || ''}
                onChange={handleChange}
                className="input"
              />
            ) : (
              <span className="ml-2">{profile.department}</span>
            )}
          </div>
          <div>
            <label className="font-semibold">Role:</label>
            {editMode ? (
              <input
                name="role"
                value={form?.role || ''}
                onChange={handleChange}
                className="input"
              />
            ) : (
              <span className="ml-2">{profile.role}</span>
            )}
          </div>
          <div>
            <label className="font-semibold">Location:</label>
            {editMode ? (
              <input
                name="location"
                value={form?.location || ''}
                onChange={handleChange}
                className="input"
              />
            ) : (
              <span className="ml-2">{profile.location}</span>
            )}
          </div>
          <div>
            <label className="font-semibold">Availability:</label>
            {editMode ? (
              <select
                name="availability"
                value={form?.availability || ''}
                onChange={handleChange}
                className="input"
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
              </select>
            ) : (
              <span className="ml-2">{profile.availability}</span>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-8 justify-end">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setForm(profile);
                }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          margin-top: 0.25rem;
        }
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
