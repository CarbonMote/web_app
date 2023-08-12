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
		return NextResponse.json(data.rows[0], { status: 200 });
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
		return NextResponse.json({ result, status: 201 });
	} catch (err) {
		console.log("Error: " + err);
		return NextResponse.json(
			{ error: "An error occurred while creating the record." },
			{ status: 500 }
		);
	}
}
