import {
  FETCH_DASHBOARD_PENDING,
  FETCH_DASHBOARD_SUCCESS,
  FETCH_DASHBOARD_FAILURE,
} from './dashboardTypes';
import { User, Crypto, Purchase, Reward } from '../../types';

export interface DashboardState {
  user: User | null;
  cryptos: Crypto[];
  purchaseHistory: Purchase[];
  rewardHistory: Reward[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DashboardState = {
  user: null,
  cryptos: [],
  purchaseHistory: [],
  rewardHistory: [],
  status: 'idle',
  error: null,
};

interface DashboardAction {
  type: string;
  payload?: any;
}

const dashboardReducer = (state: DashboardState = initialState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case FETCH_DASHBOARD_PENDING:
      return { ...state, status: 'loading', error: null };
    case FETCH_DASHBOARD_SUCCESS:
      return {
        ...state,
        status: 'succeeded',
        user: action.payload.user,
        cryptos: action.payload.cryptos,
        purchaseHistory: action.payload.purchaseHistory,
        rewardHistory: action.payload.rewardHistory,
      };
    case FETCH_DASHBOARD_FAILURE:
      return { ...state, status: 'failed', error: action.payload };
    default:
      return state;
  }
};

export default dashboardReducer;

