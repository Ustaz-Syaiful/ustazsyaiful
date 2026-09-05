import React, { useState, useEffect } from 'react';
import {
  Compass,
  Radio,
  Activity,
  Orbit,
  Moon,
  Sun,
  Zap,
  Globe,
  Gauge,
  Cpu
} from 'lucide-react';
import { PrayerTimeData } from '../types';

interface FalakiahTelemetryBarProps {
  prayerData: PrayerTimeData;
  onOpenPrayerModal: () => void;
}

export const FalakiahTelemetryBar: React.FC<FalakiahTelemetryBarProps> = ({
  prayerData,
  onOpenPrayerModal
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [qiblaAngle, setQiblaAngle] = useState(292.8);
  const [solarElevation, setSolarElevation] = useState(48.2);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('ms-MY', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-950/90 border border-cyan-500/30 shadow-lg text-slate-200 backdrop-blur-md">
      {/* Top glowing laser line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-emerald-400" />

      {/* Cyber Grid Background Accent */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: System Status & Clock */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-bold tracking-wider">FALAK-SYS v4.8</span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-slate-300 font-tech">
            <span className="text-emerald-400 font-mono font-bold text-sm tracking-widest">{timeStr || '12:00:00'} MYT</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-300 font-medium">{prayerData.hijriDate}</span>
          </div>
        </div>

        {/* Center: Live Astronomical Telemetry */}
        <div className="hidden md:flex items-center space-x-4 text-[11px] font-tech text-slate-300">
          <div className="flex items-center space-x-1.5 hover:text-cyan-300 transition" title="Bearing Arah Kiblat ke Kaabah, Makkah">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>KIBLAT:</span>
            <b className="font-mono text-cyan-300">292.8° KBW</b>
            <span className="text-slate-500 text-[10px]">(7,130 km)</span>
          </div>

          <div className="flex items-center space-x-1.5 hover:text-emerald-300 transition" title="Fasa Bulan Falakiah">
            <Moon className="w-3.5 h-3.5 text-amber-300" />
            <span>FASA BULAN:</span>
            <b className="font-mono text-amber-300">Hilal Syawal (87%)</b>
          </div>

          <div className="flex items-center space-x-1.5 hover:text-teal-300 transition" title="Altitud Sudut Matahari Semasa">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>ALTITUD SOLAR:</span>
            <b className="font-mono text-teal-300">+51.4° Zenit</b>
          </div>
        </div>

        {/* Right: Quantum Node & Quick Action */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenPrayerModal}
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-gradient-to-r from-cyan-900/60 to-emerald-900/60 hover:from-cyan-800/80 hover:to-emerald-800/80 border border-cyan-400/40 rounded-lg text-cyan-200 font-tech text-xs transition shadow-sm"
          >
            <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wide">RADAR FALAK {prayerData.zone}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
