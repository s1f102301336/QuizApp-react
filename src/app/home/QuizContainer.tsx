"use client";

import React, { useEffect, useState } from "react";
import { DisplayQuizzes } from "./DisplayQuizzes";
import { Search } from "./Search";
import { Title } from "./Title";
import styles from "./QuizContainer.module.css";
import { useHeader } from "@/hooks/HeaderContext";

export const QuizContainer = () => {
  const { setHeaderProps } = useHeader();

  useEffect(() => {
    setHeaderProps({ isLogo: false, page: "home" });
  }, [setHeaderProps]);

  const [category, setCategory] = useState("ALL");
  return (
    <div>
      <Title />
      <div className={styles.container}>
        <div className={styles.body}>
          <Search category={category} setCategory={setCategory} />
          <DisplayQuizzes category={category} />
        </div>
      </div>
    </div>
  );
};
