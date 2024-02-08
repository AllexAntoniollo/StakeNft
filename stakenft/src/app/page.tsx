"use client";
import Nft from "@/components/nft";
import { NewMessage, Message } from "../components/message";
import { useGlobalContext } from "@/contexts/WalletContext";
import { useState, useEffect } from "react";
import {
  NFT,
  doLogin,
  myNFTs,
  totalStake,
  harvest,
  earned,
} from "@/services/Web3Service";
import Image from "next/image";
import { ethers } from "ethers";
import Link from "next/link";

export default function MyStakes() {
  const { wallet, setWallet } = useGlobalContext();
  const [message, setMessage] = useState<NewMessage>({} as NewMessage);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [stake, setStake] = useState<BigInt>();
  const [peso, setPeso] = useState<number>();
  const [total, setTotal] = useState<string>();
  const value = async () => {
    await earned(wallet).then((valor) => {
      const formattedValue = ethers.formatEther(valor);
      setTotal(formattedValue);
    });
  };
  const myNfts = async () => {
    try {
      const nftsResult = await myNFTs();
      setNfts(nftsResult);

      let newPeso = 0;

      nftsResult.forEach((nft) => {
        if (Number(nft.tokenId) <= 25) {
          newPeso += 3;
        } else {
          newPeso += 1;
        }
      });

      setPeso(newPeso);
    } catch (err: any) {
      console.log(err.msg);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const total = await totalStake();
      setStake(total);
      myNfts();
      if (wallet) {
        value();
      }
    };

    fetchData();
  }, [wallet]);

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

  async function btnHarvest() {
    setMessage({ message: "Connecting MetaMask...wait...", type: "load" });

    await harvest()
      .then(() => {
        setMessage({
          message: "The harvest was carried out successfully",
          type: "successfully",
        });
      })
      .catch((err) => setMessage({ message: err.msg, type: "rejected" }));
  }
  return (
    <main className="bg-neutral-900 p-8 text-white">
      <section className="text-4xl ">
        <h1 className="font-semibold">Stake</h1>
        <h1 className="mt-2 text-neutral-400 mb-10 text-lg">
          Faça stakes para ter participação no Itrust e ganhar recompensas.
        </h1>
        <Link
          className="text-xl border p-4 rounded hover:bg-white hover:text-black"
          href={"/stake"}
        >
          Fazer Stake
        </Link>
      </section>
      <section className="flex justify-between text-xl px-6 pt-12">
        <div>
          <p>Total de NFTs em Stakes</p>
          <h1 className="text-4xl">{stake ? String(stake) : "0"}</h1>
        </div>
        <div>
          <p>Meus NFTs em Stakes</p>
          <h1 className="text-4xl">{nfts.length}</h1>
        </div>
        {!wallet ? (
          <button
            onClick={btnLoginClick}
            className="ease-linear text-black sm:mt-3 dark:hover:bg-gray-900 duration-150 dark:bg-neutral-800 dark:border-purple-700 flex items-center border border-purple-900 justify-center rounded bg-white px-3 py-2 hover:bg-purple-900 hover:text-white hover:shadow-md "
          >
            <p>Connect Wallet</p>
          </button>
        ) : (
          <div className="hover:bg-gray-50 dark:bg-zinc-950 transition-all text-black duration-300 dark:hover:bg-zinc-800 flex bg-white rounded-xl items-center font-medium p-3">
            <div>{wallet.slice(0, 6) + "..." + wallet.slice(-3)}</div>
          </div>
        )}
      </section>
      <section className="flex flex-wrap justify-evenly mt-12">
        {nfts.length > 0 ? <>{nfts[0].tokenId}</> : ""}
        {nfts.length > 0 ? (
          nfts.map((nft: NFT, index) => (
            <Nft key={index} {...nft} peso={peso || 0} />
          ))
        ) : (
          <div className="flex flex-col pt-6 items-center justify-center">
            <Image
              width={250}
              height={250}
              alt="no-data"
              src={"/no-data.svg"}
            ></Image>
            <h2 className="text-3xl my-4">No NFTs Found</h2>
            <p className="text-gray-500">There is nothing here!</p>
          </div>
        )}
      </section>
      <div className="mt-10 flex items-center flex-col text-xl">
        <h2>Your Total Rewards</h2>
        <h2>{total?.slice(0, 5)} WBNB</h2>
      </div>
      <button
        onClick={btnHarvest}
        className="w-full mt-8 rounded-xl bg-purple-500 hover:bg-purple-600 p-6"
      >
        HARVEST YOUR REWARDS
      </button>
      {message.message ? <Message {...message} /> : ""}
    </main>
  );
}
