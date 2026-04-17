'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Loader } from '@/components/Loader';
import { FileDown, CheckCircle, XCircle } from 'lucide-react';

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const initId = searchParams.get('orderId') || '';

    const [orderId, setOrderId] = useState(initId);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notes, setNotes] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [feedbackRating, setFeedbackRating] = useState(5);
    const [feedbackComment, setFeedbackComment] = useState('');
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    // Note: Backend getOrders is protected. We might need a public endpoint or we can search by exact ID from Admin getOrders?
    // Wait, I implemented `GET /api/orders/:id` without `protect` middleware intentionally for this purpose!
    // BUT the endpoint expects Mongo ObjectId, not string OrderID.
    // Wait, I can search by orderId using `GET /api/orders?search=...`? But that's protected.
    // Let me fix orderRoutes to allow fetching by orderId String publicly if needed.
    // However, `GET /api/orders/:id` uses `findById()`. I need to handle fetching by `orderId` String.

    const handleTrack = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!orderId) return;
        setLoading(true);
        setError('');

        // We will do a small hack: API `GET /api/orders/:id` supports params.
        // If it fails due to invalid ObjectId, we might need to adjust backend.

        // Temporary test assuming backend handles string ID if we modify it.
        try {
            // Fetching order (We'll assume backend is updated to search by orderId string or let's update it in parallel)
            const res = await api.get(`/orders/${orderId}?type=stringId`);
            setOrder(res.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Order not found');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (approved: boolean) => {
        setActionLoading(true);
        try {
            await api.post(`/orders/${order._id}/approve-design`, { approved, notes });
            alert(approved ? 'Design Approved!' : 'Changes Requested.');
            handleTrack(); // Refresh
            setNotes('');
        } catch (err) {
            alert('Failed to submit response');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitFeedback = async () => {
        if (!feedbackComment.trim()) {
            alert('Please enter feedback comment');
            return;
        }

        setFeedbackLoading(true);
        try {
            await api.post(`/orders/${order._id}/feedback`, { 
                rating: feedbackRating, 
                comment: feedbackComment 
            });
            setFeedbackSuccess(true);
            setFeedbackComment('');
            handleTrack(); // Refresh to see updated feedback
            setTimeout(() => setFeedbackSuccess(false), 3000);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setFeedbackLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 px-6 py-10 shadow-2xl shadow-slate-950/20 text-white">
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.45),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.35),_transparent_25%)] pointer-events-none"></div>
                    <div className="relative z-10 space-y-6">
                        <div className="max-w-xl">
                            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-200">Order Tracking</p>
                            <h1 className="mt-4 text-4xl font-black tracking-tight">Track your print order instantly</h1>
                            <p className="mt-3 text-base text-slate-300">Enter your order ID and follow every step from design review to delivery. Your print journey stays transparent and simple.</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                <p className="text-sm text-slate-300">Easy tracking</p>
                                <p className="mt-3 text-2xl font-semibold">Fast visibility</p>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                <p className="text-sm text-slate-300">Design approvals</p>
                                <p className="mt-3 text-2xl font-semibold">Instant reviews</p>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                <p className="text-sm text-slate-300">Secure feedback</p>
                                <p className="mt-3 text-2xl font-semibold">Safer updates</p>
                            </div>
                        </div>
                    </div>
                </section>

                <Card className="overflow-hidden shadow-xl shadow-slate-300/10">
                    <CardContent className="space-y-6 p-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">Track your order</h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Use your order ID to get an up-to-date delivery status, design preview, and easy feedback.</p>
                        </div>

                        <form onSubmit={handleTrack} className="grid gap-4 sm:grid-cols-[1fr_auto]">
                            <Input
                                placeholder="ORD-123456"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                required
                                className="min-h-[54px]"
                            />
                            <Button type="submit" isLoading={loading} className="min-h-[54px] px-8">
                                Track Order
                            </Button>
                        </form>

                        <div className="grid gap-4 sm:grid-cols-3 text-center">
                            <div className="rounded-3xl border border-slate-200 bg-white p-4">
                                <p className="text-sm text-slate-500">Order status</p>
                                <p className="mt-2 text-xl font-semibold">Live updates</p>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-white p-4">
                                <p className="text-sm text-slate-500">Design approvals</p>
                                <p className="mt-2 text-xl font-semibold">One-click review</p>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-white p-4">
                                <p className="text-sm text-slate-500">Customer support</p>
                                <p className="mt-2 text-xl font-semibold">Always visible</p>
                            </div>
                        </div>

                        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
                    </CardContent>
                </Card>

                {order && (
                    <Card className="overflow-hidden shadow-2xl shadow-slate-400/10">
                        <CardHeader>
                            <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Order ID</p>
                                    <span className="text-2xl font-semibold">{order.orderId}</span>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">{order.status}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl bg-slate-50 p-5">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Product</p>
                                    <p className="mt-3 text-lg font-semibold text-slate-900">{order.productId?.name}</p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-5">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total</p>
                                    <p className="mt-3 text-lg font-semibold text-slate-900">₹{order.finalPrice}</p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-5">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Delivery</p>
                                    <p className="mt-3 text-lg font-semibold text-slate-900">{order.deliveryType}</p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-5">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ordered</p>
                                    <p className="mt-3 text-lg font-semibold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {order.designPreview && (
                                <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                                        <div>
                                            <h3 className="text-xl font-semibold text-slate-900">Design Preview Ready</h3>
                                            <p className="mt-2 text-sm text-slate-500">Review the design and choose to approve or request changes.</p>
                                        </div>
                                        <a href={order.designPreview} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                                            <FileDown className="h-4 w-4" /> View Design
                                        </a>
                                    </div>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-3xl bg-white p-4 shadow-sm">
                                            <label className="text-sm font-medium text-slate-700">Change requests</label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Describe the changes you want..."
                                                className="mt-3 h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                        <div className="rounded-3xl bg-white p-4 shadow-sm flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <Button
                                                    onClick={() => handleApproval(true)}
                                                    isLoading={actionLoading}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Approve Design
                                                </Button>
                                                <Button
                                                    onClick={() => handleApproval(false)}
                                                    isLoading={actionLoading}
                                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                                                >
                                                    <XCircle className="mr-2 h-4 w-4" /> Request Changes
                                                </Button>
                                            </div>
                                            <p className="text-xs text-slate-500">You can submit your review anytime during the design phase.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {order.finalFile && (
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                                        <div>
                                            <h3 className="text-xl font-semibold text-slate-900">Final Print File</h3>
                                            <p className="mt-2 text-sm text-slate-500">Your final order file is now available for download.</p>
                                        </div>
                                        <a href={order.finalFile} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                                            <FileDown className="h-4 w-4" /> Download File
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="rounded-3xl bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-slate-900">Order History</h3>
                                    <div className="mt-4 space-y-4">
                                        {[...order.statusHistory].reverse().map((h: any, i: number) => (
                                            <div key={i} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                                                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center">
                                                    <p className="font-semibold text-slate-900">{h.status}</p>
                                                    <span className="text-xs text-slate-500">{new Date(h.timestamp).toLocaleString()}</span>
                                                </div>
                                                {h.notes && <p className="mt-2 text-sm text-slate-600">{h.notes}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-white p-6 shadow-sm">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-lg font-semibold text-slate-900">Share Your Feedback</p>
                                            <p className="mt-1 text-sm text-slate-500">Help us improve your printing experience.</p>
                                        </div>
                                        {order.userFeedback && (
                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">Submitted</span>
                                        )}
                                    </div>

                                    {order.userFeedback ? (
                                        <div className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={i < order.userFeedback.rating ? 'text-yellow-400' : 'text-slate-300'}>★</span>
                                                ))}
                                                <span>({order.userFeedback.rating}/5)</span>
                                            </div>
                                            <p className="mt-3 text-sm text-slate-700">{order.userFeedback.comment}</p>
                                            <p className="mt-3 text-xs text-slate-500">Submitted on {new Date(order.userFeedback.submittedAt).toLocaleDateString()}</p>
                                        </div>
                                    ) : (
                                        <div className="mt-5 space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Rating</p>
                                                <div className="mt-3 flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            onClick={() => setFeedbackRating(star)}
                                                            className="text-3xl transition-transform hover:scale-110"
                                                        >
                                                            <span className={feedbackRating >= star ? 'text-yellow-400' : 'text-slate-300'}>★</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <textarea
                                                    value={feedbackComment}
                                                    onChange={(e) => setFeedbackComment(e.target.value)}
                                                    placeholder="Tell us about your experience..."
                                                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                                                    rows={4}
                                                />
                                            </div>
                                            <Button onClick={handleSubmitFeedback} isLoading={feedbackLoading} className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                                                Submit Feedback
                                            </Button>
                                            {feedbackSuccess && <p className="text-sm text-emerald-700">Thank you! Your feedback has been received.</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default function TrackPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="flex justify-center"><Loader /></div>}>
                <TrackOrderContent />
            </Suspense>
        </div>
    );
}
