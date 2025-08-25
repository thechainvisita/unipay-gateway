import axios, { AxiosInstance } from 'axios';
import {
  User,
  Good,
  Crypto,
  Card,
  Bank,
  Purchase,
  Reward,
  DashboardState,
  CreatePurchaseRequest,
  CreateRewardRequest,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string, role: 'user' | 'merchant'): Promise<User> => {
    const response = await api.post<User>('/auth/login', { email, password, role });
    return response.data;
  },

  signup: async (email: string, username: string, role: 'user' | 'merchant', password: string): Promise<User> => {
    const response = await api.post<User>('/auth/signup', { email, username, role, password });
    return response.data;
  },
};

// Checkout API
export const checkoutAPI = {
  getGoods: async (method: 'fiat' | 'crypto'): Promise<Good> => {
    const response = await api.get<Good>(`/checkout/goods/${method}`);
    return response.data;
  },

  getCryptos: async (): Promise<Crypto[]> => {
    const response = await api.get<Crypto[]>('/checkout/cryptos');
    return response.data;
  },

  getCrypto: async (type: string): Promise<Crypto> => {
    const response = await api.get<Crypto>(`/checkout/cryptos/${type}`);
    return response.data;
  },

  getCards: async (userId: string): Promise<Card[]> => {
    const response = await api.get<Card[]>(`/checkout/cards/${userId}`);
    return response.data;
  },

  getBanks: async (userId: string): Promise<Bank[]> => {
    const response = await api.get<Bank[]>(`/checkout/banks/${userId}`);
    return response.data;
  },

  saveCard: async (cardData: Omit<Card, 'id' | 'created_at'>): Promise<Card> => {
    const response = await api.post<Card>('/checkout/cards', cardData);
    return response.data;
  },

  saveBank: async (bankData: Omit<Bank, 'id' | 'created_at'>): Promise<Bank> => {
    const response = await api.post<Bank>('/checkout/banks', bankData);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getDashboardData: async (userEmail: string): Promise<DashboardState> => {
    const response = await api.get<DashboardState>(`/dashboard/${userEmail}`);
    return response.data;
  },
};

// Purchases API
export const purchasesAPI = {
  createPurchase: async (purchaseData: CreatePurchaseRequest): Promise<Purchase> => {
    const response = await api.post<Purchase>('/purchases', purchaseData);
    return response.data;
  },
};

// Rewards API
export const rewardsAPI = {
  createReward: async (rewardData: CreateRewardRequest): Promise<Reward> => {
    const response = await api.post<Reward>('/rewards', rewardData);
    return response.data;
  },
};

export default api;

