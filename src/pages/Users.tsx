import React, { useState, useEffect } from "react";
import type { User, UserCreateDTO,UserUpdateDTO } from "../types";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";
import { api } from "../congif/api";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users/");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 NEW: handle submit coming from RHF form
const handleFormSubmit = async (data: UserCreateDTO | UserUpdateDTO) => {
  try {
    let url: string;
    let body: UserCreateDTO | UserUpdateDTO;
    let method: "post" | "put";

    if (editingUser) {
      // UPDATE USER
      url = `/users/${editingUser._id}`;
      method = "put";

      const { name, phone, address, role } = data as UserUpdateDTO;

      body = { name, phone, address, role };
    } else {
      // CREATE USER
      url = `/users`;
      method = "post";

      const { name, email, phone, address, role, password } = data as UserCreateDTO;

      body = { name, email, phone, address, role, password };
    }

    await api[method](url, body);

    setShowForm(false);
    setEditingUser(null);
    fetchUsers();
  } catch (error) {
    console.error("Error saving user:", error);
  }
};


  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-gray-600">Manage library users and librarians</p>

        <button
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add User
        </button>
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

      {/* Users Table */}
      <UserTable users={filteredUsers} onEdit={handleEdit} />

      {/* Form Modal */}
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
