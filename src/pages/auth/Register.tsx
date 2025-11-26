import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../components/common/TextInput";
import { api } from "../../congif/api";

import {
  UserCreateSchema,
  type UserCreateDTO,
} from "../../validation/userSchema";

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreateDTO>({
    resolver: zodResolver(UserCreateSchema),
  });

  const onSubmit = async (data: UserCreateDTO) => {
    console.log("DATA:", data);
    await api.post("/users/register", data);
    alert("Registered successfully!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextInput
            label="Full Name"
            register={register("name")}
            error={errors.name}
          />

          <TextInput
            label="Email"
            type="email"
            register={register("email")}
            error={errors.email}
          />

          <TextInput
            label="Password"
            type="password"
            register={register("password")}
            error={errors.password}
          />

          <TextInput
            label="Phone"
            register={register("phone")}
            error={errors.phone}
          />

          <TextInput
            label="Address"
            register={register("address")}
            error={errors.address}
          />

          {/* ROLE */}
          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              {...register("role")}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="member">Member</option>
              <option value="librarian">Librarian</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-600 text-xs">{errors.role.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
