import React, { useState, useMemo } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

interface AdminShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
  startDate: string;
  endDate: string;
  totalSlots: number;
  isReviewMode: boolean;
  onToggleReviewMode: (val: boolean) => void;
  verificationStatus?: {
    status: 'BELUM_DISEMAK' | 'DISEMAK_DISAHKAN' | 'PERLU_TINDAKAN';
    verifiedBy: string;
    verifiedAt: string;
    remarks: string;
  };
}

export const AdminShareLinkModal: React.FC<AdminShareLinkModalProps> = ({
  isOpen,
  onClose,
  selectedWeek,
  onSelectWeek,
  startDate,
  endDate,
  totalSlots,
  isReviewMode,
  onToggleReviewMode,
  verificationStatus
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Generate shareable URL
  const shareableUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const modeParam = isReviewMode ? '&mode=semakan' : '';
    return `${origin}${pathname}?tab=kurikulum&subTab=rph&minggu=${selectedWeek}${modeParam}`;
  }, [selectedWeek, isReviewMode]);

  // Clean short URL
  const cleanShortUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const modeParam = isReviewMode ? '&mode=semakan' : '';
    return `${origin}${pathname}?minggu=${selectedWeek}${modeParam}`;
  }, [selectedWeek, isReviewMode]);

  // Formatted WhatsApp message for school administrators
  const whatsappMessage = useMemo(() => {
    return `Assalamualaikum Tuan/Puan Pentadbir (Guru Besar / GPK Pentadbiran),

Berikut adalah pautan rasmi bagi Semakan Rancangan Pengajaran Harian (e-RPH):

🏫 Sekolah: SK Merbau Pulas (KBA 5012)
👨‍🏫 Guru: Ustaz Syaiful (Guru Pendidikan Islam)
📌 Minggu: Minggu ${selectedWeek} (Sesi 2026/2027)
📅 Tarikh: ${startDate} hingga ${endDate}
📚 Jumlah: ${totalSlots} Slot e-RPH Lengkap

🔗 Pautan Semakan Terus:
${cleanShortUrl}

*Nota Pentadbir:* Klik pautan di atas untuk menyemak, mengesahkan, dan menurunkan ulasan semakan e-RPH secara terus.

Terima kasih.`;
  }, [selectedWeek, startDate, endDate, totalSlots, cleanShortUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cleanShortUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = cleanShortUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = whatsappMessage;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  const handleSendWhatsapp = () => {
    const encoded = encodeURIComponent(whatsappMessage);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTestLink = () => {
    window.open(cleanShortUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in font-sans-custom">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-[#02080d] border border-cyan-500/40 rounded-2xl sm:rounded-3xl shadow-2xl shadow-cyan-950/60 overflow-hidden text-slate-100 my-8">
        
        {/* Header Bar */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-cyan-500/25 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-tech">
                  PAUTAN KHAS PENTADBIR
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-tech">
                  MINGGU {selectedWeek}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-tech tracking-wide mt-0.5">
                Pautan Semakan e-RPH Mengikut Minggu
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-sm">
          {/* Penerangan Ringkas */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start space-x-3 text-xs text-cyan-200">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-100">Fungsi Pautan Khas: </span>
              Hantar pautan ini kepada Guru Besar atau Penolong Kanan Pentadbiran. Apabila pentadbir klik pautan ini, portal akan <strong>terus membuka Minggu {selectedWeek} sahaja</strong> secara tepat untuk semakan, pengesahan, dan ulasan mereka.
            </div>
          </div>

          {/* Pemilihan Minggu Pantas */}
          <div className="bg-slate-900/70 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-tech flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>PILIH MINGGU e-RPH:</span>
              </label>
              <span className="text-[11px] text-cyan-400 font-mono">
                {startDate} hingga {endDate} ({totalSlots} Slot)
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={selectedWeek}
                onChange={(e) => onSelectWeek(Number(e.target.value))}
                className="w-full bg-slate-950 border border-cyan-500/40 text-cyan-200 font-tech font-bold text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                {Array.from({ length: 43 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    Minggu {w} {w === selectedWeek ? '★ (Minggu Dipilih)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Chips for nearby weeks */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-tech uppercase">Pintas:</span>
              {[
                Math.max(1, selectedWeek - 2),
                Math.max(1, selectedWeek - 1),
                selectedWeek,
                Math.min(43, selectedWeek + 1),
                Math.min(43, selectedWeek + 2)
              ]
                .filter((v, idx, arr) => arr.indexOf(v) === idx)
                .map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => onSelectWeek(w)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition border ${
                      w === selectedWeek
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                    }`}
                  >
                    M{w}
                  </button>
                ))}
            </div>
          </div>

          {/* Mod Semakan Pentadbir Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900/80 rounded-2xl border border-indigo-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-tech">MOD SEMAKAN PENTADBIR (DISYORKAN)</div>
                <div className="text-[11px] text-slate-400">
                  Memaparkan sepanduk rasmi semakan & borang ulasan/pengesahan untuk pentadbir sekolah.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggleReviewMode(!isReviewMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isReviewMode ? 'bg-gradient-to-r from-cyan-500 to-indigo-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isReviewMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Kotak Paparan Pautan Khas */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-tech flex items-center justify-between">
              <span>PAUTAN URL KHAS MINGGU {selectedWeek}:</span>
              <span className="text-[10px] text-emerald-400 font-normal">Pautan terus sedia dihantar</span>
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-slate-950 border border-cyan-500/40 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 truncate select-all">
                {cleanShortUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border font-tech shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md font-black'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-400 shadow'
                }`}
                title="Salin pautan ke papan keratan (clipboard)"
              >
                {copiedLink ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'DISALIN!' : 'SALIN LINK'}</span>
              </button>
              <button
                type="button"
                onClick={handleTestLink}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 rounded-xl transition shrink-0"
                title="Buka & uji pautan dalam tab baharu"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pratonton Mesej Rasmi WhatsApp */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-tech flex items-center space-x-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>PRATONTON MESEJ RASMI KEPADA PENTADBIR:</span>
              </label>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-tech"
              >
                {copiedText ? '✓ Teks Disalin' : 'Salin Mesej Penuh'}
              </button>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
              {whatsappMessage}
            </div>
          </div>

          {/* Status Semakan Semasa Jika Ada */}
          {verificationStatus && verificationStatus.status !== 'BELUM_DISEMAK' && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-tech">
              <div className="flex items-center space-x-2 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  STATUS: TELAH DISEMAK OLEH {verificationStatus.verifiedBy || 'PENTADBIR'} PADA{' '}
                  {verificationStatus.verifiedAt || 'TARIKH TERTENTU'}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                DISAHKAN
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-4 sm:px-6 sm:py-4 border-t border-cyan-500/20 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 font-tech">
          <div className="text-[11px] text-slate-400">
            SK Merbau Pulas (KBA 5012) • Minggu {selectedWeek}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedText ? 'TEKS DISALIN!' : 'SALIN TEKS LENGKAP'}</span>
            </button>
            <button
              type="button"
              onClick={handleSendWhatsapp}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-emerald-950/40 font-black"
            >
              <MessageCircle className="w-4 h-4 stroke-[2.5]" />
              <span>HANTAR WHATSAPP KE PENTADBIR</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
