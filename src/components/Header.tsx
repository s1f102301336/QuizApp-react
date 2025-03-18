import Link from "next/link";
import React from "react";
import style from "./Header.module.css";
import Image from "next/image";
import Logo from "../../public/Logo_2.png";
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"], weight: ["700"] });

type Page = "home" | "play" | "other";

export const Header = ({ isLogo, page }: { isLogo: boolean; page: Page }) => {
  return (
    <div className={style.container}>
      {isLogo && (
        <div className={style.text}>
          <Image src={Logo} alt="Logo Icon" className={style.logo} />
          <div className={`${jost.className} ${style.appName}`}>Quiz Dash</div>
        </div>
      )}
      <div className={style.menu}>
        {page === "home" ? (
          <>
            <Link href="./quiz/create" className={style.btn}>
              クイズ作成
            </Link>
            <Link href={"/accounts/login"} className={style.btn}>
              マイページ
            </Link>
          </>
        ) : page === "other" ? (
          <Link href="/" className={style.btn}>
            ホーム
          </Link>
        ) : (
          <div></div> //playページでは表示しない
        )}
      </div>
    </div>
  );
};
