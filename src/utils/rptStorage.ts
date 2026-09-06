import { RptItem, RPHItem } from '../types';
import { allRptDataTahun1 } from '../data/rptTahun1Data';
import { allRptDataTahun2 } from '../data/rptTahun2Data';
import { allRptDataTahun3 } from '../data/rptTahun3Data';
import { allRptDataTahun6 } from '../data/rptTahun6Data';
import { WeeklySlotConfig } from './weeklyRphGenerator';

const RPT_STORAGE_KEY = 'portal_gpi_rpt_custom_v1';

/**
 * Get default base RPT items for a specific year level
 */
export function getDefaultRptPool(yearLevel?: string): RptItem[] {
  switch (yearLevel) {
    case 'Tahun 1':
      return allRptDataTahun1;
    case 'Tahun 2':
      return allRptDataTahun2;
    case 'Tahun 3':
      return allRptDataTahun3;
    case 'Tahun 6':
      return allRptDataTahun6;
    default:
      return allRptDataTahun1;
  }
}

/**
 * Load all custom RPT overrides from LocalStorage
 */
export function getStoredCustomRpts(): RptItem[] {
  try {
    const raw = localStorage.getItem(RPT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Ralat membaca RPT tersimpan dari LocalStorage:', err);
    return [];
  }
}

/**
 * Save custom RPT overrides to LocalStorage and trigger update event
 */
export function saveStoredCustomRpts(items: RptItem[]): void {
  try {
    localStorage.setItem(RPT_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('rpt_updated', { detail: items }));
  } catch (err) {
    console.warn('Ralat menyimpan RPT ke LocalStorage:', err);
  }
}

/**
 * Get the full active RPT list for a year level, merging defaults with custom updates
 */
export function getAllRptForYear(yearLevel: string = 'Tahun 1'): RptItem[] {
  const basePool = getDefaultRptPool(yearLevel);
  const customList = getStoredCustomRpts().filter((item) => !item.yearLevel || item.yearLevel === yearLevel);

  if (customList.length === 0) {
    return basePool;
  }

  // Create map of custom items
  const customById = new Map<string, RptItem>();
  const customByWeekAndCat = new Map<string, RptItem>();

  customList.forEach((c) => {
    if (c.id) customById.set(c.id, c);
    const key = `${c.week}_${c.subjectCategory}`;
    customByWeekAndCat.set(key, c);
  });

  const merged = basePool.map((base) => {
    if (customById.has(base.id)) {
      return customById.get(base.id)!;
    }
    const key = `${base.week}_${base.subjectCategory}`;
    if (customByWeekAndCat.has(key)) {
      return { ...base, ...customByWeekAndCat.get(key)!, id: base.id };
    }
    return base;
  });

  // Add any completely new custom items not in base
  customList.forEach((c) => {
    const exists = merged.some((m) => m.id === c.id);
    if (!exists) {
      merged.push(c);
    }
  });

  return merged;
}

/**
 * Find matching RPT item for a given slot configuration and week using the live RPT store
 */
export function findRptForSlotWithCustom(config: WeeklySlotConfig, week: number): RptItem | undefined {
  const rptPool = getAllRptForYear(config.yearLevel);

  // 1. Exact week match
  const weekItems = rptPool.filter((item) => item.week === week);

  if (weekItems.length > 0) {
    if (config.category === 'JAWI') {
      const jawiItem = weekItems.find(
        (i) =>
          i.subjectCategory === 'Jawi' ||
          (i.topicTitle && i.topicTitle.toLowerCase().includes('jawi')) ||
          (i.timeSlot && i.timeSlot.includes('جاوي'))
      );
      if (jawiItem) return jawiItem;
    } else if (config.category === 'ULUM') {
      const ulumItem = weekItems.find(
        (i) =>
          ['Akidah', 'Ibadah', 'Sirah', 'Adab', 'Hadis'].includes(i.subjectCategory) ||
          i.subjectCategory === config.subjectCategoryRpt
      );
      if (ulumItem) return ulumItem;
    } else if (config.category === 'AQ') {
      const aqItem = weekItems.find(
        (i) =>
          ['Al-Quran', 'Tafsir/Kefahaman', 'Tajwid'].includes(i.subjectCategory) ||
          (i.timeSlot && i.timeSlot.includes('القرءان'))
      );
      if (aqItem) return aqItem;
    }

    return weekItems[0];
  }

  // Fallback
  return rptPool.find((i) => i.subjectCategory === config.subjectCategoryRpt) || rptPool[0];
}

/**
 * Detect year level from className (e.g. "1 Ibnu Sina" -> "Tahun 1", "6 Ibnu Rushd" -> "Tahun 6")
 */
export function detectYearLevelFromClass(className?: string): string {
  if (!className) return 'Tahun 1';
  if (className.includes('1') || className.toLowerCase().includes('tahun 1')) return 'Tahun 1';
  if (className.includes('2') || className.toLowerCase().includes('tahun 2')) return 'Tahun 2';
  if (className.includes('3') || className.toLowerCase().includes('tahun 3')) return 'Tahun 3';
  if (className.includes('6') || className.toLowerCase().includes('tahun 6') || className.includes('4')) return 'Tahun 6';
  return 'Tahun 1';
}

/**
 * Update or save changes from an e-RPH directly to the corresponding RPT item
 */
export function saveOrUpdateRptFromRph(rph: RPHItem): RptItem {
  const yearLevel = detectYearLevelFromClass(rph.className);
  const existingCustom = getStoredCustomRpts();

  // Find matching existing base or custom RPT
  const pool = getAllRptForYear(yearLevel);
  const weekItems = pool.filter((i) => i.week === rph.week);

  let targetRpt: RptItem | undefined;

  // Try matching by subjectCategory
  if (weekItems.length > 0) {
    targetRpt = weekItems.find((i) => i.subjectCategory === (rph.learningArea as any));
    if (!targetRpt) {
      targetRpt = weekItems[0];
    }
  }

  const rptId = targetRpt?.id || `rpt-custom-${yearLevel.replace(/\s+/g, '')}-w${rph.week}-${rph.learningArea || 'Umum'}`;

  const updatedRptItem: RptItem = {
    id: rptId,
    yearLevel,
    week: rph.week,
    timeSlot: targetRpt?.timeSlot || `${rph.learningArea} (${rph.time || '60 Minit'})`,
    subjectCategory: (rph.learningArea as any) || targetRpt?.subjectCategory || 'Al-Quran',
    topicTitle: rph.topic,
    contentStandard: rph.contentStandard,
    learningStandard: rph.learningStandard,
    objectives: rph.objectives && rph.objectives.length > 0 ? rph.objectives : targetRpt?.objectives || [],
    activities: rph.mainActivities && rph.mainActivities.length > 0 ? rph.mainActivities : targetRpt?.activities || [],
    emk: (rph.crossCurricularElements && rph.crossCurricularElements[0]) || targetRpt?.emk || 'Nilai Murni',
    assessment: rph.pbdAssessment || targetRpt?.assessment || 'Lisan & Bertulis',
    kbat: targetRpt?.kbat || 'Mengaplikasi & Menganalisis',
    notes: rph.notes || targetRpt?.notes || `Dikemaskini daripada e-RPH Minggu ${rph.week}`
  };

  // Update custom list
  const existingIdx = existingCustom.findIndex(
    (c) => c.id === rptId || (c.yearLevel === yearLevel && c.week === rph.week && c.subjectCategory === updatedRptItem.subjectCategory)
  );

  let nextCustom: RptItem[];
  if (existingIdx >= 0) {
    nextCustom = [...existingCustom];
    nextCustom[existingIdx] = updatedRptItem;
  } else {
    nextCustom = [...existingCustom, updatedRptItem];
  }

  saveStoredCustomRpts(nextCustom);
  return updatedRptItem;
}
