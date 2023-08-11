"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ADAPTER_EVENTS, SafeEventEmitterProvider } from "@web3auth/base";
import getSafeAuth from "@/utils/safeAuth";
import { Loader2 } from "lucide-react";
import { connectedHandler, disconnectedHandler } from "@/constants/index";
import { ethers } from "ethers";
import TokenMint from "@/components/TokenMint";

// Dummy component for the Safe
const SafeComponent = () => {
  return {
    safeAddress: "your-safe-address"
  };
};

// Dummy data for balances
const dummyBalances = [
  { asset: "Asset 1", balance: 100 },
  { asset: "Asset 2", balance: 200 }
];

// Dummy handleTransfer function
const dummyHandleTransfer = () => {
  // Your transfer logic here
};

export default function Home() {
  const [loading, setLoading] = useState({
    web3: false,
    web2: false
  });
  // const { address, isConnected } = useAccount();
  const [eoaAddress, setEoaAddress] = useState(null);
  const [safeAuth, setSafeAuth] = useState();

  const { connect } = useConnect({
    connector: new InjectedConnector()
  });

  useEffect(() => {
    (async () => {
      const safeAuthKit = await getSafeAuth();

      safeAuthKit.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
      safeAuthKit.subscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler);

      setSafeAuth(safeAuthKit);

      return () => {
        safeAuthKit.unsubscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
        safeAuthKit.unsubscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler);
      };
    })();
  }, []);

  const safeAuthLogin = async () => {
    if (!safeAuth) return;
    setLoading(prev => ({ ...prev, web2: true }));

    //Try to login
    const response = await safeAuth.signIn();

    setLoading(prev => ({ ...prev, web2: false }));
    await setEoaAddress(response.eoa);
  };
  const safeAuthLogout = async () => {
    if (!safeAuth) return;
    await safeAuth.signOut();
    setEoaAddress(null);
  };

  const web3Login = async () => {
    setLoading(prev => ({ ...prev, web3: true }));
    connect();
  };

  return (
    <main className="flex flex-col items-center flex-1 px-20 text-center">
      <div className="text-green-700 p-6">
        <p className=" text-2xl font-serif italic">
          Generate Real Carbon Credits and Begin Participating in a global carbon market
        </p>
      </div>

      <div className="flex flex-col w-full max-w-sm items-center">
        {loading.web3 ? (
          <button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </button>
        ) : (
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => web3Login()}
          >
            Login with Wallet
          </button>
        )}

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
      {eoaAddress && <TokenMint safe={SafeComponent()} balances={dummyBalances} handleTransfer={dummyHandleTransfer} />}
    </main>
  );
}
