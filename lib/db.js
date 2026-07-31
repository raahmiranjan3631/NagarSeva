import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "nagarseva.db");

let db;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDb(db);
  }
  return db;
}

function initializeDb(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS wards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      number INTEGER,
      zone TEXT,
      city TEXT DEFAULT 'Bangalore',
      officer_name TEXT,
      officer_title TEXT,
      cleanliness_score REAL DEFAULT 75,
      safety_rating REAL DEFAULT 80,
      resolution_rate REAL DEFAULT 70,
      avg_response_hours REAL DEFAULT 18,
      total_reports INTEGER DEFAULT 0,
      resolved_reports INTEGER DEFAULT 0,
      active_reports INTEGER DEFAULT 0,
      citizen_rating REAL DEFAULT 4.0,
      status TEXT DEFAULT 'Active Monitoring',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      severity TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'reported',
      department TEXT,
      ward_id INTEGER,
      ward_name TEXT,
      lat REAL,
      lng REAL,
      address TEXT,
      photo_url TEXT,
      ai_summary TEXT,
      ai_confidence REAL DEFAULT 0,
      ai_category TEXT,
      cluster_id TEXT,
      upvotes INTEGER DEFAULT 0,
      reporter_name TEXT DEFAULT 'Anonymous Citizen',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved_at DATETIME,
      FOREIGN KEY (ward_id) REFERENCES wards(id)
    );

    CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
    CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
    CREATE INDEX IF NOT EXISTS idx_reports_ward ON reports(ward_id);
    CREATE INDEX IF NOT EXISTS idx_reports_location ON reports(lat, lng);
  `);

  // Seed wards if empty
  const wardCount = db.prepare("SELECT COUNT(*) as count FROM wards").get();
  if (wardCount.count === 0) {
    seedWards(db);
    seedReports(db);
  }
}

function seedWards(db) {
  const wards = [
    { name: "Indiranagar", number: 80, zone: "East", officer: "Dr. Rajesh Kumar", title: "Ward Officer", cleanliness: 95, safety: 96, resolution: 98.2, response: 6.5, rating: 4.8 },
    { name: "Malleshwaram", number: 65, zone: "West", officer: "Priya Singh", title: "Ward Officer", cleanliness: 90, safety: 92, resolution: 94.5, response: 8.2, rating: 4.5 },
    { name: "HSR Layout", number: 174, zone: "South", officer: "Anil Deshmukh", title: "Ward Officer", cleanliness: 85, safety: 88, resolution: 89.1, response: 10.5, rating: 4.2 },
    { name: "Koramangala", number: 151, zone: "South-East", officer: "Ms. Sneha Reddy", title: "Ward Executive Engineer", cleanliness: 82, safety: 85, resolution: 84.3, response: 12.8, rating: 4.0 },
    { name: "Jayanagar", number: 170, zone: "South", officer: "Vikram Patel", title: "Ward Officer", cleanliness: 88, safety: 90, resolution: 91.2, response: 9.1, rating: 4.3 },
    { name: "Whitefield", number: 85, zone: "East", officer: "Lakshmi Narayan", title: "Ward Officer", cleanliness: 72, safety: 78, resolution: 76.8, response: 16.5, rating: 3.6 },
    { name: "Electronic City", number: 192, zone: "South", officer: "Suresh Babu", title: "Ward Officer", cleanliness: 68, safety: 74, resolution: 72.1, response: 18.2, rating: 3.4 },
    { name: "Vasanth Nagar", number: 92, zone: "Central", officer: "Anita Sharma", title: "Ward Executive Engineer", cleanliness: 80, safety: 84, resolution: 82.5, response: 13.0, rating: 3.9 },
    { name: "JP Nagar", number: 178, zone: "South", officer: "Ramesh Gowda", title: "Ward Officer", cleanliness: 75, safety: 80, resolution: 78.0, response: 15.0, rating: 3.7 },
    { name: "Basavanagudi", number: 161, zone: "South", officer: "Deepa Nair", title: "Ward Officer", cleanliness: 86, safety: 89, resolution: 88.4, response: 11.0, rating: 4.1 },
    { name: "Rajajinagar", number: 48, zone: "West", officer: "Ganesh Murthy", title: "Ward Officer", cleanliness: 78, safety: 82, resolution: 80.3, response: 14.0, rating: 3.8 },
    { name: "Majestic", number: 108, zone: "Central", officer: "Fatima Khan", title: "Ward Officer", cleanliness: 62, safety: 68, resolution: 65.2, response: 22.0, rating: 3.1 },
    { name: "Hebbal", number: 24, zone: "North", officer: "Arvind Rao", title: "Ward Officer", cleanliness: 74, safety: 78, resolution: 75.6, response: 16.0, rating: 3.5 },
    { name: "Yelahanka", number: 4, zone: "North", officer: "Meena Kumari", title: "Ward Officer", cleanliness: 70, safety: 75, resolution: 71.8, response: 17.5, rating: 3.4 },
    { name: "BTM Layout", number: 176, zone: "South", officer: "Kiran Kumar", title: "Ward Officer", cleanliness: 77, safety: 80, resolution: 79.5, response: 14.5, rating: 3.7 },
  ];

  const insert = db.prepare(`
    INSERT INTO wards (name, number, zone, officer_name, officer_title, cleanliness_score, safety_rating, resolution_rate, avg_response_hours, citizen_rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const w of wards) {
    insert.run(w.name, w.number, w.zone, w.officer, w.title, w.cleanliness, w.safety, w.resolution, w.response, w.rating);
  }
}

