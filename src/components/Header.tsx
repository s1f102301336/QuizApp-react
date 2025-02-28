import Link from "next/link";
import React from "react";

export const Header = () => {
  return (
    <div>
      Header
      <Link href={"/accounts/login"}>
        <button>マイページ</button>
      </Link>
    </div>
  );
};
