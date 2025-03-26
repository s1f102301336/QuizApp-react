"use client";

import { db } from "@/firebase";
import { Quiz } from "@/interface/Quiz";
import { doc, getDoc } from "firebase/firestore";
import { Header } from "@/components/Header";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import style from "./local.module.css";

//ディレクトリが[id]の際、{params}:{params:{id:string}}でパラメータを取得可能
// interface Props {
//   params: {
//     id: string;
//   };
// }

//useParams()で非同期取得仕様に変更された
const Local = () => {
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  //[number]により、Array<>のなかの型を参照
  const [answer, setAnswer] = useState<
    Quiz["choices"][number]["isCorrect"] | null
  >(null);
  // const result = result && userSelect.isCorrect;

  // const userSelect = (choice: Quiz["choices"][number]) => {
  //   return
  // };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, "quizzes", quizId); //ドキュメントへの参照を作成
        const docSnap = await getDoc(docRef); //参照をもとにデータを取得

        if (!docSnap.exists()) {
          console.error("Quiz not found");
          return <div>クイズが見つかりません</div>;
        }

        setQuiz(docSnap.data() as Quiz);

        console.log(docSnap.data()); //中身のオブジェクトを返す
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuiz();
  }, [quizId]);

  return (
    <div className={style.container}>
      <Header isLogo={true} page={answer === null ? "play" : "other"} />
      <div className={style.body}>
        <div className={style.quizCard}>
          {quiz && (
            <div>
              <div>{quiz.category}</div>
              <div>{quiz.title}</div>
              <div>{quiz.description}</div>
              <div>{quiz.question}</div>
              <ul>
                {quiz.choices.map((c, i) => (
                  <div key={i}>
                    <button onClick={() => setAnswer(c.isCorrect)}>
                      {c.text}
                    </button>
                  </div>
                ))}
              </ul>
              {answer !== null && (
                <div>
                  <div>{answer ? "正解" : "不正解"}</div>
                  <div>{quiz.explanation}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Local;
