"use client";

import { AppShell } from "@/components/AppShell";
import { useState } from "react";

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <AppShell>
      <div className="max-w-md mx-auto w-full px-4 py-8 space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-headline-lg text-primary">Help & Support</h1>
          <p className="text-body-md text-on-surface-variant">Resolve platform issues or contact your ward administrator.</p>
        </div>

        {/* FAQs */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4 shadow-sm">
          <h2 className="text-label-md font-bold text-on-surface">Frequently Asked Questions</h2>
          <div className="space-y-3 text-xs">
            <div>
              <p className="font-bold text-on-surface">How long does resolution take?</p>
              <p className="text-on-surface-variant mt-1">Average resolution time is 14 hours. Critical hazards are resolved in under 4 hours.</p>
            </div>
            <div className="pt-3 border-t border-outline-variant/35">
              <p className="font-bold text-on-surface">Is my personal data shared with officers?</p>
              <p className="text-on-surface-variant mt-1">No, all grievances can be reported anonymously. Officers only see the issue location and photo.</p>
            </div>
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4 shadow-sm">
          <h2 className="text-label-md font-bold text-on-surface">Submit Support Request</h2>
          {submitted ? (
            <p className="text-xs text-tertiary font-bold">Request submitted. An agent will contact you shortly.</p>
          ) : (
            <div className="space-y-3">
              <textarea
                placeholder="Describe your issue..."
                className="w-full text-xs p-3 rounded-lg border border-outline-variant bg-background"
                rows={3}
              />
              <button
                onClick={() => setSubmitted(true)}
                className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold"
              >
                Submit Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
