import React, { useState } from 'react';
import { MainMenuType, PrayerTimeData, MenuItemConfig } from '../types';
import {
  Home,
  BookOpen,
  Users,
  Award,
  Globe,
  Star,
  Calendar,
  ShieldCheck,
  Heart,
  FileText,
  Clock,
  MapPin,
  Menu,
  X,
  Printer,
  Sparkles,
  BookMarked,
  Lock,
  Unlock,
  Edit3,
  Database
} from 'lucide-react';

interface NavbarProps {
  activeMenu: MainMenuType;
  setActiveMenu: (menu: MainMenuType) => void;
  prayerData: PrayerTimeData;
  allZones: Record<string, PrayerTimeData>;
  selectedZone: string;
  onSelectZone: (zone: string) => void;
  onOpenPrayerModal: () => void;
  onOpenQuickRph: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  menuItems?: MenuItemConfig[];
  onOpenMenuEditor?: () => void;
  onOpenFirebaseModal?: () => void;
}

const getMenuIcon = (iconName: string): React.ComponentType<{ className?: string }> => {
  switch (iconName) {
    case 'Home': return Home;
    case 'BookOpen': return BookOpen;
    case 'Users': return Users;
    case 'Award': return Award;
    case 'Globe': return Globe;
    case 'Star': return Star;
    case 'Calendar': return Calendar;
    case 'ShieldCheck': return ShieldCheck;
    case 'Heart': return Heart;
    case 'FileText': return FileText;
    default: return BookOpen;
  }
};

