export interface BidangTheme {
  id: string;
  name: string;
  jawiName: string;
  description: string;
  // Core colors
  primaryHex: string;
  secondaryHex: string;
  bgLightHex: string;
  bgSoftHex: string;
  borderHex: string;
  // Tailwind classes for Screen & Light Print
  badgeClass: string;
  accentGradient: string;
  cardBorderClass: string;
  cardBorderPrint: string;
  headerBarClass: string;
  metaBoxClass: string;
  metaBoxPrint: string;
  contentBoxClass: string;
  contentBoxPrint: string;
  skSpBoxClass: string;
  skSpBoxPrint: string;
  objBoxClass: string;
  objBoxPrint: string;
  actBoxClass: string;
  actBoxPrint: string;
  pedagogyBoxClass: string;
  pedagogyBoxPrint: string;
  reflectionBoxClass: string;
  reflectionBoxPrint: string;
  headingTextClass: string;
  labelColorClass: string;
  badgePillClass: string;
}

export const BIDANG_THEMES: Record<string, BidangTheme> = {
  'Al-Quran': {
    id: 'Al-Quran',
    name: 'Al-Quran',
    jawiName: 'القرءان',
    description: 'Tilawah, Hafazan & Kefahaman Al-Quran',
    primaryHex: '#059669', // Emerald 600
    secondaryHex: '#10b981', // Emerald 500
    bgLightHex: '#d1fae5', // Emerald 100 - cheerful vibrant green tint
    bgSoftHex: '#a7f3d0', // Emerald 200
    borderHex: '#059669', // Emerald 600
    badgeClass: 'bg-emerald-600 text-white border-emerald-400',
    accentGradient: 'from-emerald-600 via-teal-500 to-emerald-500',
    cardBorderClass: 'border-emerald-500/40 hover:border-emerald-400/80',
    cardBorderPrint: 'print:border-emerald-600',
    headerBarClass: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white',
    metaBoxClass: 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100',
    metaBoxPrint: 'print:bg-emerald-100 print:border-emerald-600 print:text-slate-900',
    contentBoxClass: 'bg-emerald-950/20 border-emerald-500/20',
    contentBoxPrint: 'print:bg-emerald-50 print:border-emerald-500',
    skSpBoxClass: 'bg-emerald-950/30 border-emerald-500/30',
    skSpBoxPrint: 'print:bg-emerald-100/80 print:border-emerald-600',
    objBoxClass: 'bg-emerald-950/30 border-emerald-500/30',
    objBoxPrint: 'print:bg-emerald-100/80 print:border-emerald-600',
    actBoxClass: 'bg-emerald-950/25 border-emerald-500/25',
    actBoxPrint: 'print:bg-emerald-50/90 print:border-emerald-600',
    pedagogyBoxClass: 'bg-emerald-950/40 border-emerald-500/30',
    pedagogyBoxPrint: 'print:bg-emerald-100/80 print:border-emerald-600',
    reflectionBoxClass: 'bg-emerald-950/40 border-emerald-500/30',
    reflectionBoxPrint: 'print:bg-emerald-100/80 print:border-emerald-600',
    headingTextClass: 'text-emerald-300 print:text-emerald-900',
    labelColorClass: 'text-emerald-400 print:text-emerald-800',
    badgePillClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 print:bg-emerald-600 print:text-white print:border-emerald-600'
  },
  'Hadis': {
    id: 'Hadis',
    name: 'Hadis',
    jawiName: 'حديث',
    description: 'Hadis Nabawi & Penghayatan Sunnah',
    primaryHex: '#0284c7', // Sky 600
    secondaryHex: '#38bdf8', // Sky 400
    bgLightHex: '#e0f2fe', // Sky 100 - cheerful bright sky blue tint
    bgSoftHex: '#bae6fd', // Sky 200
    borderHex: '#0284c7', // Sky 600
    badgeClass: 'bg-sky-600 text-white border-sky-400',
    accentGradient: 'from-sky-600 via-cyan-500 to-blue-500',
    cardBorderClass: 'border-sky-500/40 hover:border-sky-400/80',
    cardBorderPrint: 'print:border-sky-600',
    headerBarClass: 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white',
    metaBoxClass: 'bg-sky-950/30 border-sky-500/30 text-sky-100',
    metaBoxPrint: 'print:bg-sky-100 print:border-sky-600 print:text-slate-900',
    contentBoxClass: 'bg-sky-950/20 border-sky-500/20',
    contentBoxPrint: 'print:bg-sky-50 print:border-sky-500',
    skSpBoxClass: 'bg-sky-950/30 border-sky-500/30',
    skSpBoxPrint: 'print:bg-sky-100/80 print:border-sky-600',
    objBoxClass: 'bg-sky-950/30 border-sky-500/30',
    objBoxPrint: 'print:bg-sky-100/80 print:border-sky-600',
    actBoxClass: 'bg-sky-950/25 border-sky-500/25',
    actBoxPrint: 'print:bg-sky-50/90 print:border-sky-600',
    pedagogyBoxClass: 'bg-sky-950/40 border-sky-500/30',
    pedagogyBoxPrint: 'print:bg-sky-100/80 print:border-sky-600',
    reflectionBoxClass: 'bg-sky-950/40 border-sky-500/30',
    reflectionBoxPrint: 'print:bg-sky-100/80 print:border-sky-600',
    headingTextClass: 'text-sky-300 print:text-sky-900',
    labelColorClass: 'text-sky-400 print:text-sky-800',
    badgePillClass: 'bg-sky-500/20 text-sky-300 border-sky-400/40 print:bg-sky-600 print:text-white print:border-sky-600'
  },
  'Akidah': {
    id: 'Akidah',
    name: 'Akidah',
    jawiName: 'عقيدة',
    description: 'Keimanan, Rukun Iman & Asmaul Husna',
    primaryHex: '#7c3aed', // Violet 600
    secondaryHex: '#a78bfa', // Violet 400
    bgLightHex: '#ede9fe', // Violet 100 - cheerful bright lavender violet
    bgSoftHex: '#ddd6fe', // Violet 200
    borderHex: '#7c3aed', // Violet 600
    badgeClass: 'bg-violet-600 text-white border-violet-400',
    accentGradient: 'from-violet-600 via-purple-500 to-indigo-500',
    cardBorderClass: 'border-violet-500/40 hover:border-violet-400/80',
    cardBorderPrint: 'print:border-violet-600',
    headerBarClass: 'bg-gradient-to-r from-violet-600 to-purple-500 text-white',
    metaBoxClass: 'bg-violet-950/30 border-violet-500/30 text-violet-100',
    metaBoxPrint: 'print:bg-violet-100 print:border-violet-600 print:text-slate-900',
    contentBoxClass: 'bg-violet-950/20 border-violet-500/20',
    contentBoxPrint: 'print:bg-violet-50 print:border-violet-500',
    skSpBoxClass: 'bg-violet-950/30 border-violet-500/30',
    skSpBoxPrint: 'print:bg-violet-100/80 print:border-violet-600',
    objBoxClass: 'bg-violet-950/30 border-violet-500/30',
    objBoxPrint: 'print:bg-violet-100/80 print:border-violet-600',
    actBoxClass: 'bg-violet-950/25 border-violet-500/25',
    actBoxPrint: 'print:bg-violet-50/90 print:border-violet-600',
    pedagogyBoxClass: 'bg-violet-950/40 border-violet-500/30',
    pedagogyBoxPrint: 'print:bg-violet-100/80 print:border-violet-600',
    reflectionBoxClass: 'bg-violet-950/40 border-violet-500/30',
    reflectionBoxPrint: 'print:bg-violet-100/80 print:border-violet-600',
    headingTextClass: 'text-violet-300 print:text-violet-900',
    labelColorClass: 'text-violet-400 print:text-violet-800',
    badgePillClass: 'bg-violet-500/20 text-violet-300 border-violet-400/40 print:bg-violet-600 print:text-white print:border-violet-600'
  },
  'Ibadah': {
    id: 'Ibadah',
    name: 'Ibadah',
    jawiName: 'عبادة',
    description: 'Solat, Bersuci & Rukun Islam',
    primaryHex: '#2563eb', // Blue 600
    secondaryHex: '#60a5fa', // Blue 400
    bgLightHex: '#dbeafe', // Blue 100 - cheerful royal ocean blue tint
    bgSoftHex: '#bfdbfe', // Blue 200
    borderHex: '#2563eb', // Blue 600
    badgeClass: 'bg-blue-600 text-white border-blue-400',
    accentGradient: 'from-blue-600 via-indigo-500 to-sky-500',
    cardBorderClass: 'border-blue-500/40 hover:border-blue-400/80',
    cardBorderPrint: 'print:border-blue-600',
    headerBarClass: 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white',
    metaBoxClass: 'bg-blue-950/30 border-blue-500/30 text-blue-100',
    metaBoxPrint: 'print:bg-blue-100 print:border-blue-600 print:text-slate-900',
    contentBoxClass: 'bg-blue-950/20 border-blue-500/20',
    contentBoxPrint: 'print:bg-blue-50 print:border-blue-500',
    skSpBoxClass: 'bg-blue-950/30 border-blue-500/30',
    skSpBoxPrint: 'print:bg-blue-100/80 print:border-blue-600',
    objBoxClass: 'bg-blue-950/30 border-blue-500/30',
    objBoxPrint: 'print:bg-blue-100/80 print:border-blue-600',
    actBoxClass: 'bg-blue-950/25 border-blue-500/25',
    actBoxPrint: 'print:bg-blue-50/90 print:border-blue-600',
    pedagogyBoxClass: 'bg-blue-950/40 border-blue-500/30',
    pedagogyBoxPrint: 'print:bg-blue-100/80 print:border-blue-600',
    reflectionBoxClass: 'bg-blue-950/40 border-blue-500/30',
    reflectionBoxPrint: 'print:bg-blue-100/80 print:border-blue-600',
    headingTextClass: 'text-blue-300 print:text-blue-900',
    labelColorClass: 'text-blue-400 print:text-blue-800',
    badgePillClass: 'bg-blue-500/20 text-blue-300 border-blue-400/40 print:bg-blue-600 print:text-white print:border-blue-600'
  },
  'Sirah': {
    id: 'Sirah',
    name: 'Sirah',
    jawiName: 'سيرة',
    description: 'Sejarah & Riwayat Hidup Rasulullah SAW',
    primaryHex: '#d97706', // Amber 600
    secondaryHex: '#f59e0b', // Amber 500
    bgLightHex: '#fef3c7', // Amber 100 - cheerful golden sunny yellow
    bgSoftHex: '#fde68a', // Amber 200
    borderHex: '#d97706', // Amber 600
    badgeClass: 'bg-amber-600 text-white border-amber-400',
    accentGradient: 'from-amber-600 via-orange-500 to-amber-500',
    cardBorderClass: 'border-amber-500/40 hover:border-amber-400/80',
    cardBorderPrint: 'print:border-amber-600',
    headerBarClass: 'bg-gradient-to-r from-amber-600 to-orange-500 text-white',
    metaBoxClass: 'bg-amber-950/30 border-amber-500/30 text-amber-100',
    metaBoxPrint: 'print:bg-amber-100 print:border-amber-600 print:text-slate-900',
    contentBoxClass: 'bg-amber-950/20 border-amber-500/20',
    contentBoxPrint: 'print:bg-amber-50 print:border-amber-500',
    skSpBoxClass: 'bg-amber-950/30 border-amber-500/30',
    skSpBoxPrint: 'print:bg-amber-100/80 print:border-amber-600',
    objBoxClass: 'bg-amber-950/30 border-amber-500/30',
    objBoxPrint: 'print:bg-amber-100/80 print:border-amber-600',
    actBoxClass: 'bg-amber-950/25 border-amber-500/25',
    actBoxPrint: 'print:bg-amber-50/90 print:border-amber-600',
    pedagogyBoxClass: 'bg-amber-950/40 border-amber-500/30',
    pedagogyBoxPrint: 'print:bg-amber-100/80 print:border-amber-600',
    reflectionBoxClass: 'bg-amber-950/40 border-amber-500/30',
    reflectionBoxPrint: 'print:bg-amber-100/80 print:border-amber-600',
    headingTextClass: 'text-amber-300 print:text-amber-900',
    labelColorClass: 'text-amber-400 print:text-amber-800',
    badgePillClass: 'bg-amber-500/20 text-amber-300 border-amber-400/40 print:bg-amber-600 print:text-white print:border-amber-600'
  },
  'Adab': {
    id: 'Adab',
    name: 'Adab',
    jawiName: 'ادب',
    description: 'Adab & Akhlak Islamiah Seharian',
    primaryHex: '#e11d48', // Rose 600
    secondaryHex: '#fb7185', // Rose 400
    bgLightHex: '#ffe4e6', // Rose 100 - cheerful rose coral blush
    bgSoftHex: '#fecdd3', // Rose 200
    borderHex: '#e11d48', // Rose 600
    badgeClass: 'bg-rose-600 text-white border-rose-400',
    accentGradient: 'from-rose-600 via-pink-500 to-rose-400',
    cardBorderClass: 'border-rose-500/40 hover:border-rose-400/80',
    cardBorderPrint: 'print:border-rose-600',
    headerBarClass: 'bg-gradient-to-r from-rose-600 to-pink-500 text-white',
    metaBoxClass: 'bg-rose-950/30 border-rose-500/30 text-rose-100',
    metaBoxPrint: 'print:bg-rose-100 print:border-rose-600 print:text-slate-900',
    contentBoxClass: 'bg-rose-950/20 border-rose-500/20',
    contentBoxPrint: 'print:bg-rose-50 print:border-rose-500',
    skSpBoxClass: 'bg-rose-950/30 border-rose-500/30',
    skSpBoxPrint: 'print:bg-rose-100/80 print:border-rose-600',
    objBoxClass: 'bg-rose-950/30 border-rose-500/30',
    objBoxPrint: 'print:bg-rose-100/80 print:border-rose-600',
    actBoxClass: 'bg-rose-950/25 border-rose-500/25',
    actBoxPrint: 'print:bg-rose-50/90 print:border-rose-600',
    pedagogyBoxClass: 'bg-rose-950/40 border-rose-500/30',
    pedagogyBoxPrint: 'print:bg-rose-100/80 print:border-rose-600',
    reflectionBoxClass: 'bg-rose-950/40 border-rose-500/30',
    reflectionBoxPrint: 'print:bg-rose-100/80 print:border-rose-600',
    headingTextClass: 'text-rose-300 print:text-rose-900',
    labelColorClass: 'text-rose-400 print:text-rose-800',
    badgePillClass: 'bg-rose-500/20 text-rose-300 border-rose-400/40 print:bg-rose-600 print:text-white print:border-rose-600'
  },
  'Jawi': {
    id: 'Jawi',
    name: 'Jawi',
    jawiName: 'جاوي',
    description: 'Membaca, Menulis & Seni Khat Warisan',
    primaryHex: '#db2777', // Pink 600
    secondaryHex: '#f472b6', // Pink 400
    bgLightHex: '#fce7f3', // Pink 100 - cheerful vibrant magenta pink
    bgSoftHex: '#fbcfe8', // Pink 200
    borderHex: '#db2777', // Pink 600
    badgeClass: 'bg-pink-600 text-white border-pink-400',
    accentGradient: 'from-pink-600 via-rose-500 to-fuchsia-500',
    cardBorderClass: 'border-pink-500/40 hover:border-pink-400/80',
    cardBorderPrint: 'print:border-pink-600',
    headerBarClass: 'bg-gradient-to-r from-pink-600 to-fuchsia-500 text-white',
    metaBoxClass: 'bg-pink-950/30 border-pink-500/30 text-pink-100',
    metaBoxPrint: 'print:bg-pink-100 print:border-pink-600 print:text-slate-900',
    contentBoxClass: 'bg-pink-950/20 border-pink-500/20',
    contentBoxPrint: 'print:bg-pink-50 print:border-pink-500',
    skSpBoxClass: 'bg-pink-950/30 border-pink-500/30',
    skSpBoxPrint: 'print:bg-pink-100/80 print:border-pink-600',
    objBoxClass: 'bg-pink-950/30 border-pink-500/30',
    objBoxPrint: 'print:bg-pink-100/80 print:border-pink-600',
    actBoxClass: 'bg-pink-950/25 border-pink-500/25',
    actBoxPrint: 'print:bg-pink-50/90 print:border-pink-600',
    pedagogyBoxClass: 'bg-pink-950/40 border-pink-500/30',
    pedagogyBoxPrint: 'print:bg-pink-100/80 print:border-pink-600',
    reflectionBoxClass: 'bg-pink-950/40 border-pink-500/30',
    reflectionBoxPrint: 'print:bg-pink-100/80 print:border-pink-600',
    headingTextClass: 'text-pink-300 print:text-pink-900',
    labelColorClass: 'text-pink-400 print:text-pink-800',
    badgePillClass: 'bg-pink-500/20 text-pink-300 border-pink-400/40 print:bg-pink-600 print:text-white print:border-pink-600'
  },
  'Bahasa Arab': {
    id: 'Bahasa Arab',
    name: 'Bahasa Arab',
    jawiName: 'لغة عربية',
    description: 'Kemahiran Bahasa Al-Quran',
    primaryHex: '#0d9488', // Teal 600
    secondaryHex: '#2dd4bf', // Teal 400
    bgLightHex: '#ccfbf1', // Teal 100 - cheerful fresh aqua teal
    bgSoftHex: '#99f6e4', // Teal 200
    borderHex: '#0d9488', // Teal 600
    badgeClass: 'bg-teal-600 text-white border-teal-400',
    accentGradient: 'from-teal-600 via-cyan-500 to-teal-500',
    cardBorderClass: 'border-teal-500/40 hover:border-teal-400/80',
    cardBorderPrint: 'print:border-teal-600',
    headerBarClass: 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white',
    metaBoxClass: 'bg-teal-950/30 border-teal-500/30 text-teal-100',
    metaBoxPrint: 'print:bg-teal-100 print:border-teal-600 print:text-slate-900',
    contentBoxClass: 'bg-teal-950/20 border-teal-500/20',
    contentBoxPrint: 'print:bg-teal-50 print:border-teal-500',
    skSpBoxClass: 'bg-teal-950/30 border-teal-500/30',
    skSpBoxPrint: 'print:bg-teal-100/80 print:border-teal-600',
    objBoxClass: 'bg-teal-950/30 border-teal-500/30',
    objBoxPrint: 'print:bg-teal-100/80 print:border-teal-600',
    actBoxClass: 'bg-teal-950/25 border-teal-500/25',
    actBoxPrint: 'print:bg-teal-50/90 print:border-teal-600',
    pedagogyBoxClass: 'bg-teal-950/40 border-teal-500/30',
    pedagogyBoxPrint: 'print:bg-teal-100/80 print:border-teal-600',
    reflectionBoxClass: 'bg-teal-950/40 border-teal-500/30',
    reflectionBoxPrint: 'print:bg-teal-100/80 print:border-teal-600',
    headingTextClass: 'text-teal-300 print:text-teal-900',
    labelColorClass: 'text-teal-400 print:text-teal-800',
    badgePillClass: 'bg-teal-500/20 text-teal-300 border-teal-400/40 print:bg-teal-600 print:text-white print:border-teal-600'
  },
  'Tasmik': {
    id: 'Tasmik',
    name: 'Tasmik (Al-Quran)',
    jawiName: 'تسميع القرءان',
    description: 'Bimbingan Talaqqi Musyafahah Al-Quran & Iqra',
    primaryHex: '#059669', // Emerald 600
    secondaryHex: '#d97706', // Amber 600 (Golden accent)
    bgLightHex: '#d1fae5', // Emerald 100
    bgSoftHex: '#fef3c7', // Amber 100
    borderHex: '#059669', // Emerald 600
    badgeClass: 'bg-gradient-to-r from-emerald-600 to-amber-600 text-white border-amber-300',
    accentGradient: 'from-emerald-600 via-teal-600 to-amber-500',
    cardBorderClass: 'border-emerald-500/50 hover:border-amber-400/80',
    cardBorderPrint: 'print:border-emerald-700',
    headerBarClass: 'bg-gradient-to-r from-emerald-700 via-teal-600 to-amber-600 text-white',
    metaBoxClass: 'bg-emerald-950/30 border-amber-500/30 text-amber-100',
    metaBoxPrint: 'print:bg-emerald-100 print:border-emerald-600 print:text-slate-900',
    contentBoxClass: 'bg-emerald-950/20 border-emerald-500/20',
    contentBoxPrint: 'print:bg-emerald-50 print:border-emerald-500',
    skSpBoxClass: 'bg-emerald-950/30 border-emerald-500/30',
    skSpBoxPrint: 'print:bg-emerald-100/80 print:border-emerald-600',
    objBoxClass: 'bg-emerald-950/30 border-emerald-500/30',
    objBoxPrint: 'print:bg-emerald-100/80 print:border-emerald-600',
    actBoxClass: 'bg-emerald-950/25 border-emerald-500/25',
    actBoxPrint: 'print:bg-emerald-50/90 print:border-emerald-600',
    pedagogyBoxClass: 'bg-emerald-950/40 border-amber-500/30',
    pedagogyBoxPrint: 'print:bg-amber-100/80 print:border-amber-600',
    reflectionBoxClass: 'bg-emerald-950/40 border-amber-500/30',
    reflectionBoxPrint: 'print:bg-emerald-100/80 print:border-emerald-600',
    headingTextClass: 'text-amber-300 print:text-emerald-900',
    labelColorClass: 'text-amber-400 print:text-emerald-800',
    badgePillClass: 'bg-amber-500/20 text-amber-300 border-amber-400/40 print:bg-emerald-600 print:text-white print:border-emerald-600'
  }
};

