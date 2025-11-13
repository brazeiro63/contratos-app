import { z } from 'zod';
import { rentalContractSchema } from '../utils/rentalDataModel';

export type RentalContractData = z.infer<typeof rentalContractSchema>;

export interface FormErrors {
  [key: string]: string | FormErrors | FormErrors[];
}
