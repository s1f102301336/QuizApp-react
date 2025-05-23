"use client";

import { rtdb } from "@/firebase";
import { Quiz } from "@/interface/Quiz";
import { get, push, ref, update } from "firebase/database";
import React, { useState } from "react";
import { Results } from "./Results";
import { RoomData } from "@/interface/RoomData";
import styles from "./Start.module.css";

interface Room {
  category: string;
  userId: number;
  roomData: RoomData;
}

export const Start = ({ category, userId, roomData }: Room) => {
  const [quizNum, setQuizNum] = useState<number>(0);

  const [ansList, setAnsList] = useState<
    { choiceText: string; choiceCorrect: boolean }[]
  >([]);
  console.log("roomData", roomData);

  const [nowChoice, setNowChoice] = useState<string | null>(null);
  const [point, setPoint] = useState(0);

  //クイズ一覧を参照
  const quizzes: Quiz[] = roomData?.quizzesData ?? []; //?? 左辺が偽値の時、右辺を返す

  //回答内容を保存する関数
  const userAnswer = async (
    e: React.MouseEvent<HTMLButtonElement>,
    c: Quiz["choices"][number]
  ) => {
    if (!nowChoice) {
      const currentId = e.currentTarget.id;
      disable(currentId);
      const ansRef = ref(rtdb, `rooms/${category}/ans_user${userId}`);
      const pointRef = ref(rtdb, `rooms/${category}/points`);

      const answer = {
        choiceText: c.text,
        choiceCorrect: c.isCorrect,
      };

      const newPoint = c.isCorrect ? point + 10 : Math.max(point - 10, 0); //0以下の時、0を返す

      try {
        await push(ansRef, answer);
        await update(pointRef, { [`user${userId}`]: newPoint });
        setPoint(newPoint);
        setAnsList((prev) => [...prev, answer]);
      } catch (error) {
        console.error(error);
      }
      console.log("nowRoomData", (await get(ansRef)).val());
      console.log("realRoomData", roomData);
    }
  };

  //選択していない選択肢を無効にする関数
  const disable = (currentId: string) => {
    //query...はNodeList、getElement...はHTMLCollectionを返すので、配列操作をするなら前者が良い！
    setNowChoice(currentId);
    //上記の状態により無効化
    console.log("disabledしてみた", currentId);
  };

  //クイズの添え字を更新する関数
  const changeQuiz = () => {
    //添え字は0から始まるため、次のクイズが存在する場合のみ実行
    setNowChoice(null);
    if (!gameSet) {
      setQuizNum((prev) => prev + 1);
    } else if (gameSet) {
    } else {
      return; //endQuizを作っても良い
    }
  };

  console.log("quizNum", quizNum);
  console.log("ansList", ansList);

  //クイズを更新する関数
  const nowQuiz =
    quizzes !== null && quizzes.length > 0 && quizNum < quizzes.length
      ? quizzes[quizNum]
      : null;

  //相手の回答を取得
  const oppAns = roomData?.[`ans_user${3 - userId}`];
  const oppAnsList = oppAns ? Object.values(oppAns) : [];

  //相手のポイントを取得
  const oppPoint = roomData?.points?.[`user${3 - userId}`] ?? 0;

  //ゲーム終了を判定
  const preGameSet = quizNum >= quizzes.length - 1;
  const gameSet = quizNum >= quizzes.length;
  console.log("gameSet", gameSet);

  console.log("nowQuiz", nowQuiz);

  return (
    <div className={styles.body}>
      {!gameSet ? (
        nowQuiz !== null ? (
          <div className={styles.mainCard}>
            <div className={styles.headCard}>
              <div className={styles.titleCard}>
                <div className={styles.category}>
                  {nowQuiz.category} : {quizNum}/{quizzes.length}
                </div>

                <div className={styles.title}>{nowQuiz.title}</div>
                <div className={styles.desc}>{nowQuiz.description}</div>

                <div className={styles.scoreContainer}>
                  <div className={styles.scoreCard}>
                    <div className={styles.scoreBox}>
                      <div className={styles.scoreColumn}>
                        <div className={styles.scoreLabel}>あなた</div>
                        <div className={styles.scoreValue}>{point}</div>
                        <div className={styles.judgeBox}>
                          {quizNum !== null && ansList.length > quizNum && (
                            <div
                              className={`${styles.judgeBadge} ${
                                ansList.slice(-1)[0].choiceCorrect
                                  ? styles.correct
                                  : styles.incorrect
                              }`}
                            >
                              {ansList.slice(-1)[0].choiceCorrect
                                ? "◯ 正解！"
                                : "× 不正解"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.scoreCard}>
                    <div className={styles.scoreBox}>
                      <div className={styles.scoreColumn}>
                        <div className={styles.scoreLabel}>相手</div>
                        <div className={styles.scoreValue}>{oppPoint}</div>
                        <div className={styles.judgeBox}>
                          {quizNum !== null && ansList.length > quizNum && (
                            <div
                              className={`${styles.judgeBadge} ${
                                oppAnsList.slice(-1)[0]?.choiceCorrect
                                  ? styles.correct
                                  : styles.incorrect
                              }`}
                            >
                              {oppAnsList.slice(-1)[0]?.choiceCorrect
                                ? "◯ 正解"
                                : "× 不正解"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.questionCard}>
              <div className={styles.qTitle}>問題</div>
              <div className={styles.qDetail}>{nowQuiz.question}</div>
            </div>

            <div className={styles.choiceCard}>
              <div className={styles.choices}>
                {nowQuiz.choices.map((c, j) => {
                  const isClicked = nowChoice !== null;
                  const isOther = nowChoice !== `choice-${j}`;

                  const buttonClass =
                    styles.btn +
                    " " +
                    (isClicked && isOther
                      ? styles.disBtn
                      : isClicked && !isOther
                      ? styles.clickBtn
                      : "");

                  return (
                    <button
                      key={j}
                      id={`choice-${j}`}
                      className={buttonClass}
                      onClick={(e) => {
                        userAnswer(e, c);
                      }}
                      disabled={isClicked && isOther}
                    >
                      {c.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {quizNum !== null && ansList.length > quizNum && (
              <div>
                <div className={styles.expCard}>
                  <div>解説</div>
                  <div className={styles.qDetail}>{nowQuiz.explanation}</div>
                </div>
              </div>
            )}

            {/* {quizNum !== null && ansList.length > quizNum && (
              <div>
                <div>
                  {ansList.slice(-1)[0].choiceCorrect ? "正解" : "不正解"}
                </div>
                <div>現在のポイント：{point}</div>
                <div className={styles.expCard}>
                  <div>解説</div>
                  <div className={styles.qDetail}>{nowQuiz.explanation}</div>
                </div>
              </div>
            )}
            {quizNum !== null && oppAnsList.length > quizNum && (
              <div>
                <div>
                  相手の回答：
                  {oppAnsList.slice(-1)[0].choiceCorrect ? "正解" : "不正解"}
                </div>
                <div>相手のポイント：{oppPoint}</div>
              </div>
            )} */}

            {ansList.length > quizNum && oppAnsList.length > quizNum && (
              <div className={styles.nextBtnContainer}>
                <button onClick={changeQuiz} className={styles.nextBtn}>
                  {!preGameSet ? "次の問題へ" : "リザルト画面へ"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>クイズが見つかりません</p>
        )
      ) : (
        <div>
          リザルト画面です
          <Results
            userId={userId}
            roomData={roomData}
            ansList={ansList}
            oppAnsList={oppAnsList}
            point={point}
            oppPoint={oppPoint}
          />
        </div>
      )}
    </div>
  );
};

//rtdbでlength取得、数字の羅列を配列にして、ランダムにシャッフルし共有、クイズの遷移時にその配列の順に添え字を変更して遷移
//quizzesはfirestoreだけどprops奈良渡していいかも

//userId = 0が出現・認証機能を追加しよう
