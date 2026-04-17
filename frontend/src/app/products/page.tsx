'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import api from '@/services/api';
import { FaSearch, FaFilter, FaArrowLeft } from 'react-icons/fa';

export default function AllProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const [prodRes, catRes] = await Promise.all([
                    api.get('/products?limit=50'),
                    api.get('/categories')
                ]);
                setProducts(prodRes.data.data || []);
                setCategories(catRes.data.data || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load products. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter((p: any) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCat = selectedCategory ? p.category === selectedCategory : true;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">

            {/* Header */}
            <div className="bg-slate-900 text-white py-16 px-4 md:px-8 shadow-inner overflow-hidden relative">
                {/* Abstract graphic */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Our Entire Collection</h1>
                    <p className="text-slate-300 font-medium max-w-2xl text-lg">
                        Explore our comprehensive catalog of commercial and personal printing solutions, engineered for breathtaking quality.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="text-slate-500 hover:text-primary-600 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50">
                        <FaArrowLeft className="inline mr-2" /> Back Home
                    </Link>
                </div>

                <div className="grid lg:grid-cols-4 gap-10">

                    {/* Left Sidebar Filters */}
                    <aside className="lg:col-span-1 space-y-6">
                        {/* Search */}
                        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
                            <h3 className="font-black text-lg mb-4 text-slate-900 flex items-center gap-2">
                                <FaSearch className="text-primary-500" /> Search
                            </h3>
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all font-semibold text-slate-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <h3 className="font-black text-lg mt-8 mb-4 text-slate-900 flex items-center gap-2">
                                <FaFilter className="text-primary-500" /> Categories
                            </h3>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedCategory === ''
                                        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                                        : 'bg-transparent text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    All Products
                                </button>
                                {categories.map((cat: any) => (
                                    <button
                                        key={cat.slug}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat.name
                                            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                                            : 'bg-transparent text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Grid */}
                    <main className="lg:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">
                                {selectedCategory || 'Displaying Everything'}
                                <span className="text-slate-400 font-medium text-base ml-2">({filteredProducts.length} Results)</span>
                            </h2>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6 text-red-800 font-semibold">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-white rounded-3xl border border-slate-200 h-80 animate-pulse p-4 flex flex-col">
                                        <div className="h-40 bg-slate-100 rounded-2xl mb-4"></div>
                                        <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-slate-100 rounded w-1/2 mb-6"></div>
                                        <div className="mt-auto h-10 bg-slate-100 rounded-xl"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {filteredProducts.length === 0 ? (
                                    <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-16 text-center shadow-sm">
                                        <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-full mx-auto mb-4">
                                            <FaSearch className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 mb-2">No matching products found.</h3>
                                        <p className="text-slate-500 font-medium">Try adjusting your filters or searching for something else.</p>
                                        <Button className="mt-6 font-bold" onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}>Clear Filters</Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                        {filteredProducts.map((p: any) => (
                                            <div key={p.slug} className="h-full group bg-white p-4 rounded-3xl border border-slate-200/80 hover:shadow-2xl hover:-translate-y-2 hover:border-primary-300 transition-all duration-300 flex flex-col relative overflow-hidden">
                                                {p.pricingRules && p.pricingRules.length > 0 && (
                                                    <div className="absolute top-6 left-6 z-10 bg-black text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">Volume Deal</div>
                                                )}
                                                <div className="aspect-[4/3] shrink-0 rounded-2xl overflow-hidden mb-5 bg-slate-100 relative">
                                                    <img src={p.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <span className="text-xs font-bold text-primary-600 mb-2 uppercase tracking-wider">{p.subCategory || p.category}</span>
                                                        <h4 className="font-bold text-lg text-slate-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">{p.name}</h4>
                                                        <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">{p.description}</p>
                                                    </div>
                                                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase">From</span>
                                                            <span className="font-black text-2xl text-slate-900">₹{p.basePrice}</span>
                                                        </div>
                                                        <Link href={`/product/${p.slug}`}>
                                                            <Button size="sm" className="rounded-xl px-6 py-2.5 font-bold shadow-md shadow-primary-500/20 group-hover:bg-primary-700 group-hover:-translate-y-0.5 transition-all">Select</Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
