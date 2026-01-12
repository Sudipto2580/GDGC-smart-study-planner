import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
} from "react-native";

import { ThemeContext } from "../theme/ThemeProvider";
import { AuthContext } from "../context/AuthContext";
import BASE_URL from "../config/api";

export default function TimerScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const token = user?.token;

  const [focusMinutes, setFocusMinutes] = useState("25");
  const [breakMinutes, setBreakMinutes] = useState("5");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("focus"); // focus | break

  // Load saved timer settings
  useEffect(() => {
    loadSettings();
  }, []);

  // Timer logic
  useEffect(() => {
    let timer = null;

    if (isRunning) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // ✅ Save completed session to backend
            saveSession(
              mode,
              mode === "focus"
                ? parseInt(focusMinutes) * 60
                : parseInt(breakMinutes) * 60
            );

            playSound();
            switchMode();

            return mode === "focus"
              ? parseInt(breakMinutes) * 60
              : parseInt(focusMinutes) * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, mode]);

  // Load timer settings
  const loadSettings = async () => {
    try {
      const saved = localStorage.getItem("TIMER_SETTINGS");
      if (saved) {
        const data = JSON.parse(saved);
        setFocusMinutes(data.focus);
        setBreakMinutes(data.break);
        setSecondsLeft(parseInt(data.focus) * 60);
      }
    } catch {}
  };

  // Save timer settings
  const saveSettings = () => {
    const data = {
      focus: focusMinutes,
      break: breakMinutes,
    };
    localStorage.setItem("TIMER_SETTINGS", JSON.stringify(data));
    resetTimer();
  };

  // Save completed session to MongoDB
  const saveSession = async (type, duration) => {
    if (!token) return;

    try {
      await fetch(`${BASE_URL}/api/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, duration }),
      });
    } catch (err) {
      console.log("Failed to save session");
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === "focus" ? "break" : "focus"));
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode("focus");
    setSecondsLeft(parseInt(focusMinutes) * 60);
  };

  const playSound = () => {
    if (typeof window !== "undefined") {
      alert("⏰ Time's up!");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {mode === "focus" ? "Focus Time" : "Break Time"}
      </Text>

      <Text style={[styles.timerText, { color: theme.primary }]}>
        {formatTime(secondsLeft)}
      </Text>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => setIsRunning((prev) => !prev)}
        >
          <Text style={styles.buttonText}>
            {isRunning ? "Pause" : "Start"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: "#ef4444" }]}
          onPress={resetTimer}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>

      {/* Settings */}
      <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>
          Focus Minutes
        </Text>
        <TextInput
          value={focusMinutes}
          onChangeText={setFocusMinutes}
          keyboardType="numeric"
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
        />

        <Text style={[styles.label, { color: theme.text }]}>
          Break Minutes
        </Text>
        <TextInput
          value={breakMinutes}
          onChangeText={setBreakMinutes}
          keyboardType="numeric"
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
        />

        <Pressable
          style={[styles.saveButton, { backgroundColor: theme.accent }]}
          onPress={saveSettings}
        >
          <Text style={styles.buttonText}>Save Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 64,
    fontWeight: "700",
    marginBottom: 30,
  },
  controls: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  settingsCard: {
    width: "100%",
    padding: 20,
    borderRadius: 14,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  saveButton: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
