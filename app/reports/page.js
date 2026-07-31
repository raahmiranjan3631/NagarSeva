"use client";

import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import Link from "next/link";

const CATEGORY_LABELS = {
  street_light: "Street Light",
  pothole: "Pothole",
  garbage: "Garbage",
  water_leak: "Water Leak",
  illegal_parking: "Illegal Parking",
  broken_pavement: "Broken Pavement",
  drainage: "Drainage",
  safety_hazard: "Safety Hazard",
  other: "Other",
};

const STATUS_BADGES = {
  reported: { bg: "bg-surface-container-high text-on-surface-variant", label: "Reported" },
  assigned: { bg: "bg-primary-container text-on-primary-container", label: "Assigned" },
  in_progress: { bg: "bg-secondary-fixed text-secondary", label: "In Progress" },
  resolved: { bg: "bg-tertiary-fixed text-tertiary", label: "Resolved" },
};

export default function ReportsListPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/reports?limit=100")
      .then((r) => r.json())
      .then((d) => setReports(d.reports || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.address?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AppShell>
      <div className="max-w-container-max mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-headline-lg text-primary">Grievances Registry</h1>
            <p className="text-body-md text-on-surface-variant">Track, filter, and monitor resolution progress across all reported issues.</p>
          </div>
          <Link href="/report" className="px-5 py-2.5 bg-secondary-container text-on-secondary-container text-label-md font-bold rounded-full flex items-center gap-2 w-fit">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Grievance
          </Link>
        </div>

        {/* Filter Controls */}
        <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl mb-6 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input */}
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-outline">search</span>
              <input
                type="text"
                placeholder="Search by title, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Status Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
              {["all", "reported", "assigned", "in_progress", "resolved"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-colors ${
                    statusFilter === st ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Table/Grid */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface border border-outline-variant h-20 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">assignment_late</span>
            <p className="text-body-lg text-on-surface font-semibold">No grievances found</p>
            <p className="text-xs text-on-surface-variant mt-1">Try clearing your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((report) => {
              const badge = STATUS_BADGES[report.status] || STATUS_BADGES.reported;
              return (
                <div key={report.id} className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-fixed/30 px-2.5 py-1 rounded">
                        {CATEGORY_LABELS[report.category] || report.category}
                      </span>
                      <span className={`${badge.bg} px-3 py-1 rounded-full text-[11px] font-bold`}>
                        {badge.label}
                      </span>
                    </div>
                    <h3 className="text-body-lg font-bold text-on-surface line-clamp-1">{report.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{report.description || report.ai_summary}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline-variant/50 flex justify-between items-center text-xs text-outline">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {report.ward_name || "Bangalore"} • {report.address || "Main Road"}
                    </span>
                    <span>{new Date(report.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
