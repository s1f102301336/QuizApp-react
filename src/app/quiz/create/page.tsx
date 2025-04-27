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
    const formData = new FormData(e.currentTarget);
    const quizData = Object.fromEntries(formData.entries());

    const choices = [...Array(numSelect)].map((_, i) => ({
      isCorrect: formData.get(`isCorrect${i}`) === "on",
      text: quizData[`choice${i}`] as string,
    }));

    const addData: Omit<Quiz, "date"> = {
      category: quizData.category as Quiz["category"],
      choices,
      description: quizData.description as string,
      explanation: quizData.explanation as string,
      question: quizData.question as string,
      title: quizData.title as string,
    };

    await addDoc(collection(db, "quizzes"), {
      ...addData,
      date: Date.now(), // ★ここで初めて付与する
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form onSubmit={SubmitQuiz} className={styles.form}>
          <h1 className={styles.title}>クイズ作成</h1>

          {/* カテゴリ選択 */}
          <div className={styles.formGroup}>
            <label htmlFor="category">カテゴリ</label>
            <select
              id="category"
              name="category"
              required
              className={styles.input}
            >
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

          {/* タイトル */}
          <div className={styles.formGroup}>
            <label htmlFor="title">タイトル</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className={styles.input}
            />
          </div>

          {/* 説明 */}
          <div className={styles.formGroup}>
            <label htmlFor="description">説明</label>
            <input
              type="text"
              id="description"
              name="description"
              className={styles.input}
            />
          </div>

          {/* 問題 */}
          <div className={styles.formGroup}>
            <label htmlFor="question">問題</label>
            <input
              type="text"
              id="question"
              name="question"
              className={styles.input}
            />
          </div>

          {/* 選択肢数 */}
          <div className={styles.formGroup}>
            <label htmlFor="numSelect">選択肢の数</label>
            <select
              id="numSelect"
              value={numSelect}
              onChange={(e) => setNumSelect(Number(e.currentTarget.value))}
              className={styles.input}
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="6">6</option>
            </select>
          </div>

          {/* 選択肢入力 */}
          <div className={styles.formGroup}>
            <span>正解にチェックを入れてください</span>
            {[...Array(numSelect)].map((_, i) => (
              <div key={i} className={styles.choiceRow}>
                <input
                  type="checkbox"
                  id={`isCorrect${i}`}
                  name={`isCorrect${i}`}
                  className={styles.choice}
                />
                <input
                  type="text"
                  id={`choice${i}`}
                  name={`choice${i}`}
                  placeholder={`選択肢${i + 1}`}
                  className={styles.input}
                />
              </div>
            ))}
          </div>

          {/* 解説 */}
          <div className={styles.formGroup}>
            <label htmlFor="explanation">解説</label>
            <input
              type="text"
              id="explanation"
              name="explanation"
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            作成
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
