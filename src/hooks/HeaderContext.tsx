"use client";
import { ReactNode, createContext, useContext, useState } from "react";

interface HeaderContextType {
  isLogo: boolean;
  page: Page;
  setHeaderProps: (props: { isLogo: boolean; page: Page }) => void;
}

type Page = "home" | "play" | "other";

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("HeaderProviderのなかで宣言してください。");
  }
  return context;
};

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [headerProps, setHeaderProps] = useState<{
    isLogo: boolean;
    page: Page;
  }>({
    isLogo: true,
    page: "home",
  });

  return (
    <HeaderContext.Provider value={{ ...headerProps, setHeaderProps }}>
      {children}
    </HeaderContext.Provider>
  );
};
