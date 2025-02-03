"use client";

import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect } from "react";

export const Start = ({ category }: { category: string }) => {
  const quizRef = collection(db, "quizzes");
  const q =
    category !== "ALL"
      ? query(quizRef, where("category", "==", category))
      : query(quizRef);

  useEffect(() => {
    const getQuiz = async () => {
      const quizzes = await getDocs(q);
      quizzes.forEach((quiz) => {
        console.log("get quizzes", quiz.data());
      });
    };
    getQuiz();
  }, [q]);
  return (
    <div>
      <div>Start</div>
    </div>
  );
};
