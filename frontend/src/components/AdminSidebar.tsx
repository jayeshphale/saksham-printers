'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaHome, FaShoppingCart, FaBox, FaFolderOpen, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        router.push('/admin/login');
    };

    const menuItems = [
        { href: '/admin', icon: FaHome, label: 'Dashboard' },
        { href: '/admin/orders', icon: FaShoppingCart, label: 'Orders' },
        { href: '/admin/products', icon: FaBox, label: 'Products' },
        { href: '/admin/categories', icon: FaFolderOpen, label: 'Categories' },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-950 text-white rounded-xl shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 fixed md:relative md:sticky top-0 left-0 h-screen w-72 bg-slate-950 text-white shadow-2xl transition-transform duration-300 z-40`}
            >
                <div className="p-6 border-b border-slate-800">
                    <div className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                        PrintAdmin
                    </div>
                    <h1 className="mt-5 text-3xl font-bold tracking-tight">Printing Press</h1>
                    <p className="mt-2 text-sm text-slate-400">Control center for your business</p>
                </div>

                <nav className="mt-8 space-y-1 px-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-medium transition ${
                                    isActive(item.href)
                                        ? 'bg-slate-800 text-white shadow-inner'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        <FaSignOutAlt size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 md:hidden z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
