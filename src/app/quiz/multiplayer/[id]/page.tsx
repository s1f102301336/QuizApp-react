"use client";

import { db, rtdb } from "@/firebase";
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
import { collection, getDocs, query, where } from "firebase/firestore";
import { Quiz } from "@/interface/Quiz";

const Multiplayer = () => {
  const params = useParams();
  const roomId = params.id as string; //categoryでカテゴリ名が渡される
  const [roomData, setRoomData] = useState(null);
  const [yourId, setYourId] = useState<string>("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const ready = roomData && "user2" in roomData;

  useEffect(() => {
    console.log("params", params);
    console.log("params", params.id);
    const roomRef = ref(rtdb, `rooms/${roomId}`); //roomsコレクションのもとにroomIdドキュメントを作成

    if (!roomId || yourId) return;

    //部屋を作成・2人目は更新して参加
    const createRoom = async () => {
      try {
        const roomSnapshot = await get(roomRef);
        console.log(roomSnapshot.val());

        if (!roomSnapshot.exists()) {
          //1人目トランザクションの可能性
          //フィールド値を作成
          await set(roomRef, {
            roomId: roomId,
            user1: {
              id: 1234,
              name: "Taro",
            },
          });
          setYourId("user1");
          console.log("data1", (await get(roomRef)).val());
          getQuiz(); //1人目の場合のみクイズ取得・ランダム値設定
        } else {
          //2人目の場合
          const newUser = {
            user2: {
              id: 2345,
              name: "John",
            },
          };
          await update(roomRef, newUser);
          setYourId("user2");
          console.log("data2", (await get(roomRef)).val());
          const quizRef = ref(rtdb, `rooms/${roomId}/quizzesData`);
          setQuizzes((await get(quizRef)).val());
        }
      } catch (error) {
        console.error("Error", error);
      }
    };
    createRoom();

    const getQuiz = async () => {
      try {
        const quizRef = collection(db, "quizzes");
        const q =
          roomId !== "ALL"
            ? query(quizRef, where("category", "==", roomId))
            : query(quizRef);

        const snapshot = await getDocs(q);

        const quizzesData = snapshot.docs
          .map((doc) => ({
            ...(doc.data() as Quiz),
          }))
          .toSorted(() => Math.random() - Math.random()); //ランダムに並び替え

        console.log("quizzes", quizzesData);
        console.log("user:", yourId);

        console.log("pre", (await get(roomRef)).val());
        await update(roomRef, { quizzesData });
        console.log("pre", (await get(roomRef)).val());

        setQuizzes(quizzesData);
      } catch (error) {
        console.error(error);
      }
    };

    const createAnsList = async () => {
      try {
        const userAns = {
          [`ans_${yourId}`]: [],
        };
        await update(roomRef, userAns);
      } catch (error) {
        console.error(error);
      }
    };

    createAnsList();

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
    const roomRef = ref(rtdb, `rooms/${roomId}`);
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
          <Start category={roomId} userId={yourId} quizzes={quizzes} />
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
