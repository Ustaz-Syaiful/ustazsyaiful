import React, { useState } from 'react';
import { PrayerTimeData } from '../types';
import {
  X,
  Clock,
  Compass,
  Volume2,
  VolumeX,
  Calendar,
  MapPin,
  CheckCircle2,
  Bell
} from 'lucide-react';

interface PrayerTimesModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerData: PrayerTimeData;
  allZones: Record<string, PrayerTimeData>;
  selectedZone: string;
  onSelectZone: (zone: string) => void;
}

export const PrayerTimesModal: React.FC<PrayerTimesModalProps> = ({
  isOpen,
  onClose,
  prayerData,
  allZones,
  selectedZone,
  onSelectZone
}) => {
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [activeTab, setActiveTab] = useState<'harian' | 'panduan'>('harian');

  if (!isOpen) return null;

  const prayers = [
    { name: 'Imsak', time: prayerData.imsak, desc: '10 Minit sebelum waktu Subuh bermula', icon: '🌙' },
    { name: 'Subuh', time: prayerData.subuh, desc: 'Fajar Sadiq sehingga terbit matahari (2 Rakaat)', icon: '🌅' },
    { name: 'Syuruk', time: prayerData.syuruk, desc: 'Matahari terbit (Tamat waktu Subuh)', icon: '☀️' },
    { name: 'Zohor', time: prayerData.zohor, desc: 'Matahari tergelincir dari rembang (4 Rakaat)', icon: '☀️' },
    { name: 'Asar', time: prayerData.asar, desc: 'Bayang objek melebihi panjang sebenar (4 Rakaat)', icon: '🌤️' },
    { name: 'Maghrib', time: prayerData.maghrib, desc: 'Matahari terbenam sepenuhnya (3 Rakaat)', icon: '🌇' },
    { name: 'Isyak', time: prayerData.isyak, desc: 'Hilang mega merah di ufuk barat (4 Rakaat)', icon: '🌌' }
  ];

  const toggleAdhanSimulation = () => {
    setIsPlayingAdhan(!isPlayingAdhan);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl text-white overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-5 border-b border-emerald-700/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center border border-emerald-400/40 shadow-inner">
              <Clock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Waktu Solat Zon Malaysia
                <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  JAKIM / JAPIM
                </span>
              </h3>
              <p className="text-xs text-emerald-200">
                {prayerData.hijriDate} • {prayerData.date}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subheader & Zone Selector */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <label className="text-xs text-slate-400">Pilih Kawasan / Zon:</label>
            <select
              value={selectedZone}
              onChange={(e) => onSelectZone(e.target.value)}
              className="bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
            >
              {(Object.values(allZones) as PrayerTimeData[]).map((z) => (
                <option key={z.zone} value={z.zone}>
                  [{z.zone}] {z.zoneName}
                </option>
              ))}
            </select>
          </div>

          {/* Adhan simulation audio pill */}
          <button
            onClick={toggleAdhanSimulation}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              isPlayingAdhan
                ? 'bg-amber-400 text-slate-950 font-bold animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {isPlayingAdhan ? <Volume2 className="w-4 h-4" /> : <Bell className="w-4 h-4 text-amber-400" />}
            <span>{isPlayingAdhan ? 'Simulasi Azan Aktif...' : 'Uji Peringatan Azan'}</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-4 pt-2">
          <button
            onClick={() => setActiveTab('harian')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'harian'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Jadual Waktu Solat Hari Ini
          </button>
          <button
            onClick={() => setActiveTab('panduan')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'panduan'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Panduan & Arah Kiblat
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {activeTab === 'harian' ? (
            <div className="space-y-3">
              {prayers.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                    p.name === 'Zohor' || p.name === 'Asar'
                      ? 'bg-emerald-950/40 border-emerald-700/50 shadow-sm'
                      : 'bg-slate-800/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{p.icon}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-slate-100">{p.name}</h4>
                        {p.name === 'Zohor' && (
                          <span className="text-[10px] bg-emerald-600/30 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                            Waktu Persekolahan
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{p.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-amber-300 tracking-tight">
                      {p.time}
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase">Waktu Piawai Malaysia</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Penentuan Arah Kiblat di Malaysia</span>
                </h4>
                <p>
                  Arah Kiblat bagi Semenanjung Malaysia secara purata berada pada sudut <b>292° ke 293° dari Utara Benar</b> (Barat Laut). Surau An-Nur SK Seri Saujana telah ditentusahkan oleh Jabatan Mufti Negeri dengan tanda mihrab yang tepat.
                </p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2">
                <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Amalan Solat Berjemaah di Sekolah</span>
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>Solat Zohor berjemaah dilaksanakan setiap hari mengikut giliran kelas Tahun 4, 5, dan 6.</li>
                  <li>Murid lelaki berpeluang menjadi Imam dan Bilal cilik di bawah bimbingan guru GPI bertugas.</li>
                  <li>Solat Dhuha dan bacaan Al-Mathurat dijalankan pada waktu rehat secara sukarela di surau sekolah.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Sumber rasmi data falak Jabatan Kemajuan Islam Malaysia (JAKIM).
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
