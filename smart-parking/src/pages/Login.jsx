import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Car, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            const role = result.user?.role;
            if (from === '/' || from === '/login') {
                if (role === 'SUPER_ADMIN') {
                    navigate('/super-admin', { replace: true });
                } else if (role === 'MANAGER') {
                    navigate('/manager', { replace: true });
                } else if (role === 'DRIVER') {
                    navigate('/driver', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            } else {
                navigate(from, { replace: true });
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden max-w-md mx-auto shadow-2xl">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[40vh] bg-[#4F46E5] rounded-b-[50px] shadow-2xl z-0"></div>

            {/* Brand & Logo */}
            <div className="relative z-10 flex flex-col items-center mb-8 text-white">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl mb-4">
                    <Car size={40} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Smart Parking</h1>
                <p className="text-blue-100 mt-1 font-medium">Park smarter, faster, better.</p>
            </div>

            {/* Login Card */}
            <div className="relative z-10 bg-white w-full max-w-sm rounded-[30px] shadow-2xl p-8 border border-gray-100">
                <div className="mb-6 text-center">
                    <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-500 text-sm mt-1">Please sign in to continue</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-xs font-bold text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wider">Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#4F46E5]">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 font-medium"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wider">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#4F46E5]">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <a href="#" className="text-xs font-bold text-[#4F46E5] hover:text-[#4338ca]">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#4F46E5] hover:bg-[#4338ca] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <LogIn size={20} /></>}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-500 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-[#4F46E5] font-bold hover:text-[#4338ca] transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>

            <p className="mt-8 text-gray-400 text-xs font-medium relative z-10">
                &copy; 2026 Smart Parking Inc.
            </p>
        </div>
    );
};

export default Login;
