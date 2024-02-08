import { ethers } from "ethers";
import StakeAbi from "./Stake.abi.json";
import CollectionAbi from "./Collection.abi.json";

const STAKE_ADDRESS = `${process.env.STAKE_ADDRESS}`;
const COLLECTION_ADDRESS = `${process.env.COLLECTION_ADDRESS}`;
const CHAIN_ID = `${process.env.CHAIN_ID}`;
export type NFT = {
  owner: string;
  tokenId: BigInt;
};
function getProvider(): ethers.BrowserProvider {
  if (!window.ethereum) throw new Error("No MetaMask found");
  return new ethers.BrowserProvider(window.ethereum);
}

export async function doLogin() {
  const provider = getProvider();
  const account = await provider.send("eth_requestAccounts", []);
  if (!account || !account.length) throw new Error("Wallet not found/allowed.");
  await provider.send("wallet_switchEthereumChain", [{ chainId: CHAIN_ID }]);

  return account[0];
}

export async function myNFTs(): Promise<NFT[]> {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const stakeContract = new ethers.Contract(STAKE_ADDRESS, StakeAbi, provider);

  const items: NFT[] = await stakeContract.fetchMyNfts({
    from: signer.address,
  });
  const nfts: NFT[] = await Promise.all(
    items.map(async (item: NFT) => {
      return {
        owner: item.owner,
        tokenId: item.tokenId,
      };
    })
  );

  return nfts;
}

export async function totalStake(): Promise<BigInt> {
  const provider = await getProvider();
  const stakeContract = new ethers.Contract(STAKE_ADDRESS, StakeAbi, provider);

  const total: BigInt = await stakeContract.totalStake();
  return total;
}

export async function withdraw(tokenId: number) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const stakeContract = new ethers.Contract(STAKE_ADDRESS, StakeAbi, signer);

  await stakeContract.withdraw(tokenId);

  return;
}

export async function earned(address: string): Promise<bigint> {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const stakeContract = new ethers.Contract(STAKE_ADDRESS, StakeAbi, signer);
  const value: bigint = await stakeContract.earned(address);

  return value;
}

export async function stake(tokenId: number) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const nftContract = new ethers.Contract(
    COLLECTION_ADDRESS,
    CollectionAbi,
    signer
  );
  const isApproved = await nftContract.getApproved(tokenId);
  if (isApproved !== true) {
    const txApprove = await nftContract.approve(STAKE_ADDRESS, tokenId);
    await txApprove.wait();
  }
  const stakeContract = new ethers.Contract(STAKE_ADDRESS, StakeAbi, signer);

  const tx = await stakeContract.stake(tokenId);
  tx.wait();
  return;
}

export async function harvest() {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const stakeContract = new ethers.Contract(STAKE_ADDRESS, StakeAbi, signer);

  const tx = await stakeContract.getReward();
  tx.wait();
  return;
}
