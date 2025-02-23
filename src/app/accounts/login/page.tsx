"use client";
import { auth } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import Link from "next/link";
import React from "react";

const Login = () => {
  const SignInWithGoogle = () => {
    console.log("ログイン");

    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };
  return (
    <div>
      <button onClick={SignInWithGoogle}>Sign In</button>
      <Link href={"/accounts/register"}>
        <button>Sign up</button>
      </Link>
    </div>
  );
};

export default Login;
