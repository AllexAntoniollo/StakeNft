import Nft from "@/components/nft";
export default function MyStakes() {
  return (
    <main className="bg-neutral-900 p-8 text-white">
      <section className="text-4xl ">
        <h1 className="font-semibold">Stake</h1>
        <h1 className="mt-2 text-neutral-400 text-lg">
          Faça stakes para ter participação no Itrust e ganhar recompensas.
        </h1>
      </section>
      <section className="flex justify-between text-xl px-6 pt-12">
        <div>
          <p>Total de NFTs em Stakes</p>
          <h1 className="text-4xl">12</h1>
        </div>
        <div>
          <p>Meus NFTs em Stakes</p>
          <h1 className="text-4xl">4</h1>
        </div>
        <button className="ease-linear text-black sm:mt-3 dark:hover:bg-gray-900 duration-150 dark:bg-neutral-800 dark:border-purple-700 flex items-center border border-purple-900 justify-center rounded bg-white px-3 py-2 hover:bg-purple-900 hover:text-white hover:shadow-md ">
          <p>Connect Wallet</p>
        </button>
      </section>
      <section className="flex flex-wrap justify-evenly mt-12">
        <Nft></Nft>
        <Nft></Nft>
        <Nft></Nft>
      </section>
      <button className="w-full mt-8 rounded-xl bg-purple-500 hover:bg-purple-600 p-6">
        HARVEST YOUR REWARDS
      </button>
    </main>
  );
}
