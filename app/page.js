"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ADAPTER_EVENTS, SafeEventEmitterProvider } from "@web3auth/base";
import { Loader2 } from "lucide-react";
import { connectedHandler, disconnectedHandler } from "@/constants/index";
import { ethers } from "ethers";
import TokenMint from "@/components/TokenMint";
import AuthKitClass from "@/utils/safeAuth";
import { ConnectKitButton } from "connectkit";

export default function Home() {
  const [loading, setLoading] = useState({
    web3: false,
    web2: false
  });
  const { address, isConnecting, isDisconnected } = useAccount();
  const [eoaAddress, setEoaAddress] = useState(null);
  const [safeAuth, setSafeAuth] = useState();
  const [provider, setProvider] = useState();
  const [dbdata, setdbdata] = useState([]);

  // const { connect } = useConnect({
  // 	connector: new InjectedConnector()
  // });

  useEffect(() => {
    // Fetch data from the "GET" endpoint
    fetch("/api/cru-data-table")
      .then(response => response.json())
      .then(data => {
        setdbdata(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const safeAuthLogin = async () => {
    setLoading(prev => ({ ...prev, web2: true }));

    //Try to login
    const tmpSafeAuth = await AuthKitClass.createSafeAuth();
    setSafeAuth(tmpSafeAuth);
    console.log("login provider: " + JSON.stringify(tmpSafeAuth, null, 2));

    const response = await tmpSafeAuth.signIn();
    setEoaAddress(response.eoa);

    setLoading(prev => ({ ...prev, web2: false }));
  };
  const safeAuthLogout = async () => {
    if (!safeAuth) return;
    await safeAuth.signOut();
    setEoaAddress(null);
  };

  return (
    <div className="flex flex-col items-center flex-1 px-20 text-center">
      <div className="text-green-700 p-6">
        <p className=" text-2xl font-serif italic">
          Generate Real Carbon Credits and Begin Participating in a global carbon market
        </p>
      </div>

      <div className="flex flex-col w-full max-w-sm items-center">
        <ConnectKitButton />

        <p className="mt-6 mb-3 text-sm text-muted-foreground">{"or Login Using Account Abstraction!"}</p>
        {loading.web2 ? (
          <button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={eoaAddress ? () => safeAuthLogout() : () => safeAuthLogin()}
          >
            {eoaAddress ? "Logout" : "Safe AA Login"}
          </button>
        )}
        {eoaAddress && <p>EOA: {eoaAddress}</p>}
      </div>
      {eoaAddress ||
        (address && (
          <TokenMint
            userWalletAddress={address}
            // signer={safeAuth.provider.signer}
            safeAuth={safeAuth}
            balances={[
              { asset: "Distance Walked (km)", balance: dbdata.distance },
              { asset: "Biking Distance (km)", balance: 10 },
              { asset: "Solar Power Produced (kW)", balance: 60 },
              { asset: "Car Driven (km)", balance: 103 },
              {
                asset: "Credits Availble to Mint",
                balance: dbdata.bufferedcredits
              }
            ]}
          />
        ))}
    </div>
  );
}
