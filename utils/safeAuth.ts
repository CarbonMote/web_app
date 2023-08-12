import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { SafeAuthKit, Web3AuthModalPack } from "@/utils/safe-core/index";

//Initialize AuthKit
const getSafeAuth = async () => {
	const options: Web3AuthOptions = {
		clientId: process.env.NEXT_PUBLIC_WEB3AUTH_ID as string,
		web3AuthNetwork: "testnet",
		chainConfig: {
			chainNamespace: CHAIN_NAMESPACES.EIP155,
			chainId: "0x14a33", //"0x5",
			rpcTarget: "https://goerli.base.org", //process.env.NEXT_PUBLIC_INFURA_RPC_TARGET,
		},
		uiConfig: {
			theme: "dark",
			loginMethodsOrder: ["google", "facebook"],
		},
	};

	const modalConfig = {
		[WALLET_ADAPTERS.TORUS_EVM]: {
			label: "torus",
			showOnModal: false,
		},
		[WALLET_ADAPTERS.METAMASK]: {
			label: "metamask",
			showOnDesktop: true,
			showOnMobile: false,
		},
	};

	const openloginAdapter = new OpenloginAdapter({
		loginSettings: {
			mfaLevel: "mandatory",
		},
		adapterSettings: {
			uxMode: "popup",
			whiteLabel: {
				name: "Safe",
			},
		},
	});

	const adapter = new Web3AuthModalPack(
		options,
		[openloginAdapter],
		modalConfig
	);

	const safeAuthKit = await SafeAuthKit.init(adapter, {
		txServiceUrl: "https://safe-transaction-base-testnet.safe.global/", //"https://safe-transaction-goerli.safe.global",
	});

	return safeAuthKit;
};

export default getSafeAuth;
