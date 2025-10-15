import { z } from 'zod';
import { contractSchema } from '../utils/dataModel';

export type ContractData = z.infer<typeof contractSchema>;

export interface FormErrors {
  [key: string]: string | FormErrors | FormErrors[];
}