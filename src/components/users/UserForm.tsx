import React, { useEffect } from "react";
import type { User, UserCreateDTO, UserUpdateDTO, UserFormData } from "../../types";
import { useForm } from "react-hook-form";

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
  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<UserFormData>({
      defaultValues: {
        name: "",
        email: "",
        phone: "",
        address: "",
        role: "member",
        password: "",
      },
    });

  useEffect(() => {
    if (editingUser) {
      reset({
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone || "",
        address: editingUser.address || "",
        role: editingUser.role as "member" | "librarian",
      });
    } else {
      reset();
    }
  }, [editingUser, reset]);

  const onSubmit = (data: UserFormData) => {
    if (editingUser) {
      // UPDATE DTO
      const updateDto: UserUpdateDTO = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        role: data.role,
      };
      onSubmitForm(updateDto);
    } else {
      // CREATE DTO
      const createDto: UserCreateDTO = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: data.role,
        password: data.password!,
      };
      onSubmitForm(createDto);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingUser ? "Edit User" : "Add New User"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* NAME */}
            <input
              {...register("name", { required: true })}
              placeholder="Full Name"
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.name && <p className="text-red-600 text-sm">Name is required</p>}

            {/* EMAIL */}
            <input
              {...register("email", { required: !editingUser })}
              type="email"
              disabled={!!editingUser}
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.email && <p className="text-red-600 text-sm">Email is required</p>}

            {/* PHONE */}
            <input
              {...register("phone")}
              placeholder="Phone"
              className="w-full px-3 py-2 border rounded-lg"
            />

            {/* ADDRESS */}
            <textarea
              {...register("address", { required: true })}
              placeholder="Address"
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.address && <p className="text-red-600 text-sm">Address is required</p>}

            {/* ROLE */}
            <select {...register("role")} className="w-full px-3 py-2 border rounded-lg">
              <option value="member">Member</option>
              <option value="librarian">Librarian</option>
            </select>

            {/* PASSWORD — only when creating */}
            {!editingUser && (
              <>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                {errors.password && <p className="text-red-600 text-sm">Password is required</p>}
              </>
            )}

            {/* BUTTONS */}
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg text-gray-700">
                Cancel
              </button>

              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
