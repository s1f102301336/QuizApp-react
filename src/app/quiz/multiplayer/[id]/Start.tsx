"use client";

import { db, rtdb } from "@/firebase";
import { Quiz } from "@/interface/Quiz";
import { get, push, ref, update } from "firebase/database";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export const Start = ({
  category,
  userId,
}: {
  category: string;
  userId: string;
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizNum, setQuizNum] = useState<number | null>(null);
  const [quizOrder, setQuizOrder] = useState<number[]>([]);
  const [ansList, setAnsList] = useState<
    { choiceText: string; choiceCorrect: boolean }[]
  >([]);

  useEffect(() => {
    const roomRef = ref(rtdb, `rooms/${category}`);

    const getQuiz = async () => {
      try {
        const quizRef = collection(db, "quizzes");
        const q =
          category !== "ALL"
            ? query(quizRef, where("category", "==", category))
            : query(quizRef);

        const snapshot = await getDocs(q);

        const quizzesData = snapshot.docs.map((doc) => ({
          ...(doc.data() as Quiz),
        }));

        console.log("quizzes", quizzesData);
        console.log("user:", userId);

        //ランダム順の添え字配列を作成
        if (userId === "user1") {
          const rdmOrder = [...Array(quizzesData.length)]
            .map((_, i) => i)
            .toSorted(() => Math.random() - Math.random());

          console.log("rdmOrder", rdmOrder);

          //クイズの順番を共有
          await update(roomRef, { rdmOrder });
        }
        //2番目の人が追い越してしまうので待つ

        setQuizzes(quizzesData);
      } catch (error) {
        console.error(error);
      }
    };

    const createAnsList = async () => {
      try {
        const userAns = {
          [`ans_${userId}`]: [],
        };
        await update(roomRef, userAns);
      } catch (error) {
        console.error(error);
      }
    };

    const getRdmOder = async () => {
      const Rdm = await get(ref(rtdb, `rooms/${category}/rdmOrder`));
      console.log("Rdm", Rdm);

      if (Rdm.exists()) {
        setQuizOrder(Rdm.val());
      }
    };

    getQuiz();
    createAnsList();
    getRdmOder();

    setQuizNum(0);
  }, [category, userId]);

  const userAnswer = async (c: Quiz["choices"][number]) => {
    const ansRef = ref(rtdb, `rooms/${category}/ans_${userId}`);
    const answer = {
      choiceText: c.text,
      choiceCorrect: c.isCorrect,
    };
    try {
      await push(ansRef, answer);
      setAnsList((prev) => [...prev, answer]);
    } catch (error) {
      console.error(error);
    }
  };

  const changeQuiz = () => {
    //添え字は0から始まるため、次のクイズが存在する場合のみ実行
    if (quizNum !== null && quizNum < quizzes.length - 1) {
      setQuizNum((prev) => (prev !== null ? prev + 1 : 0));
    } else {
      return; //endQuizを作っても良い
    }
  };

  console.log("quizNum", quizNum);
  console.log("quizOrder", quizOrder);
  console.log("ansList", ansList);

  const nowQuiz =
    quizNum !== null &&
    quizOrder.length > 0 &&
    quizzes.length > 0 &&
    quizNum < quizzes.length
      ? quizzes[quizOrder[quizNum]] ?? null
      : null;

  console.log("nowQuiz", nowQuiz);

  return (
    <div>
      <div>Start</div>

      {nowQuiz !== null ? (
        <div>
          <div>{nowQuiz.category}</div>
          <div>{nowQuiz.title}</div>
          <div>{nowQuiz.description}</div>
          <div>{nowQuiz.question}</div>
          <ul>
            {nowQuiz.choices.map((c, j) => (
              <div key={j}>
                <button onClick={() => userAnswer(c)}>{c.text}</button>
              </div>
            ))}
          </ul>
          {quizNum !== null && ansList.length > quizNum && (
            <div>
              <div>
                {ansList.slice(-1)[0].choiceCorrect ? "正解" : "不正解"}
              </div>
              <div>{nowQuiz.explanation}</div>
            </div>
          )}
        </div>
      ) : (
        <p>クイズが見つかりません</p>
      )}
      <div>
        <button onClick={changeQuiz}>次の問題へ</button>
      </div>
    </div>
  );
};

//rtdbでlength取得、数字の羅列を配列にして、ランダムにシャッフルし共有、クイズの遷移時にその配列の順に添え字を変更して遷移
//quizzesはfirestoreだけどprops奈良渡していいかも
