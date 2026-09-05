import { RptItem } from '../types';
import { rptTahun1Part1 } from './rptTahun1DataPart1';
import { rptTahun1Part2 } from './rptTahun1DataPart2';
import { rptTahun1Part3 } from './rptTahun1DataPart3';

export interface RptMetadata {
  schoolName: string;
  schoolCode: string;
  address: string;
  teacherName: string;
  classes: string[];
  sessionYear: string;
  subject: string;
  gradeLevel: string;
}

export const rptTahun1Metadata: RptMetadata = {
  schoolName: 'SEKOLAH KEBANGSAAN MERBAU PULAS',
  schoolCode: 'KBA 5012',
  address: 'KBA 5012, SK MERBAU PULAS, 09300, KUALA KETIL, KEDAH',
  teacherName: 'SALNATASHA BINTI MOHAMAD SABRI',
  classes: ['1 IBNU SINA', '1 IBNU KHALDUN'],
  sessionYear: '2026',
  subject: 'PENDIDIKAN ISLAM',
  gradeLevel: 'Tahun 1'
};

export const allRptDataTahun1: RptItem[] = [
  ...rptTahun1Part1,
  ...rptTahun1Part2,
  ...rptTahun1Part3
];
