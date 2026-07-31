"use client";

import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = (stats?.overview?.resolved || 0) + (stats?.overview?.active || 0);
  const resolutionRate = stats?.overview?.resolutionRate || (total > 0 ? parseFloat(((stats.overview.resolved / total) * 100).toFixed(1)) : 23.8);

  const doughnutData = {
    labels: ["Resolved", "Active"],
    datasets: [
      {
        data: [stats?.overview?.resolved || 19, stats?.overview?.active || 61],
        backgroundColor: ["#003fb1", "#dfe9fa"],
        borderWidth: 0,
      },
    ],
  };

  const resolved = stats?.overview?.resolved || 19;
  const active = stats?.overview?.active || 61;
  const maxVal = Math.max(resolved, active, 1);
  const resolvedHeightPct = (resolved / maxVal) * 100;
  const activeHeightPct = (active / maxVal) * 100;

  return (
    <AppShell>
      <div className="max-w-container-max mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-headline-lg text-primary">Ward Accountability</h2>
            <p className="text-on-surface-variant mt-1">
              Real-time governance performance and responsive metrics for municipal wards.
            </p>
          </div>
          <div className="flex gap-2 bg-surface-container-highest p-1 rounded-lg">
            <button className="px-4 py-2 bg-surface-container-lowest text-primary rounded shadow-sm text-sm font-bold">
              Last 30 Days
            </button>
            <button className="px-4 py-2 text-on-surface-variant text-sm font-bold hover:bg-surface-variant rounded transition-colors">
              Yearly
            </button>
          </div>
        </div>

        {/* Bento Grid Overview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* Resolution Rate Card */}
          <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-label-md text-on-surface-variant">Resolution Rate</span>
              <span className="text-tertiary font-bold text-sm bg-tertiary-fixed px-2 py-1 rounded">
                +12%
              </span>
            </div>
            <div className="flex flex-col items-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <Doughnut data={doughnutData} options={{ cutout: "75%", plugins: { legend: { display: false } } }} />
                <span className="absolute text-headline-lg font-bold text-primary">
                  {resolutionRate}%
                </span>
              </div>
              <p className="text-xs text-on-surface-variant text-center mt-4">
                Average across {stats?.allWards?.length || 15} active municipal wards.
              </p>
            </div>
          </div>

          {/* Response Time Card */}
          <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-label-md text-on-surface-variant">Avg. Response Time</span>
              <span className="material-symbols-outlined text-primary">schedule</span>
            </div>
            <div className="mt-2">
              <h3 className="text-headline-lg font-bold text-on-surface">
                {stats?.overview?.avgResponseHours || 13.7} hrs
              </h3>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-primary h-full w-[65%] rounded-full transition-all duration-1000" />
              </div>
              <div className="flex justify-between mt-2 text-xs text-on-surface-variant">
                <span>Goal: 12 hrs</span>
                <span>-1.7 hrs from target</span>
              </div>
            </div>
          </div>

          {/* Open vs Closed Card */}
          <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-label-md text-on-surface-variant">Open vs. Closed</span>
              <span className="material-symbols-outlined text-secondary">analytics</span>
            </div>
            <div className="flex items-end gap-3 h-28 pt-4">
              <div
                className="flex-1 bg-primary rounded-t-lg relative group flex flex-col justify-end p-2 text-center transition-all duration-500"
                style={{ height: `${resolvedHeightPct}%` }}
              >
                <span className="text-white text-xs font-bold">{resolved}</span>
              </div>
              <div
                className="flex-1 bg-secondary-container rounded-t-lg relative group flex flex-col justify-end p-2 text-center transition-all duration-500"
                style={{ height: `${activeHeightPct}%` }}
              >
                <span className="text-on-secondary-container text-xs font-bold">{active}</span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                <span className="text-xs text-on-surface-variant">Resolved</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-secondary-container rounded-full" />
                <span className="text-xs text-on-surface-variant">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Leaderboard */}
          <section className="lg:col-span-8">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 className="text-headline-md text-on-surface">Top Performing Wards</h3>
                <button className="text-primary text-label-md hover:underline font-semibold">View All Wards</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low text-on-surface-variant text-label-sm">
                    <tr>
                      <th className="px-6 py-3 font-bold uppercase">Rank</th>
                      <th className="px-6 py-3 font-bold uppercase">Ward Name</th>
                      <th className="px-6 py-3 font-bold uppercase">Resolution</th>
                      <th className="px-6 py-3 font-bold uppercase">Rating</th>
                      <th className="px-6 py-3 font-bold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {(stats?.topWards || []).map((ward, idx) => (
                      <tr key={ward.id} className="hover:bg-background transition-colors cursor-pointer">
                        <td className="px-6 py-4 font-bold text-primary">#{idx + 1}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-on-surface">{ward.name} Ward {ward.number}</div>
                          <div className="text-xs text-on-surface-variant">Officer: {ward.officer_name}</div>
                        </td>
                        <td className="px-6 py-4 text-on-surface font-semibold">{ward.resolution_rate}%</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-secondary">
                            <span className="material-symbols-outlined text-sm material-symbols-filled">star</span>
                            <span className="ml-1 text-xs text-on-surface-variant font-bold">({ward.citizen_rating})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-xs font-bold">
                            <span className="material-symbols-outlined text-xs">verified</span> Exceptional
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* User Ward Detail */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-primary text-on-primary rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <span className="bg-white/20 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    My Ward
                  </span>
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <h3 className="text-headline-md font-bold mt-4">Koramangala Ward 151</h3>
                <p className="text-sm opacity-80 mt-1">
                  Status: <span className="font-bold">Active Monitoring</span>
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-3.5 rounded-lg border border-white/10">
                    <div className="text-xs opacity-70">Rank</div>
                    <div className="text-xl font-bold mt-1">#4 / 15</div>
                  </div>
                  <div className="bg-white/10 p-3.5 rounded-lg border border-white/10">
                    <div className="text-xs opacity-70">Resolved</div>
                    <div className="text-xl font-bold mt-1">142</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Responsible Authorities */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
              <h4 className="text-label-md font-bold text-on-surface mb-4">Responsible Authorities</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-container flex items-center justify-center font-bold text-on-primary-container">
                    SR
                  </div>
                  <div>
                    <div className="font-bold text-on-surface">Ms. Sneha Reddy</div>
                    <div className="text-xs text-on-surface-variant">Ward Executive Engineer</div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="p-2 bg-surface-container-low rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all">
                      <span className="material-symbols-outlined text-sm">mail</span>
                    </button>
                    <button className="p-2 bg-surface-container-low rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all">
                      <span className="material-symbols-outlined text-sm">call</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary-fixed flex items-center justify-center font-bold text-on-secondary-fixed">
                    DS
                  </div>
                  <div>
                    <div className="font-bold text-on-surface">Mr. David Samuel</div>
                    <div className="text-xs text-on-surface-variant">Health Inspector</div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="p-2 bg-surface-container-low rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all">
                      <span className="material-symbols-outlined text-sm">mail</span>
                    </button>
                    <button className="p-2 bg-surface-container-low rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all">
                      <span className="material-symbols-outlined text-sm">call</span>
                    </button>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-2.5 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-on-primary transition-all uppercase text-xs tracking-wider">
                View Escalation Matrix
              </button>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
