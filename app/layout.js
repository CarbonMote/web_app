"use client";

import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { baseGoerli } from "wagmi/chains";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { GenericContextProvider } from "@/contexts/GenericContext";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

const chains = [baseGoerli];
const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,

    // Required
    appName: "Carbon Mote",

    // Optional
    appDescription: "Motion Capture",
    appUrl: "", // your app's url
    appIcon: "", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    chains
  })
);

export default function AppLayout({ children }) {
  return (
    <html>
      <head />

      <body className={inter.className}>
        <WagmiConfig config={config}>
          <ConnectKitProvider>
            <div className="flex justify-center items-center">
              <Image src={"/logo2.png"} width={800} height={400} className="m-10 mb-20" alt="logo" />
            </div>
            <GenericContextProvider>{children}</GenericContextProvider>
          </ConnectKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
