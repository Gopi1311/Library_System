import React from "react";
import { useForm, useWatch } from "react-hook-form";
import type { BookCreateDTO, BookUpdateDTO } from "../types";

interface BookFormProps {
  defaultValues: BookCreateDTO | BookUpdateDTO;
  editingBook: boolean;
  onSubmit: (data: BookCreateDTO | BookUpdateDTO) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({
  defaultValues,
  editingBook,
  onSubmit,
  onCancel,
}) => {
  const { register, handleSubmit, control, setValue, reset } = useForm<
    BookCreateDTO | BookUpdateDTO
  >({
    defaultValues,
  });

  // 👇 SAFE replacement for watch("totalCopies")
  const totalCopies = useWatch({
    control,
    name: "totalCopies",
  });

  // Reset when changing edit/create mode
  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  // Auto-fill available copies for CREATE mode
  React.useEffect(() => {
    if (!editingBook && totalCopies !== undefined) {
      setValue("availableCopies", totalCopies);
    }
  }, [totalCopies, editingBook, setValue]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start py-6 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl max-h-[95vh] flex flex-col">
        {/* BLUE HEADER */}
        <div className="bg-blue-600 px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {editingBook ? "Edit Book" : "Add New Book"}
          </h2>

          <button
            onClick={onCancel}
            className="text-white text-2xl leading-none hover:text-gray-200"
          >
            ×
          </button>
        </div>

        {/* FORM CONTENT */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div>
              <label>Title</label>
              <input
                {...register("title", { required: true })}
                className="w-full border p-2 rounded"
                autoFocus
              />
            </div>

            {/* Author */}
            <div>
              <label>Author</label>
              <input
                {...register("author", { required: true })}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* ISBN (CREATE only) */}
            {!editingBook && (
              <div>
                <label>ISBN</label>
                <input
                  {...register("isbn", { required: true })}
                  readOnly
                  className="w-full border p-2 rounded"
                />
              </div>
            )}

            {/* Publisher + Genre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label>Publisher</label>
                <input
                  {...register("publisher")}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label>Genre</label>
                <input
                  {...register("genre")}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            {/* Year + Total Copies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label>Publication Year</label>
                <input
                  type="number"
                  {...register("publicationYear", { required: true })}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label>Total Copies</label>
                <input
                  type="number"
                  {...register("totalCopies", { required: true })}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            {/* Available Copies (CREATE only) */}
            {!editingBook && (
              <div>
                <label>Available Copies</label>
                <input
                  type="number"
                  {...register("availableCopies", { required: true })}
                  className="w-full border p-2 rounded"
                />
              </div>
            )}

            {/* Shelf */}
            <div>
              <label>Shelf Location</label>
              <input
                {...register("shelfLocation")}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Summary */}
            <div>
              <label>Summary</label>
              <textarea
                rows={3}
                {...register("summary")}
                className="w-full border p-2 rounded resize-none"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="border px-4 py-2 rounded hover:bg-gray-100 w-full sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
              >
                {editingBook ? "Update" : "Add Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
