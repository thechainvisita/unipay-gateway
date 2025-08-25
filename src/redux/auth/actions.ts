import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { LOGIN, LOGOUT, SET_USER, SET_STATUS } from './types';
import { signupUser, loginUser } from '../../services/authService';
import { User } from '../../types';
import { RootState } from '../store';

export const login = (
  email: string,
  password: string,
  role: 'user' | 'merchant'
): ThunkAction<Promise<User | undefined>, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    dispatch(setStatus('loading'));
    try {
      const response = await loginUser(email, password, role);

      if (response) {
        localStorage.setItem('authUser', JSON.stringify(response));
        await dispatch({
          type: LOGIN,
          payload: response,
        });
        dispatch(setStatus('success'));
        return response;
      }
    } catch (error: any) {
      dispatch(setStatus('error'));
      throw error;
    }
  };
};

export const signup = (
  email: string,
  username: string,
  role: 'user' | 'merchant',
  password: string
): ThunkAction<Promise<User | undefined>, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    dispatch(setStatus('loading'));
    try {
      const response = await signupUser(email, username, role, password);

      if (response) {
        localStorage.setItem('authUser', JSON.stringify(response));
        await dispatch({
          type: SET_USER,
          payload: response,
        });
        dispatch(setStatus('success'));
        return response;
      }
    } catch (error: any) {
      console.error('Signup action error:', error);
      dispatch(setStatus('error'));
      let errorMessage = 'Error during signup. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
      throw new Error(errorMessage);
    }
  };
};

export const logout = () => {
  localStorage.removeItem('authUser');
  return {
    type: LOGOUT,
  };
};

export const setUser = (user: User) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

export const setStatus = (status: 'idle' | 'loading' | 'success' | 'error') => {
  return {
    type: SET_STATUS,
    payload: status,
  };
};

