import React from "react";

interface GlobalErrorProps {
  message: string;
  onRetry?: () => void;
}

export const GlobalError: React.FC<GlobalErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center py-10">
      <h2 className="text-xl font-semibold text-red-600">Error</h2>
      <p className="text-gray-600 mt-2">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      )}
    </div>
  );
};
