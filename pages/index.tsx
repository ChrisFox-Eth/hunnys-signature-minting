import styles from "./styles/Home.module.css";
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
} from "@thirdweb-dev/react";
import { ChainId, ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRef, useState } from "react";

const Home: NextPage = () => {
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
    "0xf69Ba6Bce4B0ee10bfE9FD5D43A36bC9A1Cc5EbF"
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
      switchNetwork && switchNetwork(ChainId.Mumbai);
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

      alert("Successfully minted NFT with signature");

      return nft;
    } catch (e) {
      console.error("An error occurred trying to mint the NFT:", e);
    }
  };

  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.left}>
          <div>
              <img src={`/HunnysLogoTransparent.png`} alt="Hunnys Logo" className={styles.logo} />
          </div>
        </div>
        <div className={styles.right}>
          {address ? (
            <>
              <a
                className={styles.secondaryButton}
                onClick={() => disconnectWallet()}
              >
                Disconnect Wallet
              </a>
              <p style={{ marginLeft: 8, marginRight: 8, color: "grey" }}>|</p>
              <p>
                {address.slice(0, 6).concat("...").concat(address.slice(-4))}
              </p>
            </>
          ) : (
            <a
              className={styles.mainButton}
              onClick={() => connectWithMetamask()}
            >
              Connect Wallet
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={styles.container}>
        {/* Top Section */}
        <h1 className={styles.h1}>Introducing... HUPE Scouts!</h1>
        <div>
            <img src={`/HupeScoutsHunny.jpeg`} alt="Hupe Scouts Hunny" className={styles.hupeScout} />
        </div>
        <h2>The Official Community-Owned Derivative Brand</h2>

        <hr className={styles.divider} />


        <div className={styles.aboutContainer}>
          {/* About Section */}
          <h1 className={styles.h1}>About</h1>
          <div className={styles.textGrid}>
              <div className={styles.textItem}>
                <p style={{ padding:"20px", textAlign:"left" }}>Hunny holders can Create, Earn and Grow this official community-owned brand using innovative decentralized technology.<br></br><br></br>
                Decentralized community participation is a core value of WEB3 and we want to use that within Hunnys to reward and engage the loyal members who have found a home with us. Over the past months we have seen how dedicated and enthusiastic our community is, which is why we believe you have the right to help shape how it grows in a big way.<br></br><br></br>
                The Hunnys Hupe Scouts brand belongs to you. By working together, the community can grow the Hupe Scouts Brand alongside Hunnys10k and earn profits from their participation while feeling like they are making a meaningful impact on the project’s growth.</p>
                    <img src={`/SkuzzRelic.png`} alt="SkuzzRelic" className={styles.exampleImages} />
          </div>
          <hr className={styles.smallDivider} />
          <div className={styles.aboutContainer}>
          <h1>How To Participate:</h1>
          <ul className={styles.listItems}>
          <li>1. Mint your 3000 x 3000 px Hunnys Derivative below using this base (you may redraw or change as you see fit, this is just a guideline)</li>
          <li>2. Receive an exclusive Hunnys Hupe Scouts Seasons NFT</li>
          <li>3. Verify your wallet on Collab-Land in Discord to receive the Hupe role</li>
          <li>4. Gain Access to the private Hupe Scouts channel to plan your strategy, events and more with fellow Huper-s</li>
          <li>5. List your Hunny for sale at the price of your choice</li>
          <li>6. Collect 100% of sales and royalties on your creation</li>
          </ul>
</div>
</div>

          <hr className={styles.smallDivider} />
          <div className={styles.collectionContainer}>
            <h2 className={styles.theCollection}>
              Join the Hupe Scouts:
            </h2>

            <input
              type="text"
              placeholder="Name of your NFT"
              className={styles.textInput}
              maxLength={26}
              onChange={(e) => setNftName(e.target.value)}
            />

            <input
              type="text"
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
          </div>
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

          <hr className={styles.smallDivider} />
          </div>
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
                     "https://testnets.opensea.io/assets/mumbai/0xf69ba6bce4b0ee10bfe9fd5d43a36bc9a1cc5ebf/" + nft.metadata.id,
                     "_blank"
                   )
                 }
                    >
                    <ThirdwebNftMedia style={{
                      width:200,
                    }}
                      metadata={nft.metadata}
                    />
                    <div>{nft.metadata.name}</div>
                  </div>
                  <div className={'nftDescription'} style={{ textAlign: "center", width: "30%", margin:"50px" }}>
                    <p>
                      <b>{" "}{nft.metadata.description}{" "}</b>
                    </p>
                  </div>

                  <div
                    style={{
                      textAlign: "center"
                    }}>
                    <p>Owned by:</p>
                    <p style={{
                      cursor: "pointer",
                    }}
                      onClick={() =>
                        window.open(
                          "https://testnets.opensea.io/" + nft.owner,
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
        <hr className={styles.smallDivider} />
        <div>
          <h1 className={styles.h1}>
            FAQ
          </h1>
          <div className={styles.faqContainer}>
          <h3>If I previously drew a Hunnys derivative can I mint it inside the collection?</h3>
          <em>Yes you can! We do however suggest using something that has not been minted before.</em>
          <h3>Can I mint a derivative that I didn’t draw myself?</h3>
          <em>Yes - As long as you have commercial rights/permission to use the image for this purpose. We want non-artists to be able to participate as well, so we encourage talking to community artists about your vision for your Hunnys derivative and hiring them to create it for this project.</em>
          <h3>Are there any limits to what I can upload?</h3>
          <em>TBD</em>
          <h3>How can we earn money with the Hunnys Hupe Scouts?</h3>
          <em>Initially you can earn both primary sale and royalties by listing your piece for sale within the collection. If the Hunnys Hupe Scouts derivative brand gets deals, sponsorships or other partnerships in the future, the earnings will be split equally amongst all the contributors.</em>
          <h3>Can I upload more than 1 piece?</h3>
          <em>Yes!</em>
          <h3>How was this project created?</h3>
          <em>The Hunnys Hupe Scouts brand utilizes state-of-the-art decentralized blockchain technology developed by thirdweb to implement governance, token management, and revenue splitting.</em>
</div>
        </div>
      </div>
    </>
  );
};

export default Home;
