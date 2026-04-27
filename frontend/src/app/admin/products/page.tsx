'use client';
import { useEffect, useRef, useState } from 'react';
import api from '@/services/api';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Loader } from '@/components/Loader';
import { FaEdit, FaTrash, FaPlus, FaUpload } from 'react-icons/fa';

interface Product {
    _id: string;
    name: string;
    category: string;
    basePrice: number;
    image: string;
    isActive: boolean;
}

interface FormData {
    name: string;
    category: string;
    basePrice: string;
    description: string;
    image: string;
}

const initialFormData: FormData = {
    name: '',
    category: '',
    basePrice: '',
    description: '',
    image: ''
};

// Cloudinary upload helper
const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await api.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data.imageUrl;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
};

const DEFAULT_CATEGORIES = [
    'Business Essentials',
    'Marketing Materials',
    'Banners & Large Format',
    'Stickers & Labels',
    'Packaging',
    'Office & Corporate Printing',
    'Signage & Boards'
];

export default function ProductsManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products/admin', {
                params: { limit: 200, _t: Date.now() },
                headers: { 'Cache-Control': 'no-cache' }
            });
            setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories', {
                headers: { 'Cache-Control': 'no-cache' },
                params: { _t: Date.now() } // Add timestamp to prevent caching
            });
            const categoryNames = Array.isArray(res.data.data)
                ? res.data.data.map((cat: any) => cat.name).filter(Boolean)
                : [];
            setCategories(categoryNames);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setCategories(DEFAULT_CATEGORIES);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [refreshTrigger]);

    const handleOpenForm = async (product?: Product) => {
        await fetchCategories();

        if (product) {
            setFormData({
                name: product.name,
                category: product.category,
                basePrice: product.basePrice.toString(),
                description: '',
                image: product.image
            });
            setEditingId(product._id);
        } else {
            setFormData(initialFormData);
            setEditingId(null);
        }
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setFormData(initialFormData);
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingId) {
                const response = await api.put(`/products/${editingId}`, formData);
                setProducts((prev) => prev.map((product) => product._id === editingId ? response.data.data : product));
                alert('Product updated successfully!');
            } else {
                await api.post('/products', formData);
                alert('Product created successfully!');
            }
            fetchProducts();
            handleCloseForm();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.delete(`/products/${id}`);
            alert('Product deleted successfully!');
            fetchProducts();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to delete product');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const imageUrl = await uploadImageToCloudinary(file);
            setFormData({ ...formData, image: imageUrl });
            alert('Image uploaded successfully!');
        } catch (error: any) {
            alert('Failed to upload image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const filteredProducts = (products || []).filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && p.isActive) ||
            (statusFilter === 'inactive' && !p.isActive);

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Products Management</h1>
                    <p className="text-slate-600 mt-2 text-sm">Manage your product catalog</p>
                    <p className="text-xs text-slate-500 mt-2">
                        Showing {filteredProducts.length} of {products.length} products
                    </p>
                </div>
                <Button onClick={() => handleOpenForm()} className="bg-blue-600 hover:bg-blue-700">
                    <FaPlus className="mr-2" /> Add Product
                </Button>
            </div>

            {/* Search */}
            <Card>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <Input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-700">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Products Table */}
            <Card>
                {loading ? (
                    <Loader />
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-slate-600">
                        No products found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="text-left py-4 px-4 font-semibold text-slate-900 text-sm">Name</th>
                                    <th className="text-left py-4 px-4 font-semibold text-slate-900 text-sm">Category</th>
                                    <th className="text-left py-4 px-4 font-semibold text-slate-900 text-sm">Price</th>
                                    <th className="text-left py-4 px-4 font-semibold text-slate-900 text-sm">Status</th>
                                    <th className="text-center py-4 px-4 font-semibold text-slate-900 text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.image?.startsWith('http') ? product.image : product.image || '/images/placeholder.png'}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <p className="font-medium text-slate-900">{product.name}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-slate-700 text-sm">{product.category}</td>
                                        <td className="py-4 px-4 font-medium text-slate-900">₹{product.basePrice}</td>
                                        <td className="py-4 px-4">
                                            <span
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                                                    product.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenForm(product)}
                                                    className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-2xl max-h-96 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {editingId ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button
                                onClick={handleCloseForm}
                                className="text-xl text-slate-500 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Category</option>
                                        {Array.from(new Set([...(categories.length ? categories : DEFAULT_CATEGORIES), formData.category].filter(Boolean))).map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Base Price (₹)</label>
                                    <Input
                                        type="number"
                                        required
                                        value={formData.basePrice}
                                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Image</label>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
                                        >
                                            <FaUpload /> Upload Image
                                        </Button>
                                        {uploading && <span className="px-3 py-2 text-sm text-blue-600">Uploading...</span>}
                                    </div>
                                    <div className="text-xs text-slate-500">Or paste image URL if you already have one</div>
                                    <Input
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="Enter image URL (optional)"
                                    />
                                </div>
                                {formData.image && (
                                    <div className="mt-2 w-full h-32 bg-slate-100 rounded-lg overflow-hidden">
                                        <img
                                            src={formData.image?.startsWith('http') ? formData.image : formData.image || '/images/placeholder.png'}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24 resize-none"
                                />
                            </div>

                            <div className="flex gap-3 justify-end">
                                <Button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="bg-slate-300 hover:bg-slate-400"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300"
                                >
                                    {submitting ? 'Saving...' : 'Save Product'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
