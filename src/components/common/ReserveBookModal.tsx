// import React from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import type { User } from "../../validation/userSchema";
// import type { Book } from "../../validation/bookSchema";
// import {
//   ReserveBookSchema,
//   type ReserveBookDTO,
// } from "../../validation/reservationSchema";

// import { SearchSelect } from "./SearchSelect";

// interface ReserveBookModalProps {
//   isOpen: boolean;

//   users: User[];
//   books: Book[];

//   userSearch: string;
//   bookSearch: string;

//   onUserSearch: (q: string) => void;
//   onBookSearch: (q: string) => void;

//   onSelectUser: (user: User) => void;
//   onSelectBook: (book: Book) => void;

//   onClose: () => void;
//   onSubmit: (data: ReserveBookDTO) => void;
// }

// const ReserveBookModal: React.FC<ReserveBookModalProps> = ({
//   isOpen,
//   users,
//   books,
//   userSearch,
//   bookSearch,
//   onUserSearch,
//   onBookSearch,
//   onSelectUser,
//   onSelectBook,
//   onClose,
//   onSubmit,
// }) => {
//   if (!isOpen) return null;

//   const {
//     handleSubmit,
//     setValue,
//     formState: { errors },
//     watch,
//   } = useForm<ReserveBookDTO>({
//     resolver: zodResolver(ReserveBookSchema),
//     defaultValues: { userId: "", bookId: "" },
//   });

//   const userId = watch("userId");
//   const bookId = watch("bookId");

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-md w-full p-6">
//         <h2 className="text-xl font-bold mb-4">Reserve Book</h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           {/* USER SEARCH */}
//           <SearchSelect
//             label="Select User"
//             placeholder="Search name/email..."
//             searchValue={userSearch}
//             results={users}
//             displayField={(u) => `${u.name} — ${u.email}`}
//             keyExtractor={(u) => u._id}
//             onSearch={onUserSearch}
//             onSelect={(u) => {
//               onSelectUser(u);
//               setValue("userId", u._id);
//             }}
//             error={errors.userId?.message}
//           />

//           {/* BOOK SEARCH */}
//           <SearchSelect
//             label="Select Book"
//             placeholder="Search title/author..."
//             searchValue={bookSearch}
//             results={books}
//             displayField={(b) => `${b.title} — ${b.author}`}
//             keyExtractor={(b) => b._id}
//             onSearch={onBookSearch}
//             onSelect={(b) => {
//               onSelectBook(b);
//               setValue("bookId", b._id);
//             }}
//             error={errors.bookId?.message}
//           />

//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border rounded-lg"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={!userId || !bookId}
//               className={`px-4 py-2 rounded-lg text-white ${
//                 userId && bookId
//                   ? "bg-blue-600 hover:bg-blue-700"
//                   : "bg-gray-400 cursor-not-allowed"
//               }`}
//             >
//               Reserve Book
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ReserveBookModal;

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { User } from "../../validation/userSchema";
import type { Book } from "../../validation/bookSchema";
import {
  ReserveBookSchema,
  type ReserveBookDTO,
} from "../../validation/reservationSchema";

import { SearchSelect } from "./SearchSelect";

type Mode = "admin" | "user";

interface ReserveBookModalProps {
  isOpen: boolean;

  // 🔹 Mode: admin = select user, user = fixed current user
  mode?: Mode;
  currentUser?: Pick<User, "_id" | "name" | "email">;

  // 🔹 Only needed in admin mode
  users?: User[];
  books: Book[];

  userSearch?: string;
  bookSearch: string;

  onUserSearch?: (q: string) => void;
  onBookSearch: (q: string) => void;

  onSelectUser?: (user: User) => void;
  onSelectBook: (book: Book) => void;

  onClose: () => void;
  onSubmit: (data: ReserveBookDTO) => void;
}

const ReserveBookModal: React.FC<ReserveBookModalProps> = ({
  isOpen,
  mode = "admin",
  currentUser,

  users = [],
  books,

  userSearch = "",
  bookSearch,
  onUserSearch,
  onBookSearch,
  onSelectUser,
  onSelectBook,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<ReserveBookDTO>({
    resolver: zodResolver(ReserveBookSchema),
    defaultValues: { userId: "", bookId: "" },
  });

  const userId = watch("userId");
  const bookId = watch("bookId");

  // 🔹 In user mode, auto-fill userId when modal opens
  useEffect(() => {
    if (mode === "user" && currentUser?._id) {
      setValue("userId", currentUser._id);
    }
  }, [mode, currentUser, setValue]);

  const canSubmit =
    !!bookId && (mode === "admin" ? !!userId : true);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Reserve Book</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* USER SECTION */}
          {mode === "admin" ? (
            <SearchSelect
              label="Select User"
              placeholder="Search name/email..."
              searchValue={userSearch}
              results={users}
              displayField={(u) => `${u.name} — ${u.email}`}
              keyExtractor={(u) => u._id}
              onSearch={onUserSearch!}
              onSelect={(u) => {
                onSelectUser?.(u);
                setValue("userId", u._id);
              }}
              error={errors.userId?.message}
            />
          ) : (
            currentUser && (
              <div className="border rounded-lg px-3 py-2 bg-gray-50 text-sm">
                <p className="text-gray-500">Reserving as</p>
                <p className="font-semibold text-gray-800">
                  {currentUser.name} ({currentUser.email})
                </p>
              </div>
            )
          )}

          {/* BOOK SEARCH (COMMON) */}
          <SearchSelect
            label="Select Book"
            placeholder="Search title/author..."
            searchValue={bookSearch}
            results={books}
            displayField={(b) => `${b.title} — ${b.author}`}
            keyExtractor={(b) => b._id}
            onSearch={onBookSearch}
            onSelect={(b) => {
              onSelectBook(b);
              setValue("bookId", b._id);
            }}
            error={errors.bookId?.message}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`px-4 py-2 rounded-lg text-white ${
                canSubmit
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Reserve Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReserveBookModal;
