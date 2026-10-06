import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const profile = userSnapshot.data();

            setUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: profile.name || "",
              phone: profile.phone || "",
              role: profile.role || "adopter",
            });
          } else {
            setUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name:
                firebaseUser.displayName ||
                firebaseUser.email?.split("@")[0] ||
                "",
              phone: "",
              role: "adopter",
            });
          }
        } catch (error) {
          console.error(
            "Erro ao carregar perfil do usuário:",
            error
          );

          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  async function login(email, password) {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const firebaseUser = result.user;

    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      throw new Error(
        "Perfil do usuário não encontrado no Firestore."
      );
    }

    const profile = userSnapshot.data();

    const nextUser = {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: profile.name || "",
      phone: profile.phone || "",
      role: profile.role || "adopter",
    };

    setUser(nextUser);

    return nextUser;
  }

  async function register({
    name,
    email,
    password,
    phone,
    role,
  }) {
    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const firebaseUser = result.user;

    const userProfile = {
      name: name?.trim() || "",
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      role: role || "adopter",
      createdAt: serverTimestamp(),
    };

    await setDoc(
      doc(db, "users", firebaseUser.uid),
      userProfile
    );

    const nextUser = {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: userProfile.name,
      phone: userProfile.phone,
      role: userProfile.role,
    };

    setUser(nextUser);

    return nextUser;
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser usado dentro de AuthProvider."
    );
  }

  return context;
}