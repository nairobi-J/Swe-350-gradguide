'use client';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';

// Wrap the component that uses useSearchParams
function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const status = searchParams.get('status');
  const tran_id = searchParams.get('tran_id');

  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          {status === 'success' ? '✅ Payment Successful!' : '❌ Payment Failed'}
        </h1>
        {tran_id && <p className="mb-2">Transaction ID: {tran_id}</p>}
        <p>Redirecting to home page...</p>
      </div>
    </div>
  );
}

export default function PaymentStatus() {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}