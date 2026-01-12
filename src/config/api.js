const BASE_URL =
  typeof window !== "undefined"
    ? "http://localhost:5000"
    : "http://10.0.2.2:5000";

export default BASE_URL;
