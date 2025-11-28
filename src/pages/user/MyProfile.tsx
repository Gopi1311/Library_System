import React, { useEffect, useState } from "react";
import { api } from "../../congif/api";
import { LoadingOverlay } from "../../components/common/LoadingOverlay";
import { GlobalError } from "../../components/common/GlobalError";
import { InfoRow } from "../../components/user/InfoRow";

import UserForm from "../../components/common/UserForm";
import type { User, UserUpdateDTO } from "../../validation/userSchema";

import { HiUser, HiShieldCheck, HiBookOpen } from "react-icons/hi2";
import { MdEmail, MdEdit } from "react-icons/md";
import { FaPhone, FaLocationDot, FaIdCard } from "react-icons/fa6";

interface UserProfileType {
  _id: string;
  name: string;
  email: string;
  role: "member" | "librarian" | "admin";
  phone?: string;
  address?: string;
  membershipId?: string;
  createdAt: string;
}

const MyProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed._id || parsed.id || "");
    }
    fetchUser();
  }, []);
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/users/me`);
      setUser(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: UserUpdateDTO) => {
    try {
      const body: UserUpdateDTO = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        role: data.role,
      };

      await api.put(`/users/${userId}`, body);

      setShowForm(false);
      fetchUser();
    } catch (err) {
      console.error("Update User Error:", err);
      alert((err as Error).message);
      setShowForm(false);
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "from-red-500 to-pink-500",
      librarian: "from-purple-500 to-indigo-500",
      member: "from-green-500 to-teal-500",
    };
    return colors[role] || "from-blue-500 to-cyan-500";
  };

  const getRoleIcon = (role: string) => {
    if (role === "admin") return <HiShieldCheck className="w-5 h-5" />;
    if (role === "librarian") return <HiBookOpen className="w-5 h-5" />;
    return <HiUser className="w-5 h-5" />;
  };

  if (loading) return <LoadingOverlay />;
  if (error) return <GlobalError message={error} onRetry={fetchUser} />;
  if (!user) return null;

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-40px)] bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-3">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your account information
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-3 sm:mb-0">
              <HiUser className="text-blue-600 w-5 h-5" />
              Personal Details
            </h2>

            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRoleColor(
                user.role
              )} text-white`}
            >
              {getRoleIcon(user.role)}
              {user.role.toUpperCase()}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <InfoRow
              icon={<HiUser className="text-blue-600" />}
              label="Full Name"
              value={user.name}
              bg="bg-blue-100"
            />

            <InfoRow
              icon={<MdEmail className="text-green-600" />}
              label="Email"
              value={user.email}
              bg="bg-green-100"
            />

            {user.phone && (
              <InfoRow
                icon={<FaPhone className="text-purple-600" />}
                label="Phone"
                value={user.phone}
                bg="bg-purple-100"
              />
            )}

            {user.address && (
              <InfoRow
                icon={<FaLocationDot className="text-orange-600" />}
                label="Address"
                value={user.address}
                bg="bg-orange-100"
              />
            )}

            {user.role === "member" && user.membershipId && (
              <InfoRow
                icon={<FaIdCard className="text-teal-600" />}
                label="Membership ID"
                value={user.membershipId}
                bg="bg-teal-100"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700"
            >
              <MdEdit className="w-4 h-4" />
              Edit Profile
            </button>

            <button className="px-5 py-2.5 border border-gray-300 text-sm text-gray-700 rounded-lg font-medium hover:bg-gray-50">
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showForm && (
        <UserForm
          editingUser={user as User}
          onSubmitForm={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default MyProfile;
