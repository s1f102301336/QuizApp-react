"use client";

import React, { useState } from "react";
import { DisplayQuizzes } from "./DisplayQuizzes";
import { Search } from "./Search";
import { Title } from "./Title";
import style from "./QuizContainer.module.css";

export const QuizContainer = () => {
  const [category, setCategory] = useState("ALL");
  return (
    <div>
      <Title />
      <div className={style.container}>
        <div className={style.body}>
          <Search category={category} setCategory={setCategory} />
          <DisplayQuizzes category={category} />
        </div>
      </div>
    </div>
  );
};
