"use client";

import { rtdb } from "@/firebase";
import { useParams } from "next/navigation";
import { ref, set, update, get } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Start } from "./Start";

const Multiplayer = () => {
  const params = useParams();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const roomId = params.id as string;
    const dbRef = ref(rtdb, `rooms/${roomId}`); //roomsコレクションのもとにroomIdドキュメントを作成
    console.log("Hello");

    const createRoom = async () => {
      try {
        const roomSnapshot = await get(dbRef);
        console.log(roomSnapshot.val());
        console.log("Hello2");
        if (!roomSnapshot.exists()) {
          //フィールド値を作成
          await set(dbRef, {
            roomId: roomId,
            user1: {
              id: 1234,
              name: "Taro",
            },
          });
          console.log("data", roomSnapshot.val());
        } else {
          const newUser = {
            user2: {
              id: 2345,
              name: "John",
            },
          };
          await update(dbRef, newUser);
          setReady(true);
          console.log("data", roomSnapshot.val());
        }
      } catch (error) {
        console.error("Error", error);
      }
    };
    createRoom();
  }, [params.id]);

  return (
    <div>
      <Header />
      {ready && (
        <div>
          <Start />
        </div>
      )}
    </div>
  );
};

export default Multiplayer;
