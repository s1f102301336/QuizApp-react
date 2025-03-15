import Link from "next/link";
import React from "react";
import style from "./Header.module.css";

export const Header = () => {
  return (
    <div className={style.container}>
      <div className={style.body}>
        <Link href="./quiz/create" className={style.btn}>
          クイズ作成
        </Link>
        <Link href={"/accounts/login"} className={style.btn}>
          マイページ
        </Link>
      </div>
    </div>
  );
};
