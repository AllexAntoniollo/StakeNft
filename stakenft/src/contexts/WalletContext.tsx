"use client";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface ContextProps {
  wallet: string;
  setWallet: Dispatch<SetStateAction<string>>;
}

const GlobalContext = createContext<ContextProps>({
  wallet: "",
  setWallet: (): void => {},
});

export const GlobalContextProvider = ({ children }: any) => {
  const [wallet, setWallet] = useState<string>("");

  return (
    <GlobalContext.Provider value={{ wallet, setWallet }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
