// src/components/users/UserForm.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type {
  User,
  UserCreateDTO,
  UserUpdateDTO,
  UserFormDTO,
} from "../../validation/userSchema";
import { UserFormSchema } from "../../validation/userSchema";

interface UserFormProps {
  editingUser: User | null;
  onSubmitForm: (data: UserCreateDTO | UserUpdateDTO) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  editingUser,
  onSubmitForm,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormDTO>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role: "member",
    },
    resolver: zodResolver(UserFormSchema),
  });

  useEffect(() => {
    if (editingUser) {
      reset({
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone || "",
        address: editingUser.address || "",
        role: "member", // map backend "user" to "member" if needed
        password: "",
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        address: "",
        role: "member",
        password: "",
      });
    }
  }, [editingUser, reset]);

  const onSubmit = (data: UserFormDTO) => {
    if (editingUser) {
      // validate as Update DTO
      const updateDto: UserUpdateDTO = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        role: data.role, // "member" | "librarian"
      };
      onSubmitForm(updateDto);
    } else {
      // validate as Create DTO
      const createDto: UserCreateDTO = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: data.role,
        password: data.password!, // required by UserCreateSchema
      };
      onSubmitForm(createDto);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingUser ? "Edit User" : "Add New User"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* NAME */}
            <input
              {...register("name")}
              placeholder="Full Name"
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}

            {/* EMAIL */}
            <input
              {...register("email")}
              type="email"
              disabled={!!editingUser}
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}

            {/* PASSWORD — only when creating */}
            {!editingUser && (
              <>
                <input
                  {...register("password")}
                  type="password"
                  disabled={!!editingUser}
                  placeholder="Password"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </>
            )}

            {/* PHONE */}
            <input
              {...register("phone")}
              placeholder="Phone"
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm">{errors.phone.message}</p>
            )}

            {/* ADDRESS */}
            <textarea
              {...register("address")}
              placeholder="Address"
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.address && (
              <p className="text-red-600 text-sm">{errors.address.message}</p>
            )}

            {/* ROLE */}
            <select
              {...register("role")}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="member">Member</option>
              <option value="librarian">Librarian</option>
            </select>
            {errors.role && (
              <p className="text-red-600 text-sm">{errors.role.message}</p>
            )}

            {/* BUTTONS */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border rounded-lg text-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingUser ? "Update User" : "Add User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
