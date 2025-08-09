'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentStatus() {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get('status');

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => router.push('/'), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
        </h1>
        <p>You'll be redirected home shortly...</p>
      </div>
    </div>
  );
}