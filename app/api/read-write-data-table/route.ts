import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req;

	switch (method) {
		case "GET":
			try {
				const { id } = req.query; // Assuming the ID is passed as a query parameter
				let query;

				if (id) {
					query = sql`SELECT * FROM "User" WHERE id = ${Number(id)}`;
				} else {
					query = sql`SELECT * FROM "User"`;
				}

				const data = await query;
				return res.status(200).json(data);
			} catch (error) {
				return res
					.status(500)
					.json({ error: "An error occurred while fetching data." });
			}

		case "POST":
			try {
				const { distance, BufferedCredits, TotalCredits } = req.body;
				const result = await sql`
                    INSERT INTO "User" (distance, BufferedCredits, TotalCredits)
                    VALUES (${distance}, ${BufferedCredits}, ${TotalCredits})
                    RETURNING *;
                `;
				return res.status(201).json(result[0]);
			} catch (error) {
				return res
					.status(500)
					.json({ error: "An error occurred while creating the record." });
			}
		// Add cases for PUT (Update) and DELETE operations here
		default:
			res.setHeader("Allow", ["GET", "POST"]);
			return res.status(405).end(`Method ${method} Not Allowed`);
	}
}
