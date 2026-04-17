'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { Card } from '@/components/Card';
import { Loader } from '@/components/Loader';
import { FaShoppingCart, FaClipboardList, FaBoxOpen, FaChartLine } from 'react-icons/fa';

interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    ordersToday: number;
    pendingOrders: number;
    ordersByStatus: { _id: string; count: number }[];
    recentOrders: any[];
    topProducts: any[];
}

interface TrendData {
    _id: string;
    orders: number;
    revenue: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [trend, setTrend] = useState<TrendData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, trendRes] = await Promise.all([
                api.get('/analytics/dashboard'),
                api.get('/analytics/orders-trend', { params: { days: 7 } })
            ]);
            setStats(statsRes.data.data);
            setTrend(trendRes.data.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return <Loader />;

    const avgOrderValue = stats?.totalOrders ? Math.round(stats.totalRevenue / stats.totalOrders) : 0;

    const statCards = [
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: FaShoppingCart,
            color: 'blue',
            link: '/admin/orders'
        },
        {
            title: 'Total Revenue',
            value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: FaChartLine,
            color: 'green',
            link: '/admin/orders'
        },
        {
            title: 'Orders Today',
            value: stats?.ordersToday || 0,
            icon: FaClipboardList,
            color: 'purple',
            link: '/admin/orders'
        },
        {
            title: 'Pending Orders',
            value: stats?.pendingOrders || 0,
            icon: FaBoxOpen,
            color: 'orange',
            link: '/admin/orders'
        }
    ];

    const summaryCards = [
        {
            label: 'Average order value',
            value: `₹${avgOrderValue.toLocaleString()}`,
            accent: 'bg-blue-50 text-blue-900'
        },
        {
            label: 'Live orders',
            value: stats?.ordersToday || 0,
            accent: 'bg-slate-100 text-slate-900'
        },
        {
            label: 'Pending approvals',
            value: stats?.pendingOrders || 0,
            accent: 'bg-amber-50 text-amber-900'
        },
        {
            label: 'Revenue target',
            value: `₹${((stats?.totalRevenue || 0) * 0.75).toLocaleString()}`,
            accent: 'bg-teal-50 text-teal-900'
        }
    ];

    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.8fr_1fr]">
                <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-8 text-white shadow-lg">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Admin Dashboard</p>
                            <h1 className="mt-3 text-4xl font-bold leading-tight">Welcome back, Business Owner</h1>
                            <p className="mt-3 text-slate-300 text-base leading-relaxed">Monitor your printing orders, manage product inventory, and keep the workflow moving from design to delivery.</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-6 text-center text-slate-100 shadow-inner sm:min-w-[240px]">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-300 font-semibold">Active Workflow</p>
                            <p className="mt-4 text-4xl font-bold">{stats?.totalOrders || 0}</p>
                            <p className="mt-2 text-sm text-slate-300">orders in progress</p>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {summaryCards.map((item) => (
                            <div key={item.label} className={`rounded-2xl border border-white/10 ${item.accent} p-5 shadow-sm`}>
                                <p className="text-xs uppercase tracking-[0.16em] text-slate-600 font-semibold">{item.label}</p>
                                <p className="mt-3 text-2xl font-bold text-slate-900">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 font-semibold">Order Trend</p>
                            <h2 className="mt-1 text-2xl font-bold text-slate-900">Last 7 days</h2>
                        </div>
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                            Updated now
                        </span>
                    </div>
                    <div className="space-y-3">
                        {trend.length > 0 ? (
                            trend.map((item) => (
                                <div key={item._id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100 transition">
                                    <span className="text-sm font-medium text-slate-700">{item._id}</span>
                                    <div className="flex items-center gap-4 text-right">
                                        <span className="text-sm font-semibold text-slate-900">{item.orders} orders</span>
                                        <span className="text-sm text-slate-600">₹{item.revenue.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-500 py-8 text-sm">Trend data is loading or unavailable.</p>
                        )}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <Link key={idx} href={stat.link}>
                            <Card className="cursor-pointer hover:shadow-lg transition-all rounded-2xl">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.16em] text-slate-600 font-semibold">{stat.title}</p>
                                        <p className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</p>
                                    </div>
                                    <div className={`rounded-2xl p-3 ${colorClasses[stat.color]}`}>
                                        <Icon size={24} />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
                <Card className="rounded-2xl">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-600 font-semibold">Order Activity</p>
                            <h2 className="mt-1 text-2xl font-bold text-slate-900">Recent orders</h2>
                        </div>
                        <Link href="/admin/orders" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
                            View all orders →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                            stats.recentOrders.slice(0, 5).map((order) => (
                                <Link
                                    key={order._id}
                                    href={`/admin/orders/${order._id}`}
                                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-white"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-900">{order.orderId}</p>
                                        <p className="text-sm text-slate-600">{order.customerName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-semibold text-slate-900">₹{order.finalPrice}</p>
                                        <span className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center text-slate-600 py-8 text-sm">No recent orders to display.</p>
                        )}
                    </div>
                </Card>

                <Card className="rounded-2xl">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-600 font-semibold">Status Summary</p>
                            <h2 className="mt-1 text-2xl font-bold text-slate-900">Orders by status</h2>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {stats?.ordersByStatus && stats.ordersByStatus.length > 0 ? (
                            stats.ordersByStatus.map((item) => (
                                <div key={item._id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100 transition">
                                    <span className="font-medium text-slate-800">{item._id}</span>
                                    <span className="font-semibold text-slate-900">{item.count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-600 py-8 text-sm">No status data available.</p>
                        )}
                    </div>
                </Card>
            </div>

            {stats?.topProducts && stats.topProducts.length > 0 && (
                <Card className="rounded-2xl">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-600 font-semibold">Product Insights</p>
                            <h2 className="mt-1 text-2xl font-bold text-slate-900">Top products</h2>
                        </div>
                        <span className="text-sm text-slate-600">Recent order volume</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                        {stats.topProducts.map((item, idx) => (
                            <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center hover:shadow-md transition">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">{item.product?.[0]?.name || 'Product'}</p>
                                <p className="mt-4 text-3xl font-bold text-slate-900">{item.count}</p>
                                <p className="mt-2 text-xs text-slate-600">orders</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
