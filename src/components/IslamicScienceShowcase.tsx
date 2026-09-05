import React, { useState } from 'react';
import {
  Atom,
  Orbit,
  Sparkles,
  BookOpen,
  Cpu,
  ChevronRight,
  ExternalLink,
  Compass,
  Layers,
  Zap
} from 'lucide-react';

export const IslamicScienceShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'astronomi' | 'optik' | 'algoritma' | 'ayat'>('astronomi');

  const scienceTopics = {
    astronomi: {
      title: 'Ilmu Falak & Astrolab (Al-Biruni & Al-Battani)',
      tokoh: 'Abu Raihan Al-Biruni (973–1048M)',
      desc: 'Pelopor falakiah Islam yang mengukur jejari bumi dengan ketepatan 99.7% menggunakan trigonometri di puncak bukit Nandana. Memperbaiki astrolab mekanikal untuk menentukan waktu solat dan arah kiblat secara astronomi jitu.',
      modernConnection: 'Asas teknologi orbit satelit GPS moden & penentuan waktu solat berkomputer JAKIM.',
      quranQuote: 'وَالشَّمْسُ تَجْرِي لِمُسْتَقَرٍّ لَّهَا ۚ ذَٰلِكَ تَقْدِيرُ الْعَزِيزِ الْعَلِيمِ',
      quranTranslation: '"Dan matahari bergerak di tempat peredarannya. Demikianlah ketetapan Yang Maha Perkasa lagi Maha Mengetahui." (Surah Yasin: 38)',
      badge: 'Falakiah & Geodesi'
    },
    optik: {
      title: 'Fizik Optik & Cahaya (Al-Hasan Ibn al-Haytham)',
      tokoh: 'Al-Hasan Ibn al-Haytham (965–1040M)',
      desc: 'Bapa Optik Moden dan kaedah saintifik eksperimen. Menulis Kitab al-Manazir yang membuktikan cahaya bergerak lurus dan mencipta prinsip kamera obskura (Al-Bait Al-Muthlim).',
      modernConnection: 'Asas teknologi penderia kamera digital, mikroskopi laser, dan gentian optik kuantum masa kini.',
      quranQuote: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
      quranTranslation: '"Allah (Pemberi) cahaya kepada langit dan bumi." (Surah An-Nur: 35)',
      badge: 'Fizik Kuantum Optik'
    },
    algoritma: {
      title: 'Aljabar & Algoritma Komputasi (Al-Khwarizmi)',
      tokoh: 'Muhammad bin Musa Al-Khwarizmi (780–850M)',
      desc: 'Pengasas cabang algebra (Al-Jabr) dan pencetus istilah Algoritma. Beliau memperkenalkan angka sifar (0) dan perpuluhan ke dunia sains untuk memudahkan hisab faraid, muamalat, dan astronomi.',
      modernConnection: 'Teras bahasa pengaturcaraan, cip semikonduktor, kecerdasan buatan (AI) dan sistem pengkomputeran kuantum.',
      quranQuote: 'وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ كِتَابًا',
      quranTranslation: '"Dan segala sesuatu telah Kami catat dalam satu kitab (perhitungan yang teliti)." (Surah An-Naba: 29)',
      badge: 'Matematik & AI'
    },
    ayat: {
      title: 'Kosmologi Al-Quran & Fizik Alam Semesta',
      tokoh: 'Mukjizat Saintifik Al-Quran',
      desc: 'Al-Quran mengandungi lebih 750 ayat yang mengajak manusia memerhati, mengkaji, dan meneroka fenomena alam semesta, penciptaan alam, fizik atmosfera, dan peredaran kosmik.',
      modernConnection: 'Menyepadukan sains kognitif dengan nilai tauhid, melahirkan generasi murid celik sains beriman teguh.',
      quranQuote: 'وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْدٍ وَإِنَّا لَمُوسِعُونَ',
      quranTranslation: '"Dan langit itu Kami bina dengan kekuasaan (Kami) dan sesungguhnya Kami benar-benar meluaskannya." (Surah Adz-Dzariyat: 47)',
      badge: 'Alaf Baharu & STEM'
    }
  };

  const current = scienceTopics[activeTab];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#071b26] to-[#041017] border border-cyan-500/40 p-6 sm:p-8 text-white shadow-2xl space-y-6 hud-bracket">
      {/* Laser line & ambient corner glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
              <Atom className="w-5 h-5 text-cyan-300 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-tech tracking-widest text-cyan-400 uppercase font-bold">
                KONSOL SAINS & TAMADUN ISLAM
              </span>
              <span className="px-2 py-0.2 rounded-full text-[9px] bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono">
                STEM-ISLAMIC
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Sinergi Wahyu & Sains Futuristik
            </h3>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 overflow-x-auto p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          {(['astronomi', 'optik', 'algoritma', 'ayat'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-tech uppercase tracking-wider transition ${
                activeTab === tab
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'astronomi' && 'Falak & Kosmos'}
              {tab === 'optik' && 'Optik & Fizik'}
              {tab === 'algoritma' && 'Algoritma & AI'}
              {tab === 'ayat' && 'Kosmologi Quran'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Scientific explanation & modern connection */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 font-tech">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-bold">{current.tokoh}</span>
            <span className="text-slate-500">•</span>
            <span>{current.badge}</span>
          </div>

          <h4 className="text-xl font-bold text-cyan-100 tracking-tight">
            {current.title}
          </h4>

          <p className="text-sm text-slate-300 leading-relaxed font-sans-custom">
            {current.desc}
          </p>

          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-start space-x-2.5">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300 uppercase tracking-wider block mb-0.5 font-tech">
                Kaitan Sains Futuristik Moden:
              </span>
              <p className="text-slate-300">{current.modernConnection}</p>
            </div>
          </div>
        </div>

        {/* Right: Quranic Foundation Card with Arabic Calligraphy & Cosmic Visual */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-5 pointer-events-none text-9xl font-arabic text-amber-400">
            الله
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dasar Al-Quran & Kosmologi</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">MUKJIZAT SAINTIFIK</span>
          </div>

          <div className="space-y-3">
            <p className="font-arabic text-lg sm:text-xl text-amber-200 text-right leading-loose font-bold">
              {current.quranQuote}
            </p>

            <p className="text-xs text-slate-300 leading-relaxed italic font-sans-custom border-l-2 border-amber-400/60 pl-3">
              {current.quranTranslation}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-tech">
            <span className="flex items-center gap-1 text-cyan-400">
              <Compass className="w-3 h-3" />
              <span>Penyelidikan PdPc Islamik</span>
            </span>
            <span className="text-emerald-400 font-mono">STATUS: SAHIH</span>
          </div>
        </div>
      </div>
    </div>
  );
};
