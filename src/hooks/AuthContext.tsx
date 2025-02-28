"use client";
import { auth } from "@/firebase";
import { User } from "@/interface/User";
import { onAuthStateChanged } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("AuthProviderのなかで宣言してください。");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          username: firebaseUser.displayName || "ゲスト",
          email: firebaseUser.email || "",
        });
      } else {
        setUser({ id: "", username: "ゲスト", email: "" });
      }
    });

    return () => unsubscribe();
  }, []);

  const [user, setUser] = useState<User>({
    id: "",
    username: "ゲスト",
    email: "",
  });
  const contextValue = { user, setUser };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
