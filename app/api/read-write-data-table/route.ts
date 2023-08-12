import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
	try {
		const id = req.headers.get("id"); // Assuming the ID is passed as a header
		let query;

		if (id) {
			query = sql`SELECT * FROM "User" WHERE id = ${Number(id)}`;
		} else {
			query = sql`SELECT * FROM "User"`;
		}

		const data = await query;
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "An error occurred while fetching data." },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { distance, BufferedCredits, TotalCredits } = body;
		const result = await sql`
                    INSERT INTO "User" (distance, BufferedCredits, TotalCredits)
                    VALUES (${distance}, ${BufferedCredits}, ${TotalCredits})
                    RETURNING *;
                `;
		return NextResponse.json(result[0], { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "An error occurred while creating the record." },
			{ status: 500 }
		);
	}
}

// export async function handler(req: NextRequest, res: NextResponse) {
// 	// Run the middleware
// 	// await runMiddleware(req, res, cors);

// 	const { method } = req;

// 	switch (method) {
// 		case "GET":
// 			try {
// 				const { id } = req.headers; // Assuming the ID is passed as a query parameter
// 				let query;

// 				if (id) {
// 					query = sql`SELECT * FROM "User" WHERE id = ${Number(id)}`;
// 				} else {
// 					query = sql`SELECT * FROM "User"`;
// 				}

// 				const data = await query;
// 				return res.status(200).json(data);
// 			} catch (error) {
// 				return res
// 					.status(500)
// 					.json({ error: "An error occurred while fetching data." });
// 			}

// 		case "POST":
// 			try {
// 				const { distance, BufferedCredits, TotalCredits } = req.body;
// 				const result = await sql`
//                     INSERT INTO "User" (distance, BufferedCredits, TotalCredits)
//                     VALUES (${distance}, ${BufferedCredits}, ${TotalCredits})
//                     RETURNING *;
//                 `;
// 				return res.status(201).json(result[0]);
// 			} catch (error) {
// 				return res
// 					.status(500)
// 					.json({ error: "An error occurred while creating the record." });
// 			}
// 		// Add cases for PUT (Update) and DELETE operations here
// 		default:
// 			res.setHeader("Allow", ["GET", "POST"]);
// 			console.log(`Method ${method} Not Allowed`);
// 			return res.status(405).json({ error: `Method ${method} Not Allowed` });
// 	}
// }
