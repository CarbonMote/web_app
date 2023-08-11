import { useState } from "react";

interface Balance {
	asset: string;
	balance: number;
}

interface Safe {
	safeAddress: string;
}

interface Props {
	safe: Safe;
	balances: Balance[];
	handleTransfer: () => void;
}

export default function TokenMint({ safe, balances, handleTransfer }: Props) {
	const [recipient, setRecipient] = useState("");

	return (
		<div className="p-8">
			{/* <h2 className="text-sm font-bold">Safe: {safe.safeAddress}</h2> */}

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

			<input
				type="text"
				className="w-full px-4 py-2 border mt-4"
				placeholder="Recipient"
				onChange={(e) => {
					setRecipient(e.target.value);
				}}
				value={recipient}
			/>

			<button
				className="w-full px-4 py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg"
				onClick={handleTransfer}
			>
				Send the assets
			</button>
		</div>
	);
}
