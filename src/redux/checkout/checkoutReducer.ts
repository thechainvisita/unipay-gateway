import {
  SET_PAYMENT_METHOD_1,
  SET_PAYMENT_DETAILS,
  RESET_CHECKOUT,
  SET_CARDS,
  SELECT_CARD,
  SELECT_BANK,
  SET_BANKS,
  FETCHING_START,
  FETCHING_SUCCESS,
  FETCHING_FAIL,
  INSERT_CB_START,
  INSERT_CB_SUCCESS,
  INSERT_CB_FAIL,
} from './checkoutTypes';
import { PaymentDetails, Card, Bank } from '../../types';

export interface CheckoutState {
  method_1: string | null;
  details: PaymentDetails | null;
  status: string;
  cards: Card[];
  banks: Bank[];
  selectedCard: Card | null;
  selectedBank: Bank | null;
  loading: boolean;
  error: string | null;
  registering: boolean;
}

const initialState: CheckoutState = {
  method_1: null,
  details: null,
  status: 'idle',
  cards: [],
  banks: [],
  selectedCard: null,
  selectedBank: null,
  loading: false,
  error: null,
  registering: false,
};

interface CheckoutAction {
  type: string;
  payload?: any;
}

const checkoutReducer = (state: CheckoutState = initialState, action: CheckoutAction): CheckoutState => {
  switch (action.type) {
    case FETCHING_START:
      return { ...state, loading: true, error: null };
    case FETCHING_SUCCESS:
      return {
        ...state,
        cards: action.payload.cards,
        banks: action.payload.banks,
        loading: false,
      };
    case FETCHING_FAIL:
      return { ...state, loading: false, error: action.payload };

    case SET_PAYMENT_METHOD_1:
      return { ...state, method_1: action.payload };
    case SET_PAYMENT_DETAILS:
      return { ...state, details: action.payload };
    case RESET_CHECKOUT:
      return initialState;

    case SET_CARDS:
      return { ...state, cards: action.payload };
    case SELECT_CARD:
      return { ...state, selectedCard: action.payload };
    case SET_BANKS:
      return { ...state, banks: action.payload };
    case SELECT_BANK:
      return { ...state, selectedBank: action.payload };
    case INSERT_CB_START:
      return { ...state, registering: true, error: null };
    case INSERT_CB_SUCCESS:
      return { ...state, registering: false, error: null };
    case INSERT_CB_FAIL:
      return { ...state, registering: false, error: action.payload };

    default:
      return state;
  }
};

export default checkoutReducer;

