import { NextRequest } from "next/server";
import sql from "mssql";
import { getConnection } from "../../../../lib/db"; // make sure this exists

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Id", sql.NVarChar(100), userId)

      .query(
        "SELECT * FROM Users WHERE Id = @Id"
      );

    const user = result.recordset[0];

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Sorry,could not find you" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "We found you", user }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
