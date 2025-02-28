"use client";
import { auth } from "@/firebase";
import { useAuth } from "@/hooks/AuthContext";
import { User } from "@/interface/User";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import React, { useState } from "react";

const Login = () => {
  const { user, setUser } = useAuth();

  const SignInWithGoogle = async () => {
    if (typeof window === "undefined") {
      console.error("Google Auth can only be used in a browser environment.");
      return;
    }

    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, new GoogleAuthProvider());

      const user = result.user.displayName;
      console.log("user", user);
      const newUser: User = {
        id: result.user.uid,
        username: result.user.displayName || "ゲスト",
        email: result.user.email || "",
      };
      setUser(newUser);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSubmit = (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUserName = formData.get("name") as string;

    if (!newUserName) {
      alert("ユーザ名を入力してください");
      return;
    }

    if (auth.currentUser) {
      try {
        updateProfile(auth.currentUser, {
          displayName: newUserName,
        });
        setUser({ ...user, username: newUserName });
        console.log("プロフィールを更新しました");
      } catch (error) {
        console.error("プロフィールの更新に失敗しました", error);
      }
    }
  };

  const isSignIn = !!user.id; //Boolean()と同じ意味

  return (
    <div>
      <div>
        <div>プロフィール</div>
        <ul>
          <li>id:{user.id}</li>
          <li>name:{user.username}</li>
          <li>email:{user.email}</li>
        </ul>
      </div>
      アカウント登録をすると対戦結果が記録され、クイズ作成を行うこともできます
      <div>
        {!isSignIn && (
          <button onClick={SignInWithGoogle}>
            Googleアカウントでサインアップ/サインイン
          </button>
        )}
      </div>
      {/* 以下はただユーザー名を設定するだけの機能にする */}
      {isSignIn && (
        <div>
          <form onSubmit={handleSubmit} method="post">
            <label htmlFor="name">ユーザー名</label>
            <input type="text" name="name" />
            {/* <label htmlFor="icon">アイコンを設定</label>
            <input type="image" src="#" alt="icon" name="icon"/> */}
            <button type="submit">登録</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
