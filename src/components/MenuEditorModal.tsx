import React, { useState, useEffect } from 'react';
import { MainMenuType, MenuItemConfig } from '../types';
import {
  X,
  Sparkles,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Home,
  BookOpen,
  Users,
  Award,
  Globe,
  Star,
  Calendar,
  ShieldCheck,
  Heart,
  FileText
} from 'lucide-react';
import { defaultMenuItems } from '../data/mockData';

interface MenuEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItemConfig[];
  onSaveMenuItems: (items: MenuItemConfig[]) => void;
}

const AVAILABLE_ICONS = [
  { name: 'Home', label: 'Utama / Rumah', icon: Home },
  { name: 'BookOpen', label: 'Buku / Kurikulum', icon: BookOpen },
  { name: 'Users', label: 'Murid / HEM', icon: Users },
  { name: 'Award', label: 'Piala / Kokurikulum', icon: Award },
  { name: 'Globe', label: 'Dunia / Umum', icon: Globe },
  { name: 'Star', label: 'Bintang / Sahsiah', icon: Star },
  { name: 'Calendar', label: 'Kalendar / Takwim', icon: Calendar },
  { name: 'ShieldCheck', label: 'Surau / Ibadah', icon: ShieldCheck },
  { name: 'Heart', label: 'Kebajikan / Asnaf', icon: Heart },
  { name: 'FileText', label: 'Dokumen / RPH', icon: FileText }
];

export const MenuEditorModal: React.FC<MenuEditorModalProps> = ({
  isOpen,
  onClose,
  menuItems = [],
  onSaveMenuItems
}) => {
  const [items, setItems] = useState<MenuItemConfig[]>(menuItems || []);
  const [editingId, setEditingId] = useState<MainMenuType | null>(null);

  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      setItems(menuItems);
    }
  }, [menuItems, isOpen]);

  if (!isOpen) return null;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setItems(newItems);
  };

  const handleUpdateItem = (id: MainMenuType, updates: Partial<MenuItemConfig>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleToggleEnable = (id: MainMenuType) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleSave = () => {
    onSaveMenuItems(items);
    onClose();
  };

  const handleResetToDefault = () => {
    setItems(defaultMenuItems);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Pengurusan & Suntingan Struktur Menu Utama
              </h3>
              <p className="text-xs text-slate-500">
                Ubah suai nama menu, sub-tajuk, lencana, ikon dan susunan paparan navigasi portal.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {items.map((item, index) => {
            const isEditing = editingId === item.id;
            const IconComponent =
              AVAILABLE_ICONS.find((i) => i.name === item.iconName)?.icon || BookOpen;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition space-y-3 ${
                  item.enabled
                    ? 'bg-slate-50/80 border-slate-200'
                    : 'bg-slate-100/50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    {/* Move controls */}
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200"
                        title="Alih ke atas"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === items.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200"
                        title="Alih ke bawah"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Icon Box */}
                    <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-slate-900">{item.label}</h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">
                          id: {item.id}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{item.subLabel}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleToggleEnable(item.id)}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                        item.enabled
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                      title={item.enabled ? 'Sembunyikan Menu' : 'Papar Menu'}
                    >
                      {item.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => setEditingId(isEditing ? null : item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                        isEditing
                          ? 'bg-amber-400 text-slate-950 shadow'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditing ? 'Tutup Sunting' : 'Sunting'}</span>
                    </button>
                  </div>
                </div>

                {/* Inline Editing Form */}
                {isEditing && (
                  <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nama Tajuk Menu:
                      </label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleUpdateItem(item.id, { label: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Sub-Tajuk / Penerangan:
                      </label>
                      <input
                        type="text"
                        value={item.subLabel}
                        onChange={(e) => handleUpdateItem(item.id, { subLabel: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Ikon Menu:
                      </label>
                      <select
                        value={item.iconName}
                        onChange={(e) => handleUpdateItem(item.id, { iconName: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                      >
                        {AVAILABLE_ICONS.map((ic) => (
                          <option key={ic.name} value={ic.name}>
                            {ic.label} ({ic.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Lencana / Badge (Pilihan):
                      </label>
                      <input
                        type="text"
                        value={item.badge || ''}
                        onChange={(e) => handleUpdateItem(item.id, { badge: e.target.value || undefined })}
                        placeholder="Contoh: BARU / SSDM / 2026"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100 rounded-xl transition flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Pulihkan Susunan Asal</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Perubahan Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
