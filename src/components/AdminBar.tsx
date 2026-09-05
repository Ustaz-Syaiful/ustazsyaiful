import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  RotateCcw,
  Download,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  X,
  KeyRound,
  Database
} from 'lucide-react';

interface AdminBarProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenMenuEditor: () => void;
  onResetAllData: () => void;
  onExportData: () => void;
  onImportData: (jsonData: string) => boolean;
  onOpenFirebaseModal?: () => void;
  notification: string | null;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  isAdmin,
  onToggleAdmin,
  onOpenMenuEditor,
  onResetAllData,
  onExportData,
  onImportData,
  onOpenFirebaseModal,
  notification
}) => {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    if (!importText.trim()) return;
    const success = onImportData(importText);
    if (success) {
      setIsImportModalOpen(false);
      setImportText('');
    } else {
      setImportError('Format JSON tidak sah atau ralat ketika memuat data.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (text) {
          setImportText(text);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-cyan-500/50 flex items-center space-x-3 animate-in slide-in-from-bottom-5 duration-300 hud-bracket shadow-[0_0_25px_rgba(6,182,212,0.25)]">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/40">
            <CheckCircle2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-cyan-400 font-tech uppercase tracking-wider">TELEMETRI KONSOL PENTADBIR // OK</div>
            <div className="text-xs text-slate-200 font-sans-custom">{notification}</div>
          </div>
        </div>
      )}

      {/* Admin Mode Floating Indicator / Top Banner */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-slate-950 via-[#031522] to-slate-950 text-white text-xs px-4 py-2 border-b border-amber-400/40 shadow-xl font-tech">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
              </span>
              <span className="font-bold tracking-wider flex items-center gap-1.5 text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>KONSOL PENTADBIR KUANTUM [AKTIF]:</span>
              </span>
              <span className="hidden sm:inline text-cyan-200/80 font-sans-custom">
                Akses penuh suntingan kurikulum, sahsiah, kokurikulum dan arkib dokumen dibuka.
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {onOpenFirebaseModal && (
                <button
                  type="button"
                  onClick={onOpenFirebaseModal}
                  className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-lg font-bold transition border border-cyan-500/40 shadow flex items-center space-x-1 font-tech tracking-wide"
                  title="Status & Integrasi Firebase Cloud Firestore"
                >
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>FIREBASE</span>
                </button>
              )}

              <button
                onClick={onOpenMenuEditor}
                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg font-bold transition shadow flex items-center space-x-1 font-tech tracking-wide"
                title="Sunting Tajuk, Sub-tajuk dan Susunan Semua Menu"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>SUSUNAN MENU</span>
              </button>

              <button
                onClick={onExportData}
                className="px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 rounded-lg font-semibold transition border border-cyan-500/30 flex items-center space-x-1 font-tech"
                title="Eksport Data ke fail JSON"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">EKSPORT JSON</span>
              </button>

              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 text-cyan-200 rounded-lg font-semibold transition border border-cyan-500/30 flex items-center space-x-1 font-tech"
                title="Import fail data JSON"
              >
                <Upload className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline">IMPORT JSON</span>
              </button>

              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg font-semibold transition border border-rose-700/50 flex items-center space-x-1 font-tech"
                title="Set semula semua data kepada data asal"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden md:inline">SET ASAL</span>
              </button>

              <button
                onClick={onToggleAdmin}
                className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-lg font-bold transition shadow flex items-center space-x-1 font-tech"
              >
                <Lock className="w-3 h-3" />
                <span>KUNCI KONSOL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 border border-rose-500/40 text-slate-200 hud-bracket">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-tech uppercase tracking-wider">
                  Set Semula Data Kuantum?
                </h3>
                <p className="text-xs text-rose-300/80 font-sans-custom">
                  Tindakan ini akan mengembalikan data sistem kepada susunan piawai.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-sans-custom leading-relaxed">
              Semua rekod (e-RPH, PBD, e-Tasmik, Jadual Waktu, Sahsiah SSDM, MQSS, Direktori Panitia dan Dokumen) akan dikembalikan kepada konfigurasi asal sistem.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 font-tech">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition"
              >
                BATAL
              </button>
              <button
                onClick={() => {
                  onResetAllData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-rose-900/40"
              >
                YA, RESET KESELURUHAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import JSON Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 border border-cyan-500/40 text-slate-200 hud-bracket">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center space-x-2 font-tech">
                <FileJson className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Import Data Sandaran (JSON)
                </h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {importError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-medium font-sans-custom">
                {importError}
              </div>
            )}

            <div className="space-y-3 font-sans-custom">
              <div>
                <label className="block text-xs font-semibold text-cyan-300 mb-1 font-tech uppercase">
                  Pilih Fail JSON dari Storan:
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-950 file:text-cyan-300 file:border file:border-cyan-500/40 hover:file:bg-cyan-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cyan-300 mb-1 font-tech uppercase">
                  Atau Tampal Kod Payload JSON:
                </label>
                <textarea
                  rows={6}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder='{"teacher": {...}, "timetable": [...]}'
                  className="w-full font-mono text-xs p-3 bg-slate-900 border border-cyan-500/30 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-cyan-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/20 font-tech">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700"
              >
                BATAL
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg"
              >
                MUAT MASUK DATA
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
