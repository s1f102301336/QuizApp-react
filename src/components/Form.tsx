import React from "react";
import style from "./Form.module.css";

export const Form = () => {
  return (
    <div>
      <form action="#" className={style.searchForm}>
        <label>
          <input type="text" placeholder="キーワードを入力"></input>
        </label>
        <button type="submit" aria-label="検索"></button>
      </form>
    </div>
  );
};
