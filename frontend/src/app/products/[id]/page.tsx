'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Loader } from '@/components/Loader';

interface Product {
    _id: string;
    name: string;
    description: string;
    startingPrice: number;
}

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [quantity, setQuantity] = useState(100);
    const [size, setSize] = useState('Standard');
    const [finish, setFinish] = useState('Matte');
    const [needDesign, setNeedDesign] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [deliveryType, setDeliveryType] = useState('Home Delivery');
    const [file, setFile] = useState<File | null>(null);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data.data);
            } catch (error) {
                console.error('Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const calcPrice = () => {
        if (!product) return 0;
        let base = product.startingPrice * (quantity / 100);
        if (finish === 'Glossy') base += 200;
        if (needDesign) base += 500;
        return base;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const price = calcPrice();
            // 1. Create order
            const orderRes = await api.post('/orders', {
                productId: id,
                quantity,
                options: { size, finish },
                price,
                needDesign,
                customerName,
                mobile,
                address,
                notes,
                deliveryType
            });

            const newOrder = orderRes.data.data;

            // 2. Upload file if exists and customer doesn't need design
            if (file && !needDesign) {
                const formData = new FormData();
                formData.append('fileType', 'originalFile');
                formData.append('file', file);

                await api.post(`/orders/${newOrder._id}/upload-file`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            // 3. Redirect
            router.push(`/success?orderId=${newOrder.orderId}`);
        } catch (error) {
            console.error(error);
            alert('Order failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader size={48} /></div>;
    if (!product) return <div className="text-center py-20 text-xl text-slate-500">Product not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Order {product.name}</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">{product.description}</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Product Options */}
                        <Card className="glass-panel border-none shadow-md">
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Quantity</label>
                                    <select
                                        value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full rounded-md border border-slate-300 p-2 bg-white"
                                    >
                                        <option value={100}>100</option>
                                        <option value={500}>500</option>
                                        <option value={1000}>1000</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Size</label>
                                    <select
                                        value={size} onChange={(e) => setSize(e.target.value)}
                                        className="w-full rounded-md border border-slate-300 p-2 bg-white"
                                    >
                                        <option>Standard</option>
                                        <option>Large</option>
                                        <option>Small</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Finish</label>
                                    <select
                                        value={finish} onChange={(e) => setFinish(e.target.value)}
                                        className="w-full rounded-md border border-slate-300 p-2 bg-white"
                                    >
                                        <option>Matte</option>
                                        <option>Glossy (+₹200)</option>
                                    </select>
                                </div>

                                <div className="pt-4 border-t border-slate-200 my-4">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={needDesign}
                                            onChange={(e) => setNeedDesign(e.target.checked)}
                                            className="w-5 h-5 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                                        />
                                        <span className="font-medium text-slate-800">I need design services (+₹500)</span>
                                    </label>
                                </div>

                                {!needDesign && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Upload Design (PDF/JPG/PNG)</label>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 file:text-primary-700
                        hover:file:bg-primary-100"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Right Column: Customer Details */}
                        <Card className="glass-panel border-none shadow-md">
                            <CardHeader>
                                <CardTitle>Delivery Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input label="Name" required value={customerName} onChange={e => setCustomerName(e.target.value)} />
                                <Input label="Mobile Number" required value={mobile} onChange={e => setMobile(e.target.value)} />
                                <Input label="Delivery Address" required value={address} onChange={e => setAddress(e.target.value)} />
                                <Input label="Order Notes / Instructions" value={notes} onChange={e => setNotes(e.target.value)} />

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Delivery Option</label>
                                    <select
                                        value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}
                                        className="w-full rounded-md border border-slate-300 p-2 bg-white"
                                    >
                                        <option>Home Delivery</option>
                                        <option>Pickup</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-primary-100 flex flex-col sm:flex-row items-center justify-between sticky bottom-4 z-10 glass-panel">
                        <div>
                            <p className="text-slate-500 font-medium">Estimated Total</p>
                            <p className="text-3xl font-extrabold text-primary-600">₹{calcPrice()}</p>
                        </div>
                        <Button type="submit" size="lg" className="w-full sm:w-auto mt-4 sm:mt-0" isLoading={submitting}>
                            {submitting ? 'Processing...' : 'Place Order Now'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
