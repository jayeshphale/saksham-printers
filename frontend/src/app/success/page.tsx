'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const message = `Hello, I just placed an order. My Order ID is ${orderId || 'unknown'}. Please confirm.`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;

    return (
        <div className="text-center animate-fade-in glass-panel p-10 rounded-3xl shadow-xl max-w-md w-full mx-4">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Order Confirmed!</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
                Thank you for your order. We have received your request.
            </p>

            {orderId && (
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl mb-6 border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 mb-1">Your Order ID:</p>
                    <p className="text-xl font-mono font-bold text-primary-600">{orderId}</p>
                </div>
            )}

            <div className="flex flex-col gap-4 mt-8">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30">
                        Send WhatsApp Confirmation
                    </Button>
                </a>
                <Link href="/">
                    <Button variant="outline" className="w-full">
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
