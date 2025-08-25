import { authAPI } from './api';
import { User } from '../types';

export const loginUser = async (
  email: string,
  password: string,
  role: 'user' | 'merchant'
): Promise<User> => {
  try {
    const user = await authAPI.login(email, password, role);
    return user;
  } catch (error: any) {
    // Extract error message from API response
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const signupUser = async (
  email: string,
  username: string,
  role: 'user' | 'merchant',
  password: string
): Promise<User> => {
  try {
    const user = await authAPI.signup(email, username, role, password);
    return user;
  } catch (error: any) {
    // Extract error message from API response
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

