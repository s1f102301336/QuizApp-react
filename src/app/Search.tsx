"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DisplayQuizzes } from "./DisplayQuizzes";

export const Search = () => {
  const [category, setCategory] = useState("");
  return (
    <div>
      Search
      <div>
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
        <Link href="./quiz/create">クイズ作成はこちら</Link>
      </div>
      <DisplayQuizzes category={category} />
    </div>
  );
};
