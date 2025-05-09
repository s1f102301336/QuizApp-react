import { RoomData } from "@/interface/RoomData";
import styles from "./Results.module.css"; // CSSファイルをインポート
import React from "react";

interface Results {
  userId: number;
  roomData: RoomData;
  ansList: { choiceText: string; choiceCorrect: boolean }[];
  oppAnsList: { choiceText: string; choiceCorrect: boolean }[];
  point: number;
  oppPoint: number;
}

export const Results = ({
  userId,
  roomData,
  ansList,
  oppAnsList,
  point,
  oppPoint,
}: Results) => {
  const result = point > oppPoint ? "WIN" : point < oppPoint ? "LOSE" : "DRAW";

  return (
    <div className={styles.resultContainer}>
      <table className={styles.resultTable}>
        <thead>
          <tr>
            <th></th>
            <th>{roomData?.[`user${userId}`]?.name}</th>
            <th>{roomData?.[`user${3 - userId}`]?.name}</th>
          </tr>
        </thead>
        <tbody>
          {roomData.quizzesData?.map((_, i) => (
            <tr key={i + 1}>
              <th>{`第${i + 1}問`}</th>
              <td
                className={
                  ansList[i].choiceCorrect ? styles.correct : styles.incorrect
                }
              >
                {ansList[i].choiceCorrect ? "正解" : "不正解"}
              </td>
              <td
                className={
                  oppAnsList[i].choiceCorrect
                    ? styles.correct
                    : styles.incorrect
                }
              >
                {oppAnsList[i].choiceCorrect ? "正解" : "不正解"}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={styles.finalScoreRow}>
            <th>最終スコア</th>
            <td>{point}</td>
            <td>{oppPoint}</td>
          </tr>
        </tfoot>
      </table>
      <div
        className={`${styles.resultLabel} ${
          result === "WIN"
            ? styles.win
            : result === "LOSE"
            ? styles.lose
            : styles.draw
        }`}
      >
        {result}
      </div>
    </div>
  );
};
