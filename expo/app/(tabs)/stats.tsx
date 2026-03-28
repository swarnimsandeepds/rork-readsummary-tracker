import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { useBooks } from "@/contexts/BooksContext";
import { BookOpen, CheckCircle, Clock, Target } from "lucide-react-native";

export default function StatsScreen() {
  const { books } = useBooks();

  const readingBooks = books.filter((b) => b.status === "reading");
  const completedBooks = books.filter((b) => b.status === "completed");
  const wantToReadBooks = books.filter((b) => b.status === "want-to-read");

  const totalPagesRead = completedBooks.reduce(
    (sum, book) => sum + book.totalPages,
    0
  );

  const currentlyReadingProgress = readingBooks.reduce(
    (sum, book) => sum + book.currentPage,
    0
  );

  const stats = [
    {
      icon: BookOpen,
      label: "Total Books",
      value: books.length.toString(),
      color: "#8B5E3C",
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: completedBooks.length.toString(),
      color: "#2C5F4F",
    },
    {
      icon: Clock,
      label: "Currently Reading",
      value: readingBooks.length.toString(),
      color: "#7B6B5C",
    },
    {
      icon: Target,
      label: "Want to Read",
      value: wantToReadBooks.length.toString(),
      color: "#4A5D5E",
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Reading Stats",
          headerStyle: { backgroundColor: "#F5F1EB" },
          headerTintColor: "#2C2418",
          headerShadowVisible: false,
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <View
                  style={[styles.iconContainer, { backgroundColor: stat.color }]}
                >
                  <Icon size={28} color="#FFF" strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading Progress</Text>
          
          <View style={styles.progressCard}>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Pages Completed</Text>
              <Text style={styles.progressValue}>{totalPagesRead.toLocaleString()}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Pages in Progress</Text>
              <Text style={styles.progressValue}>{currentlyReadingProgress.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {completedBooks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Completed</Text>
            {completedBooks
              .sort((a, b) => {
                const dateA = a.dateCompleted ? new Date(a.dateCompleted).getTime() : 0;
                const dateB = b.dateCompleted ? new Date(b.dateCompleted).getTime() : 0;
                return dateB - dateA;
              })
              .slice(0, 5)
              .map((book) => (
                <View key={book.id} style={styles.recentBookCard}>
                  <View
                    style={[styles.miniCover, { backgroundColor: book.coverColor }]}
                  >
                    <BookOpen size={16} color="#FFF" strokeWidth={2} />
                  </View>
                  <View style={styles.recentBookInfo}>
                    <Text style={styles.recentBookTitle} numberOfLines={1}>
                      {book.title}
                    </Text>
                    <Text style={styles.recentBookAuthor} numberOfLines={1}>
                      {book.author}
                    </Text>
                  </View>
                  <Text style={styles.recentBookPages}>{book.totalPages}p</Text>
                </View>
              ))}
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
  content: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: "#2C2418",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B6254",
    textAlign: "center",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: "#2C2418",
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressItem: {
    flex: 1,
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 14,
    color: "#6B6254",
    marginBottom: 8,
    textAlign: "center",
  },
  progressValue: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#2C2418",
  },
  divider: {
    width: 1,
    backgroundColor: "#E5DFD4",
    marginHorizontal: 16,
  },
  recentBookCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  miniCover: {
    width: 40,
    height: 56,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  recentBookInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recentBookTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#2C2418",
    marginBottom: 2,
  },
  recentBookAuthor: {
    fontSize: 12,
    color: "#6B6254",
  },
  recentBookPages: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#8B5E3C",
  },
});
