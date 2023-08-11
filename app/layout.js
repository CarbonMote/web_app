"use client";

import { ConnectKitProvider } from "connectkit";
import { WagmiConfig } from "wagmi";
import { client } from "@/utils/wagmi";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { GenericContextProvider } from "@/contexts/GenericContext";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function AppLayout({ children }) {
  return (
    <html>
      <head />

      <body className={inter.className}>
        <WagmiConfig client={client}>
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
