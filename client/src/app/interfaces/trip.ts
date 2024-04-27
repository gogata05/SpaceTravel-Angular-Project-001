import { User } from './user';

export interface Trip {//F12
  startLocation: string;
  endLocation: string;
  startDate: string;
  endDate: string;
  description: string;
  img: {
    data: {
      data: Node
    }
  };
  commentList: [];
  _id?: string;
  _ownerId: User;
  created_at: string;
  updatedAt: string;
  __v: number;
}