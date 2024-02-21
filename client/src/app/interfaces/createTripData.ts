import { User } from './user';

export interface Trip {
  startLocation: string;
  endLocation: string;
  startDate: string;
  endDate: string;
  description: string;
  img: string;
  _id?: string;
  _ownerId: User;
  created_at: string;
  updatedAt: string;
  __v: number;
}