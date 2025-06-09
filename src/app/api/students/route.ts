import { NextRequest } from "next/server";
import { getConnection } from "../../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();
    
    // Get tutorId from URL parameters
    const url = new URL(req.url);
    const tutorId = url.searchParams.get('tutorId');
    
    if (!tutorId) {
      return new Response(
        JSON.stringify({ error: "tutorId parameter is required" }), 
        { 
          status: 400, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    const result = await pool
      .request()
      .input('tutorId', tutorId)
      .query(`
SELECT DISTINCT 
    usr.Id as UserId,
    usr.Email,
    usr.Name,
    usr.PasswordHash,
    usr.Role,
    usr.CreatedAt,
    usr.UpdatedAt,
    usr.IsActive,
    usr.Password,
    usr.Profession,
    p.CourseId,
    p.Amount,
    p.PaymentStatus,
    p.PaymentMethod,
    p.TransactionId,
    p.PurchaseDate,
    c.Title as CourseTitle,
    c.Description as CourseDescription,
    c.Price as CoursePrice,
    c.Level as CourseLevel,
    c.Category as CourseCategory
FROM [amozeshgah].[dbo].[Purchases] p
INNER JOIN [amozeshgah].[dbo].[Courses] c ON p.CourseId = c.Id
INNER JOIN [amozeshgah].[dbo].[Users] usr ON p.UserId = usr.Id
WHERE c.TutorId = @tutorId
    AND p.PaymentStatus = 'COMPLETED'
ORDER BY p.PurchaseDate DESC;
      `);
console.log(result.recordset);
    return Response.json(result.recordset);
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch students" }), 
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}