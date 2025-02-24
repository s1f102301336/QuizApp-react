"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { auth } from "@/firebase";
import {
  GoogleAuthProvider,
  EmailAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const Register = () => {
  const SignUpWithEmail = (formData: FormData) => {
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const name = String(formData.get("name"));

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //Signed up
        const user = userCredential.user;

        console.log("user", user);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <form action={SignUpWithEmail} method="post">
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input type="mail" name="email" />
        </div>
        <div>
          <label htmlFor="password">パスワード(6文字以上)</label>
          <input type="text" name="password" />
        </div>
        <div>
          <label htmlFor="name">ユーザー名</label>
          <input type="text" name="name" />
        </div>
        <button type="submit">登録</button>
      </form>
      <div id="firebase-auth-container"></div>
    </div>
  );
};

export default Register;
