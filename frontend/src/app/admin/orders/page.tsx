'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Loader } from '@/components/Loader';
import { FaEye, FaFilter } from 'react-icons/fa';

interface Order {
    _id: string;
    orderId: string;
    customerName: string;
    mobile: string;
    productId: { name: string };
    finalPrice: number;
    status: string;
    createdAt: string;
}

const STATUSES = [
    'Pending',
    'Confirmed',
    'In Design',
    'Design Sent',
    'Approved',
    'Printing',
    'Finishing',
    'Packed',
    'Out for Delivery',
    'Delivered'
];

export default function OrdersManagement() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/orders', {
                params: {
                    search: search || undefined,
                    status: statusFilter || undefined,
                    page,
                    limit: itemsPerPage
                }
            });
            setOrders(res.data.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [search, statusFilter, page]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Confirmed': 'bg-blue-100 text-blue-800',
            'In Design': 'bg-purple-100 text-purple-800',
            'Design Sent': 'bg-indigo-100 text-indigo-800',
            'Approved': 'bg-green-100 text-green-800',
            'Printing': 'bg-orange-100 text-orange-800',
            'Finishing': 'bg-pink-100 text-pink-800',
            'Packed': 'bg-teal-100 text-teal-800',
            'Out for Delivery': 'bg-cyan-100 text-cyan-800',
            'Delivered': 'bg-green-100 text-green-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Orders Management</h1>
                    <p className="text-slate-600 mt-1">Manage and track all customer orders</p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                        <Input
                            type="text"
                            placeholder="Order ID, Customer name, or Mobile"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            {STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <Button
                            onClick={() => {
                                setSearch('');
                                setStatusFilter('');
                                setPage(1);
                            }}
                            className="w-full bg-slate-600 hover:bg-slate-700"
                        >
                            <FaFilter className="mr-2" /> Clear Filters
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Orders Table */}
            <Card>
                {loading ? (
                    <Loader />
                ) : orders.length === 0 ? (
                    <div className="text-center py-8 text-slate-600">
                        No orders found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Order ID</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Customer</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Product</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Price</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Feedback</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Date</th>
                                    <th className="text-center py-3 px-4 font-semibold text-slate-900">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                        <td className="py-3 px-4 font-medium text-slate-900">{order.orderId}</td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium text-slate-900">{order.customerName}</p>
                                                <p className="text-sm text-slate-600">{order.mobile}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-slate-700">{order.productId?.name}</td>
                                        <td className="py-3 px-4 font-medium text-slate-900">₹{order.finalPrice}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {order.userFeedback ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-400">★</span>
                                                    <span className="text-sm font-semibold text-slate-700">{order.userFeedback.rating}/5</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <Link
                                                href={`/admin/orders/${order._id}`}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                                            >
                                                <FaEye size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
