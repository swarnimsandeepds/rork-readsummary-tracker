import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { Book, BookStatus } from "@/constants/types";
import { getRandomBookColor } from "@/constants/book-colors";
import { generateText } from "@rork-ai/toolkit-sdk";

const STORAGE_KEY = "@books_storage";

export const [BooksProvider, useBooks] = createContextHook(() => {
  const [books, setBooks] = useState<Book[]>([]);

  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (updatedBooks: Book[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
      return updatedBooks;
    },
  });

  useEffect(() => {
    if (booksQuery.data) {
      setBooks(booksQuery.data);
    }
  }, [booksQuery.data]);

  const addBook = (
    title: string,
    author: string,
    totalPages: number,
    status: BookStatus
  ) => {
    const newBook: Book = {
      id: Date.now().toString(),
      title,
      author,
      totalPages,
      currentPage: 0,
      status,
      coverColor: getRandomBookColor(),
      dateAdded: new Date().toISOString(),
      dateStarted: status === "reading" ? new Date().toISOString() : undefined,
    };

    const updated = [...books, newBook];
    setBooks(updated);
    saveMutation.mutate(updated);
  };

  const updateBook = (bookId: string, updates: Partial<Book>) => {
    const updated = books.map((book) => {
      if (book.id === bookId) {
        const updatedBook = { ...book, ...updates };
        
        if (updates.status === "reading" && !book.dateStarted) {
          updatedBook.dateStarted = new Date().toISOString();
        }
        
        if (updates.status === "completed" && !book.dateCompleted) {
          updatedBook.dateCompleted = new Date().toISOString();
          if (updatedBook.currentPage < updatedBook.totalPages) {
            updatedBook.currentPage = updatedBook.totalPages;
          }
        }
        
        return updatedBook;
      }
      return book;
    });

    setBooks(updated);
    saveMutation.mutate(updated);
  };

  const deleteBook = (bookId: string) => {
    const updated = books.filter((book) => book.id !== bookId);
    setBooks(updated);
    saveMutation.mutate(updated);
  };

  const generateSummaryMutation = useMutation({
    mutationFn: async ({ bookId, bookTitle, bookAuthor }: { bookId: string, bookTitle: string, bookAuthor: string }) => {
      const summary = await generateText({
        messages: [
          {
            role: "user",
            content: `Please provide a concise, engaging summary of the book "${bookTitle}" by ${bookAuthor}. Include the main themes, key plot points (without major spoilers), and what makes this book notable. Keep it to 2-3 paragraphs.`
          }
        ]
      });

      return { bookId, summary };
    },
    onSuccess: ({ bookId, summary }) => {
      updateBook(bookId, { summary });
    },
  });

  const getBooksByStatus = (status: BookStatus) => {
    return books.filter((book) => book.status === status);
  };

  return {
    books,
    addBook,
    updateBook,
    deleteBook,
    getBooksByStatus,
    isLoading: booksQuery.isLoading,
    isSaving: saveMutation.isPending,
    generateSummary: generateSummaryMutation.mutate,
    isGeneratingSummary: generateSummaryMutation.isPending,
  };
});
