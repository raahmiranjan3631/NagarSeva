"use client";

import { AppShell } from "@/components/AppShell";
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

export default function SafetyMapPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [timeOfDay, setTimeOfDay] = useState("day");

  useEffect(() => {
    fetch("/api/reports?limit=100")
      .then((r) => r.json())
      .then((d) => setReports(d.reports || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredReports = reports.filter((r) => {
    if (filterCategory !== "all" && r.category !== filterCategory) return false;
    return true;
  });

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden pb-16 md:pb-0">
        {/* Left Filter & Router Controls Sidebar */}
        <div className="w-full md:w-80 border-r border-outline-variant bg-surface p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
          <div>
            <h2 className="text-headline-md text-primary font-bold">Safety Explorer</h2>
            <p className="text-label-sm text-on-surface-variant">Live civic hazard map & safer route planner</p>
          </div>

          {/* Route Planner Box */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-primary font-bold text-label-md">
              <span className="material-symbols-outlined">route</span>
              Safer Route Planner
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Current Location"
                defaultValue="Indiranagar 100ft Road"
                className="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-background"
              />
              <input
                type="text"
                placeholder="Enter destination..."
                defaultValue="Koramangala 80ft Road"
                className="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-background"
              />
            </div>
            <button className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">explore</span>
              Calculate Safer Path
            </button>
          </div>

          {/* Time of Day toggle */}
          <div>
            <label className="text-label-sm text-on-surface-variant font-semibold block mb-2">Time of Day</label>
            <div className="flex gap-2 p-1 bg-surface-container-highest rounded-lg">
              <button
                onClick={() => setTimeOfDay("day")}
                className={`flex-1 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 ${
                  timeOfDay === "day" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-sm">light_mode</span> Day
              </button>
              <button
                onClick={() => setTimeOfDay("night")}
                className={`flex-1 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 ${
                  timeOfDay === "night" ? "bg-inverse-surface text-white shadow-sm" : "text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-sm">dark_mode</span> Night
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-label-sm text-on-surface-variant font-semibold block mb-2">Issue Overlay</label>
            <div className="space-y-1.5">
              {[
                { id: "all", label: "All Grievances" },
                { id: "street_light", label: "Poor Lighting" },
                { id: "pothole", label: "Road Damage" },
                { id: "garbage", label: "Waste Accumulation" },
                { id: "safety_hazard", label: "Safety Hazards" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilterCategory(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    filterCategory === c.id
                      ? "bg-primary-container text-on-primary-container font-bold"
                      : "hover:bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  <span>{c.label}</span>
                  {filterCategory === c.id && <span className="material-symbols-outlined text-sm">check</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Interactive Map Display */}
        <div className="flex-1 relative bg-surface-container-high flex items-stretch overflow-hidden">
          <MapContainer reports={filteredReports} />

          {/* Route Overlay Info Box */}
          <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-outline-variant z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center font-bold">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-tertiary">Optimal Safe Path Found</p>
                <p className="text-xs text-on-surface-variant font-medium">Via Indiranagar 100ft Rd • 12 mins • 98% Lighted</p>
              </div>
              <button className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shrink-0">
                Navigate
              </button>
            </div>
          </div>
        </div>

        {/* Right Info Sidebar (Ward Safety Score) */}
        <div className="hidden lg:flex w-80 border-l border-outline-variant bg-surface p-4 flex-col gap-4 shrink-0 overflow-y-auto">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-outline">Selected Area</span>
            <h3 className="text-headline-md font-bold text-on-surface">Koramangala</h3>
            <p className="text-xs text-on-surface-variant">Ward 151 • South-East Zone</p>
          </div>

          {/* Safety Score Card */}
          <div className="bg-primary-fixed/20 border border-primary/20 rounded-xl p-4 text-center">
            <span className="text-xs font-semibold text-on-surface-variant">OVERALL SAFETY SCORE</span>
            <div className="text-headline-xl font-bold text-primary my-1">82/100</div>
            <span className="text-xs text-tertiary font-bold">↗ +5.2% this month</span>
          </div>

          {/* Risk Factors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-on-surface-variant">Risk Factors</h4>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>Dark Spots</span>
                  <span className="text-secondary font-bold">High (22 detected)</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full w-[70%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>CCTV Coverage</span>
                  <span className="text-tertiary font-bold">Good (88%)</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full w-[88%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>Emergency Response</span>
                  <span className="text-primary font-bold">4.2 min avg</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[90%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
