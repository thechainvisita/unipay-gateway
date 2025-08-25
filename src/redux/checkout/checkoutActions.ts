import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import {
  SET_PAYMENT_METHOD_1,
  SET_PAYMENT_DETAILS,
  RESET_CHECKOUT,
  SET_CARDS,
  SELECT_CARD,
  SET_BANKS,
  SELECT_BANK,
  FETCHING_START,
  FETCHING_SUCCESS,
  FETCHING_FAIL,
  INSERT_CB_START,
  INSERT_CB_SUCCESS,
  INSERT_CB_FAIL,
} from './checkoutTypes';
import { checkoutAPI } from '../../services/api';
import { PaymentDetails, Card, Bank } from '../../types';
import { RootState } from '../store';

export const setPaymentMethod_1 = (method: string) => {
  sessionStorage.setItem('method_1', method);
  return { type: SET_PAYMENT_METHOD_1, payload: method };
};

export const setPaymentDetails = (details: PaymentDetails) => ({
  type: SET_PAYMENT_DETAILS,
  payload: details,
});

export const resetCheckout = () => ({
  type: RESET_CHECKOUT,
});

export const fetchCheckoutData = (
  method: 'fiat' | 'crypto'
): ThunkAction<void, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      // Fetch goods from API
      const good = await checkoutAPI.getGoods(method);

      if (!good) {
        throw new Error(`No goods found for payment method: ${method}`);
      }

      let details: PaymentDetails;

      // Dispatch to store
      if (method === 'crypto') {
        const crypto = await checkoutAPI.getCrypto('ETH');

        if (!crypto) {
          throw new Error('ETH crypto data not found');
        }

        details = {
          item: good.name,
          usdPrice: null,
          cryptoPrice: good.price,
          discount: good.discount,
          rate: parseFloat(crypto.price) || 0,
          merchant_name: good.merchant,
        };
      } else {
        details = {
          item: good.name,
          usdPrice: good.price,
          discount: good.discount,
          rate: null,
          merchant_name: good.merchant,
          cryptoPrice: null,
        };
      }
      dispatch(setPaymentDetails(details));
    } catch (error: any) {
      console.error('Error fetching checkout data:', error.message);
      if (error.response && error.response.data && error.response.data.error) {
        console.error('API Error:', error.response.data.error);
      }
    }
  };
};

export const fetchCardAndBankData = (
  holder_id: string
): ThunkAction<void, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCHING_START });
    try {
      const [cards, banks] = await Promise.all([
        checkoutAPI.getCards(holder_id),
        checkoutAPI.getBanks(holder_id),
      ]);

      dispatch({
        type: FETCHING_SUCCESS,
        payload: {
          cards: cards || [],
          banks: banks || [],
        },
      });
    } catch (error: any) {
      dispatch({ type: FETCHING_FAIL, payload: error.message });
      console.error('Fetching card and bank list error:', error.message);
      if (error.response && error.response.data && error.response.data.error) {
        console.error('API Error:', error.response.data.error);
      }
      alert('Error fetching card and bank list. Please try again.');
      throw error;
    }
  };
};

export const saveNewCard = (
  card: Omit<Card, 'id' | 'created_at'>
): ThunkAction<void, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: INSERT_CB_START });
    try {
      await checkoutAPI.saveCard(card);

      // Refresh cards list
      const cards = await checkoutAPI.getCards(card.holder_id);
      dispatch(setCardList(cards || []));
      dispatch({ type: INSERT_CB_SUCCESS });
    } catch (error: any) {
      dispatch({ type: INSERT_CB_FAIL, payload: error.message });
      console.error('Saving new card info error:', error.message);
      if (error.response && error.response.data && error.response.data.error) {
        console.error('API Error:', error.response.data.error);
      }
      alert('Error saving card info. Please try again.');
      throw error;
    }
  };
};

export const saveNewBank = (
  bank: Omit<Bank, 'id' | 'created_at'>
): ThunkAction<void, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: INSERT_CB_START });
    try {
      await checkoutAPI.saveBank(bank);

      // Refresh banks list
      const banks = await checkoutAPI.getBanks(bank.holder_id);
      dispatch(setBankList(banks || []));
      dispatch({ type: INSERT_CB_SUCCESS });
    } catch (error: any) {
      dispatch({ type: INSERT_CB_FAIL, payload: error.message });
      console.error('Saving new bank info error:', error.message);
      if (error.response && error.response.data && error.response.data.error) {
        console.error('API Error:', error.response.data.error);
      }
      alert('Error saving bank info. Please try again.');
      throw error;
    }
  };
};

export const setCardList = (cards: Card[]) => ({
  type: SET_CARDS,
  payload: cards,
});

export const setBankList = (banks: Bank[]) => ({
  type: SET_BANKS,
  payload: banks,
});

export const selectCard = (card: Card) => ({ type: SELECT_CARD, payload: card });
export const selectBank = (bank: Bank) => ({ type: SELECT_BANK, payload: bank });

