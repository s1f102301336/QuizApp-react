"use client";

import Link from "next/link";
import React, { useState } from "react";
import styles from "./Header.module.css";
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
    <div className={styles.container}>
      {/* ロゴ部分 */}
      {isLogo && (
        <div className={styles.text}>
          <Image src={Logo} alt="Logo Icon" className={styles.logo} />
          <div className={`${jost.className} ${styles.appName}`}>Quiz Dash</div>
        </div>
      )}

      {/* ハンバーガーボタン (スマホ用) */}
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* メニュー */}
      <div className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
        <div className={styles.menuBody}>
          {page === "home" ? (
            <>
              <button onClick={handleNavigation} className={styles.btn}>
                クイズ作成
              </button>
              <Link href={"/accounts/login"} className={styles.btn}>
                マイページ
              </Link>
            </>
          ) : page === "other" ? (
            <Link href="/" className={styles.btn}>
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
