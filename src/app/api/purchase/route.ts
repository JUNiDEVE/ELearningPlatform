import { getConnection } from "../../../../lib/db";
import { NextRequest } from "next/server";
import sql from "mssql";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId, userId, amount } = body;

    const pool = await getConnection();

    const request = pool.request();
    request.input("UserId", sql.UniqueIdentifier, userId);
    request.input("CourseId", sql.UniqueIdentifier, courseId);
    request.input("Amount", sql.Decimal(10, 2), amount);

    const result = await request.query(
      `INSERT INTO Purchases (Id, UserId, CourseId, Amount)
      VALUES (NEWID(), @UserId, @CourseId, @Amount);`
    );

    return new Response(JSON.stringify({ message: "Purchase successful" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to insert purchase" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}