import React from "react";

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex justify-center items-center z-50">
      <div className="h-12 w-12 animate-spin border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  );
};

