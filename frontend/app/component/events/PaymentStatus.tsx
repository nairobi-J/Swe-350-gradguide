'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentStatus() {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get('status');

  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          {status === 'success' ? 'Payment Successful!' : 
           status === 'failed' ? 'Payment Failed' : 'Payment Status Unknown'}
        </h1>
        <p>Redirecting to home page...</p>
      </div>
    </div>
  );
}