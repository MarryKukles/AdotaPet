import React, { createContext, useContext, useEffect, useState } from "react";
import { configured, auth } from "./firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("adotapet_user")); } catch { return null; }
  });
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
        role: localStorage.getItem("adotapet_role") || "adopter"
      } : null);
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    if (configured) {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const next = { id: result.user.uid, email: result.user.email, name: result.user.email.split("@")[0], role: localStorage.getItem("adotapet_role") || "adopter" };
      setUser(next);
      return next;
    }
    const users = JSON.parse(localStorage.getItem("adotapet_users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("E-mail ou senha inválidos.");
    setUser(found);
    localStorage.setItem("adotapet_user", JSON.stringify(found));
    return found;
  };

  const register = async ({ name, email, password, role }) => {
    if (configured) {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("adotapet_role", role);
      const next = { id: result.user.uid, email, name, role };
      setUser(next);
      return next;
    }
    const users = JSON.parse(localStorage.getItem("adotapet_users") || "[]");
    if (users.some((u) => u.email === email)) throw new Error("Este e-mail já está cadastrado.");
    const next = { id: crypto.randomUUID(), name, email, password, role };
    users.push(next);
    localStorage.setItem("adotapet_users", JSON.stringify(users));
    localStorage.setItem("adotapet_user", JSON.stringify(next));
    setUser(next);
    return next;
  };

  const logout = async () => {
    if (configured) await signOut(auth);
    localStorage.removeItem("adotapet_user");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
