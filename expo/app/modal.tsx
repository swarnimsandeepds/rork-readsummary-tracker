import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useBooks } from "@/contexts/BooksContext";
import { BookStatus } from "@/constants/types";

export default function AddBookModal() {
  const router = useRouter();
  const { addBook } = useBooks();
  
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [status, setStatus] = useState<BookStatus>("want-to-read");

  const handleSubmit = () => {
    if (title.trim() && author.trim() && totalPages) {
      const pages = parseInt(totalPages, 10);
      if (!isNaN(pages) && pages > 0) {
        addBook(title.trim(), author.trim(), pages, status);
        router.back();
      }
    }
  };

  const isValid = title.trim() && author.trim() && totalPages && parseInt(totalPages, 10) > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Book Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter book title"
          placeholderTextColor="#A39A8C"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        <Text style={styles.label}>Author</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter author name"
          placeholderTextColor="#A39A8C"
          value={author}
          onChangeText={setAuthor}
        />

        <Text style={styles.label}>Total Pages</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of pages"
          placeholderTextColor="#A39A8C"
          value={totalPages}
          onChangeText={setTotalPages}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          {(["want-to-read", "reading", "completed"] as BookStatus[]).map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.statusButton, status === s && styles.statusButtonActive]}
              onPress={() => setStatus(s)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  status === s && styles.statusButtonTextActive,
                ]}
              >
                {s === "reading" ? "Reading" : s === "completed" ? "Completed" : "Want to Read"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={styles.submitButtonText}>Add Book</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F1EB",
  },
  content: {
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#2C2418",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5DFD4",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#2C2418",
  },
  statusContainer: {
    gap: 8,
  },
  statusButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
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
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#6B6254",
  },
  statusButtonTextActive: {
    color: "#F5F1EB",
  },
  submitButton: {
    backgroundColor: "#8B5E3C",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 32,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#FFF",
  },
});
