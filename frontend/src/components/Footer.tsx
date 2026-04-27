import Image from 'next/image';
import Link from 'next/link';
import { FaEnvelope, FaPhone, FaLock, FaStar, FaShippingFast } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 border-b border-white/10 pb-16 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white/10 border border-white/10 p-1 shadow-lg shadow-primary-500/20">
                <Image src="/images/saksham-printers-logo-v2.png" alt="Saksham Printers logo" fill className="object-contain" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Saksham</p>
                <h2 className="text-3xl font-black tracking-tight">Printers</h2>
              </div>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-6">
              Empowering brands through enterprise-grade printing services. Experience the gold standard in commercial printing across India.
            </p>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <FaEnvelope className="w-4 h-4 text-primary-400" />
                <span className="font-semibold">support@sakshamprinters.com</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="w-4 h-4 text-primary-400" />
                <span className="font-semibold">+91 98765 43210</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li><Link href="/products" className="hover:text-primary-400 transition-colors">All Products</Link></li>
              <li><Link href="/track" className="hover:text-primary-400 transition-colors">Track Order</Link></li>
              <li><Link href="#how-it-works" className="hover:text-primary-400 transition-colors">How It Works</Link></li>
              <li><Link href="#categories" className="hover:text-primary-400 transition-colors">Categories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Business</h3>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li><Link href="/admin/login" className="hover:text-primary-400 transition-colors">Admin Dashboard</Link></li>
              <li><span className="text-slate-500">Bulk Orders</span></li>
              <li><span className="text-slate-500">Custom Solutions</span></li>
              <li><span className="text-slate-500">Partnership Program</span></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left text-slate-600 text-sm font-semibold tracking-wide">
            © {new Date().getFullYear()} SAKSHAM PRINTERS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-2">
              <FaLock className="w-4 h-4 text-primary-400" />
              <span>SSL Secured</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <FaStar className="w-4 h-4 text-yellow-400" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <FaShippingFast className="w-4 h-4 text-primary-400" />
              <span>Pan-India Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
