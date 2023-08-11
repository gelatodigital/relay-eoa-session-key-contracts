import { task } from "hardhat/config";

export const verify = task("etherscan-verify", "verify").setAction(
  async ({}, hre) => {
    await hre.run("verify:verify", {
      address: "0xde2568192B20A57dE387132b54C3fa492E334837",
      constructorArguments: [
        "0xd8253782c45a12053594b9deB72d8e8aB2Fca54c"
      ],
    });
  }
);
