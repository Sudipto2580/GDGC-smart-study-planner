import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { ThemeContext } from "../theme/ThemeProvider";
import { AuthContext } from "../context/AuthContext";
import BASE_URL from "../config/api";

export default function ExamScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [exams, setExams] = useState([]);

  const token = user?.token;

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    const res = await fetch(`${BASE_URL}/api/exams`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setExams(data);
  };

  const addExam = async () => {
    if (!name || !date) return;

    await fetch(`${BASE_URL}/api/exams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, date }),
    });

    setName("");
    setDate("");
    loadExams();
  };

  const deleteExam = async (id) => {
    await fetch(`${BASE_URL}/api/exams/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    loadExams();
  };

  const daysLeft = (dateStr) => {
    const today = new Date();
    const exam = new Date(dateStr);
    return Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
  };

  const renderItem = ({ item }) => {
    const remaining = daysLeft(item.date);

    return (
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View>
          <Text style={[styles.examName, { color: theme.text }]}>
            {item.name}
          </Text>
          <Text style={{ color: theme.subText }}>
            {remaining >= 0
              ? `${remaining} days remaining`
              : "Exam passed"}
          </Text>
        </View>

        <Pressable onPress={() => deleteExam(item._id)}>
          <Text style={{ color: "#ef4444" }}>Delete</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Exam Countdown
      </Text>

      <View style={[styles.inputCard, { backgroundColor: theme.card }]}>
        <TextInput
          placeholder="Exam name"
          value={name}
          onChangeText={setName}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholderTextColor={theme.subText}
        />

        <TextInput
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholderTextColor={theme.subText}
        />

        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={addExam}
        >
          <Text style={styles.buttonText}>Add Exam</Text>
        </Pressable>
      </View>

      <FlatList
        data={exams}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "600", textAlign: "center", marginBottom: 20 },
  inputCard: { padding: 20, borderRadius: 14, marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { padding: 14, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
  card: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  examName: { fontSize: 16, fontWeight: "500" },
});
