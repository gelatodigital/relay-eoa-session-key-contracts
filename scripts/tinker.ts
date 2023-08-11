/* eslint-disable @typescript-eslint/naming-convention */
import hre, { ethers } from "hardhat";
import { Contract } from "ethers";

import { sessionKeyAbi } from "../constants/sessionKeyAbi";
import { v4 as uuidv4 } from "uuid";

import { CallWithERC2771Request , GelatoRelay } from "@gelatonetwork/relay-sdk";
import { SessionKeyGate } from "../typechain";
import { TempKey } from "./tempKey";

async function main() {
  const chainId = hre.network.config.chainId as number;
 
  const GELATO_RELAY_API_KEY = process.env.GELATO_RELAY_API_KEY;
  
  const relay = new GelatoRelay();

  // Init GelatoOpsSDK
  const signer = new ethers.Wallet(process.env.PK as string, hre.ethers.provider);
  console.log(signer.address);

  const sessionKeyAddress = "0xde2568192B20A57dE387132b54C3fa492E334837";


  const user = await signer.getAddress();

  // Generate the target payload
  const sessionKeyContract = new hre.ethers.Contract(
    sessionKeyAddress,
    sessionKeyAbi,
    hre.ethers.provider
  ) as SessionKeyGate;

const tempKey = new TempKey()

const tempAddress = tempKey.address;


  const sessionId = uuidv4(); 
  console.log(sessionId,tempAddress)
 

  const packed = ethers.utils.solidityPack(["string"], [sessionId]);
  const hash = ethers.utils.keccak256(packed);
  console.log(hash)


   const { data } = await sessionKeyContract.populateTransaction.createSession(sessionId,3600,tempAddress)

    // Populate a relay request
    const request: CallWithERC2771Request = {
      chainId,
      target: sessionKeyAddress,
      data: data as string,
      user: user as string,
    };

  const response = await relay.sponsoredCallERC2771(
    request,
    signer,
    GELATO_RELAY_API_KEY as string
  );

  console.log(`https://relay.gelato.digital/tasks/status/${response.taskId}`);
}

main()
  .then(() => console.log("okdk"))
  //process.exit(0))
  .catch((error) => {
    console.error(error);
    // process.exit(1);
  });
