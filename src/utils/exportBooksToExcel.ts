import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { Book } from "../types";

export const exportBooksToExcel = async (books: Book[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Books");

  // Header row
  worksheet.columns = [
    { header: "ID", key: "id", width: 30 },
    { header: "Title", key: "title", width: 30 },
    { header: "Author", key: "author", width: 25 },
    { header: "ISBN", key: "isbn", width: 20 },
    { header: "Total Copies", key: "totalCopies", width: 15 },
    { header: "Available Copies", key: "availableCopies", width: 18 },
    { header: "Genre", key: "genre", width: 15 },
    { header: "Publication Year", key: "publicationYear", width: 18 },
  ];

  // Data rows
  books.forEach((b) => {
    worksheet.addRow({
      id: b._id,
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      totalCopies: b.totalCopies,
      availableCopies: b.availableCopies,
      genre: b.genre || "",
      publicationYear: b.publicationYear,
    });
  });

  // Style header
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = { horizontal: "center" };

  // Create Excel buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Download file
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `Books_${Date.now()}.xlsx`);
};
