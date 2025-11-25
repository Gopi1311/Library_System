import React from "react";
import type { Borrow } from "../../../validation/borrowBookSchema";


interface BorrowRowProps {
  borrow: Borrow;
  onReturn: (b: Borrow) => void;
}

const BorrowTableRow: React.FC<BorrowRowProps> = ({ borrow, onReturn }) => {
  const formatDate = (date?: string | null) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "--";

  const overdue =
    borrow.status !== "returned" &&
    new Date() > new Date(borrow.dueDate ?? "");

  const badgeStyles = {
    issued: "bg-blue-100 text-blue-700",
    returned: "bg-green-100 text-green-700",
    late: "bg-red-100 text-red-700",
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">{borrow.userId?.name}</td>
      <td className="px-6 py-4">{borrow.bookId?.title}</td>

      <td className="px-6 py-4">{formatDate(borrow.issueDate)}</td>

      <td className="px-6 py-4">
        {formatDate(borrow.dueDate)}
        {overdue && <div className="text-red-600 text-xs">Overdue</div>}
      </td>

      <td className="px-6 py-4">
        {borrow.returnDate ? formatDate(borrow.returnDate) : "Not Returned"}
      </td>

      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs ${badgeStyles[borrow.status]}`}>
          {borrow.status}
        </span>
      </td>

      <td
        className={`px-6 py-4 font-bold ${
          borrow.fine > 0 ? "text-red-700" : "text-black"
        }`}
      >
        {borrow.fine > 0 ? "₹ " + borrow.fine.toFixed(2) : "Nill"}
      </td>

      <td className="px-6 py-4">
        {borrow.status === "returned" ? (
          <button
            disabled
            className="bg-gray-300 text-gray-600 px-8 py-2 rounded-lg cursor-not-allowed"
          >
            Returned
          </button>
        ) : (
          <button
            onClick={() => onReturn(borrow)}
            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
          >
            Mark Returned
          </button>
        )}
      </td>
    </tr>
  );
};

export default BorrowTableRow;
