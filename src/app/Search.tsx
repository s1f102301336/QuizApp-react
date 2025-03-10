"use client";

import React, { useState } from "react";
import { DisplayQuizzes } from "./DisplayQuizzes";
import style from "./search.module.css";

export const Search = () => {
  const [category, setCategory] = useState("ALL");
  return (
    <div>
      Search
      <div className={style.container}>
        <div>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(String(e.currentTarget.value))}
          >
            <option value="ALL">ALL</option>
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
      <DisplayQuizzes category={category} />
    </div>
  );
};
