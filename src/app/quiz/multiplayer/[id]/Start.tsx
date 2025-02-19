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

  const [nowChoice, setNowChoice] = useState<string | null>(null);

  const userAnswer = async (
    e: React.MouseEvent<HTMLButtonElement>,
    c: Quiz["choices"][number]
  ) => {
    const currentId = e.currentTarget.id;
    disable(currentId);
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

  const disable = (currentId: string) => {
    //query...はNodeList、getElement...はHTMLCollectionを返すので、配列操作をするなら前者が良い！
    setNowChoice(currentId);
    console.log("disabledしてみた", currentId);
  };

  const changeQuiz = () => {
    //添え字は0から始まるため、次のクイズが存在する場合のみ実行
    setNowChoice(null);
    if (!gameSet) {
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

  const preGameSet = quizNum >= quizzes.length - 2;
  const gameSet = quizNum >= quizzes.length - 1;
  console.log("gameSet", gameSet);

  console.log("nowQuiz", nowQuiz);

  return (
    <div>
      <div>Start</div>

      {nowQuiz !== null ? (
        !gameSet ? (
          <div>
            <div>{nowQuiz.category}</div>
            <div>{nowQuiz.title}</div>
            <div>{nowQuiz.description}</div>
            <div>{nowQuiz.question}</div>
            <ul>
              {nowQuiz.choices.map((c, j) => (
                <div key={j}>
                  <button
                    id={`choice-${j}`}
                    className="choices"
                    onClick={(e) => userAnswer(e, c)}
                    disabled={nowChoice !== null && nowChoice !== `choice-${j}`}
                  >
                    {c.text}
                  </button>
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
            {ansList.length > quizNum && oppAnsList.length > quizNum && (
              <div>
                <button onClick={changeQuiz}>
                  {!preGameSet ? "次の問題へ" : "リザルト画面へ"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>リザルト画面です</div>
        )
      ) : (
        <p>クイズが見つかりません</p>
      )}
    </div>
  );
};

//rtdbでlength取得、数字の羅列を配列にして、ランダムにシャッフルし共有、クイズの遷移時にその配列の順に添え字を変更して遷移
//quizzesはfirestoreだけどprops奈良渡していいかも
