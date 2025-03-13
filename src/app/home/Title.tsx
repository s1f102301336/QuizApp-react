import React from "react";
import style from "./Title.module.css";
import { Form } from "@/components/Form";

export const Title = () => {
  return (
    <div className={style.container}>
      <div>Logo</div>
      <div>Quiz Dash</div>
      <Form />
    </div>
  );
};
