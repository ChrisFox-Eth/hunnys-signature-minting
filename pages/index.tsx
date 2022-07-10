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
  useNFTBalance,
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
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.left}>
          <div>
              <img src={`/HUPEHeartLogo.png`} alt="Hunnys Logo" className={styles.logo} />
          </div>
        </div>
        <div className={styles.right}>
        <a href='https://opensea.io/collection/hupe-scouts' rel="noreferrer" target='_blank'>
        <svg
          width={30}
          height={30}
          style={{marginRight:20}}
          viewBox='0 0 90 90'
          xmlSpace='preserve'
          xmlns='http://www.w3.org/2000/svg'>
          <path xmlns="http://www.w3.org/2000/svg" d="M90 45C90 69.8514 69.8514 90 45 90C20.1486 90 0 69.8514 0 45C0 20.1486 20.1486 0 45 0C69.8566 0 90 20.1486 90 45Z" fill="white"/>
          <path xmlns="http://www.w3.org/2000/svg" d="M22.2011 46.512L22.3953 46.2069L34.1016 27.8939C34.2726 27.6257 34.6749 27.6535 34.8043 27.9447C36.76 32.3277 38.4475 37.7786 37.6569 41.1721C37.3194 42.5683 36.3948 44.4593 35.3545 46.2069C35.2204 46.4612 35.0725 46.7109 34.9153 46.9513C34.8413 47.0622 34.7165 47.127 34.5824 47.127H22.5432C22.2196 47.127 22.0301 46.7756 22.2011 46.512Z" fill="#3C6687"/>
          <path xmlns="http://www.w3.org/2000/svg" d="M74.38 49.9149V52.8137C74.38 52.9801 74.2783 53.1281 74.1304 53.1928C73.2242 53.5812 70.1219 55.0052 68.832 56.799C65.5402 61.3807 63.0251 67.932 57.4031 67.932H33.949C25.6362 67.932 18.9 61.1727 18.9 52.8322V52.564C18.9 52.3421 19.0803 52.1618 19.3023 52.1618H32.377C32.6359 52.1618 32.8255 52.4022 32.8024 52.6565C32.7099 53.5072 32.8671 54.3764 33.2693 55.167C34.0461 56.7435 35.655 57.7283 37.3934 57.7283H43.866V52.675H37.4673C37.1391 52.675 36.9449 52.2959 37.1345 52.0277C37.2038 51.9214 37.2824 51.8104 37.3656 51.6856C37.9713 50.8257 38.8358 49.4895 39.6958 47.9684C40.2829 46.9421 40.8516 45.8463 41.3093 44.746C41.4018 44.5472 41.4758 44.3438 41.5497 44.1449C41.6746 43.7936 41.804 43.4653 41.8965 43.1371C41.9889 42.8597 42.0629 42.5684 42.1369 42.2956C42.3542 41.3617 42.4467 40.3723 42.4467 39.3459C42.4467 38.9437 42.4282 38.523 42.3912 38.1207C42.3727 37.6815 42.3172 37.2423 42.2617 36.8031C42.2247 36.4147 42.1554 36.031 42.0814 35.6288C41.9889 35.0416 41.8595 34.4591 41.7115 33.8719L41.6607 33.65C41.5497 33.2478 41.4573 32.864 41.3278 32.4618C40.9626 31.1996 40.5418 29.9698 40.098 28.8186C39.9362 28.3609 39.7512 27.9217 39.5663 27.4825C39.2935 26.8213 39.0161 26.2203 38.7619 25.6516C38.6324 25.3927 38.5214 25.1569 38.4105 24.9165C38.2857 24.6437 38.1562 24.371 38.0268 24.112C37.9343 23.9132 37.8279 23.7283 37.754 23.5434L36.9634 22.0824C36.8524 21.8836 37.0374 21.6478 37.2546 21.7079L42.2016 23.0487H42.2155C42.2247 23.0487 42.2294 23.0533 42.234 23.0533L42.8859 23.2336L43.6025 23.437L43.866 23.511V20.5706C43.866 19.1512 45.0034 18 46.4089 18C47.1116 18 47.7496 18.2866 48.2073 18.7536C48.665 19.2206 48.9517 19.8586 48.9517 20.5706V24.935L49.4787 25.0829C49.5204 25.0968 49.562 25.1153 49.599 25.143C49.7284 25.2401 49.9133 25.3835 50.1491 25.5591C50.3341 25.7071 50.5329 25.8874 50.7733 26.0723C51.2495 26.4561 51.8181 26.9508 52.4423 27.5194C52.6087 27.6628 52.7706 27.8107 52.9185 27.9587C53.723 28.7076 54.6245 29.5861 55.4845 30.557C55.7249 30.8297 55.9607 31.1071 56.2011 31.3984C56.4415 31.6943 56.6958 31.9856 56.9177 32.2769C57.209 32.6652 57.5233 33.0674 57.7961 33.4882C57.9256 33.687 58.0735 33.8904 58.1984 34.0892C58.5497 34.6209 58.8595 35.1711 59.1554 35.7212C59.2802 35.9755 59.4097 36.2529 59.5206 36.5257C59.8489 37.2608 60.1078 38.0098 60.2742 38.7588C60.3251 38.9206 60.3621 39.0963 60.3806 39.2535V39.2904C60.436 39.5124 60.4545 39.7482 60.473 39.9886C60.547 40.756 60.51 41.5235 60.3436 42.2956C60.2742 42.6239 60.1818 42.9336 60.0708 43.2619C59.9598 43.5763 59.8489 43.9045 59.7056 44.2143C59.4282 44.8569 59.0999 45.4996 58.7115 46.1006C58.5867 46.3225 58.4388 46.5583 58.2908 46.7802C58.129 47.016 57.9626 47.238 57.8146 47.4553C57.6112 47.7327 57.3939 48.0239 57.172 48.2828C56.9732 48.5556 56.7697 48.8284 56.5478 49.0688C56.2381 49.434 55.9422 49.7808 55.6324 50.1137C55.4475 50.331 55.2487 50.5529 55.0452 50.7517C54.8464 50.9736 54.643 51.1724 54.4581 51.3573C54.1483 51.6671 53.8894 51.9075 53.6721 52.1063L53.1635 52.5733C53.0896 52.638 52.9925 52.675 52.8908 52.675H48.9517V57.7283H53.9079C55.0175 57.7283 56.0716 57.3353 56.9223 56.6141C57.2136 56.3598 58.485 55.2594 59.9876 53.5997C60.0384 53.5442 60.1032 53.5026 60.1771 53.4841L73.8668 49.5265C74.1211 49.4525 74.38 49.6467 74.38 49.9149Z" fill="#3C6687"/>
        </svg>
        </a>
        <a href='https://twitter.com/hunnysNFT' rel="noreferrer" target='_blank'>
        <svg
          width={30}
          height={30}
          style={{marginRight:20}}
          viewBox='0 0 248 204'
          fill='none'
          xmlSpace='preserve'
          >
          <path
            d='M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07a50.338 50.338 0 0022.8-.87C27.8 117.2 10.85 96.5 10.85 72.46v-.64a50.18 50.18 0 0022.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71a143.333 143.333 0 00104.08 52.76 50.532 50.532 0 0114.61-48.25c20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26a50.69 50.69 0 01-22.2 27.93c10.01-1.18 19.79-3.86 29-7.95a102.594 102.594 0 01-25.2 26.16z'
            fill='#ffffff'
          />
        </svg>
        </a>
        <a href='https://discord.gg/hunnys' rel="noreferrer" target='_blank'>
        <svg
          width={30}
          height={30}
          style={{marginRight:20}}
          viewBox='0 0 71 55'
          xmlns='http://www.w3.org/2000/svg'
          >
          <g clipPath='url(#clip0)'>
            <path
              d='M60.105 4.898A58.55 58.55 0 0045.653.415a.22.22 0 00-.233.11 40.784 40.784 0 00-1.8 3.697c-5.456-.817-10.886-.817-16.23 0-.485-1.164-1.201-2.587-1.828-3.697a.228.228 0 00-.233-.11 58.386 58.386 0 00-14.451 4.483.207.207 0 00-.095.082C1.578 18.73-.944 32.144.293 45.39a.244.244 0 00.093.167c6.073 4.46 11.955 7.167 17.729 8.962a.23.23 0 00.249-.082 42.08 42.08 0 003.627-5.9.225.225 0 00-.123-.312 38.772 38.772 0 01-5.539-2.64.228.228 0 01-.022-.378c.372-.279.744-.569 1.1-.862a.22.22 0 01.23-.03c11.619 5.304 24.198 5.304 35.68 0a.219.219 0 01.233.027c.356.293.728.586 1.103.865a.228.228 0 01-.02.378 36.384 36.384 0 01-5.54 2.637.227.227 0 00-.121.315 47.249 47.249 0 003.624 5.897.225.225 0 00.249.084c5.801-1.794 11.684-4.502 17.757-8.961a.228.228 0 00.092-.164c1.48-15.315-2.48-28.618-10.497-40.412a.18.18 0 00-.093-.084zm-36.38 32.427c-3.497 0-6.38-3.211-6.38-7.156 0-3.944 2.827-7.156 6.38-7.156 3.583 0 6.438 3.24 6.382 7.156 0 3.945-2.827 7.156-6.381 7.156zm23.593 0c-3.498 0-6.38-3.211-6.38-7.156 0-3.944 2.826-7.156 6.38-7.156 3.582 0 6.437 3.24 6.38 7.156 0 3.945-2.798 7.156-6.38 7.156z'
              fill='#ffffff'
            />
          </g>
          <defs>
            <clipPath id='clip0'>
              <path fill='#fff' d='M0 0H71V55H0z' />
            </clipPath>
          </defs>
        </svg>
        </a>
          {address ? (
            <>
              <a
                className={styles.secondaryButton}
                onClick={() => disconnectWallet()}
              >
                Disconnect Wallet
              </a>
              <p className={styles.walletNavText}>|</p>
              <p className={styles.walletNavText}>
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
        <div>
            <img src={`/HUPEScoutHero.png`} alt="Hupe Scouts Hunny" className={styles.hupeScout} />
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
                        <img src={`/SkuzzRelic.png`} alt="SkuzzRelic" className={styles.exampleImages} />
              </div>
              </div>
          </div>
          <hr className={styles.divider} />
          <div className={styles.aboutContainer}>
          <h1 className={styles.h1}>How To Participate:</h1>
          <ul className={styles.listItems}>
          <li>1. Mint your Hunnys derivative below using <a href='https://drive.google.com/drive/folders/1z9_njr3mXPU6FTMq_bCaREUFIb6NxhKL' rel="noreferrer" target='_blank'>the bases we provide</a> or your own design!</li>
          <li>2. Receive an exclusive Hunnys Hupe Scouts Seasons NFT</li>
          <li>3. Verify your wallet on Collab-Land in Discord to receive the Hupe Scouts role</li>
          <li>4. Gain access to the private Hupe Scouts channel to plan your strategy, events and more with fellow Huper-s</li>
          <li>5. List your Hunny for sale at the price of your choice</li>
          <li>6. Collect 100% of your primary sale and share all royalties earned with the collective Hupe Scouts on your creation</li>
          </ul>
          </div>

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
        <hr className={styles.divider} />
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
        </div>
        <img src={`/HunnysDerivs.png`} alt="Hunnys Derivatives" className={styles.hunnysDerivs} />
      </div>
    </>
  );
};

export default Home;
