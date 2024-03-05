import { NFT } from "@/services/Web3Service";
import { FiCornerDownRight } from "react-icons/fi";
import { withdraw, earned } from "@/services/Web3Service";
import { NewMessage, Message } from "@/components/message";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
export default function Nft(props: NFT & { peso: number }) {
  const [message, setMessage] = useState<NewMessage>({} as NewMessage);
  const [total, setTotal] = useState<string>();
  const [language, setLanguage] = useState<string>("pt-BR");
  const idioma = localStorage.getItem("language");

  const handleWithdraw = async () => {
    setMessage({ message: "Connecting MetaMask...wait...", type: "load" });

    await withdraw(Number(props.tokenId))
      .then(() => {
        setMessage({
          message: "The NFT #" + String(props.tokenId) + " was removed!",
          type: "successfully",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      })
      .catch((err) => setMessage({ message: err.msg, type: "rejected" }));
  };
  const value = async () => {
    await earned(props.owner).then((valor) => {
      const newValor = (valor || BigInt(0)) / BigInt(props.peso);
      const formattedValue = ethers.formatEther(newValor);
      if (Number(props.tokenId) <= 25) {
        setTotal(String(Number(formattedValue) * 3));
      } else {
        setTotal(formattedValue);
      }
    });
  };

  const fetchData = async () => {
    value();
    setLanguage(idioma || "pt-BR");
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 20000);

    return () => clearInterval(intervalId);
  }, [idioma]);

  return (
    <>
      {" "}
      <div
        style={{
          backgroundColor: "#1A212A",
          height: "400px",
          width: "350px",
          borderColor: "#2D3748",
        }}
        className="border-r-4 mt-7 flex flex-col justify-evenly p-6 border-b-4 border-l border-t rounded-2xl"
      >
        <h1 className="text-2xl font-semibold">
          NFT Guaxinim #{Number(props.tokenId)}
        </h1>
        <div className="flex flex-col mt-5 text-gray-400">
          <h2 className="flex justify-between">
            <p> {language === "pt-BR" ? "Tipo da NFT:" : "NFT type:"}</p>
            <p className="text-purple-600 font-semibold">
              {language === "pt-BR"
                ? Number(props.tokenId) <= 25
                  ? "Fundador"
                  : "Colaborador"
                : Number(props.tokenId) <= 25
                ? "Founder"
                : "Collaborator"}
            </p>
          </h2>
        </div>
        <div className="flex flex-col mt-5 text-gray-400">
          <h2 className="flex justify-between">
            <p> {language === "pt-BR" ? "Dono:" : "Owner:"}</p>
            <p>{props.owner.slice(0, 6) + "..." + props.owner.slice(-3)}</p>
          </h2>
        </div>
        <div className="flex flex-col mt-5 text-gray-400">
          <h2 className="flex items-center justify-between">
            <div className="flex flex-col">
              <p>
                {" "}
                {language === "pt-BR" ? "Tokens ganhados:" : "Tokens earned:"}
              </p>
              <h1 className="text-2xl my-2">{total?.slice(0, 5)} WBNB</h1>
            </div>
            <button
              onClick={handleWithdraw}
              className="bg-transparent flex justify-between items-center hover:bg-purple-500 text-purple-600 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded"
            >
              <p> {language === "pt-BR" ? "Retirar NFT" : "Withdraw NFT"}</p>
            </button>{" "}
          </h2>
        </div>
        <div className="text-blue-300">
          <p className="flex items-center">
            {language === "pt-BR"
              ? "Adicionar iTRUST na MetaMask"
              : "Add iTRUST to MetaMask"}{" "}
            <FiCornerDownRight className="ml-2"></FiCornerDownRight>
          </p>
          <Link
            href={
              "https://testnet.bscscan.com/nft/0xb9a23b611c0ee460475cf77b32da289cb9e9adc6/" +
              props.tokenId
            }
            className="flex items-center"
          >
            {language === "pt-BR" ? "Vizualizar o Contrato" : "View Contract"}{" "}
            <FiCornerDownRight className="ml-2"></FiCornerDownRight>
          </Link>
        </div>
      </div>
      {message.message ? <Message {...message} /> : ""}
    </>
  );
}
