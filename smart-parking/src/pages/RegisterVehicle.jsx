import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Hash, Car, Smartphone, Palette, Loader2 } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';

export default function RegisterVehicle() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        plateNumber: '',
        make: '',
        model: '',
        color: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'plateNumber' ? value.toUpperCase() : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting registration form:', formData);
        setError('');
        setLoading(true);

        // Basic client-side validation
        if (!formData.plateNumber || !formData.make || !formData.model || !formData.color) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        try {
            const result = await vehicleService.add(formData);
            console.log('Vehicle registered successfully:', result);
            alert('Vehicle Registered Successfully! Redirecting to scan...');
            navigate('/scan');
        } catch (err) {
            console.error('Registration failed:', err);
            const msg = err.response?.data?.message || 'Failed to register vehicle. Please try again.';
            setError(msg);
            alert(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
            {/* Header */}
            <div className="bg-[#4F46E5] text-white p-6 pb-24 rounded-b-[40px] shadow-lg relative z-0">
                <div className="flex items-center gap-4 pt-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold">Register Vehicle</h1>
                </div>
                <p className="text-white/70 text-sm mt-4 ml-2">Add your vehicle details for quick parking</p>
            </div>

            {/* Form Card */}
            <div className="px-6 -mt-16 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl p-6 space-y-5">

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Vehicle Info */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1.5 block ml-1">Car Number Plate</label>
                            <div className="relative">
                                <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="plateNumber"
                                    value={formData.plateNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="MH 12 AB 1234"
                                    className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all placeholder:text-gray-300 font-mono uppercase"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1.5 block ml-1">Make (Brand)</label>
                                <div className="relative">
                                    <Car size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="make"
                                        value={formData.make}
                                        onChange={handleChange}
                                        placeholder="Toyota, Honda, etc."
                                        className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1.5 block ml-1">Model</label>
                                <div className="relative">
                                    <Car size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        placeholder="Camry, Civic, etc."
                                        className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1.5 block ml-1">Color</label>
                            <div className="relative">
                                <Palette size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    placeholder="Red, Black, White"
                                    className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Auto-fill Banner */}
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3 items-start">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                                <Car size={16} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Auto-fill next time</h4>
                                <p className="text-xs text-indigo-800/70 mt-0.5 leading-relaxed">Your vehicle will be automatically detected when you scan a QR code</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4F46E5] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 mt-4 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Saving...' : 'Save Vehicle'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
