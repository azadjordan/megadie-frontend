import { setCredentials, logout } from "../slices/authSlice";

let sessionChecked = false; // ✅ Prevent repeated API calls

const API_BASE_URL = import.meta.env.VITE_API_URL; // ✅ Use correct env variable

// Optional: Warn if env variable is missing
if (!API_BASE_URL) {
  console.warn("⚠️ VITE_API_URL is not defined. Check your .env.development file.");
}

const authMiddleware = (store) => (next) => async (action) => {
  const { userInfo } = store.getState().auth;

  if (userInfo && !sessionChecked) {
    sessionChecked = true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/account/profile`, {
        method: "GET",
        credentials: "include", // ✅ Ensure cookie is sent
      });

      if (!res.ok) {
        throw new Error("Session expired");
      }

      const data = await res.json();
      store.dispatch(setCredentials(data));
    } catch (error) {
      console.warn("❌ Session check failed:", error.message);
      sessionChecked = false;
      store.dispatch(logout());
    }
  }

  return next(action);
};

export default authMiddleware;
