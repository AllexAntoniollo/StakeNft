import { FiCornerDownRight } from "react-icons/fi";

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
        <div
          style={{
            backgroundColor: "#1A212A",
            height: "400px",
            width: "350px",
            borderColor: "#2D3748",
          }}
          className="border-r-4 flex flex-col justify-evenly p-6 border-b-4 border-l border-t rounded-2xl"
        >
          <h1 className="text-2xl font-semibold">NFT Guaxinim #3</h1>
          <div className="flex flex-col mt-5 text-gray-400">
            <h2 className="flex justify-between">
              <p>APR:</p>
              <p className="text-purple-600 font-semibold">4.53%</p>
            </h2>
          </div>
          <div className="flex flex-col mt-5 text-gray-400">
            <h2 className="flex justify-between">
              <p>Dias bloqueados:</p>
              <p>16d</p>
            </h2>
          </div>
          <div className="flex flex-col mt-5 text-gray-400">
            <h2 className="flex items-center justify-between">
              <div className="flex flex-col">
                <p>Tokens ganhados</p>
                <h1 className="text-2xl my-2">12.0</h1>
                <p>$ 0.000</p>
              </div>
              <button className="bg-transparent flex justify-between items-center hover:bg-purple-500 text-purple-600 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded">
                <p></p>
                <p>Coletar</p>
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
        <div
          style={{
            backgroundColor: "#1A212A",
            height: "400px",
            width: "350px",
            borderColor: "#2D3748",
          }}
          className="border-r-4 flex flex-col justify-evenly p-6 border-b-4 border-l border-t rounded-2xl"
        >
          <h1 className="text-2xl font-semibold">NFT Guaxinim #3</h1>
          <div className="flex flex-col mt-5 text-gray-400">
            <h2 className="flex justify-between">
              <p>APR:</p>
              <p className="text-purple-600 font-semibold">4.53%</p>
            </h2>
          </div>
          <div className="flex flex-col mt-5 text-gray-400">
            <h2 className="flex justify-between">
              <p>Dias bloqueados:</p>
              <p>16d</p>
            </h2>
          </div>
          <div className="flex flex-col mt-5 text-gray-400">
            <h2 className="flex items-center justify-between">
              <div className="flex flex-col">
                <p>Tokens ganhados</p>
                <h1 className="text-2xl my-2">12.0</h1>
                <p>$ 0.000</p>
              </div>
              <button className="bg-transparent flex justify-between items-center hover:bg-purple-500 text-purple-600 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded">
                <p></p>
                <p>Coletar</p>
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
        <div
          style={{
            backgroundColor: "#1A212A",
            height: "400px",
            width: "350px",
            borderColor: "#2D3748",
          }}
          className="border-r-4 flex flex-col justify-evenly p-6 border-b-4 border-l border-t rounded-2xl"
        >
          <h1 className="text-2xl font-semibold">NFT Guaxinim #3</h1>
          <div className="flex flex-col mt-5 text-gray-400">
            <h2 className="flex justify-between">
              <p>Tipo NFT:</p>
              <p className="text-purple-600 font-semibold">Raro</p>
            </h2>
          </div>
          <div className="flex flex-col mt-5 text-gray-400">
            <h2 className="flex justify-between">
              <p>Dias em stake:</p>
              <p>16d</p>
            </h2>
          </div>
          <div className="flex flex-col mt-5 text-gray-400">
            <h2 className="flex items-center justify-between">
              <div className="flex flex-col">
                <p>Tokens ganhados</p>
                <h1 className="text-2xl my-2">12.0</h1>
                <p>$ 0.000</p>
              </div>
              <button className="bg-transparent flex justify-between items-center hover:bg-purple-500 text-purple-600 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded">
                <p></p>
                <p>Coletar</p>
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
      </section>
    </main>
  );
}
