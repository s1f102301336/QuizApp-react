"use client";

import { db } from "@/firebase";
import { Quiz } from "@/interface/Quiz";
import { doc, getDoc } from "firebase/firestore";
import { Header } from "@/components/Header";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./local.module.css";

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
    <div className={styles.container}>
      <Header isLogo={true} page={answer === null ? "play" : "other"} />
      <div className={styles.body}>
        <div className={styles.bodyCard}>
          {quiz && (
            <div className={styles.mainCard}>
              <div>
                <div className={styles.headCard}>
                  <div className={styles.stateQuiz}>
                    <div className={styles.myPoint}>自分のポイント：</div>
                    <div className={styles.oppPoint}>相手のポイント：</div>
                    <div className={styles.timeLimit}>残り時間：</div>
                  </div>
                  <div className={styles.titleCard}>
                    <div className={styles.category}>{quiz.category}</div>
                    <div className={styles.title}>{quiz.title}</div>
                    <div className={styles.desc}>{quiz.description}</div>
                  </div>
                </div>
              </div>
              <div className={styles.questionCard}>
                <div className={styles.qTitle}>問題</div>
                <div className={styles.qDetail}>{quiz.question}</div>
              </div>

              <div className={styles.choiceCard}>
                {quiz.choices.map((c, i) => (
                  <div key={i} className={styles.choiceBox}>
                    <button onClick={() => setAnswer(c.isCorrect)}>
                      {c.text}
                    </button>
                  </div>
                ))}
              </div>
              {answer !== null && (
                <div>
                  <div>{answer ? "正解" : "不正解"}</div>
                  <div className={styles.expCard}>
                    <div className={styles.qTitle}>解説</div>
                    <div className={styles.qDetail}>{quiz.explanation}</div>
                  </div>
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
