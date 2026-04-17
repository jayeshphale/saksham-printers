export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { FaArrowLeft } from 'react-icons/fa';

async function getCategory(slug: string) {
    const res = await fetch(`http://localhost:5000/api/categories/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
}

async function getProductsByCategory(categoryName: string) {
    const encoded = encodeURIComponent(categoryName);
    const res = await fetch(`http://localhost:5000/api/products?category=${encoded}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<any> }) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const { slug } = resolvedParams;
    const subCategoryFilter = resolvedSearchParams?.subCategory;

    const category = await getCategory(slug);
    if (!category) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold mb-4">Category not found</h1>
                <Link href="/"><Button>Back to Home</Button></Link>
            </div>
        );
    }

    const allProducts = await getProductsByCategory(category.name);

    // Filter locally or fetch by subcategory. Local filtering is elegant.
    const products = subCategoryFilter
        ? allProducts.filter((p: any) => p.subCategory === subCategoryFilter)
        : allProducts;

    // Get unique subcategories for sidebar filters
    const subCategories = Array.from(new Set(allProducts.map((p: any) => p.subCategory))).filter(Boolean);

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            {/* Banner Header */}
            <div className="bg-slate-900 text-white relative h-72 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover opacity-[0.25]" />
                </div>
                <div className="relative z-10 text-center px-4 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-lg">{category.name}</h1>
                    <p className="text-slate-300 font-semibold text-lg drop-shadow-md">Browse our premium customisable {category.name.toLowerCase()} for all your individual and corporate needs.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex gap-10 flex-col md:flex-row">

                {/* Sidebar Filter */}
                <aside className="w-full md:w-72 shrink-0">
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sticky top-24 shadow-sm">
                        <h3 className="font-black text-xl mb-6 text-slate-900">Filter Products</h3>
                        <div className="flex flex-col gap-2">
                            <Link href={`/category/${slug}`} className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${!subCategoryFilter ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'}`}>
                                All Products
                            </Link>
                            {(subCategories as string[]).map((sub: string) => (
                                <Link key={sub} href={`/category/${slug}?subCategory=${encodeURIComponent(sub)}`} className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${subCategoryFilter === sub ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'}`}>
                                    {sub}
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="flex-1">
                    <div className="flex justify-between items-center mb-8 border-b border-slate-200/60 pb-4">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">{subCategoryFilter || 'All'} Products <span className="text-slate-400 font-medium text-lg ml-2">({products.length})</span></h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((p: any) => (
                            <div key={p.slug} className="h-full group bg-white p-4 rounded-3xl border border-slate-200/80 hover:shadow-2xl hover:-translate-y-2 hover:border-primary-300 transition-all duration-300 flex flex-col relative overflow-hidden">
                                {p.pricingRules && p.pricingRules.length > 0 && (
                                    <div className="absolute top-6 left-6 z-10 bg-black text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">Bulking Offer</div>
                                )}
                                <div className="aspect-[4/3] shrink-0 rounded-2xl overflow-hidden mb-5 bg-slate-100 relative">
                                    <img src={p.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900 mb-2 leading-tight">{p.name}</h4>
                                        <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">{p.description}</p>
                                    </div>
                                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 font-bold tracking-wide uppercase">Starts at</span>
                                            <span className="font-black text-2xl text-slate-900">₹{p.basePrice}</span>
                                        </div>
                                        <Link href={`/product/${p.slug}`}>
                                            <Button size="sm" className="rounded-xl px-5 py-2 font-bold shadow-md shadow-primary-500/20 group-hover:bg-primary-700 group-hover:-translate-y-0.5 transition-all">Details</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-300">
                            <p className="text-slate-500 font-medium text-lg">No products found in this category.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