/**
 * Normalizes any string to matching BidangTheme
 */
export function getBidangTheme(learningArea?: string, isTasmik?: boolean): BidangTheme {
  if (isTasmik) {
    return BIDANG_THEMES['Tasmik'];
  }

  if (!learningArea) {
    return BIDANG_THEMES['Al-Quran'];
  }

  const clean = learningArea.trim().toLowerCase();

  if (clean.includes('tasmik') || clean.includes('تسميع')) {
    return BIDANG_THEMES['Tasmik'];
  }
  if (clean.includes('quran') || clean.includes('qur\'an') || clean.includes('tilawah') || clean.includes('hafazan') || clean.includes('قرءان') || clean.includes('قرآن')) {
    return BIDANG_THEMES['Al-Quran'];
  }
  if (clean.includes('hadis') || clean.includes('hadith') || clean.includes('حديث')) {
    return BIDANG_THEMES['Hadis'];
  }
  if (clean.includes('akidah') || clean.includes('aqidah') || clean.includes('عقيدة')) {
    return BIDANG_THEMES['Akidah'];
  }
  if (clean.includes('ibadah') || clean.includes('ibadat') || clean.includes('عبادة')) {
    return BIDANG_THEMES['Ibadah'];
  }
  if (clean.includes('sirah') || clean.includes('sejarah') || clean.includes('سيرة')) {
    return BIDANG_THEMES['Sirah'];
  }
  if (clean.includes('adab') || clean.includes('akhlak') || clean.includes('ادب')) {
    return BIDANG_THEMES['Adab'];
  }
  if (clean.includes('jawi') || clean.includes('khat') || clean.includes('جاوي')) {
    return BIDANG_THEMES['Jawi'];
  }
  if (clean.includes('arab') || clean.includes('bahasa arab') || clean.includes('عربية')) {
    return BIDANG_THEMES['Bahasa Arab'];
  }

  // Exact key match fallback
  if (BIDANG_THEMES[learningArea]) {
    return BIDANG_THEMES[learningArea];
  }

  return BIDANG_THEMES['Al-Quran'];
}
