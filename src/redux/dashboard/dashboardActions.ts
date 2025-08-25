import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import {
  FETCH_DASHBOARD_PENDING,
  FETCH_DASHBOARD_SUCCESS,
  FETCH_DASHBOARD_FAILURE,
} from './dashboardTypes';
import { dashboardAPI } from '../../services/api';
import { RootState } from '../store';

export const fetchDashboardData = (
  userEmail: string
): ThunkAction<void, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_DASHBOARD_PENDING });

    try {
      const data = await dashboardAPI.getDashboardData(userEmail);

      dispatch({
        type: FETCH_DASHBOARD_SUCCESS,
        payload: {
          user: data.user,
          cryptos: data.cryptos,
          purchaseHistory: data.purchaseHistory || [],
          rewardHistory: data.rewardHistory || [],
        },
      });
    } catch (error: any) {
      console.error('Dashboard fetch error:', error.message);
      if (error.response && error.response.data && error.response.data.error) {
        console.error('API Error:', error.response.data.error);
      }
      dispatch({ type: FETCH_DASHBOARD_FAILURE, payload: error.message });
    }
  };
};

