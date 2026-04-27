'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import api from '@/services/api';
import { FaArrowLeft, FaCheckCircle, FaCloudUploadAlt, FaShieldAlt, FaStar, FaTruck, FaPaintBrush } from 'react-icons/fa';
import Link from 'next/link';

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const { slug } = use(params);

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form states
    const [selectedOptions, setSelectedOptions] = useState<any>({});
    const [quantity, setQuantity] = useState<number>(1);
    const [needDesign, setNeedDesign] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    // Customer details
    const [customer, setCustomer] = useState({ name: '', mobile: '', address: '', notes: '' });

    const [estimatedPrice, setEstimatedPrice] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchProduct() {
            try {
                const { data } = await api.get(`/products/${slug}`);
                setProduct(data.data);
                setEstimatedPrice(data.data.basePrice);

                // Pre-select first options
                const initialOpts: any = {};
                if (data.data.options) {
                    Object.keys(data.data.options).forEach(key => {
                        if (data.data.options[key] && data.data.options[key].length > 0) {
                            if (key === 'quantity') {
                                setQuantity(data.data.options[key][0]);
                            } else {
                                initialOpts[key] = data.data.options[key][0];
                            }
                        }
                    });
                    if (data.data.options.customOptions) {
                        data.data.options.customOptions.forEach((opt: any) => {
                            initialOpts[opt.key] = opt.values[0];
                        });
                    }
                }
                setSelectedOptions(initialOpts);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    // Pseudo local pricing engine replica
    useEffect(() => {
        if (!product) return;
        let finalUnitPrice = product.basePrice;

        if (product.pricingRules) {
            for (const rule of product.pricingRules) {
                let matches = true;
                for (const key in rule.condition) {
                    const cond = rule.condition[key];
                    const act = key === 'quantity' ? quantity : selectedOptions[key];
                    if (typeof cond === 'object') {
                        if (cond.$gte && !(act >= cond.$gte)) matches = false;
                        if (cond.$lt && !(act < cond.$lt)) matches = false;
                    } else {
                        if (act !== cond) matches = false;
                    }
                }
                if (matches) finalUnitPrice = rule.price;
            }
        }

        let multiplier = 1;
        if (product.unitType === 'per sq.ft' && selectedOptions.size) {
            const match = selectedOptions.size.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/i);
            if (match) multiplier = parseFloat(match[1]) * parseFloat(match[2]);
        }

        const calculated = finalUnitPrice * multiplier * quantity;
        setEstimatedPrice(calculated + (needDesign ? 500 : 0));
    }, [selectedOptions, quantity, product, needDesign]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('productId', product._id);
            formData.append('quantity', quantity.toString());
            formData.append('options', JSON.stringify(selectedOptions));
            formData.append('needDesign', String(needDesign));
            formData.append('customerName', customer.name);
            formData.append('mobile', customer.mobile);
            formData.append('address', customer.address);
            formData.append('notes', customer.notes);

            if (file && !needDesign) {
                formData.append('file', file);
            }

            const { data } = await api.post('/orders', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            router.push(`/order-success/${data.data.orderId}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to place order');
            setSubmitting(false);
        }
    };

    const handleOptionSelect = (key: string, value: any) => {
        if (key === 'quantity') setQuantity(Number(value));
        else setSelectedOptions((prev: any) => ({ ...prev, [key]: value }));
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Loading Product Module...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Product Temporarily Unavailable</div>;

    return (
        <div className="min-h-screen bg-white font-sans pb-32">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid lg:grid-cols-12 gap-8 lg:gap-14">

                {/* Left Column: Media & Overviews */}
                <div className="lg:col-span-7 space-y-10">
                    {/* Main Image Viewer */}
                    <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden relative">
                        <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-200">
                            {product.subCategory || 'Premium Customisation'}
                        </div>
                        <img src={product.image} alt={product.name} className="w-full object-cover aspect-[4/3] mix-blend-multiply hover:scale-105 transition-transform duration-700 cursor-zoom-in" />
                    </div>

                    {/* Rich Details */}
                    <div className="prose prose-slate max-w-none">
                        <h2 className="text-2xl font-black text-slate-900 mb-4">Product Overview</h2>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            {product.description}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                        <div className="flex gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                            <FaShieldAlt className="w-8 h-8 text-blue-500 shrink-0" />
                            <div>
                                <h4 className="font-bold text-blue-900">Purchase Protection</h4>
                                <p className="text-sm text-blue-700 mt-1">100% safe & SSL secured checkout via top gateways.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 rounded-2xl bg-green-50 border border-green-100">
                            <FaTruck className="w-8 h-8 text-green-500 shrink-0" />
                            <div>
                                <h4 className="font-bold text-green-900">Fast Fulfillment</h4>
                                <p className="text-sm text-green-700 mt-1">Priority dispatch and tracked shipping.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Checkout & Configuration (Sticky Buy Box) */}
                <div className="lg:col-span-5 relative">
                    <div className="sticky top-24 bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 rounded-[2rem] p-6 sm:p-8">

                        {/* Title & Pricing Header */}
                        <div className="mb-8 border-b border-slate-100 pb-6">
                            <div className="flex items-center gap-1 text-yellow-400 mb-3">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                <span className="text-slate-400 text-sm font-semibold ml-2">(128 Reviews)</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{product.name}</h1>
                            <div className="flex items-end gap-3">
                                <span className="text-5xl font-black tracking-tighter text-primary-600">₹{estimatedPrice.toFixed(0)}</span>
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Inclusive of all taxes</span>
                            </div>
                            {product.pricingRules && product.pricingRules.length > 0 && (
                                <div className="mt-3 inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-green-200">
                                    Bulk Discounts Applied Automatically
                                </div>
                            )}
                        </div>

                        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold border border-red-200 text-sm">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Option Chips */}
                            <div className="space-y-6">
                                {/* Static Array Options */}
                                {product.options && Object.keys(product.options).map((optKey) => {
                                    if (optKey === 'customOptions') return null;
                                    const values = product.options[optKey];
                                    if (!values || values.length === 0) return null;

                                    const isQuantity = optKey === 'quantity';
                                    const currentValue = isQuantity ? quantity : selectedOptions[optKey];

                                    return (
                                        <div key={optKey} className="flex flex-col gap-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-black text-slate-900 uppercase tracking-wider">{optKey}</label>
                                                <span className="text-xs font-bold text-slate-400">{currentValue}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {values.map((v: any) => {
                                                    const isSelected = currentValue === v;
                                                    return (
                                                        <button
                                                            key={v} type="button"
                                                            onClick={() => handleOptionSelect(optKey, v)}
                                                            className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/20 active:scale-95 ${isSelected
                                                                ? 'border-primary-600 bg-primary-50 text-primary-800 shadow-sm'
                                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            {v} {isQuantity && product.unitType !== 'per piece' ? product.unitType.replace('per ', '') : (isQuantity ? 'pcs' : '')}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Custom Dynamic Options */}
                                {(product.options?.customOptions || []).map((custom: any) => {
                                    const currentValue = selectedOptions[custom.key];
                                    return (
                                        <div key={custom.key} className="flex flex-col gap-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-black text-slate-900 uppercase tracking-wider">{custom.key}</label>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {custom.values.map((v: any) => {
                                                    const isSelected = currentValue === v;
                                                    return (
                                                        <button
                                                            key={v} type="button"
                                                            onClick={() => handleOptionSelect(custom.key, v)}
                                                            className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/20 active:scale-95 ${isSelected
                                                                ? 'border-primary-600 bg-primary-50 text-primary-800 shadow-sm'
                                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            {v}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Artwork Toggle Cards */}
                            <div className="space-y-3 pt-6 border-t border-slate-100">
                                <label className="text-sm font-black text-slate-900 uppercase tracking-wider block mb-2">Artwork & Design</label>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Upload Card */}
                                    <div
                                        onClick={() => setNeedDesign(false)}
                                        className={`cursor-pointer rounded-2xl border-2 p-5 flex flex-col items-center justify-center text-center transition-all ${!needDesign ? 'border-primary-600 bg-primary-50 shadow-md ring-4 ring-primary-500/10' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                            }`}
                                    >
                                        <FaCloudUploadAlt className={`w-8 h-8 mb-3 ${!needDesign ? 'text-primary-600' : 'text-slate-400'}`} />
                                        <h4 className="font-bold text-sm text-slate-800">Upload Design</h4>
                                        <p className="text-xs text-slate-500 mt-1">I have a ready print file</p>
                                    </div>

                                    {/* Need Design Card */}
                                    <div
                                        onClick={() => setNeedDesign(true)}
                                        className={`cursor-pointer rounded-2xl border-2 p-5 flex flex-col items-center justify-center text-center transition-all ${needDesign ? 'border-indigo-600 bg-indigo-50 shadow-md ring-4 ring-indigo-500/10' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                            }`}
                                    >
                                        <FaPaintBrush className={`w-8 h-8 mb-3 ${needDesign ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        <h4 className="font-bold text-sm text-slate-800">Need Design</h4>
                                        <p className="text-xs text-slate-500 mt-1">Expert design (+₹500)</p>
                                    </div>
                                </div>

                                {/* Conditional File Input Zone */}
                                {!needDesign && (
                                    <div className="relative mt-4 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100 hover:border-primary-400 transition-all group overflow-hidden">
                                        {file ? (
                                            <div className="text-green-700 font-bold bg-green-100 py-2 border border-green-200 px-4 rounded-full text-sm truncate max-w-full">
                                                Selected: {file.name}
                                            </div>
                                        ) : (
                                            <>
                                                <h4 className="font-bold text-slate-600 text-sm">Click to browse your file</h4>
                                                <p className="text-xs text-slate-400 font-medium mt-1">PDF, JPG, PNG (Max 20MB)</p>
                                            </>
                                        )}
                                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,.pdf" onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
                                        }} />
                                    </div>
                                )}
                            </div>

                            {/* Compact Shipping Info */}
                            <div className="space-y-4 pt-6 border-t border-slate-100 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <label className="text-sm font-black text-slate-900 uppercase tracking-wider block mb-2 flex items-center gap-2">
                                    <FaTruck className="text-slate-400" /> Delivery Info
                                </label>

                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="text" placeholder="Full Name" className="col-span-2 sm:col-span-1 px-4 py-3 border border-slate-300 rounded-xl font-semibold text-sm focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none w-full" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
                                    <input required type="text" placeholder="Mobile Number" className="col-span-2 sm:col-span-1 px-4 py-3 border border-slate-300 rounded-xl font-semibold text-sm focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none w-full" value={customer.mobile} onChange={e => setCustomer({ ...customer, mobile: e.target.value })} />
                                    <input required type="text" placeholder="Complete Street Address" className="col-span-2 px-4 py-3 border border-slate-300 rounded-xl font-semibold text-sm focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none w-full" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
                                </div>
                            </div>

                            <Button size="lg" className="rounded-2xl px-8 py-5 font-black text-lg w-full shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1 transition-transform" disabled={submitting || (!needDesign && !file)}>
                                {submitting ? 'Processing Payment...' : `Checkout Securely • ₹${estimatedPrice.toFixed(0)}`}
                            </Button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
