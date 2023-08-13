import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { ModalConfig, Web3AuthOptions } from "@web3auth/modal";
import { Web3AuthModalPack, Web3AuthConfig } from "@safe-global/auth-kit";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

export default class AuthKitClass {
	private static chainId = "0x14a33";
	private static web3AuthModal;
	private static signedIn: boolean = false;

	public static async createSafeAuth() {
		const options: Web3AuthOptions = {
			clientId: process.env.NEXT_PUBLIC_WEB3AUTH_ID!,
			web3AuthNetwork: "testnet",
			chainConfig: {
				chainNamespace: CHAIN_NAMESPACES.EIP155,
				chainId: this.chainId,
				rpcTarget: "https://goerli.base.org",
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

		const web3AuthConfig: Web3AuthConfig = {
			txServiceUrl: "https://safe-transaction-base-testnet.safe.global/",
		};
		// Instantiate and initialize the pack
		const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);
		await web3AuthModalPack.init({
			options,
			adapters: [openloginAdapter],
			modalConfig,
		});

		// Instantiate and initialize the pack
		// const web3AuthModalPack = new Web3AuthModalPack({
		// 	options,
		// 	[openloginAdapter],
		// 	modalConfig
		// });

		// await web3AuthModalPack.init();
		// AuthKitClass.web3AuthModal = web3AuthModalPack;
		return web3AuthModalPack;
		// AuthKitClass.web3AuthModal = await SafeAuthKit.init(web3AuthModalPack, {
		// 	txServiceUrl: "https://safe-transaction-base-testnet.safe.global/",
		// });
	}

	// public static async safeAuthSignIn() {
	// 	let safeAuth;
	// 	if (!AuthKitClass.signedIn) {
	// 		console.log("initializing...");
	// 		safeAuth = await AuthKitClass.createSafeAuth();
	// 	}
	// 	const res = await safeAuth.signIn();
	// 	AuthKitClass.signedIn = true;
	// 	return res;
	// }

	// public static async safeAuthSignOut(authModal: Web3AuthModalPack) {
	// 	if (!authModal) {
	// 		return;
	// 	}
	// 	await authModal.signOut();
	// }

	// public static getSafeAuth() {
	// 	if (!AuthKitClass.web3AuthModal) {
	// 		throw new Error("SafeAuthKit instance is not initialized.");
	// 	}
	// 	return AuthKitClass.web3AuthModal;
	// }
}
