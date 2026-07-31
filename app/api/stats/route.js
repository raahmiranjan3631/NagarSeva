import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = getDb();

    const totalReports = db.prepare("SELECT COUNT(*) as count FROM reports").get().count;
    const resolved = db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'resolved'").get().count;
    const active = totalReports - resolved;
    const resolutionRate = totalReports > 0 ? ((resolved / totalReports) * 100).toFixed(1) : 0;

    const avgResponseHours = db.prepare("SELECT AVG(avg_response_hours) as avg FROM wards").get().avg || 14.2;

    const byCategory = db.prepare(`
      SELECT category, COUNT(*) as count FROM reports GROUP BY category ORDER BY count DESC
    `).all();

    const byStatus = db.prepare(`
      SELECT status, COUNT(*) as count FROM reports GROUP BY status
    `).all();

    const bySeverity = db.prepare(`
      SELECT severity, COUNT(*) as count FROM reports GROUP BY severity
    `).all();

    const byDepartment = db.prepare(`
      SELECT department, COUNT(*) as count FROM reports GROUP BY department ORDER BY count DESC
    `).all();

    const topWards = db.prepare(`
      SELECT * FROM wards ORDER BY resolution_rate DESC LIMIT 10
    `).all();

    const recentReports = db.prepare(`
      SELECT * FROM reports ORDER BY created_at DESC LIMIT 5
    `).all();

    const allWards = db.prepare("SELECT * FROM wards ORDER BY name").all();

    return NextResponse.json({
      overview: {
        totalReports,
        resolved,
        active,
        resolutionRate: parseFloat(resolutionRate),
        avgResponseHours: parseFloat(avgResponseHours.toFixed(1)),
      },
      byCategory,
      byStatus,
      bySeverity,
      byDepartment,
      topWards,
      recentReports,
      allWards,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
