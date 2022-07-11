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

export const HowTo = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const signer = useSigner();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  return (

    <div className={styles.aboutContainer}>
      <h1 className={styles.h1}>How To Participate:</h1>
        <ul className={styles.listItems}>
            <li>1. Mint your Hunnys derivative below using {' '}
            <MenuLink
              href='https://drive.google.com/drive/folders/1z9_njr3mXPU6FTMq_bCaREUFIb6NxhKL'
              target="_blank">
              the bases we provide
            </MenuLink>{' '}
            or your own design!</li>
            <li>2. Receive an exclusive Hunnys Hupe Scouts Seasons NFT</li>
            <li>3. Verify your wallet on Collab-Land in Discord to receive the Hupe Scouts role</li>
            <li>4. Gain access to the private Hupe Scouts channel to plan your strategy, events and more with fellow Huper-s</li>
            <li>5. List your Hunny for sale at the price of your choice</li>
            <li>6. Collect 100% of your primary sale and share all royalties earned with the collective Hupe Scouts on your creation</li>
        </ul>
    </div>

  );
};

export default HowTo;
