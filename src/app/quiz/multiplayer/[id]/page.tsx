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
import { useAuth } from "@/hooks/AuthContext";

const Multiplayer = () => {
  const params = useParams();
  const roomId = params.id as string; //categoryでカテゴリ名が渡される
  const [roomData, setRoomData] = useState(null);
  const [yourId, setYourId] = useState<number>(0);
  const { user } = useAuth();

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
          //1人目トランザクションの可能性
          //フィールド値を作成

          setYourId(1);
          await getQuiz(); //1人目の場合のみクイズ取得・ランダム値設定
        } else {
          //2人目の場合
          const newUser = {
            user2: {
              id: user.id,
              name: user.username,
            },
          };
          await update(roomRef, newUser);
          setYourId(2);
          console.log("data2", (await get(roomRef)).val());
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

        //ここでユーザと一緒にクイズを設定
        await set(roomRef, {
          roomId: roomId,
          user1: {
            id: user.id,
            name: user.username,
          },
          quizzesData: quizzesData,
        });

        console.log("data1", (await get(roomRef)).val());
      } catch (error) {
        console.error(error);
      }
    };

    const createAnsList = async () => {
      try {
        const userAns = {
          [`ans_user${yourId}`]: [],
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
  }, [roomId, yourId]);

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
          <Start category={roomId} userId={yourId} roomData={roomData} />
        </div>
      )}

      <div>
        <button onClick={delDoc}>部屋を解散する</button>
      </div>
      <Link href="/">
        <button onClick={delDoc}>ホームに戻る</button>
      </Link>
    </div>
  );
};

export default Multiplayer;
