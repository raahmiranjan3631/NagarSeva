"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const sidebarLinks = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/reports", icon: "assignment_late", label: "My Grievances" },
  { href: "/map", icon: "map", label: "Safety Map" },
  { href: "/dashboard", icon: "groups", label: "Community" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

const topNavLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/map", label: "Heatmap" },
  { href: "/dashboard#leaderboard", label: "Leaderboard" },
  { href: "/map#routes", label: "Safety Routes" },
];

const mockNotifications = [
  { id: 1, text: "Grievance #892 Resolved at HSR Layout", time: "2h ago", icon: "check_circle", color: "text-tertiary" },
  { id: 2, text: "Official Ward Meeting tomorrow, 10 AM", time: "5h ago", icon: "campaign", color: "text-primary" },
  { id: 3, text: "12 Neighbors thanked your last report", time: "1d ago", icon: "favorite", color: "text-secondary" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen p-4 gap-2 bg-surface-container-low w-64 shrink-0 border-r border-outline-variant">
      {/* Logo */}
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-white">
          <span className="material-symbols-outlined material-symbols-filled">account_balance</span>
        </div>
        <div>
          <h1 className="text-headline-md font-bold text-primary leading-tight" style={{ fontSize: "20px" }}>NagarSeva</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Civic Trust System</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-full text-label-md transition-colors ${
                isActive
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? "material-symbols-filled" : ""}`}>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-outline-variant pt-4 space-y-1">
        <Link
          href="/report"
          className="w-full bg-secondary-container text-on-secondary-container text-label-md py-3 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined">auto_awesome</span>
          AI Quick Report
        </Link>
        <Link
          href="/support"
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant text-label-md hover:bg-surface-variant transition-colors rounded-full w-full"
        >
          <span className="material-symbols-outlined">help</span>
          Help & Support
        </Link>
      </div>
    </aside>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [hash, setHash] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setHash(window.location.hash);
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      setUser(JSON.parse(authUser));
    }
  }, []);

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-8 h-16 bg-surface border-b border-outline-variant relative">
      <div className="flex items-center gap-8">
        {/* Mobile Logo */}
        <div className="flex md:hidden items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[32px]">account_balance</span>
          <h1 className="text-headline-lg-mobile font-bold text-primary">NagarSeva</h1>
        </div>

        {/* Search */}
        <div className="hidden md:flex relative items-center bg-surface-container-high rounded-full px-4 py-2 w-64">
          <span className="material-symbols-outlined text-outline">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none" placeholder="Search ward or officer..." type="text" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {topNavLinks.map((link) => {
            const linkPath = link.href.split("#")[0];
            const linkHash = link.href.includes("#") ? "#" + link.href.split("#")[1] : "";
            const isActive = pathname === linkPath && hash === linkHash;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-body-md transition-colors ${
                  isActive ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Link href="/report" className="hidden sm:flex px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-label-md font-bold items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">edit_note</span>
          Report
        </Link>

        {/* Notification Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-variant transition-colors relative"
          >
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary-container rounded-full border-2 border-surface" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-50 p-2 space-y-1">
              <div className="px-3 py-1.5 border-b border-outline-variant/50 flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-on-surface">Notifications</span>
                <button onClick={() => setShowNotifications(false)} className="text-[10px] text-primary font-bold hover:underline">Clear all</button>
              </div>
              {mockNotifications.map((n) => (
                <div key={n.id} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-surface-container transition-colors text-xs cursor-pointer">
                  <span className={`material-symbols-outlined ${n.color} shrink-0`}>{n.icon}</span>
                  <div>
                    <p className="text-on-surface leading-snug">{n.text}</p>
                    <span className="text-[10px] text-outline mt-0.5 block">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link href="/profile" className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold border-2 border-surface text-sm">
          {user ? user.name.split(" ").map(n => n[0]).join("") : "RK"}
        </Link>
      </div>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", icon: "home", label: "Home" },
    { href: "/reports", icon: "description", label: "Reports" },
    { href: "/report", icon: "auto_awesome", label: "Quick AI", isSpecial: true },
    { href: "/map", icon: "distance", label: "Map" },
    { href: "/profile", icon: "person", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 md:hidden bg-surface shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-outline-variant">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.label}
            href={link.href}
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-full transition-all ${
              link.isSpecial
                ? "bg-secondary-container text-on-secondary-container scale-90"
                : isActive
                ? "bg-secondary-container text-on-secondary-container"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className={`material-symbols-outlined ${isActive || link.isSpecial ? "material-symbols-filled" : ""}`}>
              {link.icon}
            </span>
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("auth_user");
    if (!user) {
      // Login screen disabled: auto-authenticate default user
      localStorage.setItem("auth_user", JSON.stringify({
        name: "Rajesh M.",
        email: "rajesh.m@example.com",
        ward: "Koramangala Ward 151"
      }));
    }
    setAuthChecked(true);
  }, [router]);

  if (!authChecked) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