export const Navbar: React.FC<NavbarProps> = ({
  activeMenu,
  setActiveMenu,
  prayerData,
  allZones,
  selectedZone,
  onSelectZone,
  onOpenPrayerModal,
  onOpenQuickRph,
  isAdmin,
  onToggleAdmin,
  menuItems = [],
  onOpenMenuEditor,
  onOpenFirebaseModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isZoneDropdownOpen, setIsZoneDropdownOpen] = useState(false);

  const fallbackMenuItems = [
    { id: 'utama' as MainMenuType, label: 'Utama', subLabel: 'Laman Utama', iconName: 'Home', enabled: true },
    { id: 'kurikulum' as MainMenuType, label: 'Kurikulum', subLabel: 'e-RPH, PBD & DSKP', iconName: 'BookOpen', enabled: true },
    { id: 'hem' as MainMenuType, label: 'HEM', subLabel: 'Hal Ehwal Murid', iconName: 'Users', enabled: true },
    { id: 'kokurikulum' as MainMenuType, label: 'Kokurikulum', subLabel: 'PAI, Khat & MQSS', iconName: 'Award', enabled: true },
    { id: 'umum' as MainMenuType, label: 'Umum', subLabel: 'Direktori & Dokumen', iconName: 'Globe', enabled: true }
  ];

  const effectiveMenuItems = (menuItems && menuItems.length > 0 ? menuItems : fallbackMenuItems)
    .filter((m) => m.enabled !== false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/30 text-white shadow-2xl">
      {/* Top Cyber Laser Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-emerald-400 via-amber-400 to-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]" />

      {/* Mini Telemetry Bar: Hijri, Prayer Times & Zone Selector */}
      <div className="bg-[#020d14]/90 border-b border-cyan-500/20 text-xs px-4 py-1.5 hidden md:flex items-center justify-between font-tech">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-amber-300 font-medium space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-cyan-300 text-[11px] font-bold">FALAK-SYNC //</span>
            <span className="font-mono text-amber-300">{prayerData.hijriDate}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-mono">{prayerData.date}</span>
          </div>

          <div className="hidden lg:flex items-center space-x-3 text-slate-400 border-l border-cyan-500/20 pl-3 font-mono text-[11px]">
            <span>SUBUH: <b className="text-cyan-300">{prayerData.subuh}</b></span>
            <span>ZOHOR: <b className="text-amber-300">{prayerData.zohor}</b></span>
            <span>ASAR: <b className="text-cyan-300">{prayerData.asar}</b></span>
            <span>MAGHRIB: <b className="text-cyan-300">{prayerData.maghrib}</b></span>
            <span>ISYAK: <b className="text-cyan-300">{prayerData.isyak}</b></span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Quick Zone Selector */}
          <div className="relative">
            <button
              onClick={() => setIsZoneDropdownOpen(!isZoneDropdownOpen)}
              className="flex items-center space-x-1.5 text-cyan-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 px-2.5 py-1 rounded-lg transition text-xs border border-cyan-500/30 font-tech"
              title="Tukar Zon Waktu Solat"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="max-w-[140px] truncate">{prayerData.zoneName.split(',')[0]}</span>
              <span className="text-amber-300 font-mono text-[10px]">[{selectedZone}]</span>
            </button>

            {isZoneDropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-slate-950 border border-cyan-500/40 rounded-xl shadow-2xl z-50 py-1.5 max-h-72 overflow-y-auto hud-bracket">
                <div className="px-3 py-1 text-[11px] font-semibold text-cyan-400 uppercase tracking-widest border-b border-cyan-500/20 font-tech">
                  Zon Falak Malaysia (JAKIM)
                </div>
                {(Object.values(allZones) as PrayerTimeData[]).map((zone) => (
                  <button
                    key={zone.zone}
                    onClick={() => {
                      onSelectZone(zone.zone);
                      setIsZoneDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-cyan-950/60 transition ${
                      selectedZone === zone.zone ? 'bg-cyan-950/80 text-cyan-300 font-medium' : 'text-slate-300'
                    }`}
                  >
                    <span className="truncate pr-2 font-sans-custom">{zone.zoneName}</span>
                    <span className="text-[10px] text-amber-300 font-mono">{zone.zone}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onOpenPrayerModal}
            className="flex items-center space-x-1 text-cyan-300 hover:text-white transition px-2 py-1 font-tech text-[11px]"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>RADAR FALAK</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Header */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveMenu('utama')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-emerald-600 to-slate-950 p-0.5 shadow-lg flex items-center justify-center border border-cyan-400/50">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center">
                <span className="font-arabic text-amber-300 text-lg leading-none font-bold">قرآن</span>
                <span className="text-[8px] font-bold tracking-widest text-cyan-400 uppercase font-tech">GPI</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5 font-sans-custom">
                  Portal Guru Pendidikan Islam
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-tech font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    KPM j-QAF
                  </span>
                </span>
              </div>
              <p className="text-xs text-cyan-200/70 font-sans-custom">
                Ustaz Muhammad Harith • SK Seri Saujana
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1.5">
            {effectiveMenuItems.map((item) => {
              const Icon = getMenuIcon(item.iconName);
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveMenu(item.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2.5 font-tech ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/90 to-emerald-950/80 text-cyan-200 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300 animate-pulse' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <div className="leading-none flex items-center gap-1.5">
                      <span className="tracking-wide">{item.label.toUpperCase()}</span>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full font-mono">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] opacity-70 font-normal leading-tight mt-0.5 font-sans-custom">{item.subLabel}</div>
                  </div>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full shadow-[0_0_6px_#06b6d4]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Admin Toggle Button */}
            <button
              onClick={onToggleAdmin}
              className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-xl transition shadow-md font-tech tracking-wide ${
                isAdmin
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 ring-2 ring-amber-400/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30'
              }`}
              title={isAdmin ? 'Mod Pentadbir sedang aktif. Klik untuk nyahaktif' : 'Aktifkan Mod Pentadbir untuk menyunting semua menu'}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                  <span>ADMIN [AKTIF]</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>MOD ADMIN</span>
                </>
              )}
            </button>

            {onOpenFirebaseModal && (
              <button
                type="button"
                onClick={onOpenFirebaseModal}
                className="flex items-center space-x-1.5 px-2.5 py-2 text-xs font-bold text-cyan-300 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 rounded-xl transition shadow font-tech tracking-wide"
                title="Integrasi Firebase Cloud Firestore"
              >
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline">FIREBASE</span>
              </button>
            )}

            <button
              onClick={onOpenQuickRph}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl transition shadow-lg font-tech tracking-wide hover:scale-102"
              title="Jana e-RPH Pantas"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>+ e-RPH PANTAS</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-900 rounded-xl transition border border-slate-800 no-print"
              title="Cetak Paparan Semasa"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2 font-tech">
            <button
              onClick={onToggleAdmin}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg flex items-center space-x-1 ${
                isAdmin ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'ADMIN' : 'LOCK'}</span>
            </button>
            <button
              onClick={onOpenQuickRph}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-lg"
            >
              + RPH
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-cyan-300 hover:text-white hover:bg-slate-900 rounded-lg border border-cyan-500/20"
              aria-label="Buka Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-cyan-500/30 px-4 pt-2 pb-5 space-y-2 animate-in fade-in slide-in-from-top-3">
          <div className="p-2.5 bg-slate-900/90 border border-cyan-500/30 rounded-xl text-xs flex items-center justify-between text-amber-300 mb-2 font-tech">
            <span className="font-mono">{prayerData.hijriDate}</span>
            <button
              onClick={() => {
                onOpenPrayerModal();
                setIsMobileMenuOpen(false);
              }}
              className="text-cyan-400 underline text-[11px]"
            >
              RADAR FALAK
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {effectiveMenuItems.map((item) => {
              const Icon = getMenuIcon(item.iconName);
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between transition font-tech ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-200 font-bold border border-cyan-400/50 shadow-md'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span>{item.label.toUpperCase()}</span>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full font-mono">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-normal font-sans-custom">{item.subLabel}</div>
                    </div>
                  </div>
                  {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-tech">
            {onOpenFirebaseModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenFirebaseModal();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-1.5 text-xs text-cyan-300 hover:text-cyan-200 font-bold"
              >
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>STATUS FIREBASE</span>
              </button>
            )}

            <button
              onClick={() => {
                handlePrint();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 text-xs text-slate-400 hover:text-cyan-300"
            >
              <Printer className="w-4 h-4" />
              <span>CETAK</span>
            </button>

            <span className="text-[11px] text-slate-500 font-mono">
              SISTEM GPI 2026.1
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
