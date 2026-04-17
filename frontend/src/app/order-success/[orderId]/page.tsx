'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { FaCheckCircle, FaWhatsapp, FaArrowRight, FaBoxOpen } from 'react-icons/fa';
import Link from 'next/link';

export default function OrderSuccess({ params }: { params: Promise<{ orderId: string }> }) {
    const router = useRouter();
    const { orderId } = use(params);

    // WhatsApp logic builder
    const handleWhatsAppRedirect = () => {
        const text = `Hello Saksham Printers, I have just placed order #${orderId} on the website. I want to confirm my order details!`;
        const encoded = encodeURIComponent(text);
        // Redirect to whatsapp with hardcoded number format or generic
        window.open(`https://wa.me/911234567890?text=${encoded}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-primary-500 selection:text-white">
            <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 text-center border-t-8 border-green-500 relative overflow-hidden">

                {/* Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-500/20 blur-3xl"></div>

                <FaCheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6 relative z-10 drop-shadow-xl" />

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">Order Confirmed!</h1>
                <p className="text-slate-500 text-lg font-medium mb-8">
                    Thank you for choosing Saksham Printers. Your transaction was securely handled and your invoice has been generated.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 inline-block shadow-inner w-full max-w-sm">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Your Tracking ID</span>
                    <span className="text-3xl font-black text-primary-600 tracking-wider">#{orderId}</span>
                </div>

                <div className="space-y-4">
                    <Button onClick={handleWhatsAppRedirect} size="lg" className="w-full h-16 rounded-2xl font-bold text-lg bg-[#25D366] hover:bg-[#20BE5C] shadow-lg shadow-[#25D366]/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 border-none">
                        <FaWhatsapp className="w-6 h-6" /> Chat on WhatsApp
                    </Button>

                    <Link href="/track" className="block">
                        <Button variant="outline" size="lg" className="w-full h-16 rounded-2xl font-bold text-lg border-2 border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all flex items-center justify-center gap-3">
                            <FaBoxOpen className="text-slate-500" /> Track Order Status
                        </Button>
                    </Link>

                    <Link href="/" className="block mt-4 text-sm font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest">
                        ← Return to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
