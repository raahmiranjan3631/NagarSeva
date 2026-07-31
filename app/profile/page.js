"use client";

import { AppShell } from "@/components/AppShell";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const router = useRouter();

  useEffect(() => {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      const parsed = JSON.parse(authUser);
      setUser(parsed);
      setName(parsed.name || "");
      setEmail(parsed.email || "");
      setMobile(parsed.mobile || "+91 98765 43210");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_user");
    router.push("/");
  };

  const handleSave = () => {
    const updated = { ...user, name, email, mobile };
    localStorage.setItem("auth_user", JSON.stringify(updated));
    setUser(updated);
    setIsEditing(false);
    window.location.reload();
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto w-full px-4 py-8 space-y-6 animate-fade-in-up">
        {/* Profile Card */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl text-center shadow-sm">
          <div className="w-24 h-24 rounded-full bg-primary-container text-on-primary-container font-bold text-headline-lg flex items-center justify-center mx-auto border-4 border-surface shadow-md">
            {user ? name.split(" ").map(n => n[0]).join("") : "RK"}
          </div>
          <h2 className="text-headline-md text-on-surface mt-4">{name || "Rajesh Kumar"}</h2>
          <p className="text-body-md text-on-surface-variant">Citizen • {user ? user.ward : "Koramangala Ward 151"}</p>
          <div className="mt-4 inline-flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-xs font-bold">
            <span className="material-symbols-outlined text-sm">verified_user</span> Verified Citizen
          </div>
        </div>

        {/* Account Details Form */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-label-md font-bold text-on-surface">Account Details</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-primary font-bold hover:underline"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-outline">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-background outline-none focus:border-primary"
                />
              ) : (
                <p className="text-xs text-on-surface font-semibold">{name}</p>
              )}
            </div>

            <div className="space-y-1 pt-3 border-t border-outline-variant/35">
              <label className="text-[10px] uppercase font-bold text-outline">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-background outline-none focus:border-primary"
                />
              ) : (
                <p className="text-xs text-on-surface font-semibold">{email}</p>
              )}
            </div>

            <div className="space-y-1 pt-3 border-t border-outline-variant/35">
              <label className="text-[10px] uppercase font-bold text-outline">Mobile Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-background outline-none focus:border-primary"
                />
              ) : (
                <p className="text-xs text-on-surface font-semibold">{mobile}</p>
              )}
            </div>

            {isEditing && (
              <button
                onClick={handleSave}
                className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold mt-2 shadow-md hover:bg-opacity-90"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 border-2 border-error text-error hover:bg-error-container hover:text-on-error-container transition-colors text-label-md font-bold rounded-xl"
        >
          Sign Out
        </button>
      </div>
    </AppShell>
  );
}
