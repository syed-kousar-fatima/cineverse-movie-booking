
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import { validateSignupForm } from "../utils/validators.js";

const AuthContext = createContext(null);

const USERS_KEY = "cineverse-users";
const SESSION_KEY = "cineverse-user";

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

const normalizeEmail = (email) =>
  String(email || "").trim().toLowerCase();

const getPublicUser = (user) => {
  if (!user) {
    return null;
  }

  const { password, confirmPassword, ...publicUser } = user;
  return publicUser;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    getPublicUser(readStorage(SESSION_KEY, null))
  );
  const [loading] = useState(false);

  const signup = useCallback((values = {}) => {
    const name = String(values.name || "").trim();
    const email = normalizeEmail(values.email);
    const phone = String(values.phone || "").trim();
    const password = String(values.password || "");
    const confirmPassword = String(
      values.confirmPassword ?? values.password ?? ""
    );
    const acceptTerms = values.acceptTerms ?? true;

    const signupValues = {
      ...values,
      name,
      email,
      phone,
      password,
      confirmPassword,
      acceptTerms
    };

    const validation = validateSignupForm(signupValues);

    const hasValidationErrors =
      validation &&
      typeof validation === "object" &&
      Object.keys(validation).length > 0;

    if (hasValidationErrors) {
      return {
        success: false,
        message:
          Object.values(validation).find(
            (message) => typeof message === "string" && message.trim()
          ) || "Please check your signup details."
      };
    }

    if (!name || !email || !password) {
      return {
        success: false,
        message: "Please complete all required fields."
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match."
      };
    }

    if (!acceptTerms) {
      return {
        success: false,
        message: "Please accept the terms to continue."
      };
    }

    const users = readStorage(USERS_KEY, []);

    if (!Array.isArray(users)) {
      return {
        success: false,
        message: "Unable to access account data. Please try again."
      };
    }

    const existingUser = users.find(
      (item) => normalizeEmail(item.email) === email
    );

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists."
      };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      password,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];

    if (!writeStorage(USERS_KEY, updatedUsers)) {
      return {
        success: false,
        message: "Unable to save your account in this browser."
      };
    }

    const publicUser = getPublicUser(newUser);

    if (!writeStorage(SESSION_KEY, publicUser)) {
      return {
        success: false,
        message: "Your account was created, but the session could not be saved."
      };
    }

    setUser(publicUser);

    return {
      success: true,
      user: publicUser
    };
  }, []);

  const login = useCallback(({ email, password } = {}) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return {
        success: false,
        message: "Please enter your email and password."
      };
    }

    const users = readStorage(USERS_KEY, []);

    if (!Array.isArray(users)) {
      return {
        success: false,
        message: "Unable to access account data. Please try again."
      };
    }

    const matchedUser = users.find(
      (item) =>
        normalizeEmail(item.email) === normalizedEmail &&
        item.password === password
    );

    if (!matchedUser) {
      return {
        success: false,
        message: "Invalid email or password."
      };
    }

    const publicUser = getPublicUser(matchedUser);

    if (!writeStorage(SESSION_KEY, publicUser)) {
      return {
        success: false,
        message: "Unable to save your session in this browser."
      };
    }

    setUser(publicUser);

    return {
      success: true,
      user: publicUser
    };
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      return;
    }

    setUser(null);
  }, []);

  const updateProfile = useCallback((updates = {}) => {
    if (!user) {
      return {
        success: false,
        message: "Please log in to update your profile."
      };
    }

    const updatedUser = {
      ...user,
      ...updates,
      id: user.id,
      email: user.email
    };

    const users = readStorage(USERS_KEY, []);

    if (!Array.isArray(users)) {
      return {
        success: false,
        message: "Unable to access account data."
      };
    }

    const updatedUsers = users.map((item) =>
      item.id === user.id
        ? { ...item, ...updates, id: user.id, email: user.email }
        : item
    );

    if (!writeStorage(USERS_KEY, updatedUsers)) {
      return {
        success: false,
        message: "Unable to save your profile changes."
      };
    }

    if (!writeStorage(SESSION_KEY, updatedUser)) {
      return {
        success: false,
        message: "Unable to save your updated session."
      };
    }

    setUser(updatedUser);

    return {
      success: true,
      user: updatedUser
    };
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
      updateProfile
    }),
    [user, loading, signup, login, logout, updateProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

export default AuthContext;
