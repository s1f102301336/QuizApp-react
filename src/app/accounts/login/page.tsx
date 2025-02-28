"use client";
import { auth } from "@/firebase";
import { useAuth } from "@/hooks/AuthContext";
import { User } from "@/interface/User";
import {
  browserLocalPersistence,
  deleteUser,
  setPersistence,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import React from "react";

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

  const SignOut = async () => {
    const result = confirm(
      "本当にサインアウトしますか？（データは保存されます）"
    );
    if (result) {
      try {
        await signOut(auth);
        console.log("ユーザのサインアウトに成功しました");
      } catch (error) {
        console.error("ユーザのサインアウトに失敗しました", error);
      }
    } else {
      return;
    }
  };

  const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUserName = formData.get("name") as string;

    if (!newUserName) {
      alert("ユーザ名を入力してください");
      return;
    }

    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: newUserName,
        });
        setUser({ ...user, username: newUserName });
        console.log("プロフィールを更新しました");
      } catch (error) {
        console.error("プロフィールの更新に失敗しました", error);
      }
    } else {
      console.log("ユーザが存在しません");
    }
  };

  const handleDelete = async () => {
    const result = confirm("本当に削除しますか？（データは失われます）");
    if (result) {
      try {
        if (auth.currentUser) {
          await deleteUser(auth.currentUser);
          console.log("ユーザを削除しました");
        } else {
          console.log("ユーザが存在しません");
        }
      } catch (error) {
        console.error("ユーザの削除に失敗しました", error);
      }
    } else {
      return;
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
          <div>
            <button onClick={SignOut}>サインアウト</button>
          </div>
          <div>
            <button onClick={handleDelete} style={{ color: "red" }}>
              アカウントを削除
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
