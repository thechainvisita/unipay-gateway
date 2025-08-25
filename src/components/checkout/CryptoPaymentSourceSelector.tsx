import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../common/LoadingScreen';
import { resetCheckout } from '../../redux/checkout/checkoutActions';
import { connectWallet, sendTransaction } from '../../redux/wallet/walletActions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

export default function CryptoPaymentSelection() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.checkout);
  const wallet = useAppSelector((state) => state.wallet);

  if (loading) {
    return <LoadingScreen message="Loading your card and bank information" />;
  }

  return (
    <div className="h-full px-4 py-12 flex flex-col items-center text-white">
      <div>
        {wallet.address ? (
          <>
            <p>
              <b>Address:</b> {wallet.address}
            </p>
            <p>
              <b>Balance:</b> {wallet.balance} ETH
            </p>
            <p>
              <b>Network:</b> {wallet.network}
            </p>

            <button
              onClick={() => dispatch(sendTransaction('0xRecipientAddressHere', '0.001'))}
              className="mt-6 w-full py-2 border border-white text-white hover:bg-white/10 rounded-full"
            >
              Send 0.001 ETH
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => dispatch(connectWallet())}
              className="mt-6 w-full py-2 border border-white text-white hover:bg-white/10 rounded-full"
            >
              Connect MetaMask
            </button>
          </>
        )}
        <button
          onClick={() => {
            dispatch(resetCheckout());
            navigate('/checkout');
          }}
          className="mt-6 w-full py-2 border border-white text-white hover:bg-white/10 rounded-full"
        >
          Go To Previous Page
        </button>
      </div>
    </div>
  );
}

