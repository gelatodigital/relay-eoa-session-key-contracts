import { deployments, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async () => {

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();



  const sessionKey = await deploy("SessionKeyGate", {
    from:deployer,
    args:["0xd8253782c45a12053594b9deB72d8e8aB2Fca54c"]
  })
  
  const sessionKeyAddress = sessionKey.address


  const counter = await deploy("Counter", {
    from: deployer,
    args: [sessionKeyAddress],
  });




};

func.tags = ["Counter"];

export default func;
