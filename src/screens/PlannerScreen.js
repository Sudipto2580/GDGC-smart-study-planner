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

export default function PlannerScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");
  const [plans, setPlans] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const token = user?.token;

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const res = await fetch(`${BASE_URL}/api/plans`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setPlans(data);
  };

  const addOrUpdatePlan = async () => {
    if (!subject || !hours) return;

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${BASE_URL}/api/plans/${editingId}`
      : `${BASE_URL}/api/plans`;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subject, hours }),
    });

    setSubject("");
    setHours("");
    setEditingId(null);
    loadPlans();
  };

  const editPlan = (plan) => {
    setSubject(plan.subject);
    setHours(plan.hours);
    setEditingId(plan._id);
  };

  const deletePlan = async (id) => {
    await fetch(`${BASE_URL}/api/plans/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    loadPlans();
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View>
        <Text style={[styles.subject, { color: theme.text }]}>
          {item.subject}
        </Text>
        <Text style={{ color: theme.subText }}>
          {item.hours} hours / day
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => editPlan(item)}>
          <Text style={{ color: theme.accent }}>Edit</Text>
        </Pressable>
        <Pressable onPress={() => deletePlan(item._id)}>
          <Text style={{ color: "#ef4444" }}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Study Planner</Text>

      <View style={[styles.inputCard, { backgroundColor: theme.card }]}>
        <TextInput
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholderTextColor={theme.subText}
        />
        <TextInput
          placeholder="Hours"
          value={hours}
          onChangeText={setHours}
          keyboardType="numeric"
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholderTextColor={theme.subText}
        />
        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={addOrUpdatePlan}
        >
          <Text style={styles.buttonText}>
            {editingId ? "Update" : "Add"}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={plans}
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
  subject: { fontSize: 16, fontWeight: "500" },
  actions: { flexDirection: "row", gap: 15 },
});
