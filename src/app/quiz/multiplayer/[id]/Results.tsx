import { RoomData } from "@/interface/RoomData";
import React from "react";

interface Results {
  userId: number;
  roomData: RoomData;
}

export const Results = ({ userId, roomData }: Results) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>{userId}</th>
            <th></th>
          </tr>
        </thead>
      </table>
    </div>
  );
};
