"use client";

import { rtdb } from "@/firebase";
import { Quiz } from "@/interface/Quiz";
import { get, push, ref } from "firebase/database";
import React, { useState } from "react";

interface RoomData {
  roomId: string;
  user1?: { id: number; name: string };
  user2?: { id: number; name: string };
  quizzesData?: Quiz[];
  ans_user1?: object;
  ans_user2?: object;
  [key: `ans_user${number}`]: object | undefined;
}

interface Room {
  category: string;
  userId: number;
  quizzes: Quiz[];
  roomData: RoomData;
}

export const Start = ({ category, userId, quizzes, roomData }: Room) => {
  const [quizNum, setQuizNum] = useState<number>(0);

  const [ansList, setAnsList] = useState<
    { choiceText: string; choiceCorrect: boolean }[]
  >([]);
  console.log("roomData", roomData);

  const userAnswer = async (c: Quiz["choices"][number]) => {
    const ansRef = ref(rtdb, `rooms/${category}/ans_user${userId}`);
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
    console.log("nowRoomData", (await get(ansRef)).val());
    console.log("realRoomData", roomData);
  };

  const changeQuiz = () => {
    //添え字は0から始まるため、次のクイズが存在する場合のみ実行
    if (quizNum < quizzes.length - 1) {
      setQuizNum((prev) => prev + 1);
    } else {
      return; //endQuizを作っても良い
    }
  };

  console.log("quizNum", quizNum);
  console.log("ansList", ansList);

  const nowQuiz =
    quizzes !== null && quizzes.length > 0 && quizNum < quizzes.length
      ? quizzes[quizNum]
      : null;

  const oppAns = roomData?.[`ans_user${3 - userId}`];
  const oppAnsList = oppAns ? Object.values(oppAns) : [];

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
          {quizNum !== null && oppAnsList.length > quizNum && (
            <div>
              相手の回答：
              {oppAnsList.slice(-1)[0].choiceCorrect ? "正解" : "不正解"}
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
