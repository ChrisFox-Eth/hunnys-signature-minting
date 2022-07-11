import React from "react";
import type { NextPage } from "next";
import styles from "/pages/styles/Home.module.css";
import { Image } from "../shared/Image";
import { Link } from "../shared/Link";
import { MenuLink } from "../shared/MenuLink";
import derivs from "/public/HunnysDerivs.png";

export default function Faq() {
  return (
    <div>
      <h1 className={styles.h1}>
        FAQ
      </h1>
      <div className={styles.faqContainer}>
      <h3>How does this work?</h3>
      <p>This is not an ordinary NFT collection. This is a community-based collection that allows multiple people to mint their own pieces on to it, rather than confining that ability to one single owner. The instant that you mint your NFT, you will become its owner. You can then use it for any purpose that you wish: as a verified PFP on Twitter, for merchandise, to gift to somebody special, or to sell it! You will see the piece inside of OpenSea like any other NFT, and you can take it from there. Also, once you mint at least one piece, your wallet address will be added to our Royalties contract, allowing you to share in receiving perpetual royalties on any secondary sales taking place in markets like OpenSea.</p>
      <p>In the beginning, the minting process will require a manual verification process by Stacys and Rat from Hunnys. While this is occurring, the minting process will be password-protected. If you are interested, please reach out to Stacys and Rat inside of Hunnys Discord, or on Twitter, requesting the ability to mint. After this initial entry period, minting will be open for everybody. This process of allowing additional wallets to mint based on meeting certain conditions is called Signature-Based Minting.</p>
      <h3>If I previously drew a Hunnys derivative, can I mint it inside the collection?</h3>
      <p>Yes you can! We only ask that you use something that has not been minted before.</p>
      <h3>Can I mint a derivative that I didn’t draw myself?</h3>
      <p>Yes - As long as you have commercial rights/permission to use the image for this purpose. We want non-artists to be able to participate as well, so we encourage talking to community artists about your vision for your Hunnys derivative and hiring them to create it for this project.</p>
      <h3>Are there any base files I can get started with, or any upload recommendations to be aware of?</h3>
      <p>Absolutely! You can use <a href='https://drive.google.com/drive/folders/1z9_njr3mXPU6FTMq_bCaREUFIb6NxhKL' rel="noreferrer" target='_blank'>this base</a> here to get started. This will set you up with a 3000 x 3000 px file, which is the recommended resolution for optimal display of your NFT.</p>
      <h3>Are there any limits to what I can upload?</h3>
      <p>The Hunnys team values and welcomes a diverse field of creative input, artistic expression, and background. Having said that, if it is found out that any of the content minted on this contract promotes hatred, violence, bigotry, or demeaning towards other artists/collections, the Hunnys team reserves the right to hide these pieces from the website, restrict from future minting, and if necessary, take further disciplinary actions inside of the Hunnys Discord.</p>
      <h3>How can we earn money with the Hunnys Hupe Scouts?</h3>
      <p>Initially you can earn both primary sale and royalties by listing your piece for sale within the collection. If the Hunnys Hupe Scouts derivative brand gets deals, sponsorships or other partnerships in the future, the earnings will be split equally amongst all the contributors.</p>
      <h3>Can I upload more than 1 piece?</h3>
      <p>Yes!</p>
      <h3>How can I get more involved with the community?</h3>
      <p>There are two great ways to do that! You can join the <a href='https://discord.gg/hunnys' rel="noreferrer" target='_blank'>Hunnys Discord,</a> and you can follow <a href='https://twitter.com/hunnysNFT' rel="noreferrer" target='_blank'>@HunnysNFT</a> on Twitter!</p>
      <h3>Where can I find the contract for this project?</h3>
      <p>You can find it right here on <a href='https://etherscan.io/address/0x1D595b1b360E2240e85f06beC1D1679D5C005BE3' rel="noreferrer" target='_blank'>Etherscan!</a></p>
      <h3>What are Hunnys?</h3>
      <p>The Hunnys NFT collection is the foundational project that has allowed the Hunnys brand to grow into projects like this. You can find the proper Hunnys NFT collection <a href='https://opensea.io/collection/hunnys' rel="noreferrer" target='_blank'>here on OpenSea.</a></p>
      <h3>How was this project created?</h3>
      <p>The Hunnys Hupe Scouts brand utilizes state-of-the-art decentralized blockchain technology developed by <a href='https://thirdweb.com' rel="noreferrer" target='_blank'>thirdweb</a> to implement governance, token management, and revenue splitting.</p>
      </div>
      <Image
      className={styles.hunnysDerivs}
      src={derivs}
      alt='Derivatives Collage'
      placeholder='blur'
      />
    </div>
  );
}
