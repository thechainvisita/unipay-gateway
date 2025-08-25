// User Types
export interface User {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    role: 'user' | 'merchant';
  };
  created_at: string;
}

export interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

// Checkout Types
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

export interface PaymentDetails {
  item: string;
  usdPrice: number | null;
  cryptoPrice: number | null;
  discount: number;
  rate: number | null;
  merchant_name: string;
}

export interface CheckoutState {
  method_1: string | null;
  details: PaymentDetails | null;
  cards: Card[];
  banks: Bank[];
  selectedCard: Card | null;
  selectedBank: Bank | null;
  loading: boolean;
  registering: boolean;
  error: string | null;
}

// Dashboard Types
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

export interface DashboardState {
  user: User | null;
  cryptos: Crypto[];
  purchaseHistory: Purchase[];
  rewardHistory: Reward[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// API Response Types
export interface ApiError {
  error: string;
}

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

