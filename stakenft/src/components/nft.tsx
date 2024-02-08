import { NFT } from "@/services/Web3Service";
import { FiCornerDownRight } from "react-icons/fi";
import { withdraw, earned } from "@/services/Web3Service";
import { NewMessage, Message } from "@/components/message";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
export default function Nft(props: NFT & { peso: number }) {
  const [message, setMessage] = useState<NewMessage>({} as NewMessage);
  const [total, setTotal] = useState<string>();
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
      const newValor = valor / BigInt(props.peso);
      const formattedValue = ethers.formatEther(newValor);
      if (Number(props.tokenId) <= 25) {
        setTotal(String(Number(formattedValue) * 3));
      } else {
        setTotal(formattedValue);
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      value();
    };

    fetchData();
  }, []);
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
            <p>Tipo NFT:</p>
            <p className="text-purple-600 font-semibold">
              {Number(props.tokenId) <= 25 ? "Raro" : "Comum"}
            </p>
          </h2>
        </div>
        <div className="flex flex-col mt-5 text-gray-400">
          <h2 className="flex justify-between">
            <p>Owner:</p>
            <p>{props.owner.slice(0, 6) + "..." + props.owner.slice(-3)}</p>
          </h2>
        </div>
        <div className="flex flex-col mt-5 text-gray-400">
          <h2 className="flex items-center justify-between">
            <div className="flex flex-col">
              <p>Tokens ganhados</p>
              <h1 className="text-2xl my-2">{total?.slice(0, 5)} WBNB</h1>
            </div>
            <button
              onClick={handleWithdraw}
              className="bg-transparent flex justify-between items-center hover:bg-purple-500 text-purple-600 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded"
            >
              <p>Withdraw NFT</p>
            </button>{" "}
          </h2>
        </div>
        <div className="text-blue-300">
          <p className="flex items-center">
            Add ITrust to MetaMask{" "}
            <FiCornerDownRight className="ml-2"></FiCornerDownRight>
          </p>
          <p className="flex items-center">
            View Contract{" "}
            <FiCornerDownRight className="ml-2"></FiCornerDownRight>
          </p>
        </div>
      </div>
      {message.message ? <Message {...message} /> : ""}
    </>
  );
}
