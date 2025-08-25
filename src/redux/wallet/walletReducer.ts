export interface WalletState {
  address: string | null;
  balance: string | null;
  network: string | null;
}

const initialState: WalletState = {
  address: null,
  balance: null,
  network: null,
};

interface WalletAction {
  type: string;
  payload?: Partial<WalletState>;
}

export default function walletReducer(state: WalletState = initialState, action: WalletAction): WalletState {
  switch (action.type) {
    case 'SET_WALLET_INFO':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

