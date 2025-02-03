"use client";

import { rtdb } from "@/firebase";
import { useParams } from "next/navigation";
import {
  ref,
  set,
  update,
  get,
  remove,
  onValue,
  off,
  DataSnapshot,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Start } from "./Start";
import Link from "next/link";

const Multiplayer = () => {
  const params = useParams();
  const roomId = params.id as string; //categoryでカテゴリ名が渡される
  const [roomData, setRoomData] = useState(null);

  const ready = roomData && "user2" in roomData;

  useEffect(() => {
    const roomRef = ref(rtdb, `rooms/${roomId}`); //roomsコレクションのもとにroomIdドキュメントを作成

    if (!roomId) return;

    //部屋を作成・2人目は更新して参加
    const createRoom = async () => {
      try {
        const roomSnapshot = await get(roomRef);
        console.log(roomSnapshot.val());

        if (!roomSnapshot.exists()) {
          //フィールド値を作成
          await set(roomRef, {
            roomId: roomId,
            user1: {
              id: 1234,
              name: "Taro",
            },
          });
          console.log("data", (await get(roomRef)).val());
        } else {
          const newUser = {
            user2: {
              id: 2345,
              name: "John",
            },
          };
          await update(roomRef, newUser);
          console.log("data", (await get(roomRef)).val());
        }
      } catch (error) {
        console.error("Error", error);
      }
    };
    createRoom();

    //リスナーを登録（更新を常に監視できるようになる）
    const callback = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        console.log("Data updated", snapshot.val());
        setRoomData(snapshot.val());
      } else {
        setRoomData(null);
      }
    };
    onValue(roomRef, callback);

    //クリーンアップ関数
    return () => off(roomRef, "value", callback);
  }, [roomId]);

  //部屋のドキュメントを削除する関数
  const delDoc = async () => {
    const roomRef = ref(rtdb, `rooms/${params.id}`);
    await remove(roomRef);
    return;
  };

  return (
    <div>
      <Header />
      <div>
        roomData:{roomData ? JSON.stringify(roomData, null, 2) : "No Data"}
      </div>
      {ready && (
        <div>
          <Start category={roomId} />
        </div>
      )}

      <div>
        <button onClick={delDoc}>部屋を解散する</button>
      </div>
      <Link href="/">
        <button>ホームに戻る</button>
      </Link>
    </div>
  );
};

export default Multiplayer;
