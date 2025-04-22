// import Image from "next/image";
// import { Header } from "@/components/Header";
import { QuizContainer } from "./home/QuizContainer";
import styles from "../styles/page.module.css";
// import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <QuizContainer />
      </main>
    </div>
  );
}
