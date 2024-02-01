import { TbPigMoney } from "react-icons/tb";
import { FaArrowRightLong } from "react-icons/fa6";

export default function Stake() {
  return (
    <main className="w-full text-white flex bg-neutral-900 h-full">
      <div className="w-1/2 p-12">
        <h1 className=" text-3xl flex items-center">
          <TbPigMoney className=" size-24"></TbPigMoney>
          <p className="ml-4">
            Faça agora o stake de seu NFT e ganhe recompensas!
          </p>
        </h1>
        <div className="border-white flex flex-col text-lg border p-6 rounded-lg mt-16">
          <label>Qual o Token ID de seu nft?</label>
          <input
            className="mt-6 text-black rounded outline-0 px-3 py-4"
            value={"0"}
            type="number"
          />
          <button className="bg-transparent mt-4 flex justify-between items-center hover:bg-purple-500 text-purple-600 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded">
            <p></p>
            <p>Fazer Stake</p>
            <FaArrowRightLong></FaArrowRightLong>
          </button>{" "}
        </div>
      </div>
      <div
        style={{ backgroundImage: "url(/guaxinim.png)" }}
        className="w-1/2 h-full bg-cover bg-no-repeat"
      ></div>
    </main>
  );
}
