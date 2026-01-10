import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Building, Loader2, CheckCircle2 } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await register(email, password, name, role);
        setLoading(false);
        if (result.success) {
            if (role === 'MANAGER') {
                navigate('/manager');
            } else {
                navigate('/');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden max-w-md mx-auto shadow-2xl">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[35vh] bg-[#4F46E5] rounded-b-[50px] shadow-2xl z-0"></div>

            {/* Brand & Logo */}
            <div className="relative z-10 flex flex-col items-center mb-6 text-white text-center">
                <h1 className="text-3xl font-black tracking-tight">Create Account</h1>
                <p className="text-blue-100 mt-1 text-sm font-medium">Join our smart parking community</p>
            </div>

            {/* Signup Card */}
            <div className="relative z-10 bg-white w-full max-w-sm rounded-[30px] shadow-2xl p-8 border border-gray-100">

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-xs font-bold text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-[10px] font-black mb-3 uppercase tracking-widest text-center">I am a...</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole('USER')}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all relative ${role === 'USER'
                                    ? 'border-[#4F46E5] bg-indigo-50/50'
                                    : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                {role === 'USER' && <CheckCircle2 className="absolute top-2 right-2 text-[#4F46E5]" size={14} />}
                                <User size={24} className={role === 'USER' ? 'text-[#4F46E5]' : 'text-gray-400'} />
                                <span className={`text-[10px] font-bold mt-2 ${role === 'USER' ? 'text-[#4F46E5]' : 'text-gray-500'}`}>User</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('MANAGER')}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all relative ${role === 'MANAGER'
                                    ? 'border-[#4F46E5] bg-indigo-50/50'
                                    : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                {role === 'MANAGER' && <CheckCircle2 className="absolute top-2 right-2 text-[#4F46E5]" size={14} />}
                                <Building size={24} className={role === 'MANAGER' ? 'text-[#4F46E5]' : 'text-gray-400'} />
                                <span className={`text-[10px] font-bold mt-2 ${role === 'MANAGER' ? 'text-[#4F46E5]' : 'text-gray-500'}`}>Manager</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-[10px] font-black mb-2 uppercase tracking-widest">Full Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#4F46E5]">
                                <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 text-sm font-medium"
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-[10px] font-black mb-2 uppercase tracking-widest">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#4F46E5]">
                                <Mail className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 text-sm font-medium"
                                placeholder="name@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-[10px] font-black mb-2 uppercase tracking-widest">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#4F46E5]">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300 text-sm font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#4F46E5] hover:bg-[#4338ca] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Signup <UserPlus size={20} /></>}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-500 text-sm font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#4F46E5] font-black hover:text-[#4338ca] transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
