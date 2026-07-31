"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleAuth = (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) return;

    localStorage.setItem("auth_user", JSON.stringify({
      name: name || "Rajesh M.",
      email: email,
      ward: "Koramangala Ward 151"
    }));

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 animate-fade-in-up">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant p-8 rounded-2xl shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl text-white mx-auto">
            <span className="material-symbols-outlined text-[28px] material-symbols-filled">account_balance</span>
          </div>
          <h1 className="text-headline-md font-bold text-primary">NagarSeva</h1>
          <p className="text-xs text-on-surface-variant">Civic Trust & Grievance Routing System</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                className="w-full text-xs p-3 rounded-lg border border-outline-variant bg-background focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full text-xs p-3 rounded-lg border border-outline-variant bg-background focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-3 rounded-lg border border-outline-variant bg-background focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              required
            />
          </div>

          <button type="submit" className="w-full py-3 bg-primary text-on-primary rounded-lg text-xs font-bold shadow-md hover:bg-opacity-90 transition-opacity">
            {isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="text-center text-xs">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-primary font-bold hover:underline"
          >
            {isRegister ? "Already have an account? Sign In" : "New user? Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
}
