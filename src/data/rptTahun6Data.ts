import { RptItem } from '../types';
import { rptPenggal1 } from './rptDataPenggal1';
import { rptPenggal2A } from './rptDataPenggal2A';
import { rptPenggal2B } from './rptDataPenggal2B';

export const allRptDataTahun6: RptItem[] = [
  ...rptPenggal1,
  ...rptPenggal2A,
  ...rptPenggal2B
];

export { rptPenggal1, rptPenggal2A, rptPenggal2B };
