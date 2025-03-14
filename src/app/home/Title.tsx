import React from "react";
import style from "./Title.module.css";
import { Form } from "@/components/Form";
import Image from "next/image";
import Logo from "../../../public/Logo_2.png";
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"], weight: ["700"] });

export const Title = () => {
  return (
    <div className={style.container}>
      <div className={style.body}>
        <div className={style.text}>
          <Image src={Logo} alt="Logo Icon" className={style.logo} />
          <div className={`${jost.className} ${style.appName}`}>Quiz Dash</div>
        </div>
        <Form />
      </div>
    </div>
  );
};
