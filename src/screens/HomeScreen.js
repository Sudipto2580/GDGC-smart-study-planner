import React, { useContext } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ThemeContext } from "../theme/ThemeProvider";
import { AuthContext } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.appName, { color: theme.text }]}>
          Smart Study Planner(GDGC)
        </Text>

        <Pressable onPress={toggleTheme}>
          <Text style={{ color: theme.accent }}>
            {theme.mode === "light" ? "Dark" : "Light"}
          </Text>
        </Pressable>
      </View>

      {/* Welcome Card */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.welcomeText, { color: theme.text }]}>
          Welcome {user?.guest ? "Guest" : user?.email}
        </Text>

        <Text style={{ color: theme.subText }}>
          Let’s plan and focus on your study.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionCard, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate("Planner")}
        >
          <Text style={[styles.actionText, { color: theme.text }]}>
            📚 Study Planner
          </Text>
        </Pressable>

        <Pressable
          style={[styles.actionCard, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate("Timer")}
        >
          <Text style={[styles.actionText, { color: theme.text }]}>
            ⏱️ Focus Timer
          </Text>
        </Pressable>

        <Pressable
          style={[styles.actionCard, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate("Exam")}
        >
          <Text style={[styles.actionText, { color: theme.text }]}>
            📅 Exam Countdown
          </Text>
        </Pressable>
      </View>

      {/* Logout */}
      <Pressable
        style={[styles.logoutButton]}
        onPress={logout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },
  appName: {
    fontSize: 22,
    fontWeight: "600",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 6,
  },
  actions: {
    flex: 1,
  },
  actionCard: {
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
  },
  actionText: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
