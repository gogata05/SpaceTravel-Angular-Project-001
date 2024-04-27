import { Trip } from './trip';
import { User } from './user';

export interface Post {//F12
  likes: string[];
  _id: string;
  text: string;
  userId: User;
  themeId: Trip;
  created_at: string;
  updatedAt: string;
  __v: number;
}