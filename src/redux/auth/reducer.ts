import { LOGIN, LOGOUT, SET_STATUS, SET_USER } from './types';
import { User } from '../../types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
};

interface AuthAction {
  type: string;
  payload?: any;
}

const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case SET_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;

