'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentStatus() {
  const router = useRouter();

  useEffect(() => {
    // Simple redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p>You will be redirected to home page shortly...</p>
      </div>
    </div>
  );
}