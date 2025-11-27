import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginDTO } from "../../validation/authSchema";
import TextInput from "../../components/common/TextInput";
import { api } from "../../congif/api";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setUser: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>({
    resolver: zodResolver(LoginSchema),
  });
  const navigate = useNavigate();
  const onSubmit = async (data: LoginDTO) => {
    const res = await api.post("/auth/login", data);
    const user = res.data.user;
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    alert("Login successful!");
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user/home");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-purple-600 font-medium">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
