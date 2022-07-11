import styles from "/pages/styles/Home.module.css";
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
import type { NextPage } from "next";
import { useRef, useState } from "react";
import React, { Component }  from "react";

export const Minter = () => {
  // Helpful thirdweb hooks to connect and manage the wallet from metamask.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const signer = useSigner();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();


  // Fetch the NFT collection from thirdweb via it's contract address.
  const nftCollection = useNFTCollection(
    // Replace this with your NFT Collection contract address
    "0x1D595b1b360E2240e85f06beC1D1679D5C005BE3"
  );

  // Here we store the user inputs for their NFT.
  const [nftName, setNftName] = useState<string>("");
  const [nftDescription, setNftDescription] = useState<string>("");
  const [file, setFile] = useState<File>();

  const { data: nfts, isLoading: loadingNfts } = useNFTs(nftCollection);

  // Magic to get the file upload even though its hidden
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Function to store file in state when user uploads it
  const uploadFile = () => {
    if (fileInputRef?.current) {
      fileInputRef.current.click();

      fileInputRef.current.onchange = () => {
        if (fileInputRef?.current?.files?.length) {
          const file = fileInputRef.current.files[0];
          setFile(file);
        }
      };
    }
  };

  // This function calls a Next JS API route that mints an NFT with signature-based minting.
  // We send in the address of the current user, and the text they entered as part of the request.
  const mintWithSignature = async () => {
    if (!address) {
      connectWithMetamask();
      return;
    }

    if (isOnWrongNetwork) {
      switchNetwork && switchNetwork(ChainId.Mainnet);
      return;
    }

    try {
      if (!file || !nftName) {
        alert("Please enter a name and upload a file.");
        return;
      }

      if (!address || !signer) {
        alert("Please connect to your wallet.");
        return;
      }

      // Upload image to IPFS using the sdk.storage
      const tw = new ThirdwebSDK(signer);
      const ipfsHash = await tw.storage.upload(file);
      const url = `${ipfsHash.uris[0]}`;

      // Make a request to /api/server
      const signedPayloadReq = await fetch(`/api/server`, {
        method: "POST",
        body: JSON.stringify({
          authorAddress: address, // Address of the current user
          nftName: nftName,
          nftDescription: nftDescription,
          imagePath: url,
        }),
      });

      console.log("Received Signed payload", signedPayloadReq);

      // Grab the JSON from the response
      const json = await signedPayloadReq.json();

      console.log("Json:", json);

      // If the request failed, we'll show an error.
      if (!signedPayloadReq.ok) {
        alert(json.error);
        return;
      }

      // If the request succeeded, we'll get the signed payload from the response.
      // The API should come back with a JSON object containing a field called signedPayload.
      // This line of code will parse the response and store it in a variable called signedPayload.
      const signedPayload = json.signedPayload;

      // Now we can call signature.mint and pass in the signed payload that we received from the server.
      // This means we provided a signature for the user to mint an NFT with.
      const nft = await nftCollection?.signature.mint(signedPayload);

      console.log("Successfully minted NFT with signature", nft);

      alert("HUPE! Your NFT has been added to the collection. Check it out below!");

      return nft;
    } catch (e) {
      console.error("An error occurred trying to mint the NFT:", e);
    }
  };



  return (
    <>

          <div className={styles.aboutContainer}>
          <div className={styles.mintShadow}>
          <h2 className={styles.theCollection}>
            Join the Hupe Scouts:
          </h2>
          <div className={styles.collectionContainer}>

            <input
              type="text"
              placeholder="Name of your NFT"
              className={styles.textInput}
              maxLength={40}
              onChange={(e) => setNftName(e.target.value)}
            />

            <textarea
              placeholder="Description of your NFT"
              className={styles.textInput}
              maxLength={250}
              onChange={(e) => setNftDescription(e.target.value)}
            />

            {file ? (
              <img
                src={URL.createObjectURL(file)}
                style={{ cursor: "pointer", maxHeight: 250, borderRadius: 8 }}
                onClick={() => setFile(undefined)}
              />
            ) : (
              <div
                className={styles.imageInput}
                onClick={uploadFile}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  setFile(e.dataTransfer.files[0]);
                }}
              >
                Drag and drop an image here to upload it!
              </div>
            )}

          <input
            type="file"
            accept="image/png, image/gif, image/jpeg"
            id="profile-picture-input"
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          <div style={{ marginTop: 24 }}>
            {address ? (
              <a className={styles.mainButton} onClick={mintWithSignature}>
                Mint NFT
              </a>
            ) : (
              <a className={styles.mainButton} onClick={connectWithMetamask}>
                Connect Wallet
              </a>
            )}
          </div>
          </div>
          </div>
          <hr className={styles.divider} />

      </div>
    </>
  );
};



export default Minter;
