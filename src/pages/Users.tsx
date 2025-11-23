import React, { useState, useEffect } from "react";
import type { User, UserCreateDTO, UserUpdateDTO } from "../types";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";
import { api } from "../congif/api";
import { LoadingOverlay } from "../components/common/LoadingOverlay";
import { GlobalError } from "../components/common/GlobalError";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get("/users/");
      setUsers(data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: UserCreateDTO | UserUpdateDTO) => {
    try {
      let url: string;
      let body: UserCreateDTO | UserUpdateDTO;
      let method: "post" | "put";

      if (editingUser) {
        url = `/users/${editingUser._id}`;
        method = "put";

        const { name, phone, address, role } = data as UserUpdateDTO;
        body = { name, phone, address, role };
      } else {
        url = `/users`;
        method = "post";

        const { name, email, phone, address, role, password } =
          data as UserCreateDTO;
        body = { name, email, phone, address, role, password };
      }

      await api[method](url, body);

      setShowForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      setError("Failed to save user");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ❗ Error Page
  if (error) {
    return <GlobalError message={error} onRetry={fetchUsers} />;
  }

  return (
    <div className="space-y-6 relative">
      {loading && <LoadingOverlay />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-gray-600">Manage library users and librarians</p>

        {/* Hide Add User button when no data */}
        {!(users.length === 0 && !loading) && (
          <button
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add User
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Users Table OR No Users */}
      {users.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold">No Users Available</h2>
          <p className="text-gray-500">Please add a new user to get started.</p>

          <button
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4"
          >
            + Add User
          </button>
        </div>
      ) : (
        <UserTable users={filteredUsers} onEdit={handleEdit} />
      )}

      {/* SINGLE Modal */}
      {showForm && (
        <UserForm
          editingUser={editingUser}
          onSubmitForm={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default Users;
