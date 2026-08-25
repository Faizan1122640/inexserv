import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  ShieldCheck,
  Database,
  User,
  Key,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function AdminSettings({
  formData,
  setFormData,
  onSave
}) {
  const [importStatus, setImportStatus] = useState('');

  const exportJSON = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inexserv-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (parsed && typeof parsed === 'object') {
          setFormData(parsed);
          setImportStatus('✓ Backup file loaded into editor! Click "Save & Publish" in the top bar to apply it live.');
        } else {
          setImportStatus('❌ Invalid JSON backup file format.');
        }
      } catch (err) {
        setImportStatus('❌ Error parsing JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h2 className="text-xl font-extrabold text-[#0f2b48] flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-[#04A552]" />
          <span>System Settings &amp; Data Backups</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Export full JSON content snapshots, import backup configurations, and view security credentials.
        </p>
      </div>

      {importStatus && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${importStatus.startsWith('✓') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {importStatus}
        </div>
      )}

      {/* Grid: Backups & Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup & Restore Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#0f2b48] flex items-center gap-2">
            <Download className="w-4 h-4 text-[#074476]" />
            <span>Export &amp; Import Snapshots</span>
          </h3>

          <p className="text-xs text-slate-500">
            Download a full snapshot of your website text, services, and navigation to keep offline backups or transfer between environments.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={exportJSON}
              className="flex-1 py-3 px-4 rounded-xl bg-[#074476] hover:bg-[#0c1d2e] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON Backup</span>
            </button>

            <label className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer text-center">
              <Upload className="w-4 h-4 text-[#04A552]" />
              <span>Import JSON Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Security & Access */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#0f2b48] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#04A552]" />
            <span>Admin Credentials &amp; Access</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Primary Admin Account</div>
                <div className="text-slate-500 text-[11px]">admin@gmail.com</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Full Access
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Secondary Admin Account</div>
                <div className="text-slate-500 text-[11px]">admin@inexserv.com</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                Full Access
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
