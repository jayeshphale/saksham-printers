import Image from 'next/image';
import Link from 'next/link';
import { Button } from './Button';
import { FaBars, FaShoppingCart } from 'react-icons/fa';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-black text-white shadow-lg shadow-primary-600/10 transition-all h-[72px] flex items-center w-full">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl w-full mx-auto px-4 lg:px-8 flex justify-between items-center relative z-10">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 border border-white/10 p-1 shadow-lg shadow-primary-500/20">
                        <Image src="/images/saksham-printers-logo.png" alt="Saksham Printers logo" fill className="object-contain" />
                    </div>
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Saksham</p>
                        <h1 className="text-2xl font-black tracking-tight text-white">Printers</h1>
                    </div>
                </Link>

                <nav className="hidden md:flex gap-8 font-semibold text-sm">
                    <Link href="/" className="text-slate-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300">Home</Link>
                    <Link href="/products" className="text-slate-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300">Catalog</Link>
                    <Link href="/track" className="text-slate-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300">Track Order</Link>
                </nav>

                <div className="flex gap-4 items-center">
                    <Link href="/products">
                        <Button className="hidden sm:flex bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-bold px-6 rounded-lg shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transition-all hover:-translate-y-0.5">
                            <FaShoppingCart className="mr-2" /> Shop Now
                        </Button>
                    </Link>
                    <button className="md:hidden flex items-center justify-center text-slate-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"><FaBars className="w-6 h-6" /></button>
                </div>
            </div>
        </header>
    );
}
