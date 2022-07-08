import "../styles/globals.css";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import animalNames from "../../animalNames";

export default async function server(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // De-structure the arguments we passed in out of the request body
    const { authorAddress, nftName, nftDescription, imagePath } = JSON.parse(req.body);

    // You'll need to add your private key in a .env.local file in the root of your project
    // !!!!! NOTE !!!!! NEVER LEAK YOUR PRIVATE KEY to anyone!
    if (!process.env.PRIVATE_KEY) {
      throw new Error("You're missing PRIVATE_KEY in your .env.local file, ya idiot!");
    }

    // Initialize the Thirdweb SDK on the serverside
    const sdk = ThirdwebSDK.fromPrivateKey(
      // Your wallet private key (read it in from .env.local file)
      process.env.PRIVATE_KEY as string,
      "mainnet"
    );

    // Load the NFT Collection via it's contract address using the SDK
    const nftCollection = sdk.getNFTCollection(
      // Replace this with your NFT Collection contract address
      "0x1D595b1b360E2240e85f06beC1D1679D5C005BE3"
    );

    // Here we can make all kinds of cool checks to see if the user is eligible to mint the NFT.
    // Here are a few examples:

    // 1) Check that it's an animal name from our list of animal names
    // This demonstrates how we can restrict what kinds of NFTs we give signatures for
    //if (!animalNames.includes(nftName?.toLowerCase())) {
    //  res.status(400).json({ error: "Minting is currently not open to the public. Please reach out in Hunnys Discord for more information." });
    //  return;
    // }

    // 2) Check that this wallet hasn't already minted a page - 1 NFT per wallet
//    const hasMinted = (await nftCollection.balanceOf(authorAddress)).gt(0);
//    if (hasMinted) {
//      res.status(400).json({ error: "Already minted" });
//      return;
//    }

    // If all the checks pass, begin generating the signature...

    // Generate the signature for the page NFT
    const signedPayload = await nftCollection.signature.generate({
      to: authorAddress,
      metadata: {
        name: nftName as string,
        image: imagePath as string,
        description: nftDescription as string,
        properties: {
          "trait_type": "Collection",
          "value": "Community Submission"
        },
      },
    });

    // Return back the signedPayload to the client.
    res.status(200).json({
      signedPayload: JSON.parse(JSON.stringify(signedPayload)),
    });
  } catch (e) {
    res.status(500).json({ error: `Server error ${e}` });
  }
}
