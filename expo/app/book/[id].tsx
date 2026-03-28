import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { BookOpen, Sparkles, Trash2 } from "lucide-react-native";
import { useBooks } from "@/contexts/BooksContext";
import { BookStatus } from "@/constants/types";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { books, updateBook, deleteBook, generateSummary, isGeneratingSummary } = useBooks();
  
  const book = books.find((b) => b.id === id);
  const [currentPage, setCurrentPage] = useState(book?.currentPage.toString() || "0");

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Book not found</Text>
      </View>
    );
  }

  const progress = book.totalPages > 0 ? (book.currentPage / book.totalPages) * 100 : 0;

  const handleUpdateProgress = () => {
    const pageNumber = parseInt(currentPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 0 && pageNumber <= book.totalPages) {
      updateBook(book.id, { currentPage: pageNumber });
    }
  };

  const handleStatusChange = (status: BookStatus) => {
    updateBook(book.id, { status });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteBook(book.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleGenerateSummary = () => {
    generateSummary({ bookId: book.id, bookTitle: book.title, bookAuthor: book.author });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Book Details",
          headerStyle: { backgroundColor: "#F5F1EB" },
          headerTintColor: "#2C2418",
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Trash2 size={22} color="#D64545" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.bookCover, { backgroundColor: book.coverColor }]}>
          <BookOpen size={64} color="#FFF" strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>

        <View style={styles.statusContainer}>
          {(["reading", "completed", "want-to-read"] as BookStatus[]).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                book.status === status && styles.statusButtonActive,
              ]}
              onPress={() => handleStatusChange(status)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  book.status === status && styles.statusButtonTextActive,
                ]}
              >
                {status === "reading" ? "Reading" : status === "completed" ? "Completed" : "Want to Read"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressPercent}>{Math.round(progress)}% complete</Text>
          
          <View style={styles.pageInputContainer}>
            <Text style={styles.pageLabel}>Current Page</Text>
            <View style={styles.pageInputWrapper}>
              <TextInput
                style={styles.pageInput}
                value={currentPage}
                onChangeText={setCurrentPage}
                keyboardType="number-pad"
                onBlur={handleUpdateProgress}
              />
              <Text style={styles.pageSeparator}>/</Text>
              <Text style={styles.totalPages}>{book.totalPages}</Text>
            </View>
          </View>
        </View>

        {book.status === "completed" && (
          <View style={styles.section}>
            <View style={styles.summaryHeader}>
              <Text style={styles.sectionTitle}>AI Summary</Text>
              {!book.summary && (
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={handleGenerateSummary}
                  disabled={isGeneratingSummary}
                >
                  {isGeneratingSummary ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Sparkles size={16} color="#FFF" />
                      <Text style={styles.generateButtonText}>Generate</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
            
            {book.summary ? (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>{book.summary}</Text>
              </View>
            ) : (
              <View style={styles.summaryPlaceholder}>
                <Sparkles size={32} color="#C4B5A0" />
                <Text style={styles.summaryPlaceholderText}>
                  Generate an AI-powered summary of this book
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F1EB",
  },
  deleteButton: {
    marginRight: 8,
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  bookCover: {
    width: 160,
    height: 240,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#2C2418",
    marginTop: 24,
    textAlign: "center",
  },
  author: {
    fontSize: 18,
    color: "#6B6254",
    marginTop: 8,
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 24,
    width: "100%",
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5DFD4",
    alignItems: "center",
  },
  statusButtonActive: {
    backgroundColor: "#2C2418",
    borderColor: "#2C2418",
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#6B6254",
  },
  statusButtonTextActive: {
    color: "#F5F1EB",
  },
  section: {
    width: "100%",
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: "#2C2418",
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: "#E5DFD4",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8B5E3C",
    borderRadius: 6,
  },
  progressPercent: {
    fontSize: 16,
    color: "#6B6254",
    marginTop: 8,
    textAlign: "center",
  },
  pageInputContainer: {
    marginTop: 20,
  },
  pageLabel: {
    fontSize: 14,
    color: "#6B6254",
    marginBottom: 8,
  },
  pageInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pageInput: {
    width: 80,
    height: 48,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5DFD4",
    paddingHorizontal: 12,
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#2C2418",
    textAlign: "center",
  },
  pageSeparator: {
    fontSize: 24,
    color: "#6B6254",
    marginHorizontal: 12,
  },
  totalPages: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#6B6254",
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#8B5E3C",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  generateButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFF",
  },
  summaryBox: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5DFD4",
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#2C2418",
  },
  summaryPlaceholder: {
    backgroundColor: "#FFF",
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5DFD4",
    alignItems: "center",
  },
  summaryPlaceholderText: {
    fontSize: 14,
    color: "#6B6254",
    marginTop: 12,
    textAlign: "center",
  },
});
