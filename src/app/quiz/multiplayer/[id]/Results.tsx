import { RoomData } from "@/interface/RoomData";
import React from "react";

interface Results {
  userId: number;
  roomData: RoomData;
  ansList: { choiceText: string; choiceCorrect: boolean }[];
  oppAnsList: { choiceText: string; choiceCorrect: boolean }[];
}

export const Results = ({ userId, roomData, ansList, oppAnsList }: Results) => {
  console.log("resultsInfo", userId, roomData, ansList, oppAnsList);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>{roomData?.[`user${userId}`]?.name}</th>
            <th>{roomData?.[`user${3 - userId}`]?.name}</th>
          </tr>
        </thead>
        <tbody>
          {roomData.quizzesData?.map((_, i) => (
            //jsx内ではreturnがないとReactNodeにできないので、mapかつ()が必要
            <tr key={i + 1}>
              <th>{`第${i}問`}</th>
              <td>{ansList[i].choiceCorrect ? "正解" : "不正解"}</td>
              <td>{oppAnsList[i].choiceCorrect ? "正解" : "不正解"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
