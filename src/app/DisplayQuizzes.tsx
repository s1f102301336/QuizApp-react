import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";
import { Quiz } from "@/interface/Quiz";
import { QuizWithId } from "@/interface/QuizQithId";

//OmitでimportしたQuizを再利用できるかも

export const DisplayQuizzes = ({ category }: { category: string }) => {
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
    <div>
      <div>DisplayQuizzes</div>
      {
        //とりあえず1問だけ
        <div>
          <div>クイズマッチ</div>
          <div>カテゴリ：{category}</div>
          <Link href={`./quiz/multiplayer/${category}`}>
            <button>入室</button>
          </Link>
        </div>
      }
      {quizzes
        .filter((q) => category === "ALL" || q.category === category)
        .map((quiz) => (
          <div key={quiz.id}>
            シングルマッチ
            <div>{quiz.title}</div>
            <div>{quiz.description}</div>
            {/* Localではランダム値idで識別 */}
            <Link href={`./quiz/local/${quiz.id}`}>
              <button>入室</button>
            </Link>
          </div>
        ))}
    </div>
  );
};

//一度全部取得した後、数、カテゴリなどをバックエンドで絞って表示すれば読み込み回数減らせそう
