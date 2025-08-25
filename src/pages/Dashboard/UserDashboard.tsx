import { useEffect, useMemo, lazy, Suspense } from 'react';
import { shallowEqual } from 'react-redux';
import { fetchDashboardData } from '../../redux/dashboard/dashboardActions';
import AccountInfo from '../../components/dashboard/AccountInfo';
import MarketData from '../../components/dashboard/MarketData';
import LoadingScreen from '../../components/common/LoadingScreen';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { User } from '../../types';

const PurchaseHistory = lazy(() => import('../../components/dashboard/PurchaseHistory'));
const RewardHistory = lazy(() => import('../../components/dashboard/RewardHistory'));

export default function Dashboard() {
  const dispatch = useAppDispatch();

  const loginUser = useMemo<User | null>(() => {
    const storedUser = localStorage.getItem('authUser');
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      console.warn('Invalid authUser format in localStorage');
      return null;
    }
  }, []);

  const { user, cryptos, purchaseHistory, rewardHistory, status, error } = useAppSelector(
    (state) => state.dashboard,
    shallowEqual
  );

  useEffect(() => {
    if (loginUser?.email) {
      dispatch(fetchDashboardData(loginUser.email));
    }
  }, [dispatch, loginUser?.email]);

  if (status === 'loading') {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-center">
        <p>Error loading dashboard: {error || 'Unknown error'}</p>
      </div>
    );
  }

  if (!loginUser?.email || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-center">
        <p>Please log in to continue.</p>
      </div>
    );
  }

  return (
    <div className="w-full text-white px-4 py-10 md:px-12">
      <header className="text-center mb-10">
        <h1 className="text-[40px] md:text-[59px] font-grifter font-bold mb-2">
          Manage your Rewards and Payments
        </h1>
        <p className="text-sm font-aeonik text-gray-500">Pay with Crypto</p>
      </header>

      <main className="max-w-screen-xl mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <AccountInfo user={user} />
          <MarketData cryptos={cryptos} />
        </section>

        <section className="mb-10">
          <Suspense fallback={<LoadingScreen message="Loading purchases..." />}>
            <PurchaseHistory data={purchaseHistory} />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<LoadingScreen message="Loading rewards..." />}>
            <RewardHistory data={rewardHistory} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}

