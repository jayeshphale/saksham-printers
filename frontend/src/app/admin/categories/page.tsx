'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Loader } from '@/components/Loader';
<<<<<<< HEAD
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
=======
import { FaEdit, FaTrash, FaPlus, FaUpload } from 'react-icons/fa';
    slug: string;
    image: string;
    isActive: boolean;
}

interface FormData {
    name: string;
    image: string;
}

const initialFormData: FormData = {
    name: '',
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

export default function CategoriesManagement() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const [uploading, setUploading] = useState(false);
<<<<<<< HEAD
=======
    const fileInputRef = useRef<HTMLInputElement | null>(null);
>>>>>>> c6d820f (Initial commit)

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories', {
                headers: { 'Cache-Control': 'no-cache' },
                params: { _t: Date.now() } // Add timestamp to prevent caching
            });
            setCategories(res.data.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [refreshTrigger]);

    const handleOpenForm = (category?: Category) => {
        if (category) {
            setFormData({
                name: category.name,
                image: category.image
            });
            setEditingId(category._id);
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
                await api.put(`/categories/${editingId}`, formData);
                alert('Category updated successfully!');
            } else {
                await api.post('/categories', formData);
                alert('Category created successfully!');
            }
            await fetchCategories();
            setRefreshTrigger(prev => prev + 1); // Force immediate refresh
            handleCloseForm();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await api.delete(`/categories/${id}`);
            alert('Category deleted successfully!');
            await fetchCategories();
            setRefreshTrigger(prev => prev + 1); // Force immediate refresh
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to delete category');
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

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Categories Management</h1>
                    <p className="text-slate-600 mt-1">Organize your product categories</p>
                </div>
                <Button onClick={() => handleOpenForm()} className="bg-blue-600 hover:bg-blue-700">
                    <FaPlus className="mr-2" /> Add Category
                </Button>
            </div>

            {/* Search */}
            <Card>
                <Input
                    type="text"
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Card>

            {/* Categories Grid */}
            <div>
                {loading ? (
                    <Loader />
                ) : filteredCategories.length === 0 ? (
                    <Card className="text-center py-8 text-slate-600">
                        No categories found
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCategories.map((category) => (
                            <Card key={category._id} className="flex flex-col">
                                {/* Image */}
                                <div className="w-full h-40 bg-slate-100 rounded-lg overflow-hidden mb-4">
                                    <img
                                        src={category.image.startsWith('http') ? category.image : process.env.NEXT_PUBLIC_API_URL + category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{category.name}</h3>
                                    <p className="text-sm text-slate-600 mb-4">/{category.slug}</p>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            category.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenForm(category)}
                                            className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {editingId ? 'Edit Category' : 'Add New Category'}
                            </h2>
                            <button
                                onClick={handleCloseForm}
                                className="text-xl text-slate-500 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Marketing Materials"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Image</label>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
<<<<<<< HEAD
=======
                                            ref={fileInputRef}
>>>>>>> c6d820f (Initial commit)
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
<<<<<<< HEAD
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                                        />
                                        {uploading && <span className="px-3 py-2 text-sm text-blue-600">Uploading...</span>}
                                    </div>
                                    <div className="text-xs text-slate-500">or paste image URL:</div>
                                    <Input
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="Enter image URL"
=======
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
>>>>>>> c6d820f (Initial commit)
                                    />
                                </div>
                                {formData.image && (
                                    <div className="mt-2 w-full h-32 bg-slate-100 rounded-lg overflow-hidden">
                                        <img
                                            src={formData.image.startsWith('http') ? formData.image : process.env.NEXT_PUBLIC_API_URL + formData.image}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
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
                                    {submitting ? 'Saving...' : 'Save Category'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
