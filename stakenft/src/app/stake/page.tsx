"use client";
import { useGlobalContext } from "@/contexts/WalletContext";
import { FaArrowLeftLong } from "react-icons/fa6";
import { TbPigMoney } from "react-icons/tb";
import { FaArrowRightLong } from "react-icons/fa6";
import { NewMessage, Message } from "@/components/message";
import { useState, useEffect } from "react";
import { stake, doLogin } from "@/services/Web3Service";
import Link from "next/link";
export default function Stake() {
  const [language, setLanguage] = useState<string>("pt-BR");
  const { wallet, setWallet } = useGlobalContext();
  const [message, setMessage] = useState<NewMessage>({} as NewMessage);
  const [tokenID, setTokenID] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== "undefined") {
        const idioma = localStorage.getItem("language");
        setLanguage(idioma || "pt-BR");
      }
    };

    fetchData();
  });
  async function btnLoginClick() {
    try {
      const result = await doLogin();

      if (result !== null && result !== undefined) setWallet(result);
      else
        setMessage({ message: "Wallet not found/allowed.", type: "rejected" });
    } catch (err) {
      setMessage({ message: (err as Error).message, type: "rejected" });
    }
  }
  const handleStake = async () => {
    setMessage({ message: "Connecting MetaMask...wait...", type: "load" });
    if (tokenID < 1 || tokenID > 100) {
      setMessage({
        message: "O Token ID deve estar entre 1 e 100.",
        type: "rejected",
      });

      return;
    }

    try {
      await stake(tokenID).then(() => {
        setMessage({
          message: "The NFT #" + tokenID + " was staked!",
          type: "successfully",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      });
    } catch (err: any) {
      setMessage({ message: err.msg, type: "rejected" });
    }
  };
  return (
    <main className="w-full text-white flex bg-neutral-900 h-full">
      <div className="w-1/2 sm:w-full p-12">
        <Link href={"/"}>
          {" "}
          <FaArrowLeftLong className="size-12"></FaArrowLeftLong>
        </Link>
        <h1 className=" text-3xl flex items-center">
          <TbPigMoney className=" size-24"></TbPigMoney>
          <p className="ml-4">
            {language === "pt-BR"
              ? "Faça agora o stake do seu NFT e ganhe recompensas"
              : "Stake your nft now and earn rewards"}
          </p>
        </h1>
        <div className="border-white flex flex-col text-lg border p-6 rounded-lg mt-12">
          <label>
            {" "}
            {language === "pt-BR"
              ? "Qual o token id de seu nft?"
              : "Which is your nft token id?"}
          </label>
          <input
            className="mt-6 text-black rounded outline-0 px-3 py-4"
            value={tokenID}
            type="number"
            onChange={(e) => setTokenID(parseInt(e.target.value))}
          />
          {!wallet ? (
            <button
              onClick={btnLoginClick}
              className="bg-transparent mt-4 flex justify-center hover:bg-purple-500 text-purple-600 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded"
            >
              <p>
                {" "}
                {language === "pt-BR" ? "Conectar Carteira" : "Connect Wallet"}
              </p>
            </button>
          ) : (
            <button
              onClick={handleStake}
              className="bg-transparent mt-4 flex justify-between items-center hover:bg-purple-500 text-purple-600 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded"
            >
              <p></p>
              <p> {language === "pt-BR" ? "Fazer Stake" : "Create Stake"}</p>
              <FaArrowRightLong></FaArrowRightLong>
            </button>
          )}{" "}
        </div>
      </div>
      <div
        style={{ backgroundImage: "url(/guaxinim.png)" }}
        className="w-1/2 sm:hidden md:bg-center h-full bg-cover bg-no-repeat"
      ></div>
      {message.message ? <Message {...message} /> : ""}
    </main>
  );
}
