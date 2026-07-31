import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const ward = searchParams.get("ward");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = "SELECT * FROM reports WHERE 1=1";
    const params = [];

    if (category) { query += " AND category = ?"; params.push(category); }
    if (status) { query += " AND status = ?"; params.push(status); }
    if (ward) { query += " AND ward_id = ?"; params.push(ward); }

    query += " ORDER BY created_at DESC LIMIT ?";
    params.push(limit);

    const reports = db.prepare(query).all(...params);
    return NextResponse.json({ reports });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();

    const { title, description, category, severity, department, ward_id, ward_name, lat, lng, address, photo_url, ai_summary, ai_confidence, ai_category, reporter_name } = body;

    const result = db.prepare(`
      INSERT INTO reports (title, description, category, severity, department, ward_id, ward_name, lat, lng, address, photo_url, ai_summary, ai_confidence, ai_category, reporter_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, description, category, severity || "medium", department,
      ward_id || null, ward_name || null, lat || null, lng || null, address || null,
      photo_url || null, ai_summary || null, ai_confidence || 0, ai_category || null,
      reporter_name || "Anonymous Citizen"
    );

    // Update ward counts
    if (ward_id) {
      db.prepare(`
        UPDATE wards SET
          total_reports = total_reports + 1,
          active_reports = active_reports + 1
        WHERE id = ?
      `).run(ward_id);
    }

    return NextResponse.json({ id: result.lastInsertRowid, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
