import React from "react";
import type { FieldError } from "react-hook-form";

interface TextInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  register: any;
  error?: FieldError;
}

const TextInput: React.FC<TextInputProps> = ({ label, type="text", placeholder, register, error }) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
      />
      {error && <p className="text-red-600 text-xs">{error.message}</p>}
    </div>
  );
};

export default TextInput;
