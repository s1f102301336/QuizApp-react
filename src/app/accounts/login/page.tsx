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
import React, { useEffect } from "react";
import styles from "./login.module.css";
import Image from "next/image";
import Logo from "../../../../public/Logo_2.png";
import { GoogleBtn } from "@/components/GoogleBtn";
import { useHeader } from "@/hooks/HeaderContext";

const Login = () => {
  const { user, setUser } = useAuth();

  const { setHeaderProps } = useHeader();

  useEffect(() => {
    setHeaderProps({ isLogo: true, page: "other" });
  }, []);

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

    if (user && auth.currentUser) {
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

  const isSignIn = !!user; //Boolean()と同じ意味

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.profileCard}>
          <div>
            <div>
              <Image src={Logo} alt="Logo Icon" className={styles.logo} />
              <div>プロフィール</div>
              <div>
                <div className={styles.prfText}>
                  <div className={styles.prfHead}>id:</div>
                  <div className={styles.prfBody}>
                    {user ? user.id : "guest"}
                  </div>
                </div>
                <div className={styles.prfText}>
                  <div className={styles.prfHead}>name:</div>
                  <div className={styles.prfBody}>
                    {user ? user.username : "guest"}
                  </div>
                </div>
                <div className={styles.prfText}>
                  <div className={styles.prfHead}>email:</div>
                  <div className={styles.prfBody}>
                    {user ? user.email : "guest@gmai.com"}
                  </div>
                </div>
              </div>
            </div>

            <div>
              {!isSignIn && (
                <div>
                  <div>
                    アカウント登録をすると対戦結果が記録され、
                    <br />
                    クイズ作成を行うこともできます
                  </div>
                  <div>Googleアカウントでサインアップ/サインイン</div>
                  <div onClick={SignInWithGoogle}>
                    <GoogleBtn />
                  </div>
                </div>
              )}
            </div>
            {/* 以下はただユーザー名を設定するだけの機能にする */}
            {isSignIn && (
              <div className={styles.optionSignIn}>
                <form onSubmit={handleSubmit} method="post">
                  <label htmlFor="name">ユーザー名を変更：</label>
                  <input type="text" name="name" />
                  {/* <label htmlFor="icon">アイコンを設定</label>
                  <input type="image" src="#" alt="icon" name="icon"/> */}
                  <button type="submit">登録</button>
                </form>
                <div className={styles.signOut}>
                  <div onClick={SignOut}>サインアウト</div>
                </div>
                <div className={styles.delete}>
                  <div onClick={handleDelete}>アカウントを削除</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
