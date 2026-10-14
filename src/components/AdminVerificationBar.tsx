import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  Save,
  MessageSquare,
  Award,
  UserCheck,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface AdminReviewRecord {
  week: number;
  status: 'BELUM_DISEMAK' | 'DISEMAK_DISAHKAN' | 'PERLU_TINDAKAN';
  verifiedBy: string;
  verifierRole: string;
  verifiedAt: string;
  remarks: string;
}

interface AdminVerificationBarProps {
  selectedWeek: number;
  totalSlots: number;
  startDate: string;
  endDate: string;
  teacherName?: string;
  schoolName?: string;
  onReviewSaved?: (review: AdminReviewRecord) => void;
}

const REVIEW_STORAGE_KEY_PREFIX = 'portal_gpi_admin_review_w';

export function getAdminReviewForWeek(week: number): AdminReviewRecord {
  try {
    const raw = localStorage.getItem(`${REVIEW_STORAGE_KEY_PREFIX}${week}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading admin review from storage:', e);
  }
  return {
    week,
    status: 'BELUM_DISEMAK',
    verifiedBy: 'Guru Besar / GPK Pentadbiran',
    verifierRole: 'Pentadbir Sekolah',
    verifiedAt: new Date().toISOString().split('T')[0],
    remarks: ''
  };
}

export function saveAdminReviewForWeek(review: AdminReviewRecord): void {
  try {
    localStorage.setItem(`${REVIEW_STORAGE_KEY_PREFIX}${review.week}`, JSON.stringify(review));
    window.dispatchEvent(new CustomEvent('admin_review_updated', { detail: review }));
  } catch (e) {
    console.warn('Error saving admin review to storage:', e);
  }
}

export const AdminVerificationBar: React.FC<AdminVerificationBarProps> = ({
  selectedWeek,
  totalSlots,
  startDate,
  endDate,
  teacherName = 'Ustaz Syaiful',
  schoolName = 'SK Merbau Pulas (KBA 5012)',
  onReviewSaved
}) => {
  const [review, setReview] = useState<AdminReviewRecord>(() => getAdminReviewForWeek(selectedWeek));
  const [isOpenForm, setIsOpenForm] = useState<boolean>(() => {
    // If not verified yet, open form by default; if already verified, collapse by default
    const existing = getAdminReviewForWeek(selectedWeek);
    return existing.status === 'BELUM_DISEMAK';
  });
  const [isSavedFeedback, setIsSavedFeedback] = useState<boolean>(false);

  // Sync state whenever selectedWeek changes
  useEffect(() => {
    const rec = getAdminReviewForWeek(selectedWeek);
    setReview(rec);
    setIsOpenForm(rec.status === 'BELUM_DISEMAK');
  }, [selectedWeek]);

  const handleSave = () => {
    const updated: AdminReviewRecord = {
      ...review,
      week: selectedWeek,
      verifiedAt: review.verifiedAt || new Date().toISOString().split('T')[0]
    };
    saveAdminReviewForWeek(updated);
    setReview(updated);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 3000);
    if (onReviewSaved) {
      onReviewSaved(updated);
    }
  };

  const quickRemarks = [
    'RPH disediakan dengan lengkap, teratur dan menepati kehendak DSKP.',
    'Menepati Surat Pekeliling Ikhtisas (SPI) Bil. 3/1999 & jadual waktu rasmi.',
    'Aktiviti PdP berpusatkan murid dengan penerapan elemen KBAT & PAK-21 yang baik.',
    'Objektif pembelajaran jelas dan pentaksiran bersesuaian dengan tahap murid.',
    'Bahan bantu mengajar dan lembaran kerja disediakan dengan kemas.'
  ];

  const isVerified = review.status === 'DISEMAK_DISAHKAN';
  const isNeedsAction = review.status === 'PERLU_TINDAKAN';

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-2 border-indigo-500/50 rounded-2xl shadow-xl shadow-indigo-950/40 overflow-hidden font-tech transition-all">
      {/* Top Banner Header */}
      <div className="px-4 sm:px-6 py-3.5 bg-indigo-950/80 border-b border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/50">
                MOD SEMAKAN PENTADBIR RASMI
              </span>
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                MINGGU {selectedWeek}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide mt-0.5">
              Semakan & Pengesahan e-RPH Mingguan oleh Pentadbir Sekolah
            </h3>
          </div>
        </div>

        {/* Current Status Badge & Toggle Form Button */}
        <div className="flex items-center space-x-2.5">
          {isVerified ? (
            <div className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center space-x-1.5 shadow-sm text-xs font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>TELAH DISEMAK & DISAHKAN</span>
            </div>
          ) : isNeedsAction ? (
            <div className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center space-x-1.5 shadow-sm text-xs font-bold">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>PERLU TINDAKAN GURU</span>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-600 text-slate-300 flex items-center space-x-1.5 text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>BELUM DISEMAK</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpenForm(!isOpenForm)}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition flex items-center space-x-1"
            title={isOpenForm ? 'Tutup borang semakan' : 'Buka borang semakan & ulasan pentadbir'}
          >
            <span>{isOpenForm ? 'TUTUP BORANG' : 'BORANG ULASAN'}</span>
            {isOpenForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="px-4 sm:px-6 py-2.5 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-indigo-500/20 text-slate-300">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <div>
            <span className="text-slate-400">Guru: </span>
            <span className="font-bold text-white">{teacherName}</span>
          </div>
          <div>
            <span className="text-slate-400">Sekolah: </span>
            <span className="font-bold text-cyan-300">{schoolName}</span>
          </div>
          <div>
            <span className="text-slate-400">Tarikh: </span>
            <span className="font-mono text-emerald-300 font-bold">{startDate} hingga {endDate}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
            {totalSlots} Slot e-RPH Disediakan
          </span>
          {isVerified && review.verifiedAt && (
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
              Disahkan: {review.verifiedAt}
            </span>
          )}
        </div>
      </div>

      {/* Verified Seal Stamp (Displayed if verified) */}
      {isVerified && !isOpenForm && (
        <div className="p-4 sm:p-5 bg-emerald-950/30 border-b border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-emerald-300 tracking-wider">
                  PENGESAHAN RASMI PENTADBIR SEKOLAH
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  (Tarikh Semakan: {review.verifiedAt})
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 italic font-sans">
                "{review.remarks || 'e-RPH telah disemak, teratur dan menepati piawaian sukatan pelajaran.'}"
              </p>
              <div className="text-[11px] text-slate-400">
                Disahkan oleh: <span className="text-white font-bold">{review.verifiedBy}</span> ({review.verifierRole})
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpenForm(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition shrink-0"
          >
            Kemaskini Ulasan
          </button>
        </div>
      )}

      {/* Expandable Administrator Verification Form */}
      {isOpenForm && (
        <div className="p-4 sm:p-6 bg-slate-950/80 space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider font-tech mb-1">
                STATUS SEMAKAN:
              </label>
              <select
                value={review.status}
                onChange={(e) => setReview({ ...review, status: e.target.value as any })}
                className="w-full bg-slate-900 border border-indigo-500/40 text-white rounded-xl px-3 py-2 text-xs font-tech font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="DISEMAK_DISAHKAN">✅ TELAH DISEMAK & DISAHKAN</option>
                <option value="BELUM_DISEMAK">⏳ BELUM DISEMAK / DALAM SEMAKAN</option>
                <option value="PERLU_TINDAKAN">⚠️ PERLU TINDAKAN / PEMBETULAN</option>
              </select>
            </div>

            {/* Nama Penyemak */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider font-tech mb-1">
                NAMA PENYEMAK / PENTADBIR:
              </label>
              <input
                type="text"
                value={review.verifiedBy}
                onChange={(e) => setReview({ ...review, verifiedBy: e.target.value })}
                placeholder="Contoh: En. Ahmad (Guru Besar)"
                className="w-full bg-slate-900 border border-indigo-500/40 text-white rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Tarikh Semakan */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider font-tech mb-1">
                TARIKH SEMAKAN:
              </label>
              <input
                type="date"
                value={review.verifiedAt}
                onChange={(e) => setReview({ ...review, verifiedAt: e.target.value })}
                className="w-full bg-slate-900 border border-indigo-500/40 text-cyan-300 rounded-xl px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Ulasan & Catatan Pentadbir */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-tech flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>CATATAN / ULASAN PENTADBIR:</span>
              </label>
              <span className="text-[10px] text-slate-400">Pilih ulasan pantas atau taip sendiri</span>
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickRemarks.map((qr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setReview({ ...review, remarks: qr })}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-indigo-900/40 hover:text-indigo-200 text-slate-400 border border-slate-800 rounded-lg text-[11px] transition text-left"
                  title="Klik untuk gunakan ulasan ini"
                >
                  + {qr.length > 40 ? `${qr.slice(0, 40)}...` : qr}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={review.remarks}
              onChange={(e) => setReview({ ...review, remarks: e.target.value })}
              placeholder="Tulis ulasan pentadbir untuk Minggu ini..."
              className="w-full bg-slate-900 border border-indigo-500/40 text-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-indigo-500/20 font-tech">
            <div className="text-[11px] text-slate-400">
              * Pengesahan ini akan disimpan dan dipaparkan pada cetakan e-RPH Minggu {selectedWeek}.
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsOpenForm(false)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-bold transition border border-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md ${
                  isSavedFeedback
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-black'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavedFeedback ? 'PENGESAHAN DISIMPAN!' : 'SIMPAN & SAHKAN SEMAKAN'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
