'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('token');
        const isLoginPage = window.location.pathname === '/admin/login';

        if (!token && !isLoginPage) {
            router.push('/admin/login');
        }
    }, [router]);

    if (!mounted) return null;

    // Skip sidebar on login page
    if (typeof window !== 'undefined' && window.location.pathname === '/admin/login') {
        return children;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 pt-20 md:pt-0 md:ml-0">
                    <div className="max-w-7xl mx-auto p-4 md:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
