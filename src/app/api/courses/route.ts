import { getConnection } from "../../../../lib/db";
export async function GET() {
  
  try {
  
const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM courses');
  

    return Response.json(result.recordset);
   
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: 'Failed to fetch courses' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}