'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const tran_id = searchParams.get('tran_id');

  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {status === 'success' ? 'Payment Successful' : 'Payment Failed'}
        </h1>
        <p className="text-gray-600">
          {status === 'success' 
            ? 'Your transaction was completed successfully' 
            : 'We encountered an issue with your payment'}
        </p>
      </div>

      {/* Payment Status Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center text-center mb-6">
            {status === 'success' ? (
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
            )}
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              {status === 'success' ? '✅ Payment Successful!' : '❌ Payment Failed'}
            </h2>
            {tran_id && (
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full mb-4">
                <span className="text-sm font-medium text-gray-700">Transaction ID: {tran_id}</span>
              </div>
            )}
            <p className="text-gray-600 max-w-md">
              {status === 'success'
                ? 'Thank you for your payment. Your transaction has been processed successfully.'
                : 'Please try again or contact support if the problem persists.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Next Steps</h3>
              <p className="text-sm text-gray-600">
                {status === 'success'
                  ? 'You will receive a confirmation email shortly.'
                  : 'You will not be charged for this failed transaction.'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600">
                Contact our support team at support@example.com for any questions.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              Return to Home
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentStatus() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p>Loading payment status...</p>
        </div>
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}