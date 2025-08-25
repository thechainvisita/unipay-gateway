import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import LoadingScreen from '../common/LoadingScreen';
import { resetCheckout } from '../../redux/checkout/checkoutActions';

export default function PaymentSourceSelector() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, cards, banks } = useAppSelector((state) => state.checkout);

  if (loading) {
    return <LoadingScreen message="Loading payment sources..." />;
  }

  return (
    <div className="h-full px-4 py-12 flex flex-col items-center text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-grifter mb-8">Select Payment Method</h1>
      
      <div className="w-full space-y-8">
        {/* Cards Section */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-4">Credit/Debit Cards</h2>
          {cards && cards.length > 0 ? (
            <div className="grid gap-4">
              {cards.map((card) => (
                <div key={card.id} className="p-4 border border-white/20 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/5"
                     onClick={() => navigate('/paymentsummary')}>
                  <div>
                    <p className="font-bold">{card.name}</p>
                    <p className="text-sm text-gray-400">**** **** **** {card.card_number.slice(-4)}</p>
                  </div>
                  <div className="text-sm text-gray-400">{card.expiry}</div>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-gray-400">No cards saved.</p>
          )}
        </div>

        {/* Banks Section */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-4">Bank Accounts</h2>
          {banks && banks.length > 0 ? (
            <div className="grid gap-4">
              {banks.map((bank) => (
                <div key={bank.id} className="p-4 border border-white/20 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/5"
                     onClick={() => navigate('/paymentsummary')}>
                  <div>
                    <p className="font-bold">{bank.bank_name}</p>
                    <p className="text-sm text-gray-400">{bank.account_holder_name}</p>
                  </div>
                  <div className="text-sm text-gray-400">**** {bank.account_number.slice(-4)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No bank accounts linked.</p>
          )}
        </div>

        <button
          onClick={() => {
            dispatch(resetCheckout());
            navigate('/checkout');
          }}
          className="mt-6 w-full py-3 border border-white text-white hover:bg-white/10 rounded-full font-bold transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
