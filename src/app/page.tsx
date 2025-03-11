// import Image from "next/image";
import { Header } from "@/components/Header";
import { QuizContainer } from "./home/QuizContainer";
import style from "../styles/page.module.css";

export default function Home() {
  return (
    <div className={style.page}>
      <header>
        <Header />
      </header>

      <main className={style.main}>
        <QuizContainer />
      </main>

      <footer className={style.footer}>footerです</footer>
    </div>
  );
}
