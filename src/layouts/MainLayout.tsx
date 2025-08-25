import React, { ReactNode } from 'react';
import UserNavbar from '../components/common/NavBar/UserNavBar';
import MerchantNavbar from '../components/common/NavBar/MerchantNavbar';

interface MainLayoutProps {
  children: ReactNode;
  role?: 'user' | 'merchant';
}

export default function MainLayout({ children, role = 'user' }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar (wider on dashboard) */}
      <div className="basis-[14%] flex-shrink-0">
        {role === 'user' ? <UserNavbar /> : <MerchantNavbar />}
      </div>

      {/* Main content */}
      <main className="basis-[86%] overflow-auto">{children}</main>
    </div>
  );
}

