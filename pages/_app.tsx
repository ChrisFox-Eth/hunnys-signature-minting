import React from "react";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import Head from "next/head";
import ThirdwebGuideFooter from "../components/guide/ThirdwebGuideFooter";
import "./styles/globals.css";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mainnet;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Head>
        <title>Hunnys Hupe Scouts</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Hunnys Hupe Squad: A Community NFT Collection" />
        <meta name="url" content="https://hupe.hunnysnft.com" />
        <meta name="image" content="https://hupe.hunnysnft.com/HUPEScoutHero.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://hupe.hunnysnft.com/HUPEScoutHero.png" />
        <meta name="keywords" content="Hunnys Hupe Scouts: A Community NFT Collection" />
      </Head>
      <Component {...pageProps} />
      <ThirdwebGuideFooter />
    </ThirdwebProvider>
  );
}

export default MyApp;
