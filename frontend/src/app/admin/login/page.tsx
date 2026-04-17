'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/admin/login', { email, password });
            localStorage.setItem('token', res.data.data.token);
            router.push('/admin');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4">
            <Card className="w-full max-w-md shadow-2xl glass-panel">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-primary-100 text-primary-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                        <Lock size={28} />
                    </div>
                    <CardTitle className="text-2xl font-bold dark:text-white">Admin Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm text-center">{error}</div>}
                        <Input
                            type="email"
                            label="Email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            label="Password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button type="submit" className="w-full mt-6" isLoading={loading}>
                            Secure Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
