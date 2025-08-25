import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { RootState } from '../store';

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
}

export const connectWallet = (): ThunkAction<void, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      const ethereumProvider = (await detectEthereumProvider()) as EthereumProvider | null;

      if (!ethereumProvider) {
        alert('Please install MetaMask!');
        window.open('https://metamask.io/download.html', '_blank');
        return;
      }

      const existingAccounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
      let account = existingAccounts[0];

      if (existingAccounts.length === 0) {
        const accounts = await ethereumProvider.request({
          method: 'eth_requestAccounts',
        });
        account = accounts[0];
      }

      const ethersProvider = new ethers.BrowserProvider(ethereumProvider as any);
      const balance = await ethersProvider.getBalance(account);
      const network = await ethersProvider.getNetwork();

      dispatch({
        type: 'SET_WALLET_INFO',
        payload: {
          address: account,
          balance: ethers.formatEther(balance),
          network: network.name,
        },
      });

      ethereumProvider.on('accountsChanged', async (accounts: string[]) => {
        const updatedAccount = accounts[0];
        const updatedBalance = await ethersProvider.getBalance(updatedAccount);
        dispatch({
          type: 'SET_WALLET_INFO',
          payload: {
            address: updatedAccount,
            balance: ethers.formatEther(updatedBalance),
            network: network.name,
          },
        });
      });

      ethereumProvider.on('chainChanged', () => {
        window.location.reload();
      });
    } catch (error: any) {
      if (error.code === 4001) {
        console.error('User rejected connection');
      } else {
        console.error(error);
      }
    }
  };
};

export const sendTransaction = (to: string, amountEth: string): ThunkAction<void, RootState, unknown, any> => {
  return async () => {
    try {
      const ethereumProvider = (await detectEthereumProvider()) as EthereumProvider | null;
      if (!ethereumProvider) {
        throw new Error('MetaMask not found');
      }
      const ethersProvider = new ethers.BrowserProvider(ethereumProvider as any);
      const signer = await ethersProvider.getSigner();

      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amountEth),
      });

      await tx.wait();
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };
};

