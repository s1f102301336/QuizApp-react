import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";
import { Quiz } from "@/interface/Quiz";
import { QuizWithId } from "@/interface/QuizWithId";
import style from "./Display.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";

//OmitでimportしたQuizを再利用できるかも

export const DisplayQuizzes = ({ category }: { category: string }) => {
  const router = useRouter();
  const { user } = useAuth();
  const isSignIn = !!user;
  console.log("ログインしてるかどうか", isSignIn);
  console.log("ログインしてるかどうか", user);

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

  const handleNavigation = () => {
    if (isSignIn) {
      router.push(`./quiz/multiplayer/${category}`);
    } else {
      alert("ログインが必要です");
    }
  };

  console.log("Q", quizzes);
  return (
    <div className={style.container}>
      <div className={style.displayContainer}>
        {
          //とりあえず1問だけ
          //このままリンクにするか、Comportsとして包括し、スライドショーにするか
          <div className={style.multiContainer}>
            <div className={style.multiBody}>
              <h2>バトルマッチ</h2>
              <div className={style.multiCard}>
                <div>
                  <h3>対戦部屋</h3>
                  <div>カテゴリ：{category}</div>
                  <p>選択したカテゴリの問題がランダムに出題されます</p>
                </div>
                <div className={style.multiBtn}>
                  <button onClick={handleNavigation}>入室</button>
                </div>
              </div>
            </div>
            {/* ログインしてない人は無効にし、popup的なもので催促 */}
          </div>
        }
        <div className={style.localContainer}>
          <div className={style.localBody}>
            <h2>シングルマッチ</h2>
            <div>
              {quizzes
                .filter((q) => category === "ALL" || q.category === category)
                .map((quiz) => (
                  <div key={quiz.id} className={style.localCard}>
                    <div>
                      <h3>{quiz.title}</h3>
                      <p>{quiz.description}</p>
                    </div>
                    {/* Localではランダム値idで識別 */}
                    <div className={style.localBtn}>
                      <Link href={`./quiz/local/${quiz.id}`}>入室</Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//一度全部取得した後、数、カテゴリなどをバックエンドで絞って表示すれば読み込み回数減らせそう
