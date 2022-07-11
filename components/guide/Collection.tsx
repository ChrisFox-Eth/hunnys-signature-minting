import React from 'react';
import styles from "/pages/styles/Home.module.css";
import { Link } from "../shared/Link";
import { OpenSeaLogo } from "../shared/svg/OpenSeaLogo";
import { TwitterLogo } from "../shared/svg/TwitterLogo";
import { DiscordLogo } from "../shared/svg/DiscordLogo";
import { MenuLink } from "../shared/MenuLink";
import {
  ThirdwebNftMedia,
  useAddress,
  useDisconnect,
  useMetamask,
  useNetwork,
  useNetworkMismatch,
  useNFTCollection,
  useNFTs,
  useSigner,
  useNFTBalance,
} from "@thirdweb-dev/react";
import { ChainId, ThirdwebSDK } from "@thirdweb-dev/sdk";

export const Collection = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const signer = useSigner();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const nftCollection = useNFTCollection(
    // Replace this with your NFT Collection contract address
    "0x1D595b1b360E2240e85f06beC1D1679D5C005BE3"
  );
  const { data: nfts, isLoading: loadingNfts } = useNFTs(nftCollection);
  return (
          <div className={styles.aboutContainer}>
    <div className={styles.collectionContainer}>
      <h1 className={styles.ourCollection}>
        See the collection:
      </h1>

      {loadingNfts ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.nftGrid}>
          {nfts?.map((nft) => (
            <div
              className={styles.nftItem}
              key={nft.metadata.id.toString()}
            >
              <div style={{
                width: 200,
                cursor: "pointer",
                borderRadius: 16,
              }}
              onClick={() =>
               window.open(
                 "https://opensea.io/assets/ethereum/0x1D595b1b360E2240e85f06beC1D1679D5C005BE3/" + nft.metadata.id,
                 "_blank"
               )
             }
                >
                <ThirdwebNftMedia style={{
                  width:200,
                }}
                  metadata={nft.metadata}
                />
                <div className={styles.nftName}>{nft.metadata.name}</div>
              </div>
              <div className={styles.nftDescription} style={{ textAlign: "center", width: "30%", margin:"50px" }}>
                <p>
                  <b>{" "}{nft.metadata.description}{" "}</b>
                </p>
              </div>

              <div
                className={
                  styles.nftOwner
                }>
                <p>Owned by:</p>
                <p style={{
                  cursor: "pointer",
                }}
                  onClick={() =>
                    window.open(
                      "https://opensea.io/" + nft.owner,
                      "_blank"
                    )
                  }>
                    {nft.owner
                      .slice(0, 6)
                      .concat("...")
                      .concat(nft.owner.slice(-4))}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
</div>
    </div>
);
};
export default Collection;
