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
  const norm = className.toLowerCase();
  if (norm.includes('tahun 1') || norm.includes('1 ibnu') || norm.includes('1 is') || norm.includes('1 ik') || norm.includes('١')) return 'Tahun 1';
  if (norm.includes('tahun 2') || norm.includes('2 ibnu') || norm.includes('2 is') || norm.includes('2 ik') || norm.includes('٢')) return 'Tahun 2';
  if (norm.includes('tahun 3') || norm.includes('3 ibnu') || norm.includes('3 is') || norm.includes('3 ik') || norm.includes('٣')) return 'Tahun 3';
  if (norm.includes('tahun 4') || norm.includes('4 ibnu') || norm.includes('4 is') || norm.includes('4 ik') || norm.includes('٤')) return 'Tahun 4';
  if (norm.includes('tahun 5') || norm.includes('5 ibnu') || norm.includes('5 is') || norm.includes('5 ik') || norm.includes('٥')) return 'Tahun 5';
  if (norm.includes('tahun 6') || norm.includes('6 ibnu') || norm.includes('6 is') || norm.includes('6 ik') || norm.includes('٦')) return 'Tahun 6';

  if (norm.includes('1')) return 'Tahun 1';
  if (norm.includes('2')) return 'Tahun 2';
  if (norm.includes('3')) return 'Tahun 3';
  if (norm.includes('4')) return 'Tahun 4';
  if (norm.includes('5')) return 'Tahun 5';
  if (norm.includes('6')) return 'Tahun 6';
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

  // Try matching by subjectCategory or learningArea
  if (weekItems.length > 0) {
    const area = (rph.learningArea || '').toLowerCase();
    targetRpt = weekItems.find((i) => {
      const cat = (i.subjectCategory || '').toLowerCase();
      if (cat === area) return true;
      if (area.includes('quran') && (cat.includes('quran') || cat.includes('tajwid') || cat.includes('tilawah'))) return true;
      if (area.includes('jawi') && cat.includes('jawi')) return true;
      if (area.includes('ulum') && ['akidah', 'ibadah', 'sirah', 'adab', 'hadis'].includes(cat)) return true;
      return false;
    });

    if (!targetRpt) {
      targetRpt = weekItems[0];
    }
  }

  // Prioritize active script or jawiOverrides if present
  const isJawi = rph.preferredScript === 'jawi' || Boolean(rph.jawiOverrides);
  const overrides = rph.jawiOverrides || {};

  const topicTitle = (isJawi && overrides.topic) ? overrides.topic : (rph.topic || targetRpt?.topicTitle || '');
  const contentStandard = (isJawi && overrides.contentStandard) ? overrides.contentStandard : (rph.contentStandard || targetRpt?.contentStandard || '');
  const learningStandard = (isJawi && overrides.learningStandard) ? overrides.learningStandard : (rph.learningStandard || targetRpt?.learningStandard || '');
  const objectives = (isJawi && overrides.objectives && overrides.objectives.length > 0)
    ? overrides.objectives
    : (rph.objectives && rph.objectives.length > 0 ? rph.objectives : (targetRpt?.objectives || []));
  const activities = (isJawi && overrides.mainActivities && overrides.mainActivities.length > 0)
    ? overrides.mainActivities
    : (rph.mainActivities && rph.mainActivities.length > 0 ? rph.mainActivities : (targetRpt?.activities || []));
  const emk = (isJawi && overrides.crossCurricularElements && overrides.crossCurricularElements[0])
    || (rph.crossCurricularElements && rph.crossCurricularElements[0])
    || targetRpt?.emk
    || 'Nilai Murni';
  const assessment = (isJawi && overrides.pbdAssessment) || rph.pbdAssessment || targetRpt?.assessment || 'Lisan & Bertulis';

  const rptId = targetRpt?.id || `rpt-custom-${yearLevel.replace(/\s+/g, '')}-w${rph.week}-${rph.learningArea || 'Umum'}`;

  const updatedRptItem: RptItem = {
    id: rptId,
    yearLevel,
    week: rph.week,
    timeSlot: targetRpt?.timeSlot || `${rph.learningArea} (${rph.time || '60 Minit'})`,
    subjectCategory: targetRpt?.subjectCategory || (rph.learningArea as any) || 'Al-Quran',
    topicTitle,
    contentStandard,
    learningStandard,
    objectives,
    activities,
    emk,
    assessment,
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
