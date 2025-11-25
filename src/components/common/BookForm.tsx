import React ,{useEffect} from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BookFormSchema } from "../../validation/bookSchema";
import type { BookFormDTO } from "../../validation/bookSchema";

interface BookFormProps {
  defaultValues: BookFormDTO;
  editingBook: boolean;
  onSubmit: (data: BookFormDTO) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({
  defaultValues,
  editingBook,
  onSubmit,
  onCancel,
}) => {
const {
  register,
  handleSubmit,
  reset,
  control,
  setValue,
  formState: { errors },
} = useForm<BookFormDTO>({
  defaultValues,
  resolver: zodResolver(BookFormSchema),   // always loose schema
});


  const totalCopies = useWatch({ control, name: "totalCopies" });

  // Reset form when switching modes
useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  // Auto-fill availableCopies for creation
 useEffect(() => {
    if (!editingBook && totalCopies !== undefined) {
      setValue("availableCopies", totalCopies);
    }
  }, [totalCopies, editingBook, setValue]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start py-6 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl max-h-[95vh] flex flex-col">

        {/* HEADER */}
        <div className="bg-blue-600 px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {editingBook ? "Edit Book" : "Add New Book"}
          </h2>
          <button onClick={onCancel} className="text-white text-2xl">×</button>
        </div>

        {/* FORM */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Title */}
            <div>
              <label>Title</label>
              <input {...register("title")} className="w-full border p-2 rounded" />
              {errors.title && <p className="text-red-600">{errors.title.message}</p>}
            </div>

            {/* Author */}
            <div>
              <label>Author</label>
              <input {...register("author")} className="w-full border p-2 rounded" />
              {errors.author && <p className="text-red-600">{errors.author.message}</p>}
            </div>

            {/* ISBN — Only Create */}
            {!editingBook && (
              <div>
                <label>ISBN</label>
                <input {...register("isbn")} readOnly className="w-full border p-2 rounded" />
                {errors.isbn && <p className="text-red-600">{errors.isbn.message}</p>}
              </div>
            )}

            {/* Publisher + Genre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label>Publisher</label>
                <input {...register("publisher")} className="w-full border p-2 rounded" />
                {errors.publisher && <p className="text-red-600">{errors.publisher.message}</p>}
              </div>
              <div>
                <label>Genre</label>
                <input {...register("genre")} className="w-full border p-2 rounded" />
                {errors.genre && <p className="text-red-600">{errors.genre.message}</p>}
              </div>
            </div>

            {/* Year + Total copies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label>Publication Year</label>
                <input type="number" {...register("publicationYear", { valueAsNumber: true })} className="w-full border p-2 rounded" />
               {errors.publicationYear && <p className="text-red-600">{errors.publicationYear.message}</p>}
              </div>

              <div>
                <label>Total Copies</label>
                <input type="number" {...register("totalCopies", { valueAsNumber: true })} className="w-full border p-2 rounded" />
                {errors.totalCopies && <p className="text-red-600">{errors.totalCopies.message}</p>}
              </div>
            </div>

            {/* Available copies — Only Create */}
            {!editingBook && (
              <div>
                <label>Available Copies</label>
                <input type="number" {...register("availableCopies", { valueAsNumber: true })} readOnly className="w-full border p-2 rounded" />
                {errors.availableCopies && <p className="text-red-600">{errors.availableCopies.message}</p>}
              </div>
            )}

            {/* Shelf */}
            <div>
              <label>Shelf Location</label>
              <input {...register("shelfLocation")} className="w-full border p-2 rounded" />
              {errors.shelfLocation && <p className="text-red-600">{errors.shelfLocation.message}</p>}
            </div>

            {/* Summary */}
            <div>
              <label>Summary</label>
              <textarea rows={3} {...register("summary")} className="w-full border p-2 rounded" />
              {errors.summary && <p className="text-red-600">{errors.summary.message}</p>}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onCancel} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
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
