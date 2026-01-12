import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../theme/ThemeProvider";

export default function SignupScreen({ navigation }) {
  const { signup, loading } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholderTextColor={theme.subText}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholderTextColor={theme.subText}
      />

      <Pressable
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => signup(email, password)}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Sign Up"}
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.goBack()}>
        <Text style={[styles.link, { color: theme.accent }]}>
          Back to Login
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 14,
  },
});
