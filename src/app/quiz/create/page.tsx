"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { Quiz } from "@/interface/Quiz";
import styles from "./Create.module.css";
import { useHeader } from "@/hooks/HeaderContext";

const Create = () => {
  const [numSelect, setNumSelect] = useState<number>(4);

  const { setHeaderProps } = useHeader();

  useEffect(() => {
    setHeaderProps({ isLogo: true, page: "other" });
  }, []);

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
      date: Date.now(), //1970年始からのミリ単位秒
      question: quizData.question as string,
      title: quizData.title as string,
    };
    const docRef = await addDoc(collection(db, "quizzes"), addData); //fireStoreに追加
    console.log("new document", docRef);
  };

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.createCard}>
          <form
            name="formQuiz"
            onSubmit={SubmitQuiz}
            className={styles.formFormat}
          >
            <div className={styles.textBlock}>
              <div className={styles.choiceBlock}>
                <label className={styles.textLabel} htmlFor="category">
                  カテゴリ
                </label>
                <select id="category" name="category" required>
                  <option value="">選択してください</option>
                  <option value="Anime_Manga">アニメ/漫画</option>
                  <option value="Games">ゲーム</option>
                  <option value="Music">音楽</option>
                  <option value="History">歴史</option>
                  <option value="Math">数学</option>
                  <option value="Science">理科</option>
                  <option value="Literature">文学</option>
                  <option value="Other">その他</option>
                </select>
              </div>
            </div>
            <hr />
            <div className={styles.textBlock}>
              <label className={styles.textLabel} htmlFor="title">
                タイトル
              </label>
              <input
                className={styles.textInput}
                type="text"
                id="title"
                name="title"
                required
              />
            </div>
            <hr />
            <div className={styles.textBlock}>
              <label className={styles.textLabel} htmlFor="description">
                説明
              </label>
              <input
                className={styles.textInput}
                type="text"
                id="description"
                name="description"
              />
            </div>
            <hr />
            <div className={styles.textBlock}>
              <label className={styles.textLabel} htmlFor="question">
                問題
              </label>
              <input
                className={styles.textInput}
                type="text"
                id="question"
                name="question"
              />
            </div>
            <hr />
            <div className={styles.textBlock}>
              <div className={styles.textLabel}>選択肢</div>
              <div className={styles.choiceBlock}>
                <label className={styles.textLabel} htmlFor="numSelect">
                  選択肢の数
                </label>
                <select
                  id="numSelect"
                  value={numSelect} //selectのデフォルト値をstate流用
                  onChange={(e) => setNumSelect(Number(e.currentTarget.value))} //型変換（as numberだと型をみなすだけで実際に変換しないので危険）
                >
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                </select>
              </div>
              <div>正解の選択肢にチェックを入れてください</div>
            </div>

            {
              //選択肢の数だけ入力欄を用意
              //jsxではforEachなので空配列の長さを用いてrange
              [...Array(numSelect)].map((_, i) => (
                <div key={i}>
                  <label className={styles.textLabel} htmlFor={`choice${i}`}>
                    選択肢{i + 1}
                  </label>
                  <input
                    type="checkbox"
                    id={`isCorrect${i}`}
                    name={`isCorrect${i}`}
                  />
                  <input
                    className={styles.textInput}
                    type="text"
                    id={`choice${i}`}
                    name={`choice${i}`}
                  />
                </div>
              ))
            }
            <hr />

            <div className={styles.textBlock}>
              <label className={styles.textLabel} htmlFor="explanation">
                解説
              </label>
              <input
                className={styles.textInput}
                type="text"
                id="explanation"
                name="explanation"
              />
            </div>
            <hr />
            <button type="submit">作成</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
