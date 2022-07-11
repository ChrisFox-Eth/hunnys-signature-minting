import styles from "./styles/Home.module.css";
import {
  ThirdwebNftMedia,
  useAddress,
  useDisconnect,
  useMetamask,
  useNetwork,
  useEditionDrop,
  useNetworkMismatch,
  useNFTCollection,
  useNFTs,
  useSigner,
  useNFTBalance,
} from "@thirdweb-dev/react";
import { ChainId, ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRef, useState } from "react";
import Minter from "../components/guide/Minter";

const Home: NextPage = () => {
  // Helpful thirdweb hooks to connect and manage the wallet from metamask.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const signer = useSigner();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

/*
  // Check for at least 1 Hunnys in wallet
  const hunnysCollection = useNFTCollection(
    // Replace this with the Hunnys10k contract address
    "0x5DFEB75aBae11b138A16583E03A2bE17740EADeD"
  );
  const { data: balance, isLoading } = useNFTBalance(hunnysCollection, address, "0");

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
          <h1>You cant sit with us.</h1>
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
