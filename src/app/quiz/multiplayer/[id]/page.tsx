"use client";

import { rtdb } from "@/firebase";
import { useParams } from "next/navigation";
import { ref, set, update, get } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Start } from "./Start";

const Multiplayer = () => {
  const params = useParams();
  const roomId = params.id as string;
  const dbRef = ref(rtdb, "rooms/" + roomId); //roomsコレクションのもとにroomIdドキュメントを作成

  const [ready, setReady] = useState(false);
  console.log("s", dbRef);
  console.log("d", roomId);

  try {
    useEffect(() => {
      console.log("Hello");

      const createRoom = async () => {
        const roomSnapshot = await get(dbRef);
        console.log("Hello");
        if (!roomSnapshot.exists()) {
          //フィールド値を作成
          set(dbRef, {
            roomId: roomId,
            user1: {
              id: 1234,
              name: "Taro",
            },
          });
          console.log("data", roomSnapshot);
        } else {
          const newUser = {
            user2: {
              id: 2345,
              name: "John",
            },
          };
          update(dbRef, newUser);
          setReady(true);
          console.log("data", roomSnapshot);
        }
      };
      createRoom();
    }, [dbRef, roomId]);

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
  } catch (error) {
    console.error("Error", error);
  }
};

export default Multiplayer;
