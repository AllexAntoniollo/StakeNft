import { FiCornerDownRight } from "react-icons/fi";

export default function Nft() {
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
        className="border-r-4 flex flex-col justify-evenly p-6 border-b-4 border-l border-t rounded-2xl"
      >
        <h1 className="text-2xl font-semibold">NFT Guaxinim #2</h1>
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
              <h1 className="text-2xl my-2">12.0 WBNB</h1>
              <p>$ 0.000</p>
            </div>
            <button className="bg-transparent flex justify-between items-center hover:bg-purple-500 text-purple-600 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded">
              <p></p>
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
    </>
  );
}
