import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { BookOpen, Plus } from "lucide-react-native";
import { useBooks } from "@/contexts/BooksContext";
import { BookStatus } from "@/constants/types";

export default function LibraryScreen() {
  const router = useRouter();
  const { getBooksByStatus } = useBooks();
  const [selectedTab, setSelectedTab] = useState<BookStatus>("reading");

  const tabs = [
    { key: "reading" as BookStatus, label: "Reading" },
    { key: "completed" as BookStatus, label: "Completed" },
    { key: "want-to-read" as BookStatus, label: "Want to Read" },
  ];

  const currentBooks = getBooksByStatus(selectedTab);

  const getProgressPercentage = (currentPage: number, totalPages: number) => {
    return totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "My Library",
          headerStyle: { backgroundColor: "#F5F1EB" },
          headerTintColor: "#2C2418",
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/modal")}
              style={styles.addButton}
            >
              <Plus size={24} color="#2C2418" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {currentBooks.length === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen size={64} color="#C4B5A0" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No books here yet</Text>
            <Text style={styles.emptySubtitle}>
              {selectedTab === "reading"
                ? "Start reading a book to see it here"
                : selectedTab === "completed"
                ? "Finish a book to see it here"
                : "Add books you want to read"}
            </Text>
          </View>
        ) : (
          <View style={styles.booksGrid}>
            {currentBooks.map((book) => {
              const progress = getProgressPercentage(
                book.currentPage,
                book.totalPages
              );

              return (
                <TouchableOpacity
                  key={book.id}
                  style={styles.bookCard}
                  onPress={() => router.push(`/book/${book.id}`)}
                >
                  <View
                    style={[
                      styles.bookCover,
                      { backgroundColor: book.coverColor },
                    ]}
                  >
                    <BookOpen size={32} color="#FFF" strokeWidth={1.5} />
                  </View>
                  <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle} numberOfLines={2}>
                      {book.title}
                    </Text>
                    <Text style={styles.bookAuthor} numberOfLines={1}>
                      {book.author}
                    </Text>
                    {selectedTab === "reading" && (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              { width: `${progress}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {book.currentPage}/{book.totalPages}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
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
  addButton: {
    marginRight: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#F5F1EB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5DFD4",
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#2C2418",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#6B6254",
  },
  activeTabText: {
    color: "#F5F1EB",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600" as const,
    color: "#2C2418",
    marginTop: 24,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6B6254",
    marginTop: 8,
    textAlign: "center",
  },
  booksGrid: {
    gap: 16,
  },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#2C2418",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#6B6254",
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5DFD4",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8B5E3C",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#6B6254",
    marginTop: 4,
  },
});
