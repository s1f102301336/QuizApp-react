// import Image from "next/image";
import { Header } from "@/components/Header";
import { QuizContainer } from "./home/QuizContainer";
import style from "../styles/page.module.css";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className={style.page}>
      <header>
        <Header isLogo={false} page={"home"} />
      </header>

      <main className={style.main}>
        <QuizContainer />
      </main>

      <Footer />
      <footer className={style.footer}></footer>
    </div>
  );
}
