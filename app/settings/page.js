"use client";

import { AppShell } from "@/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="max-w-md mx-auto w-full px-4 py-8 space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-headline-lg text-primary">Settings</h1>
          <p className="text-body-md text-on-surface-variant">Configure your notification preferences and platform settings.</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-label-md text-on-surface">Push Notifications</p>
              <p className="text-xs text-on-surface-variant">Get notified instantly about resolution updates.</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary h-5 w-5" />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-outline-variant/50">
            <div>
              <p className="text-label-md text-on-surface">Anonymous Reporting</p>
              <p className="text-xs text-on-surface-variant">Keep citizen name hidden when filing reports by default.</p>
            </div>
            <input type="checkbox" className="rounded text-primary focus:ring-primary h-5 w-5" />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-outline-variant/50">
            <div>
              <p className="text-label-md text-on-surface">Emergency SMS Alerts</p>
              <p className="text-xs text-on-surface-variant">SMS broadcasts for critical ward safety alerts.</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary h-5 w-5" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
