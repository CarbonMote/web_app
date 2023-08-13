import { useState } from "react";
import { Contract, Wallet, ethers } from "ethers";
const Carbon = require("../contracts/Carbon.json");
import getSafeAuth from "@/utils/safeAuth";
import {
	SafeTransaction,
	SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import Safe from "@safe-global/protocol-kit";
import EASHandler from "@/utils/EASHandler";
// import { SafeAuthKit, Web3AuthModalPack } from "@/utils/safe-core";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { Web3AuthModalPack } from "@safe-global/auth-kit";

const CONTRACT_ADDRESS = "0x2684cF2D1cfaFbA1809C11D4225eC0B537Eba83b"; //"0xD33e55E09A4f81dD0A80dC15dae2552A0b7Ab502"; //"0xfB34915FbE18F42a311c1b3d3bBAa8037513622d";
const contractMethod = "mint"; // The contract method you want to call
const EASContractAddress = "0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A"; // Base Goerli
const schemaUID =
	"0x11fb32126da1d35918fc58921fae7f06178d66d67f1db0d2d20724daf82c14c0";

interface Balance {
	asset: string;
	balance: number;
}
interface Props {
	userWalletAddress: string;
	safeAuth: Web3AuthModalPack;
	balances: Balance[];
}

function doubleToUint16(value: number): number {
	return Math.floor(value) & 0xffff;
}

declare global {
	interface Window {
		ethereum?: any;
	}
}

export default function TokenMint({
	userWalletAddress,
	safeAuth,
	balances,
}: Props) {
	async function attestData(DistanceWalked, inputType, inputDate) {
		if (window.ethereum) {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();

			const eas = new EAS(EASContractAddress);
			eas.connect(signer);

			const schemaEncoder = new SchemaEncoder(
				"uint16 DistanceWalked,string Type,string Date"
			);
			const encodedData = schemaEncoder.encodeData([
				{
					name: "DistanceWalked",
					value: doubleToUint16(DistanceWalked),
					type: "uint16",
				},
				{ name: "Type", value: inputType, type: "string" },
				{ name: "Date", value: inputDate, type: "string" },
			]);
			const addr = await signer.getAddress();
			console.log("trying to send attestation...: " + addr);
			const tx = await eas.attest({
				schema: schemaUID,
				data: {
					recipient: addr,
					revocable: false,
					data: encodedData,
				},
			});

			console.log("waiting for tx");
			const newAttestationUID = await tx.wait();
			console.log("New attestation UID:", newAttestationUID);

			return newAttestationUID;
		} else {
			console.error(
				"Ethereum provider not detected. Please make sure you have MetaMask or a similar wallet installed."
			);
		}
	}

	//mint button handler
	async function handleMint() {
		const newTokenData = await attestData(balances[0].balance, "iot", "today");

		// try {
		const tokensToMint = balances[4].balance; // Assuming balances[4] is the correct index
		// }
		if (window.ethereum) {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const contract = new ethers.Contract(
				CONTRACT_ADDRESS,
				Carbon.abi,
				signer
			);

			const toAddress = await signer.getAddress();
			// await contract.mint(toAddress, amountToMint);
			await contract.mintTokens(
				toAddress,
				newTokenData,
				tokensToMint.toString()
			);
			console.log("mint complete!");
		} else {
			console.error(
				"Ethereum provider not detected. Please make sure you have MetaMask or a similar wallet installed."
			);
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
