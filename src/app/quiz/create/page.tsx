"use client";

import { useState } from "react";
import { db } from "../../../firebase";
import { addDoc, collection } from "firebase/firestore";

const Create = () => {
  interface Quiz {
    category:
      | "Anime/Manga"
      | "Games"
      | "Music"
      | "History"
      | "Math"
      | "Science"
      | "Literature"
      | "Other";
    //配列の中身が複数になる場合、Array<>で囲う
    choices: Array<{
      isCorrect: boolean;
      text: string;
    }>;
    description: string;
    explanation: string;
    id: number;
    question: string;
    title: string;
  }

  const [numSelect, setNumSelect] = useState<number>(4);

  const SubmitQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
    console.log(e);

    const formData = new FormData(e.currentTarget); //formタグ自体を取得
    console.log(formData);

    const quizData = Object.fromEntries(formData.entries()); //二次元リスト＝＞オブジェクトに変換
    console.log(quizData);

    const choices = [...Array(numSelect)].map((_, i) => ({
      isCorrect: formData.get(`isCorrect${i}`) === "on", //指定nameの文字列を取得し判定
      text: quizData[`choice${i}`] as string,
    }));
    const addData: Quiz = {
      category: quizData.category as Quiz["category"],
      choices,
      description: quizData.description as string,
      explanation: quizData.explanation as string,
      id: Date.now(), //1970年始からのミリ単位秒
      question: quizData.question as string,
      title: quizData.title as string,
    };
    const docRef = await addDoc(collection(db, "quizzes"), addData); //fireStoreに追加
    console.log("new document", docRef);
  };

  return (
    <div>
      <form name="formQuiz" onSubmit={SubmitQuiz}>
        <label htmlFor="category">カテゴリ</label>
        <select id="category" name="category">
          <option value="">選択してください</option>
          <option value="Anime/Manga">アニメ/漫画</option>
          <option value="Games">ゲーム</option>
          <option value="Music">音楽</option>
          <option value="History">歴史</option>
          <option value="Math">数学</option>
          <option value="Science">理科</option>
          <option value="Literature">文学</option>
          <option value="Other">その他</option>
        </select>
        <label htmlFor="title">タイトル</label>
        <input type="text" id="title" name="title" required />
        <label htmlFor="description">説明</label>
        <input type="text" id="description" name="description" />
        <label htmlFor="question">問題</label>
        <input type="text" id="question" name="question" />
        <label htmlFor="numSelect">選択肢の数</label>
        <select
          id="numSelect"
          value={numSelect}
          onChange={(e) => setNumSelect(Number(e.currentTarget.value))} //型変換（as numberだと型をみなすだけで実際に変換しないので危険）
        >
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="6">6</option>
        </select>

        {
          //選択肢の数だけ入力欄を用意
          //jsxではforEachなので空配列の長さを用いてrange
          [...Array(numSelect)].map((_, i) => (
            <div key={i + 1}>
              <label htmlFor={`choice${i + 1}`}>選択肢{i + 1}</label>
              <input
                type="checkbox"
                id={`isCorrect${i + 1}`}
                name={`isCorrect${i + 1}`}
              />
              <input
                type="text"
                id={`choice${i + 1}`}
                name={`choice${i + 1}`}
              />
            </div>
          ))
        }

        <label htmlFor="explanation">解説</label>
        <input type="text" id="explanation" name="explanation" />
        <button type="submit">作成</button>
      </form>
    </div>
  );
};

export default Create;
