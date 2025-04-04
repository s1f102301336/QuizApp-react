// import Image from "next/image";
import { Header } from "@/components/Header";
import { QuizContainer } from "./home/QuizContainer";
import styles from "../styles/page.module.css";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <header>
        <Header isLogo={false} page={"home"} />
      </header>

      <main className={styles.main}>
        <QuizContainer />
      </main>

      <Footer />
      <footer className={styles.footer}></footer>
    </div>
  );
}
