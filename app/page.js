"use client";

import { AppShell } from "@/components/AppShell";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("@/components/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
    </div>
  ),
});

const CATEGORY_ICONS = {
  street_light: "wb_sunny",
  pothole: "construction",
  garbage: "delete",
  water_leak: "water_drop",
  illegal_parking: "local_parking",
  broken_pavement: "warning",
  drainage: "water",
  safety_hazard: "health_and_safety",
  other: "more_horiz",
};

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

const STATUS_STYLES = {
  reported: { bg: "bg-surface-container-high", text: "text-on-surface-variant", icon: "schedule", label: "Reported" },
  assigned: { bg: "bg-primary-container", text: "text-on-primary-container", icon: "engineering", label: "Assigned" },
  in_progress: { bg: "bg-secondary-fixed", text: "text-on-secondary-fixed", icon: "construction", label: "In Progress" },
  resolved: { bg: "bg-tertiary-fixed", text: "text-on-tertiary-fixed", icon: "check_circle", label: "Resolved" },
};

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="pb-24 md:pb-8">
        <div className="max-w-md mx-auto w-full px-4 md:px-0 md:max-w-6xl md:mx-auto md:px-8 pt-6 space-y-6">
          {/* Welcome Section */}
          <section className="animate-fade-in-up">
            <h2 className="text-headline-md text-on-surface">Hello, Rajesh</h2>
            <p className="text-body-md text-on-surface-variant">
              Your neighborhood is currently{" "}
              <span className="text-tertiary-container font-bold">Stable</span>
            </p>
          </section>

          {/* Safety Map Card */}
          <section className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="w-full h-48 rounded-xl overflow-hidden border border-outline-variant relative shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer">
              <MapContainer reports={stats?.recentReports || []} zoom={11} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20 pointer-events-none">
                <div className="text-white">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span className="text-label-md uppercase tracking-wider">Safety Map</span>
                  </div>
                  <p className="text-headline-md leading-tight">Bangalore</p>
                </div>
                <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse" />
                  <span className="text-on-surface text-label-md">High Stability</span>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Overview */}
          <section className="hidden md:grid grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            {[
              { icon: "description", label: "Total Reports", value: stats?.overview?.totalReports || 0, color: "text-primary" },
              { icon: "check_circle", label: "Resolved", value: stats?.overview?.resolved || 0, color: "text-tertiary" },
              { icon: "pending", label: "Active", value: stats?.overview?.active || 0, color: "text-secondary" },
              { icon: "speed", label: "Resolution Rate", value: `${stats?.overview?.resolutionRate || 0}%`, color: "text-primary" },
            ].map((s) => (
              <div key={s.label} className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                  <span className="text-label-sm text-on-surface-variant">{s.label}</span>
                </div>
                <p className={`text-headline-lg font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </section>

          {/* My Grievances */}
          <section className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex justify-between items-center">
              <h3 className="text-headline-md text-on-surface">My Grievances</h3>
              <Link href="/reports" className="text-primary text-label-md hover:underline">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-surface border border-outline-variant p-4 rounded-xl animate-pulse h-24" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {(stats?.recentReports || []).slice(0, 4).map((report) => {
                  const statusStyle = STATUS_STYLES[report.status] || STATUS_STYLES.reported;
                  return (
                    <div
                      key={report.id}
                      className="bg-surface border border-outline-variant p-4 rounded-xl flex justify-between items-start transition-all hover:bg-surface-container cursor-pointer"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">
                            {CATEGORY_ICONS[report.category] || "report"}
                          </span>
                          <span className="text-label-md text-primary font-bold truncate">
                            {CATEGORY_LABELS[report.category] || report.category}
                          </span>
                        </div>
                        <p className="text-body-md text-on-surface-variant truncate">{report.title}</p>
                        <span className="text-label-sm text-outline">
                          {new Date(report.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <span className={`${statusStyle.bg} ${statusStyle.text} px-3 py-1 rounded-full text-[12px] font-bold border border-outline-variant/20 flex items-center gap-1 shrink-0 ml-2`}>
                        <span className="material-symbols-outlined text-[14px]">{statusStyle.icon}</span>
                        {statusStyle.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Recent Activity */}
          <section className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-headline-md text-on-surface">Recent Activity</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 bg-surface-container-low border border-outline-variant p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div>
                    <p className="text-label-md text-on-surface">
                      {stats?.overview?.resolved || 19} Grievances Resolved
                    </p>
                    <p className="text-label-sm text-on-surface-variant">
                      Across {stats?.allWards?.length || 15} wards in Bangalore
                    </p>
                  </div>
                </div>
              </div>

              {/* Campaign / Top Ward Card */}
              <div className="bg-white border border-outline-variant p-4 rounded-xl flex flex-col justify-between aspect-square hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-primary text-[32px] self-start">campaign</span>
                <div className="my-auto text-center">
                  <p className="text-headline-xl font-extrabold text-primary leading-none">98.2%</p>
                  <p className="text-[10px] text-outline font-bold uppercase tracking-wider mt-1">Resolution Score</p>
                </div>
                <p className="text-label-sm text-on-surface-variant leading-tight">
                  {stats?.topWards?.[0]?.name || "Indiranagar"} leads in resolution rate
                </p>
              </div>

              {/* Neighbors / Reports Card */}
              <div className="bg-white border border-outline-variant p-4 rounded-xl flex flex-col justify-between aspect-square hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-secondary text-[32px] self-start">favorite</span>
                <div className="my-auto text-center">
                  <p className="text-headline-xl font-extrabold text-secondary leading-none">+{stats?.overview?.totalReports || 80}</p>
                  <p className="text-[10px] text-outline font-bold uppercase tracking-wider mt-1">Active Citizens</p>
                </div>
                <p className="text-label-sm text-on-surface-variant leading-tight">
                  {stats?.overview?.totalReports || 80} reports from community
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Floating AI Report Button */}
        <Link
          href="/report"
          className="fixed bottom-24 right-4 z-40 md:hidden bg-secondary-container text-on-secondary-container flex items-center gap-2 px-6 py-4 rounded-full shadow-lg border-2 border-surface active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined material-symbols-filled">auto_awesome</span>
          <span className="text-label-md font-bold uppercase tracking-wide">AI Quick Report</span>
        </Link>
      </div>
    </AppShell>
  );
}
