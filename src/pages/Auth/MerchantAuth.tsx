import React from 'react';
import MerchantAuthForm from '../../components/auth/AuthForm/MerchantAuthForm';

export default function MerchantAuth() {
  return (
    <div className="h-full flex flex-col justify-center items-center px-4 text-black">
      <div className="max-w-7xl space-y-6">
        <MerchantAuthForm />
      </div>
    </div>
  );
}

