import React, { useState, useEffect } from 'react';
import {
  Database,
  CloudCheck,
  CloudOff,
  ShieldCheck,
  Key,
  ExternalLink,
  X,
  LogIn,
  LogOut,
  RefreshCw,
  Copy,
  Check,
  Save,
  Trash2,
  AlertTriangle,
  UserCheck,
  Sparkles
} from 'lucide-react';
import {
  initFirebase,
  isFirebaseConfigured,
  getFirebaseConfig,
  saveCustomFirebaseConfig,
  clearCustomFirebaseConfig,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  auth
} from '../firebase/firebase';

interface FirebaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const FirebaseStatusModal: React.FC<FirebaseStatusModalProps> = ({
  isOpen,
  onClose,
  onNotify
}) => {
  const [configured, setConfigured] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [showConfigForm, setShowConfigForm] = useState<boolean>(false);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [domainCopied, setDomainCopied] = useState<boolean>(false);

  // Form states
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [projectIdInput, setProjectIdInput] = useState<string>('website-ustaz-syaiful');
  const [appIdInput, setAppIdInput] = useState<string>('');

  useEffect(() => {
    const isConfig = isFirebaseConfigured();
    setConfigured(isConfig);

    const cfg = getFirebaseConfig();
    if (cfg.apiKey) setApiKeyInput(cfg.apiKey);
    if (cfg.projectId) setProjectIdInput(cfg.projectId);
    if (cfg.appId) setAppIdInput(cfg.appId);

    // Retrieve local session if exists
    try {
      const savedUser = localStorage.getItem('portal_gpi_auth_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore
    }

    if (isConfig) {
      const { auth: currentAuth } = initFirebase();
      if (currentAuth) {
        const unsub = onAuthStateChanged(currentAuth, (user) => {
          if (user) {
            setCurrentUser(user);
            try {
              localStorage.setItem('portal_gpi_auth_user', JSON.stringify({
                displayName: user.displayName,
                email: user.email,
                uid: user.uid,
                photoURL: user.photoURL
              }));
            } catch {}
          }
        });
        return () => unsub();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const config = getFirebaseConfig();
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleSaveFormConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim() || !projectIdInput.trim()) {
      onNotify('Sila masukkan sekurang-kurangnya API Key dan Project ID.');
      return;
    }

    saveCustomFirebaseConfig({
      apiKey: apiKeyInput.trim(),
      projectId: projectIdInput.trim(),
      appId: appIdInput.trim() || undefined
    });

    setConfigured(true);
    setShowConfigForm(false);
    onNotify('Konfigurasi Firebase berjaya disimpan! Memulakan sambungan...');
  };

  const handleClearCustomConfig = () => {
    if (confirm('Padam konfigurasi tersimpan?')) {
      clearCustomFirebaseConfig();
      setConfigured(false);
      setApiKeyInput('');
      setProjectIdInput('website-ustaz-syaiful');
      setAppIdInput('');
      onNotify('Konfigurasi telah dipadam.');
    }
  };

  const handleGoogleLogin = async () => {
    const { auth: currentAuth } = initFirebase();
    if (!currentAuth) {
      onNotify('Sila konfigurasikan Firebase terlebih dahulu.');
      return;
    }

    setIsLoggingIn(true);
    setUnauthorizedDomain(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const res = await signInWithPopup(currentAuth, provider);
      setCurrentUser(res.user);
      try {
        localStorage.setItem('portal_gpi_auth_user', JSON.stringify({
          displayName: res.user.displayName,
          email: res.user.email,
          uid: res.user.uid,
          photoURL: res.user.photoURL
        }));
      } catch {}
      onNotify(`Berjaya log masuk sebagai ${res.user.displayName || res.user.email}!`);
    } catch (err: any) {
      console.error('Login error:', err);
      const isDomainError = err?.code === 'auth/unauthorized-domain' ||
        (typeof err?.message === 'string' && err.message.includes('unauthorized-domain'));

      if (isDomainError) {
        setUnauthorizedDomain(currentHostname || 'ais-dev-bvadsg2vgdxncgddg2pxdo-858779136856.asia-east1.run.app');
        onNotify('Domain semasa belum dibenarkan di Firebase Console. Sila ikuti panduan di bawah.');
      } else {
        onNotify(`Ralat log masuk: ${err.message || 'Sila cuba lagi'}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLocalAdminLogin = () => {
    const adminUser = {
      displayName: 'Ustaz Syaiful (Pentadbir)',
      email: 'g-77071151@moe-dl.edu.my',
      uid: 'admin-ustaz-syaiful',
      isLocalAdmin: true
    };
    setCurrentUser(adminUser as any);
    try {
      localStorage.setItem('portal_gpi_auth_user', JSON.stringify(adminUser));
    } catch {}
    onNotify('Berjaya log masuk sebagai Pentadbir Utama (Ustaz Syaiful)!');
  };

  const handleGoogleLogout = async () => {
    try {
      localStorage.removeItem('portal_gpi_auth_user');
    } catch {}
    setCurrentUser(null);
    if (auth) {
      try {
        await signOut(auth);
      } catch (err: any) {
        console.warn('Logout warning:', err);
      }
    }
    onNotify('Telah log keluar daripada akaun.');
  };

  const handleCopyDomain = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setDomainCopied(true);
    setTimeout(() => setDomainCopied(false), 2500);
    onNotify(`Domain '${textToCopy}' telah disalin!`);
  };

  const handleCopyEnv = () => {
    const text = `VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=website-ustaz-syaiful.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=website-ustaz-syaiful
VITE_FIREBASE_STORAGE_BUCKET=website-ustaz-syaiful.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onNotify('Templat konfigurasi disalin ke papan keratan.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans-custom">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl hud-bracket text-slate-200 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-cyan-600 flex items-center justify-center text-slate-950 font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-tech tracking-wide flex items-center space-x-2">
                <span>STATUS INTEGRASI FIREBASE</span>
                {configured ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    AKTIF / TERSAMBUNG
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-950 text-amber-300 border border-amber-500/40">
                    MEMERLUKAN KREDENSIAL
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Penyelarasan Awan Cloud Firestore & Log Masuk Pengesahan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Box */}
        {configured ? (
          <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-emerald-300">
                <CloudCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Firebase Cloud Firestore Siap Digunakan!</p>
                  <p className="text-xs text-emerald-200/80">
                    ID Projek: <span className="font-mono font-bold text-white">{config.projectId}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowConfigForm(!showConfigForm)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:bg-slate-800"
                >
                  {showConfigForm ? 'Tutup Konfigurasi' : 'Kemaskini'}
                </button>
                <button
                  type="button"
                  onClick={handleClearCustomConfig}
                  className="p-1.5 text-xs text-red-400 hover:text-red-300 rounded-lg bg-slate-900 hover:bg-red-950/40 border border-red-500/30"
                  title="Padam Konfigurasi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Auth Section */}
            <div className="border-t border-emerald-500/20 pt-3 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs">
                  {currentUser ? (
                    <div className="flex items-center space-x-2 text-white">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>
                        Log Masuk: <strong className="text-emerald-300">{currentUser.displayName || currentUser.email}</strong>
                      </span>
                      {currentUser.email && (
                        <span className="text-[11px] text-slate-400">({currentUser.email})</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-300">Log masuk diperlukan untuk kawalan pentadbir penuh.</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {currentUser ? (
                    <button
                      type="button"
                      onClick={handleGoogleLogout}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-red-300 border border-red-500/30 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Keluar</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleLocalAdminLogin}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition font-tech"
                        title="Log masuk serta-merta sebagai Ustaz Syaiful (tanpa popup Google)"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Log Masuk Pentadbir Segera</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoggingIn}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition shadow font-tech"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>{isLoggingIn ? 'Menyambung...' : 'Log Masuk Google'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Unauthorized Domain Alert & Resolution Guide */}
              {unauthorizedDomain && (
                <div className="bg-amber-950/60 border border-amber-500/50 rounded-xl p-4 space-y-3 text-xs animate-in fade-in duration-200">
                  <div className="flex items-start space-x-2.5 text-amber-300">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-amber-200 font-tech uppercase tracking-wide">
                        Domain Pelayan Perlu Didaftarkan (auth/unauthorized-domain)
                      </p>
                      <p className="text-amber-200/90 leading-relaxed text-[11px]">
                        Google Firebase Authentication menyekat popup log masuk Google kerana alamat domain pelayan semasa belum tersenarai dalam senarai <strong>Authorized Domains</strong> di Firebase Console projek <strong>{config.projectId}</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Domain to Copy */}
                  <div className="bg-slate-950/90 border border-slate-700 rounded-lg p-3 space-y-2">
                    <div className="text-[11px] text-slate-300 font-medium">Domain semasa aplikasi anda:</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="px-2.5 py-1 bg-black/60 rounded text-cyan-300 font-mono text-xs border border-cyan-500/30 select-all">
                        {unauthorizedDomain}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopyDomain(unauthorizedDomain)}
                        className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded text-xs flex items-center space-x-1 transition"
                      >
                        {domainCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{domainCopied ? 'Disalin!' : 'Salin Domain'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyDomain('run.app')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded text-xs flex items-center space-x-1 transition"
                        title="Salin 'run.app' untuk benarkan semua sub-domain aplikasi secara automatik"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Salin 'run.app' (Disyorkan)</span>
                      </button>
                    </div>
                  </div>

                  {/* 3 Step Instructions */}
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="font-bold text-amber-300">Langkah Penyelesaian (1 Minit):</div>
                    <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-300">
                      <li>
                        Buka tetapan domain di Firebase:{' '}
                        <a
                          href={`https://console.firebase.google.com/project/${config.projectId}/authentication/settings`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline font-bold inline-flex items-center space-x-1"
                        >
                          <span>Firebase Auth &gt; Settings &gt; Authorized domains</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      </li>
                      <li>Skrol ke bahagian <strong>Authorized domains</strong> dan klik butang <strong>Add domain</strong>.</li>
                      <li>Tampal domain di atas (atau taip <code className="text-cyan-300 font-bold">run.app</code>) dan klik <strong>Save</strong>.</li>
                      <li>Kembali ke sini dan klik butang <strong>Log Masuk Google</strong> semula.</li>
                    </ol>
                  </div>

                  {/* Quick Local Admin Bypass */}
                  <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-amber-200/80">
                      Ingin teruskan kerja tanpa mendaftar domain sekarang?
                    </span>
                    <button
                      type="button"
                      onClick={handleLocalAdminLogin}
                      className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition flex items-center space-x-1.5 shadow"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Gunakan Sesi Pentadbir Segera</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-amber-950/30 border border-amber-500/40 p-4 rounded-xl space-y-3">
            <div className="flex items-start space-x-3 text-amber-300">
              <CloudOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm">Penyediaan Automatik Disekat oleh Organisasi MOE</p>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  Akaun Google Workspace Kementerian Pendidikan Malaysia (<span className="font-mono text-cyan-300">@moe-dl.edu.my</span>) mempunyai sekatan keselamatan organisasi yang menghalang penjanaan projek awan GCP secara automatik melalui API (ralat: <em>The caller does not have permission</em>).
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigForm(true)}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition font-tech flex items-center space-x-1.5 shadow"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>MASUKKAN API KEY PROJEK ANDA DI SINI</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manual Config Form */}
        {showConfigForm && (
          <form onSubmit={handleSaveFormConfig} className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-cyan-300 font-tech uppercase flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>Penyambungan Kredensial Firebase</span>
              </h3>
              <span className="text-[11px] text-slate-400">Dari Firebase Console</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Project ID</label>
                <input
                  type="text"
                  value={projectIdInput}
                  onChange={(e) => setProjectIdInput(e.target.value)}
                  placeholder="website-ustaz-syaiful"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-cyan-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Web API Key (Wajib)</label>
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-cyan-400 outline-none"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Didapati di Firebase Console &gt; Project Settings &gt; General &gt; Web API Key (atau konfigurasi Web App)
                </p>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">App ID (Pilihan)</label>
                <input
                  type="text"
                  value={appIdInput}
                  onChange={(e) => setAppIdInput(e.target.value)}
                  placeholder="1:123456789:web:abcdef..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-cyan-400 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfigForm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan & Sambung</span>
              </button>
            </div>
          </form>
        )}

        {/* Blueprint & Security Rules Info */}
        <div className="space-y-2 bg-slate-950/80 p-4 rounded-xl border border-cyan-500/20 text-xs">
          <div className="flex items-center space-x-2 text-cyan-300 font-bold font-tech uppercase">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Keselamatan & Skema Sedia Ada (Production Ready)</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Struktur pangkalan data dan peraturan keselamatan telah dijana secara rasmi mengikut piawaian KPM:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
            <li><strong className="text-cyan-300">firebase-blueprint.json</strong>: Skema model data e-RPH, PBD Murid, dan Tasmik.</li>
            <li><strong className="text-cyan-300">firestore.rules</strong>: Peraturan keselamatan ketat (Zero-Trust ABAC) dengan pengesahan pentadbir.</li>
            <li><strong className="text-cyan-300">Auto-Offline Sync</strong>: Aplikasi beroperasi penuh secara tempatan dan akan menyegerak automatik sebaik sahaja Firebase aktif.</li>
          </ul>
        </div>

        {/* How to Connect instructions */}
        {!configured && !showConfigForm && (
          <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-cyan-500/20 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center space-x-1.5 font-tech">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>CARA MENDAPATKAN API KEY FIREBASE:</span>
              </span>
              <button
                type="button"
                onClick={handleCopyEnv}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 flex items-center space-x-1 transition font-tech"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Disalin' : 'Salin Templat'}</span>
              </button>
            </div>

            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
              <li>
                Buka <a href="https://console.firebase.google.com/project/website-ustaz-syaiful/settings/general" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline inline-flex items-center space-x-1"><span>Firebase Project Settings (website-ustaz-syaiful)</span> <ExternalLink className="w-3 h-3 ml-0.5" /></a>.
              </li>
              <li>Di bawah tab <strong>General</strong>, lihat bahagian <strong>Web API Key</strong> (bermula dengan `AIzaSy...`).</li>
              <li>Klik butang kuning <strong>"MASUKKAN API KEY PROJEK ANDA DI SINI"</strong> di atas dan tampal (*paste*) kunci tersebut.</li>
            </ol>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-tech font-bold text-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
