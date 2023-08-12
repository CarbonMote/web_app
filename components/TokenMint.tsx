import { useState } from "react";
import { Contract, ethers } from "ethers";
const Carbon = require("../contracts/Carbon.json");
import getSafeAuth from "@/utils/safeAuth";
import {
	SafeTransaction,
	SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import Safe from "@safe-global/protocol-kit";

const CONTRACT_ADDRESS = "0xfB34915FbE18F42a311c1b3d3bBAa8037513622d";
const contractMethod = "mint"; // The contract method you want to call

interface Balance {
	asset: string;
	balance: number;
}
interface Props {
	userWalletAddress: string;
	signer: ethers.providers.JsonRpcProvider;
	balances: Balance[];
}

export default function TokenMint({
	userWalletAddress,
	signer,
	balances,
}: Props) {
	// async function proposeTransaction() {
	// 	// Prepare contract call data
	// 	const contract = new Contract(CONTRACT_ADDRESS, Carbon.abi, signer);
	// 	const data = contract.interface.encodeFunctionData(contractMethod, [
	// 		userWalletAddress,
	// 		100,
	// 	]); // Example call data

	// 	// Create the transaction
	// 	const tx = await safe.createTransaction({
	// 		to: contractAddress,
	// 		value: 0,
	// 		data: data,
	// 		operation: 0, // 0: Call, 1: Delegate Call
	// 	});

	// 	// Propose the transaction
	// 	try {
	// 		const safeTxHash = await userSafe.getTransactionHash(tx);
	// 		await userSafe.signTransactionHash(safeTxHash);
	// 		console.log("Transaction proposed:", safeTxHash);
	// 	} catch (error) {
	// 		console.error("Error proposing transaction:", error);
	// 	}
	// }

	// async function proposeTransaction(
	// 	withdrawAmount = "0.005",
	// 	destination = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
	// ) {
	// 	const safeAuthKit = await getSafeAuth();
	// 	const provider = new ethers.providers.Web3Provider(
	// 		safeAuthKit.getProvider()!
	// 	);
	// 	const signer = provider.getSigner();

	// 	const safeTransactionData: SafeTransactionDataPartial = {
	// 		to: destination,
	// 		data: "0x",
	// 		value: withdrawAmount,
	// 	};

	// 	// Create a Safe transaction with the provided parameters
	// 	const safeTransaction: SafeTransaction =
	// 		await safeAuthKit.createTransaction({ safeTransactionData });

	// 	// Deterministic hash based on transaction parameters
	// 	const safeTxHash = await safeSdkOwner1.getTransactionHash(safeTransaction);

	// 	// Sign transaction to verify that the transaction is coming from owner 1
	// 	const senderSignature = await safeSdkOwner1.signTransactionHash(safeTxHash);

	// 	await safeService.proposeTransaction({
	// 		safeAddress,
	// 		safeTransactionData: safeTransaction.data,
	// 		safeTxHash,
	// 		senderAddress: await owner1Signer.getAddress(),
	// 		senderSignature: senderSignature.data,
	// 	});
	// }

	//Confirm transaction
	// async function confirmTransaction() {
	// 	const pendingTransactions = (
	// 		await safeService.getPendingTransactions(safeAddress)
	// 	).results;

	// 	// Assumes that the first pending transaction is the transaction we want to confirm
	// 	const transaction = pendingTransactions[0];
	// 	const safeTxHash = transaction.safeTxHash;

	// 	const ethAdapterOwner2 = new EthersAdapter({
	// 		ethers,
	// 		signerOrProvider: owner2Signer,
	// 	});

	// 	const safeSdkOwner2 = await Safe.create({
	// 		ethAdapter: ethAdapterOwner2,
	// 		safeAddress,
	// 	});

	// 	const signature = await safeSdkOwner2.signTransactionHash(safeTxHash);
	// 	const response = await safeService.confirmTransaction(
	// 		safeTxHash,
	// 		signature.data
	// 	);

	// 	console.log("Transaction confirmed:", response);
	// 	return { safeTxHash, confirmationResponse: response };
	// }

	// async function executeTransaction(
	// 	safeTxHash: string,
	// 	safeSdk: Safe = safeSdkOwner1
	// ) {
	// 	let safeBalance = await safeSdk.getBalance();

	// 	console.log(
	// 		`[Before Transaction] Safe Balance: ${ethers.utils.formatUnits(
	// 			safeBalance,
	// 			"ether"
	// 		)} ETH`
	// 	);

	// 	const safeTransaction = await safeService.getTransaction(safeTxHash);
	// 	const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);
	// 	const receipt = await executeTxResponse.transactionResponse?.wait();

	// 	console.log("Transaction executed:");
	// 	console.log(`https://goerli.etherscan.io/tx/${receipt?.transactionHash}`);

	// 	safeBalance = await safeSdk.getBalance();

	// 	console.log(
	// 		`[After Transaction] Safe Balance: ${ethers.utils.formatUnits(
	// 			safeBalance,
	// 			"ether"
	// 		)} ETH`
	// 	);
	// }

	//mint button handler
	async function handleMint() {
		// await proposeTransaction();
		// const { safeTxHash } = await confirmTransaction();
		// await executeTransaction(safeTxHash);

		try {
			console.log("Using signer: " + JSON.stringify(signer));
			const contract = new Contract(CONTRACT_ADDRESS, Carbon.abi, signer);
			const tokensToMint = balances[4].balance; // Assuming balances[4] is the correct index

			console.log(
				"Calling mint function...: " +
					userWalletAddress +
					" - tokens: " +
					tokensToMint
			);
			const tx = await contract.mint(userWalletAddress, tokensToMint);
			await tx.wait();

			console.log(`Minted ${tokensToMint} tokens to ${userWalletAddress}`);
		} catch (error) {
			console.error("Error minting tokens:", error);
		}
	}

	return (
		<div className="p-8">
			<table className="w-full border-collapse">
				<thead>
					<tr>
						<th className="px-4 py-2 border">Asset</th>
						<th className="px-4 py-2 border">Balance</th>
					</tr>
				</thead>
				<tbody>
					{balances.map((balance, index) => (
						<tr key={index} className="odd:bg-gray-100">
							<td className="px-4 py-2 border">{balance.asset}</td>
							<td className="px-4 py-2 border">{balance.balance}</td>
						</tr>
					))}
				</tbody>
			</table>

			<button
				className="w-full px-4 py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg"
				onClick={handleMint}
			>
				Claim Carbon Credits!
			</button>
		</div>
	);
}
