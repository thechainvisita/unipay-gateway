import { Request, Response } from 'express';

// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'user' | 'merchant';
  created_at: string;
}

export interface Good {
  id: number;
  name: string;
  price: number;
  discount: number;
  merchant: string;
  payment_method: 'fiat' | 'crypto';
}

export interface Crypto {
  id: number;
  type: string;
  name: string;
  price: string;
  change: string;
  icon: string;
}

export interface Card {
  id: string;
  holder_id: string;
  card_number: string;
  expiry: string;
  cvv: string;
  name: string;
  created_at: string;
}

export interface Bank {
  id: string;
  holder_id: string;
  bank_name: string;
  account_number: string;
  routing_number: string;
  account_holder_name: string;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_email: string;
  item: string;
  amount_paid: number;
  payment_method: string;
  points: number;
  status: string;
  merchant_name: string;
  created_at: string;
}

export interface Reward {
  id: string;
  user_email: string;
  tokens: number;
  source: string;
  note: string | null;
  created_at: string;
}

// Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
  role: 'user' | 'merchant';
}

export interface SignupRequest {
  email: string;
  username: string;
  role: 'user' | 'merchant';
  password: string;
}

export interface CreateCardRequest {
  holder_id: string;
  card_number: string;
  expiry: string;
  cvv: string;
  name: string;
}

export interface CreateBankRequest {
  holder_id: string;
  bank_name: string;
  account_number: string;
  routing_number: string;
  account_holder_name: string;
}

export interface CreatePurchaseRequest {
  user_email: string;
  item: string;
  amount_paid: number;
  payment_method: string;
  points: number;
  status: string;
  merchant_name: string;
}

export interface CreateRewardRequest {
  user_email: string;
  tokens: number;
  source: string;
  note?: string;
}

export interface ApiError {
  error: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Express Types
export type RouteHandler = (req: Request, res: Response) => void | Promise<void>;

