import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase";
import Link from "next/link";
import { Quiz } from "@/interface/Quiz";
import { QuizWithId } from "@/interface/QuizWithId";
import style from "./Display.module.css";

//OmitでimportしたQuizを再利用できるかも

export const DisplayQuizzes = ({ category }: { category: string }) => {
  const isSignIn = auth.currentUser;

  const [quizzes, setQuizzes] = useState<QuizWithId[]>([]);
  useEffect(() => {
    const fetchQuizzes = async () => {
      const snapshot = await getDocs(collection(db, "quizzes"));
      const quizzesData = snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...(doc.data() as Quiz), //titleとdescriptionだけ
        })
        //id属性は設定してないが、ランダム値が自動生成され設定される
        // => ({}) でjsブロックではなく、オブジェクトであることを明記
      );
      setQuizzes(quizzesData);
    };
    fetchQuizzes();
  }, [category]);

  console.log("Q", quizzes);
  return (
    <div className={style.container}>
      <div className={style.displayContainer}>
        {
          //とりあえず1問だけ
          //このままリンクにするか、Comportsとして包括し、スライドショーにするか
          <div className={style.MultiContainer}>
            <div>バトルマッチ</div>
            <div>カテゴリ：{category}</div>
            <Link href={isSignIn ? `./quiz/multiplayer/${category}` : "#"}>
              <button>入室</button>
            </Link>
            {/* ログインしてない人は無効にし、popup的なもので催促 */}
          </div>
        }
        <div className={style.localContainer}>
          <div className={style.localBody}>
            <div>シングルマッチ</div>
            {quizzes
              .filter((q) => category === "ALL" || q.category === category)
              .map((quiz) => (
                <div key={quiz.id} className={style.localCard}>
                  <div className={style.localText}>
                    <div>{quiz.title}</div>
                    <div>{quiz.description}</div>
                  </div>
                  {/* Localではランダム値idで識別 */}
                  <Link href={`./quiz/local/${quiz.id}`}>
                    <button className={style.localButton}>入室</button>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

//一度全部取得した後、数、カテゴリなどをバックエンドで絞って表示すれば読み込み回数減らせそう
