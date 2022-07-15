import styles from "./styles/Home.module.css";
import {
  ThirdwebNftMedia,
  NFTContract,
  useAddress,
  useDisconnect,
  useMetamask,
  useNetwork,
  useEditionDrop,
  useNetworkMismatch,
  useNFTCollection,
  useNFTs,
  useSigner,
  useOwnedNFTs,
  useNFTBalance
} from "@thirdweb-dev/react";
import { ChainId, ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { TokenMintParams, ContractAddress } from "@thirdweb-dev/react";
import { NFTCollection } from "@thirdweb-dev/sdk/dist/browser";
import type { NextPage } from "next";
import { useRef, useState } from "react";
import Minter from "../components/guide/Minter";
import type { BigNumberish } from "ethers";

const Home: NextPage = () => {
  // Helpful thirdweb hooks to connect and manage the wallet from metamask.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const signer = useSigner();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

/*
  const hunnysCollection = useNFTCollection("0x5DFEB75aBae11b138A16583E03A2bE17740EADeD");
  const [hasBalance, setHasBalance] = useState(false);
  const { data: balance, isLoading } = useNFTBalance(hunnysCollection, address, "0");


// '[NFTCollection | undefined, string | undefined, "0"]' is not assignable to parameter of type
// '[contract: RequiredParam<Erc721<any>>, ownerWalletAddress: RequiredParam<string>] | [contract: RequiredParam<Erc1155<any>>, ownerWalletAddress: RequiredParam<string>, tokenId: RequiredParam<...>]'.

  // Check for at least 1 Hunnys in wallet



  if (!address) {
      return (
        <div>
          <h1>Check to see if you can sit with us.</h1>
        </div>
      );
    }

  if (balance == 0) {
      return (
        <div>
        <p>It looks like there are currently no Hunnys NFTs held by the connected wallet:{" "}
      <span
        style={{
          cursor: "pointer",
          color: "white",
              }}
        onClick={() =>
        window.open(
          "https://opensea.io/" + address,
          "_blank"
        )}>
          {address.slice(0, 6)}...{address.slice(-4)}
      </span>
    </p>
    <p>In order to be eligible to mint, you will need to be holding at least{" "}
    <span
    style={{
      cursor: "pointer",
      color: "white",
          }}
    onClick={() =>
    window.open(
      "https://opensea.io/collection/hunnys",
      "_blank"
    )}>
    1 Hunnys 10k NFT token.
  </span>
  </p>
    </div>
      );
    }
*/

  return (
    <>

<Minter />

    </>
  );
};



export default Home;
