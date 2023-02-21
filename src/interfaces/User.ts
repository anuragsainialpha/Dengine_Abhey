import { Request } from 'express';

export interface User {
  username: string;
  instance: string;
  url: string;
  password: string;
  crypto: string;
}

export interface RequestUser extends Request {
  user: User;
}
