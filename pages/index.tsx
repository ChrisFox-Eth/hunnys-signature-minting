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
  const hunnysCollection = useNFTCollection("0x5DFEB75aBae11b138A16583E03A2bE17740EADeD");
  const [hasBalance, setHasBalance] = useState(false);
  const { data: balance, isLoading } = useNFTBalance(hunnysCollection, address);


  if (balance?.toNumber() === 0) {
      return (
        <div>
        <h2
        style={{
          color: "var(--purple)"
        }}>It looks like there are currently no Hunnys NFTs held by the connected wallet.
    </h2>
    <h2
    style={{
      color: "var(--purple)"
    }}>In order to be eligible to mint, you will need to be holding at least{" "}
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
  </h2>
  <div className={styles.aboutContainer}>
  <div className={styles.mintShadow}>
  <h2 className={styles.theCollection}>
    Mint your piece into the collection:
  </h2>
  <p className={styles.description}>You can upload image, audio, video, html, text, pdf, and 3d model files here.</p>
  <div className={styles.collectionContainer}>

    <input
      type="text"
      placeholder="Name of your NFT"
      className={styles.textInput}
      maxLength={0}
    />

    <textarea
      placeholder="Description of your NFT"
      className={styles.textInput}
      maxLength={0}
    />


      <div
        className={styles.imageInput}
      >
        Drag and drop an image here to upload it!
      </div>



  <div style={{ marginTop: 24 }}>
      <a className={styles.mainButton}>Not Eligible</a>
  </div>
  </div>
  </div>
  </div>
  </div>
      );
    }


  return (
    <>

<Minter />

    </>
  );
};



export default Home;
