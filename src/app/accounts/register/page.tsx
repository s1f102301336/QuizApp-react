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
  const SignUpWithGoogle = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //Signed up
        const user = userCredential.user;
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <form action="SignUp" method="post">
        <input type="email" />
        <input type="password" />
        <button type="submit" onClick={SignUpWithGoogle}>
          登録
        </button>
      </form>
      <div id="firebase-auth-container"></div>
    </div>
  );
};

export default Register;
