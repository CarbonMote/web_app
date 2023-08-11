import { mainnet, polygon, arbitrum, hardhat, goerli, baseGoerli } from "wagmi/chains";
import { getDefaultClient } from "connectkit";
import { createClient } from "wagmi";

const chains = [polygon, goerli, hardhat, mainnet, arbitrum, baseGoerli];

export const client = createClient(
  getDefaultClient({
    autoConnect: true,
    appName: "AppName",
    chains
  })
);
