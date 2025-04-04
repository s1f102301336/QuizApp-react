import React from "react";
import styles from "./Title.module.css";
import { Form } from "@/components/Form";
import Image from "next/image";
import Logo from "../../../public/Logo_2.png";
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"], weight: ["700"] });

export const Title = () => {
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.text}>
          <Image src={Logo} alt="Logo Icon" className={styles.logo} />
          <div className={`${jost.className} ${styles.appName}`}>Quiz Dash</div>
        </div>
        <Form />
      </div>
    </div>
  );
};
