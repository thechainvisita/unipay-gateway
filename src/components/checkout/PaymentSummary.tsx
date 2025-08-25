import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchCardAndBankData,
  fetchCheckoutData,
  setPaymentMethod_1,
} from '../../redux/checkout/checkoutActions';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Gift,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { purchasesAPI, rewardsAPI } from '../../services/api';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import LoadingScreen from '../common/LoadingScreen';

export default function PaymentSummary() {
  const [processing, setProcessing] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [rewardsEarned, setRewardsEarned] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const { details } = useAppSelector((state) => state.checkout);
  const method = sessionStorage.getItem('method_1') as 'fiat' | 'crypto' | null;
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('authUser') || '{}');
        if (method) {
          dispatch(setPaymentMethod_1(method));
          await dispatch(fetchCardAndBankData(user.id));
          await dispatch(fetchCheckoutData(method));
        }
      } finally {
        setLoading(false);
      }
    };

    if (method) loadData();
  }, [dispatch, method]);

  if (loading || !details || Object.keys(details).length === 0) {
    return <LoadingScreen message="Loading payment summary..." />;
  }

  const handlePayment = async () => {
    try {
      setProcessing(true);
      const userJson = localStorage.getItem('authUser');
      if (!userJson) throw new Error('User not authenticated');
      const user = JSON.parse(userJson);

      let rewardAmount = 0;
      if (method === 'crypto') {
        rewardAmount = Math.floor((details.cryptoPrice || 0) * (details.rate || 0) * 0.05);
      } else {
        rewardAmount = Math.floor((details.usdPrice || 0) * 0.05);
      }
      const cryptoAmount =
        method === 'crypto' ? (details.cryptoPrice || 0) : (details.usdPrice || 0);

      // Create purchase and reward via API
      await Promise.all([
        purchasesAPI.createPurchase({
          user_email: user.email,
          item: details.item,
          amount_paid: cryptoAmount,
          payment_method: method || 'fiat',
          points: rewardAmount,
          status: 'Completed',
          merchant_name: details.merchant_name,
        }),
        rewardsAPI.createReward({
          user_email: user.email,
          tokens: rewardAmount,
          source: 'Purchase Cashback',
          note: `5% reward on ${details.item}`,
        }),
      ]);

      setRewardsEarned(rewardAmount);
      setSuccess(true);
    } catch (err: any) {
      console.error('Payment failed:', err);
      if (err.response && err.response.data && err.response.data.error) {
        console.error('API Error:', err.response.data.error);
      }
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRefund = () => {
    alert('Refund request submitted. Refund functionality coming soon.');
  };

  const buttonLabel =
    method === 'crypto'
      ? `Pay (${details?.cryptoPrice?.toFixed(4)} ETH) $${(
          (details.cryptoPrice || 0) * (details.rate || 0)
        ).toFixed(2)} Now`
      : `Pay $${details?.usdPrice} Now`;

  const goBack = () => navigate('/paymentsource');

  return (
    <div className="h-full text-white px-4 py-12 flex flex-col items-center">
      <h1 className="text-[40px] md:text-[59px] font-grifter font-bold text-center">
        Confirm your purchase
      </h1>
      <p className="font-aeonik text-white/60 text-sm mb-8">
        Pay with {method}
      </p>

      <div className="w-full max-w-2xl bg-[#ffffff]/10 border border-white/10 rounded-2xl p-6 md:p-8">
        <h2 className="font-grifter text-xl mb-4">Summary</h2>

        <div className="space-y-3 text-sm">
          <SummaryRow label="Item" value="1-month membership" />
          <SummaryRow label="Quantity" value="1" />
          {method === 'crypto' && (
            <SummaryRow
              label="Crypto Type"
              value={
                <select className="border border-white/20 rounded px-2 py-1 bg-transparent text-white/80 text-sm">
                  <option value="ETH">ETH</option>
                </select>
              }
            />
          )}
          <SummaryRow
            label="Price"
            value={
              method === 'crypto'
                ? `${details?.cryptoPrice?.toFixed(3)} ($${(
                    (details.cryptoPrice || 0) * (details.rate || 0)
                  ).toFixed(2)})`
                : `$${details?.usdPrice}`
            }
          />
          <SummaryRow label="Discount" value={`${details?.discount}%`} />
          <SummaryRow
            label="Total"
            value={
              method === 'crypto'
                ? `$${(
                    (details.cryptoPrice || 0) * (details.rate || 0) *
                    (1 - (details.discount || 0) / 100)
                  ).toFixed(2)}`
                : `$${((details.usdPrice || 0) * (1 - (details.discount || 0) / 100)).toFixed(2)}`
            }
          />
        </div>

        {success ? (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
              <Gift className="text-emerald-400" size={32} />
            </div>
            <h3 className="text-xl font-grifter mb-2">Payment Successful!</h3>
            <p className="text-white/70 mb-4">
              You earned <span className="text-emerald-400 font-bold">{rewardsEarned}</span> reward
              tokens!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-cyan-400 text-white px-6 py-2 rounded-full font-aeonik hover:bg-cyan-500 transition"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <ShieldCheck size={16} />
              <span>Secure payment processing</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={goBack}
                className="flex-1 border border-white/20 text-white px-4 py-3 rounded-full font-aeonik hover:bg-white/10 transition flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                onClick={handlePayment}
                disabled={processing}
                className="flex-1 bg-emerald-400 text-white px-4 py-3 rounded-full font-aeonik hover:bg-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  <>
                    {buttonLabel}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleRefund}
              className="w-full text-sm text-white/60 hover:text-white/80 transition flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} />
              Request Refund
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: string | React.ReactNode;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white/60">{label}</span>
      <span className="text-white font-aeonik">{value}</span>
    </div>
  );
}

