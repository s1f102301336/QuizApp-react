import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const DisplayQuizzes = async () => {
  const quizzes = await getDocs(collection(db, "quizzes")).then((snapshot) =>
    snapshot.docs.map((doc) => {
      return doc.data();
    })
  );
  console.log("Q", quizzes);

  return (
    <div>
      <div>DisplayQuizzes</div>
      {quizzes.map((quiz, index) => (
        <ul key={index}>
          <li>{quiz.title}</li>
          <li>{quiz.description}</li>
        </ul>
      ))}
    </div>
  );
};
