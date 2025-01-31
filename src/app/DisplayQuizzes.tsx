import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";
import { Quiz } from "@/interface/Quiz";

//OmitでimportしたQuizを再利用できるかも

export const DisplayQuizzes = async () => {
  const snapshot = await getDocs(collection(db, "quizzes"));
  const quizzes = snapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...(doc.data() as Quiz), //titleとdescriptionだけ
    })
    //id属性は設定してないが、ランダム値が自動生成され設定される
    // => ({}) でjsブロックではなく、オブジェクトであることを明記
  );

  console.log("Q", quizzes);

  return (
    <div>
      <div>DisplayQuizzes</div>
      {quizzes.map((quiz) => (
        <div key={quiz.id}>
          <div>{quiz.title}</div>
          <div>{quiz.description}</div>

          <Link href={`./quiz/local/${quiz.id}`}>
            <button>入室</button>
          </Link>
        </div>
      ))}
    </div>
  );
};
