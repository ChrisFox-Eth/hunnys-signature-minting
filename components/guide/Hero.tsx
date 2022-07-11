import React from 'react';
import styles from "/pages/styles/Home.module.css";
import heroimage from "/public/HUPEScoutHero.png";
import heart from "/public/HunnysHeart.svg";
import skuzzrelic from "/public/SkuzzRelic.png";
import { Image } from "../shared/Image";
import { Link } from "../shared/Link";
import { MenuLink } from "../shared/MenuLink";
import NextLink, { LinkProps as ImportedLinkProps } from 'next/link';
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

export const Hero = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const signer = useSigner();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  return (

    <div className={styles.container}>
      {/* Top Section */}
      <div>
        <Image
          className={styles.hupeScout}
          src={heroimage}
          alt='Haley the Hupe Scout'
          placeholder='blur'
        />
      </div>

      <div className={styles.aboutContainer}>
        {/* About Section */}
            <ul className={styles.listItemsBig}>
            <li className={styles.h2}><img src={`/HunnysHeart.svg`} className={styles.heartBullet}/>  Sell commissions of Hunnys derivative artwork under 1 unified collection</li>
            <li className={styles.h2}><img src={`/HunnysHeart.svg`} className={styles.heartBullet}/>  Use the Hupe Scouts brand and logo for anything (commercial or otherwise!)</li>
            <li className={styles.h2}><img src={`/HunnysHeart.svg`} className={styles.heartBullet}/>  Create Hunnys artwork and list it for sale or gift it to friends</li>
            <li className={styles.h2}><img src={`/HunnysHeart.svg`} className={styles.heartBullet}/>  Grow the Hunnys brand on your own terms</li>
            <li className={styles.h2}><img src={`/HunnysHeart.svg`} className={styles.heartBullet}/>  Commission Hunnys artwork from other artists and (with consent) mint it for sale</li>
            <li className={styles.h2}><img src={`/HunnysHeart.svg`} className={styles.heartBullet}/>  Hold events, games, contests and more as you see fit</li>
            </ul>
            <div className={styles.textGrid}>
            <h1 className={styles.h1}>About</h1>
                <div className={styles.textItem}>
                  <p style={{ padding:"20px", textAlign:"left" }}>Hunny holders can Create, Earn and Grow this official community-owned brand using innovative decentralized technology.<br></br><br></br>
                  Decentralized community participation is a core value of Web3 and we want to use that within Hunnys to reward and engage the loyal members who have found a home with us. Over the past months we have seen how dedicated and enthusiastic our community is, which is why we believe you have the right to help shape how it grows in a big way.<br></br><br></br>
                  The Hunnys Hupe Scouts brand belongs to you. By working together, the community can grow the Hupe Scouts Brand alongside Hunnys10k and earn profits from their participation while making a meaningful impact on the project’s growth.</p>
                  <Image
                  className={styles.exampleImages}
                  src={skuzzrelic}
                  alt='SkuzzRelic'
                  placeholder='blur'
                  />
            </div>
            </div>
            </div>
        </div>

  );
};

export default Hero;
