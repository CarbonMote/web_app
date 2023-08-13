// "use client";
// import { useEffect, useState } from "react";
// import { ADAPTER_EVENTS, SafeEventEmitterProvider } from "@web3auth/base";

// import getSafeAuth from "@/utils/safeAuth";

// const Web3Auth = () => {
// 	const [safeAuthSignInResponse, setSafeAuthSignInResponse] =
// 		useState<SafeAuthSignInData | null>(null);
// 	const [safeAuth, setSafeAuth] = useState<SafeAuthKit<Web3AuthModalPack>>();
// 	const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
// 		null
// 	);
// 	const [userAddress, setUserAddress] = useState<string | null>(null);

// 	useEffect(() => {
// 		(async () => {
// 			const safeAuthKit = await getSafeAuth();

// 			safeAuthKit.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
// 			safeAuthKit.subscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler);

// 			setSafeAuth(safeAuthKit);

// 			return () => {
// 				safeAuthKit.unsubscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
// 				safeAuthKit.unsubscribe(
// 					ADAPTER_EVENTS.DISCONNECTED,
// 					disconnectedHandler
// 				);
// 			};
// 		})();
// 	}, []);

// 	const login = async () => {
// 		if (!safeAuth) return;
// 		const response = await safeAuth.signIn();

// 		setSafeAuthSignInResponse(response);
// 		setProvider(safeAuth.getProvider() as SafeEventEmitterProvider);
// 		setUserAddress(response.eoa);
// 	};

// 	const logout = async () => {
// 		if (!safeAuth) return;
// 		await safeAuth.signOut();

// 		setProvider(null);
// 		setSafeAuthSignInResponse(null);
// 		setUserAddress(null);
// 	};

// 	return (
// 		<>
// 			<div className="flex items-center justify-center w-full h-full">
// 				<div className="max-w-md w-full my-4 ">
// 					<div className="flex items-center justify-between">
// 						<button
// 							type="submit"
// 							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
// 							disabled={!login}
// 							onClick={() => {
// 								login?.();
// 							}}
// 						>
// 							Safe AA Login
// 						</button>
// 						{userAddress && (
// 							<button
// 								type="submit"
// 								className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
// 								disabled={!logout}
// 								onClick={() => {
// 									logout?.();
// 								}}
// 							>
// 								Sign Out
// 							</button>
// 						)}
// 					</div>

// 					{userAddress && <p>EOA: {userAddress}</p>}
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default Web3Auth;
