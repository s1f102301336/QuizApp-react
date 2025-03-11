import Link from "next/link";
import React from "react";
import style from "./Header.module.css";

export const Header = () => {
  return (
    <div className={style.container}>
      Header
      <Link href="./quiz/create">
        <button>クイズ作成</button>
      </Link>
      <Link href={"/accounts/login"}>
        <button>マイページ</button>
      </Link>
    </div>
  );
};
