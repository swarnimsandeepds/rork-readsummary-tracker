export type BookStatus = "reading" | "completed" | "want-to-read";

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: BookStatus;
  coverColor: string;
  dateAdded: string;
  dateStarted?: string;
  dateCompleted?: string;
  summary?: string;
}
