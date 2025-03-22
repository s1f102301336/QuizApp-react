"use client";

import Link from "next/link";
import React, { useState } from "react";
import style from "./Header.module.css";
import Image from "next/image";
import Logo from "../../public/Logo_2.png";
import { Jost } from "next/font/google";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";

const jost = Jost({ subsets: ["latin"], weight: ["700"] });

type Page = "home" | "play" | "other";

export const Header = ({ isLogo, page }: { isLogo: boolean; page: Page }) => {
  const router = useRouter();
  const { user } = useAuth();
  const isSignIn = !!user;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = () => {
    if (isSignIn) {
      router.push("/quiz/create");
    } else {
      alert("ログインが必要です");
    }
  };

  return (
    <div className={style.container}>
      {/* ロゴ部分 */}
      {isLogo && (
        <div className={style.text}>
          <Image src={Logo} alt="Logo Icon" className={style.logo} />
          <div className={`${jost.className} ${style.appName}`}>Quiz Dash</div>
        </div>
      )}

      {/* ハンバーガーボタン (スマホ用) */}
      <button
        className={style.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* メニュー */}
      <div className={`${style.menu} ${menuOpen ? style.open : ""}`}>
        <div className={style.menuBody}>
          {page === "home" ? (
            <>
              <div onClick={handleNavigation} className={style.btn}>
                クイズ作成
              </div>
              <Link href={"/accounts/login"} className={style.btn}>
                マイページ
              </Link>
            </>
          ) : page === "other" ? (
            <Link href="/" className={style.btn}>
              ホーム
            </Link>
          ) : (
            <div></div> // playページでは表示しない
          )}
        </div>
      </div>
    </div>
  );
};
