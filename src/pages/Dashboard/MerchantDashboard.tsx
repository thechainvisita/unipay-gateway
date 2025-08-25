import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FaCheckCircle } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog } from '@headlessui/react';

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#8884d8', '#FF6384', '#36A2EB'];

const STATIC_URL =
  'https://unipay-site.vercel.app/checkout?merchantId=e305bb4c-5f13-49a0-8a28-3258f5b6b657&customerId=5ed89014-c11d-4aca-b492-b3c8c1550d6b&itemId=abc123&quantity=2&price=50&total=100&discount=10&successUrl=https%3A%2F%2Funipay-site.vercel.app%2Fsuccess%3Fsession_id%3D%7BCHECKOUT_SESSION_ID%7D';

interface SummaryCardProps {
  label: string;
  value: string;
  color?: string;
}

const SummaryCard = ({ label, value, color = 'text-[#00ffd1]' }: SummaryCardProps) => (
  <div className="bg-[#f2f2f2]/10 px-6 py-5 rounded-[20px] flex justify-between items-center">
    <span className="text-white text-base font-aeonik">{label}</span>
    <span className={`${color} font-aeonik text-base`}>{value}</span>
  </div>
);

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => (
  <div className="relative w-full h-3 bg-[#404452] rounded-full">
    <div
      className="absolute top-0 left-0 h-full bg-[#00ffd1] rounded-full transition-all duration-500"
      style={{ width: `${progress}%` }}
    />
    <div
      className="absolute -top-6 text-xs bg-[#0f172a] border border-[#00ffd1] text-white px-2 py-0.5 rounded-full shadow-sm"
      style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
    >
      {progress}%
    </div>
  </div>
);

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const QRModal = ({ isOpen, onClose, url }: QRModalProps) => (
  <Dialog open={isOpen} onClose={onClose} className="relative z-50">
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <Dialog.Panel className="bg-white p-6 rounded-2xl shadow-xl text-center">
        <Dialog.Title className="text-lg font-bold mb-4 text-black">Scan to Pay</Dialog.Title>
        <QRCodeSVG value={url} size={200} />
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-black text-white rounded-full"
        >
          Close
        </button>
      </Dialog.Panel>
    </div>
  </Dialog>
);

interface SalesData {
  name: string;
  value: number;
}

interface Transaction {
  date: string;
  customer: string;
  amount: string;
  method: string;
  status: string;
}

export default function MerchantDashboard() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const sales = useMemo<SalesData[]>(
    () => [
      { name: 'USD', value: 2863.54 },
      { name: 'BTC', value: 283.54 },
      { name: 'ETH', value: 283.54 },
      { name: 'BNB', value: 283.54 },
      { name: 'USDT', value: 283.54 },
      { name: 'USDC', value: 283.54 },
      { name: 'SOL', value: 283.54 },
    ],
    []
  );

  const transactions = useMemo<Transaction[]>(
    () => [
      {
        date: 'April 23',
        customer: 'Alex Carter',
        amount: '$200.00',
        method: 'Credit',
        status: 'Confirmed',
      },
      {
        date: 'April 22',
        customer: 'Ryan Lee',
        amount: '0.05 BTC',
        method: 'Crypto',
        status: 'Confirmed',
      },
      {
        date: 'April 22',
        customer: 'Emma Reed',
        amount: '$150.00',
        method: 'Bank',
        status: 'Transfer Refund',
      },
      {
        date: 'April 21',
        customer: 'Mia Blake',
        amount: '$75.00',
        method: 'Credit',
        status: 'Confirmed',
      },
    ],
    []
  );

  return (
    <div className="h-full text-white px-4 py-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00ffd1] text-black font-bold px-6 py-2 rounded-full shadow hover:bg-cyan-300 transition"
        >
          Generate QR Code
        </button>
      </div>

      <QRModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} url={STATIC_URL} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="rounded-[32px] bg-[#f2f2f2]/10 p-6 space-y-6 shadow-inner">
            <h2 className="font-grifter text-2xl">Payout Summary</h2>
            <SummaryCard label="Total Settled This Month" value="$10,000" />
            <SummaryCard label="Pending Payout" value="$2,000" />
            <SummaryCard label="Refunds Processed" value="$150" color="text-red-500" />
            <div className="mt-2">
              <p className="text-sm font-aeonik mb-2">Your Sales Goal</p>
              <ProgressBar progress={28} />
            </div>
          </div>

          <div className="rounded-[32px] bg-[#f2f2f2]/10 p-6 space-y-6 shadow-inner">
            <h2 className="font-grifter text-2xl">Rewards & Insights</h2>
            <SummaryCard label="Total Rewards Given" value="500 Tokens" />
            <SummaryCard label="Most Popular Payment" value="USDC" />
            <SummaryCard label="Transactions" value="120" />
          </div>
        </div>

        <div className="rounded-[32px] bg-[#f2f2f2]/10 p-6 space-y-6 shadow-inner">
          <h2 className="font-grifter text-2xl">Total Sales</h2>
          <div className="flex flex-col gap-6 items-center">
            <div className="w-full h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sales}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                  >
                    {sales.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm w-full">
              {sales.map((s) => (
                <div
                  key={s.name}
                  className="border border-white/10 bg-[#f2f2f2]/10 rounded-full px-3 py-1 flex items-center justify-between"
                >
                  <span className="font-aeonik">{s.name}</span>
                  <span className="text-[#00ffd1]">${s.value.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] bg-[#f2f2f2]/10 p-6 overflow-auto shadow-inner">
        <h2 className="font-grifter text-2xl mb-4">Transactions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-400 to-sky-500 text-white">
              {['Date', 'Customer', 'Amount', 'Method', 'Status'].map((h, i) => (
                <th
                  key={h}
                  className={`text-left py-3 px-4 font-aeonik ${
                    i === 0 ? 'rounded-l-full' : i === 4 ? 'rounded-r-full' : ''
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-white/90 divide-y divide-[#2a2e3a]">
            {transactions.map((t) => {
              const isConfirmed = t.status.toLowerCase().includes('confirm');
              const isRefund = t.status.toLowerCase().includes('refund');
              const statusColor = isConfirmed
                ? 'text-[#00ffd1]'
                : isRefund
                ? 'text-[#38bdf8]'
                : 'text-white';
              return (
                <tr key={t.customer}>
                  <td className="py-4 px-4 rounded-l-xl">{t.date}</td>
                  <td className="py-4 px-4">{t.customer}</td>
                  <td className="py-4 px-4">{t.amount}</td>
                  <td className="py-4 px-4">{t.method}</td>
                  <td
                    className={`py-4 px-4 rounded-r-xl font-aeonik flex items-center gap-1 ${statusColor}`}
                  >
                    {t.status}
                    {isConfirmed && <FaCheckCircle className="text-[#00ffd1]" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

