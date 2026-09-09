import React from 'react';
import { MainMenuType } from '../types';
import {
  BookOpen,
  Mail,
  Phone,
  School,
  ExternalLink,
  ChevronUp,
  HeartHandshake,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface FooterProps {
  setActiveMenu: (menu: MainMenuType) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveMenu }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#02070d] text-slate-400 border-t border-cyan-500/30 text-sm no-print relative overflow-hidden">
      {/* Decorative Cyber Laser Topline */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 via-amber-400 to-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Identity & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-emerald-600 to-slate-950 p-0.5 border border-cyan-400/50 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-300 font-bold font-arabic text-xl">
                  علم
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight font-tech tracking-wide">PORTAL GURU GPI KUANTUM</h3>
                <p className="text-xs text-cyan-400 font-tech">Panitia Pendidikan Islam & j-QAF Cyber</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans-custom">
              Membangun modal insan Rabbani yang menguasai ilmu wahyu dan sains teknologi, berakhlak mulia selaras Falsafah Pendidikan Islam dan Kebangsaan.
            </p>
            <div className="pt-2 text-xs text-cyan-200/80 flex flex-col space-y-1.5 font-sans-custom">
              <div className="flex items-center space-x-2">
                <School className="w-3.5 h-3.5 text-cyan-400" />
                <span>SK Merbau Pulas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[11px]">g-77071151@moe-dl.edu.my</span>
              </div>
            </div>
          </div>

          {/* Col 2: Menu Utama */}
          <div className="space-y-3">
            <h4 className="text-amber-400 font-semibold text-xs uppercase tracking-widest flex items-center gap-1.5 font-tech">
              <BookOpen className="w-3.5 h-3.5" />
              <span>NAVIGASI SISTEM //</span>
            </h4>
            <ul className="space-y-2 text-xs font-sans-custom">
              <li>
                <button
                  onClick={() => setActiveMenu('utama')}
                  className="hover:text-cyan-300 transition flex items-center space-x-2 group text-left"
                >
                  <span className="text-cyan-500 font-mono text-[10px] group-hover:translate-x-0.5 transition-transform">▸</span>
                  <span>Laman Utama & Telemetri Falak</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu('kurikulum')}
                  className="hover:text-cyan-300 transition flex items-center space-x-2 group text-left"
                >
                  <span className="text-cyan-500 font-mono text-[10px] group-hover:translate-x-0.5 transition-transform">▸</span>
                  <span>Pusat Kurikulum e-RPH & Radar PBD</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu('kurikulum')}
                  className="hover:text-cyan-300 transition flex items-center space-x-2 group text-left"
                >
                  <span className="text-cyan-500 font-mono text-[10px] group-hover:translate-x-0.5 transition-transform">▸</span>
                  <span>Penjejak e-Tasmik & Al-Quran</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu('hem')}
                  className="hover:text-cyan-300 transition flex items-center space-x-2 group text-left"
                >
                  <span className="text-cyan-500 font-mono text-[10px] group-hover:translate-x-0.5 transition-transform">▸</span>
                  <span>HEM: Sahsiah SSDM & Imarah Surau</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu('kokurikulum')}
                  className="hover:text-cyan-300 transition flex items-center space-x-2 group text-left"
                >
                  <span className="text-cyan-500 font-mono text-[10px] group-hover:translate-x-0.5 transition-transform">▸</span>
                  <span>Kokurikulum: PAI, Seni Khat & Arena MQSS</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu('umum')}
                  className="hover:text-cyan-300 transition flex items-center space-x-2 group text-left"
                >
                  <span className="text-cyan-500 font-mono text-[10px] group-hover:translate-x-0.5 transition-transform">▸</span>
                  <span>Arkib Dokumen & Khazanah Doa</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal KPM & Rasmi */}
          <div className="space-y-3">
            <h4 className="text-cyan-400 font-semibold text-xs uppercase tracking-widest flex items-center gap-1.5 font-tech">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>GERBANG KPM // SINKRONISASI</span>
            </h4>
            <ul className="space-y-2 text-xs font-sans-custom">
              <li>
                <a
                  href="https://d2.delima.edu.my"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-200 transition flex items-center justify-between group p-2 bg-slate-900/80 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    DELIMa 2.0 KPM
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://apdm.moe.gov.my"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-200 transition flex items-center justify-between group p-2 bg-slate-900/80 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    APDM Pangkalan Data Murid
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://eoperasi.moe.gov.my"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-200 transition flex items-center justify-between group p-2 bg-slate-900/80 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    e-Operasi Modul Guru
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://splkpm.moe.gov.my"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-200 transition flex items-center justify-between group p-2 bg-slate-900/80 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    SPLKPM Latihan Personel
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Hadis Peringatan Guru */}
          <div className="space-y-3 bg-gradient-to-b from-slate-900/90 to-slate-950 p-4 rounded-2xl border border-cyan-500/30 hud-bracket">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-semibold font-tech tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>KALAM HIKMAH PENDIDIK //</span>
            </div>
            <p className="font-arabic text-amber-200 text-base leading-relaxed text-right">
              إِنَّمَا بُعِثْتُ مُعَلِّمًا
            </p>
            <p className="text-xs text-slate-300 italic font-sans-custom leading-relaxed">
              "Sesungguhnya aku diutuskan hanyalah sebagai seorang pendidik (guru)."
            </p>
            <span className="block text-[11px] text-cyan-300/80 font-mono">
              — HR Ibnu Majah (No. 229)
            </span>
            <div className="pt-2 border-t border-cyan-500/20 text-[11px] text-emerald-400 flex items-center space-x-1.5 font-tech">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SKPM KUALITI @ KPM 2026</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-3 sm:space-y-0 font-sans-custom">
          <p>© {new Date().getFullYear()} Portal Rasmi Guru Pendidikan Islam • SK Merbau Pulas • KPM j-QAF</p>
          <div className="flex items-center space-x-4 font-tech">
            <span className="text-cyan-300/70">KONSOL KELUARAN 2.5 • STATUS TELEMETRI: AKTIF</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 bg-slate-900 hover:bg-cyan-950 text-cyan-300 hover:text-white rounded-lg transition border border-cyan-500/30 flex items-center space-x-1"
              title="Kembali ke Atas"
            >
              <ChevronUp className="w-4 h-4" />
              <span className="text-[10px]">ATAS</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
