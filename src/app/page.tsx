// import Image from "next/image";
import { Header } from "@/components/Header";
import { Search } from "./Search";
import styles from "../styles/page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header>
        <Header />
      </header>
      <main className={styles.main}>
        <Search />
      </main>
      <footer className={styles.footer}>footerです</footer>
    </div>
  );
}
