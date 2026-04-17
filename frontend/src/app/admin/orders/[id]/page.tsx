'use client';
import { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Loader } from '@/components/Loader';
import { FileDown, Upload, ArrowLeft } from 'lucide-react';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [internalNotes, setInternalNotes] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    // File Upload states
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [finalFile, setFinalFile] = useState<File | null>(null);

    // Refs for file inputs
    const previewInputRef = useRef<HTMLInputElement>(null);
    const finalInputRef = useRef<HTMLInputElement>(null);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${id}`);
            setOrder(res.data.data);
            setStatus(res.data.data.status);
            setInternalNotes(res.data.data.internalNotes || '');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleUpdate = async () => {
        setUpdateLoading(true);
        try {
            await api.put(`/orders/${id}`, { status, internalNotes });
            fetchOrder(); // refresh
            alert('Order updated!');
        } catch (error) {
            alert('Update failed');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleFileUpload = async (file: File | null, fileType: string) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('fileType', fileType);
        formData.append('file', file);

        try {
            await api.post(`/orders/${id}/upload-file`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('File uploaded successfully!');
            fetchOrder();
            if (fileType === 'designPreview') setPreviewFile(null);
            if (fileType === 'finalFile') setFinalFile(null);
        } catch (error) {
            alert('Upload failed');
        }
    };

    if (loading) return <Loader className="mt-20 block mx-auto" size={48} />;
    if (!order) return <div className="p-8">Order not found</div>;

    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center space-x-4 mb-4">
                <Button variant="ghost" onClick={() => router.push('/admin')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Order #{order.orderId}</span>
                                <span className="text-sm px-3 py-1 bg-slate-100 rounded-full text-slate-700">{order.status}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-y-4 text-sm text-slate-700 dark:text-slate-300">
                            <div><p className="font-semibold text-slate-900 dark:text-white">Customer</p><p>{order.customerName}</p></div>
                            <div><p className="font-semibold text-slate-900 dark:text-white">Mobile</p><p>{order.mobile}</p></div>
                            <div><p className="font-semibold text-slate-900 dark:text-white">Product</p><p>{order?.productId?.name}</p></div>
                            <div><p className="font-semibold text-slate-900 dark:text-white">Quantity</p><p>{order.quantity}</p></div>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">Options</p>
                                <p>Size: {order.options?.size}, Finish: {order.options?.finish}</p>
                                <p>Needs Design: {order.needDesign ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="col-span-2"><p className="font-semibold text-slate-900 dark:text-white">Delivery</p><p>{order.deliveryType} - {order.address || 'N/A'}</p></div>
                            <div className="col-span-2"><p className="font-semibold text-slate-900 dark:text-white">Customer Notes</p><p className="italic">{order.notes || 'None'}</p></div>
                        </CardContent>
                    </Card>

                    {/* Files Section */}
                    <Card>
                        <CardHeader><CardTitle>Files & Design</CardTitle></CardHeader>
                        <CardContent className="space-y-6">

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div>
                                    <h4 className="font-medium dark:text-white">Original File</h4>
                                    <p className="text-sm text-slate-500">File uploaded by customer</p>
                                </div>
                                {order.originalFile ? (
                                    <a href={order.originalFile} target="_blank" rel="noreferrer" className="flex items-center text-primary-600 hover:underline">
                                        <FileDown className="w-4 h-4 mr-1" /> Download
                                    </a>
                                ) : (
                                    <span className="text-sm text-slate-400">No file uploaded</span>
                                )}
                            </div>

                            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium dark:text-white">Design Preview</h4>
                                        <p className="text-sm text-slate-500">Upload design for customer approval</p>
                                    </div>
                                    {order.designPreview && (
                                        <a href={order.designPreview} target="_blank" rel="noreferrer" className="flex items-center text-primary-600 hover:underline text-sm">
                                            <FileDown className="w-4 h-4 mr-1" /> View Current
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={previewInputRef}
                                        className="hidden"
                                        onChange={(e) => setPreviewFile(e.target.files?.[0] || null)}
                                    />
                                    <input
                                        type="text"
                                        readOnly
                                        value={previewFile ? previewFile.name : 'No file chosen'}
                                        className="flex-1 text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 dark:bg-slate-800"
                                        placeholder="No file chosen"
                                    />
                                    <Button size="sm" onClick={() => previewInputRef.current?.click()}>
                                        <Upload className="w-3 h-3 mr-1" /> Choose File
                                    </Button>
                                    <Button size="sm" onClick={() => handleFileUpload(previewFile, 'designPreview')} disabled={!previewFile}>
                                        <Upload className="w-3 h-3 mr-1" /> Upload
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium dark:text-white">Final Print File</h4>
                                        <p className="text-sm text-slate-500">High-res file for printing</p>
                                    </div>
                                    {order.finalFile && (
                                        <a href={order.finalFile} target="_blank" rel="noreferrer" className="flex items-center text-primary-600 hover:underline text-sm">
                                            <FileDown className="w-4 h-4 mr-1" /> View Current
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={finalInputRef}
                                        className="hidden"
                                        onChange={(e) => setFinalFile(e.target.files?.[0] || null)}
                                    />
                                    <input
                                        type="text"
                                        readOnly
                                        value={finalFile ? finalFile.name : 'No file chosen'}
                                        className="flex-1 text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 dark:bg-slate-800"
                                        placeholder="No file chosen"
                                    />
                                    <Button size="sm" onClick={() => finalInputRef.current?.click()}>
                                        <Upload className="w-3 h-3 mr-1" /> Choose File
                                    </Button>
                                    <Button size="sm" onClick={() => handleFileUpload(finalFile, 'finalFile')} disabled={!finalFile}>
                                        <Upload className="w-3 h-3 mr-1" /> Upload
                                    </Button>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Status & Notes */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Update Order</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    className="w-full rounded-md border border-slate-300 p-2"
                                    value={status} onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option>Pending</option>
                                    <option>Confirmed</option>
                                    <option>In Design</option>
                                    <option>Design Sent</option>
                                    <option>Approved</option>
                                    <option>Printing</option>
                                    <option>Finishing</option>
                                    <option>Packed</option>
                                    <option>Out for Delivery</option>
                                    <option>Delivered</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Internal Notes</label>
                                <textarea
                                    className="w-full rounded-md border border-slate-300 p-2 min-h-32"
                                    placeholder="Notes only visible to admins..."
                                    value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)}
                                />
                            </div>
                            <Button className="w-full" onClick={handleUpdate} isLoading={updateLoading}>
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Status History</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1 max-h-96 overflow-y-auto">
                                {[...order.statusHistory].reverse().slice(0, 10).map((h: any, i: number) => (
                                    <div key={i} className="text-xs border-l-2 border-slate-300 pl-2 py-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-semibold text-slate-900 dark:text-white">{h.status}</span>
                                            <span className="text-slate-500 whitespace-nowrap">{new Date(h.timestamp).toLocaleDateString()} {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        {h.notes && <p className="text-slate-600 dark:text-slate-400 mt-0.5 italic">{h.notes}</p>}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {order.userFeedback && (
                        <Card className="border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
                            <CardHeader><CardTitle className="text-sm text-green-700 dark:text-green-400">Customer Feedback</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Rating:</span>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-sm ${i < order.userFeedback.rating ? 'text-yellow-400' : 'text-slate-300'}`}>★</span>
                                        ))}
                                    </div>
                                    <span className="text-xs font-semibold text-green-700 dark:text-green-400">({order.userFeedback.rating}/5)</span>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-900 dark:text-white mb-0.5">Comment:</p>
                                    <p className="text-xs text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800 p-1.5 rounded line-clamp-2">{order.userFeedback.comment}</p>
                                </div>
                                <p className="text-xs text-slate-500">{new Date(order.userFeedback.submittedAt).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
