import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Camera,
    Upload,
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    FileText,
    CheckCircle2,
    Lock
} from 'lucide-react';
import axios from 'axios';

export default function AddDriver() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        dob: '',
        licenseNumber: '',
        licenseExpiry: '',
        photo: null,
        licensePhoto: null,
        password: '' // Default empty
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, [fieldName]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const apiUrl =
                import.meta.env.VITE_API_BACKEND_SERVER_URL ||
                import.meta.env.VITE_API_BACKEND_LOCAL_URL;

            await axios.post(`${apiUrl}/manager/add-driver`, {
                ...formData,
                password: formData.password || 'valetUser123!'
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            navigate('/manager');
        } catch (error) {
            console.error('Error adding driver:', error);
            const errorData = error.response?.data;
            const detail = errorData?.error || error.message;
            const code = errorData?.code ? ` (${errorData.code})` : '';
            alert(`Failed to add driver: ${errorData?.message || 'Unknown error'} \n\nDetails: ${detail}${code}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden min-h-[800px] flex flex-col relative">

                {/* Header */}
                <div className="bg-[#0f172a] text-white p-6 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-lg font-medium">Add Driver/Valet</h1>
                    </div>
                    <p className="text-gray-400 text-xs">Fill in the details to add a new driver</p>
                </div>

                <div className="flex-1 p-6 relative">
                    <div className="absolute top-0 left-0 right-0 -mt-6 bg-white rounded-t-3xl h-6"></div>

                    {step === 1 ? (
                        <div className="space-y-5">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center mb-6">
                                <label className="text-xs font-medium text-gray-700 mb-3 w-full">Driver Photo *</label>
                                <label className="w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors overflow-hidden">
                                    {formData.photo ? (
                                        <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Camera size={24} className="mb-1" />
                                            <span className="text-[10px]">Take Photo</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'photo')} />
                                </label>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-900 block mb-1.5">Personal Details</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name *"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number *"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                                    />
                                </div>

                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email *"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                                    />
                                </div>

                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password *"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                                    />
                                </div>

                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 block mb-1.5 ml-1">Date of Birth</label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-900 transition-colors text-gray-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (!formData.name || !formData.phone || !formData.email || !formData.password) {
                                        alert('Please fill in all required fields');
                                        return;
                                    }
                                    setStep(2);
                                }}
                                className="w-full bg-[#0f172a] text-white rounded-xl py-4 font-medium mt-8 hover:bg-black transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5 h-full flex flex-col">
                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="text-xs font-semibold text-gray-900 block mb-1.5">License Details</label>
                                    <div className="relative">
                                        <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="licenseNumber"
                                            placeholder="Driving License Number *"
                                            value={formData.licenseNumber}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 block mb-1.5 ml-1">License Expiry Date</label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            name="licenseExpiry"
                                            value={formData.licenseExpiry}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-900 transition-colors text-gray-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-3">License Photo *</label>
                                    <label className="w-full h-40 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors overflow-hidden">
                                        {formData.licensePhoto ? (
                                            <img src={formData.licensePhoto} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Upload size={24} className="mb-2" />
                                                <span className="text-xs">Upload License Photo</span>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'licensePhoto')} />
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-[#0f172a] text-white rounded-xl py-4 font-medium mt-auto hover:bg-black transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? 'Submitting...' : 'Submit for Approval'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
