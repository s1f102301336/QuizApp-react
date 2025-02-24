"use client";
import { auth } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import React, { useState } from "react";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const SignInWithGoogle = () => {
    if (typeof window === "undefined") {
      console.error("Google Auth can only be used in a browser environment.");
      return;
    }

    const provider = new GoogleAuthProvider();

    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          const user = result.user.displayName;
          console.log("user", user);
          setIsSignIn(true);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.error(error);
        });
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const duplicateName = (e) => {};
  const setUserData = () => {};
  return (
    <div>
      <div>
        {!isSignIn && (
          <button onClick={SignInWithGoogle}>
            Googleアカウントでサインアップ/サインイン
          </button>
        )}
      </div>
      {!isSignUp && isSignIn && (
        <div>
          <form action={setUserData} method="post">
            <label htmlFor="name">ユーザー名</label>
            <input type="text" onChange={duplicateName(e)} value={userName} />
            <input type="image" src="#" alt="icon" />
            <button type="submit">登録</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