function seedReports(db) {
  const categories = ["street_light", "pothole", "garbage", "water_leak", "illegal_parking", "broken_pavement", "drainage", "safety_hazard"];
  const severities = ["low", "medium", "high", "critical"];
  const statuses = ["reported", "assigned", "in_progress", "resolved"];
  const departments = ["Electricity Board", "Public Works Department", "Municipal Sanitation", "Traffic Police", "Water Board", "Drainage Department"];

  const bangaloreLocations = [
    { lat: 12.9716, lng: 77.5946, ward: "Indiranagar", wardId: 1, address: "100 Feet Road, Indiranagar" },
    { lat: 12.9956, lng: 77.5700, ward: "Malleshwaram", wardId: 2, address: "8th Cross, Malleshwaram" },
    { lat: 12.9116, lng: 77.6389, ward: "HSR Layout", wardId: 3, address: "Sector 2, HSR Layout" },
    { lat: 12.9352, lng: 77.6245, ward: "Koramangala", wardId: 4, address: "80 Feet Road, Koramangala" },
    { lat: 12.9308, lng: 77.5838, ward: "Jayanagar", wardId: 5, address: "4th Block, Jayanagar" },
    { lat: 12.9698, lng: 77.7500, ward: "Whitefield", wardId: 6, address: "ITPL Main Road, Whitefield" },
    { lat: 12.8440, lng: 77.6600, ward: "Electronic City", wardId: 7, address: "Phase 1, Electronic City" },
    { lat: 12.9877, lng: 77.5914, ward: "Vasanth Nagar", wardId: 8, address: "MG Road, Vasanth Nagar" },
    { lat: 12.9100, lng: 77.5851, ward: "JP Nagar", wardId: 9, address: "15th Cross, JP Nagar" },
    { lat: 12.9424, lng: 77.5746, ward: "Basavanagudi", wardId: 10, address: "Bull Temple Road, Basavanagudi" },
    { lat: 12.9910, lng: 77.5544, ward: "Rajajinagar", wardId: 11, address: "Industrial Town, Rajajinagar" },
    { lat: 12.9766, lng: 77.5713, ward: "Majestic", wardId: 12, address: "KG Road, Majestic" },
    { lat: 13.0358, lng: 77.5970, ward: "Hebbal", wardId: 13, address: "Outer Ring Road, Hebbal" },
    { lat: 13.1007, lng: 77.5963, ward: "Yelahanka", wardId: 14, address: "Main Road, Yelahanka" },
    { lat: 12.9166, lng: 77.6101, ward: "BTM Layout", wardId: 15, address: "1st Stage, BTM Layout" },
  ];

  const reportTemplates = [
    { cat: "street_light", title: "Broken street lamp on {road}", desc: "Street lamp post #{num} is not working for the past {days} days. The area becomes very dark at night, making it unsafe for pedestrians.", dept: "Electricity Board" },
    { cat: "street_light", title: "Flickering light near {road}", desc: "The street light near the junction is flickering constantly, creating visibility issues for motorists at night.", dept: "Electricity Board" },
    { cat: "pothole", title: "Large pothole on {road}", desc: "A dangerous pothole has formed on the main road, approximately {size}ft wide. Several vehicles have been damaged. Urgent repair needed.", dept: "Public Works Department" },
    { cat: "pothole", title: "Road cave-in near {road}", desc: "The road has partially caved in near the drainage cover. This is a major hazard for two-wheelers and pedestrians.", dept: "Public Works Department" },
    { cat: "garbage", title: "Garbage overflow at {road}", desc: "The municipal garbage bin at this location has been overflowing for {days} days. Stray dogs are scattering waste. Foul smell affecting nearby residents.", dept: "Municipal Sanitation" },
    { cat: "garbage", title: "Illegal dumping near {road}", desc: "Construction waste and household debris have been illegally dumped on the roadside. This is becoming a health hazard.", dept: "Municipal Sanitation" },
    { cat: "water_leak", title: "Water pipe burst on {road}", desc: "A main water supply pipe has burst, causing continuous water flow on the road. Water is being wasted and the road is becoming slippery.", dept: "Water Board" },
    { cat: "water_leak", title: "Sewage overflow near {road}", desc: "Sewage water is overflowing from the manhole cover onto the road and footpath. Extremely unhygienic conditions.", dept: "Drainage Department" },
    { cat: "illegal_parking", title: "Illegal parking blocking {road}", desc: "Vehicles are being parked illegally on the footpath and road, blocking pedestrian movement and causing traffic congestion.", dept: "Traffic Police" },
    { cat: "broken_pavement", title: "Damaged footpath on {road}", desc: "The footpath tiles are broken and uneven, causing tripping hazard. Elderly citizens and children are at risk.", dept: "Public Works Department" },
    { cat: "drainage", title: "Blocked drain on {road}", desc: "The storm water drain is completely blocked with debris. During rains, the entire area gets waterlogged for hours.", dept: "Drainage Department" },
    { cat: "safety_hazard", title: "Open manhole on {road}", desc: "A manhole cover is missing on the main road. This is extremely dangerous, especially at night. Immediate action required.", dept: "Public Works Department" },
    { cat: "safety_hazard", title: "Exposed electrical wires near {road}", desc: "Electrical wires are hanging low and exposed near the bus stop. Risk of electrocution during rains.", dept: "Electricity Board" },
  ];

  const names = ["Rajesh M.", "Priya K.", "Arun S.", "Kavitha R.", "Mohammed H.", "Lakshmi V.", "Suresh B.", "Deepa N.", "Ganesh P.", "Meena T.", "Anonymous Citizen"];

  const insert = db.prepare(`
    INSERT INTO reports (title, description, category, severity, status, department, ward_id, ward_name, lat, lng, address, ai_confidence, reporter_name, created_at, upvotes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = Date.now();

  for (let i = 0; i < 80; i++) {
    const loc = bangaloreLocations[Math.floor(Math.random() * bangaloreLocations.length)];
    const template = reportTemplates[Math.floor(Math.random() * reportTemplates.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const reporter = names[Math.floor(Math.random() * names.length)];

    // Add small random offset to location
    const lat = loc.lat + (Math.random() - 0.5) * 0.01;
    const lng = loc.lng + (Math.random() - 0.5) * 0.01;

    const title = template.title
      .replace("{road}", loc.address)
      .replace("{num}", Math.floor(Math.random() * 900 + 100))
      .replace("{days}", Math.floor(Math.random() * 14 + 1))
      .replace("{size}", Math.floor(Math.random() * 4 + 1));

    const desc = template.desc
      .replace("{days}", Math.floor(Math.random() * 14 + 1))
      .replace("{size}", Math.floor(Math.random() * 4 + 1));

    const hoursAgo = Math.floor(Math.random() * 720); // up to 30 days
    const createdAt = new Date(now - hoursAgo * 60 * 60 * 1000).toISOString();
    const confidence = 0.7 + Math.random() * 0.25;
    const upvotes = Math.floor(Math.random() * 30);

    insert.run(title, desc, template.cat, severity, status, template.dept, loc.wardId, loc.ward, lat, lng, loc.address, confidence, reporter, createdAt, upvotes);
  }

  // Update ward report counts
  const updateWard = db.prepare(`
    UPDATE wards SET
      total_reports = (SELECT COUNT(*) FROM reports WHERE ward_id = wards.id),
      resolved_reports = (SELECT COUNT(*) FROM reports WHERE ward_id = wards.id AND status = 'resolved'),
      active_reports = (SELECT COUNT(*) FROM reports WHERE ward_id = wards.id AND status != 'resolved')
  `);
  updateWard.run();
}
