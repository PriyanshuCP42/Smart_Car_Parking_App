import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Car, MapPin, Smartphone, Building, CreditCard, Banknote, Loader2 } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { parkingService } from '../services/parkingService';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function ConfirmParking() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { notify } = useNotifications();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [parking, setParking] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('UPI');

    // Get vehicleId from state (passed from Scan page)
    const vehicleId = location.state?.vehicleId;

    useEffect(() => {
        if (!vehicleId) {
            navigate('/scan');
            return;
        }
        fetchVehicle();
    }, [vehicleId]);

    const fetchVehicle = async () => {
        try {
            const data = await vehicleService.getOne(vehicleId);
            setVehicle(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        setParking(true);
        try {
            await parkingService.scanQR({
                vehicleId: vehicleId,
                gate: 'Inorbit Mall - Gate 1',
                paymentMethod: selectedMethod
            });
            notify('🎟️ Ticket Generated! Your parking session has started at Inorbit Mall West.', vehicle);
            navigate('/');
        } catch (error) {
            console.error('Ticket creation error:', error);
            // If ticket already exists (400) or if we get a specific message, redirect to home
            // The backend returns { message: "Vehicle already has an active ticket", ticket: ... }
            if (
                error.response &&
                (
                    (error.response.status === 400 && error.response.data?.ticket) ||
                    error.response.data?.message?.toLowerCase().includes('active ticket')
                )
            ) {
                console.log('Ticket exists, redirecting to home');
                navigate('/');
            } else {
                const errorMessage = error.response?.data?.message || 'Failed to generate ticket. Please try again.';
                alert(errorMessage);
            }
        } finally {
            setParking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
            </div>
        );
    }

    const paymentMethods = [
        { id: 'UPI', label: 'UPI', icon: Smartphone, color: 'indigo' },
        { id: 'Netbanking', label: 'Netbanking', icon: Building, color: 'blue' },
        { id: 'Card', label: 'Card', icon: CreditCard, color: 'green' },
        { id: 'Cash', label: 'Cash', icon: Banknote, color: 'orange' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
            {/* Header */}
            <div className="bg-[#4F46E5] text-white p-6 pb-20 rounded-b-[40px] shadow-lg relative z-0">
                <div className="flex items-center gap-4 pt-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold">Confirm Parking</h1>
                </div>
            </div>

            <div className="px-6 -mt-12 relative z-10 space-y-4">

                {/* Auto-filled Banner */}
                <div className="bg-[#ECFDF5] border border-[#10B981]/30 p-3 rounded-xl flex items-center gap-3 shadow-sm">
                    <CheckCircle2 size={20} className="text-[#10B981]" />
                    <span className="text-sm font-medium text-green-800">Auto-filled from saved vehicle</span>
                </div>

                {/* Vehicle Details */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4 text-gray-500">
                        <Car size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Vehicle Details</span>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Owner</span>
                            <span className="font-bold text-gray-900">{user?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Vehicle</span>
                            <span className="font-bold text-gray-900">{vehicle?.make} {vehicle?.model}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Number Plate</span>
                            <span className="font-bold text-gray-900 font-mono uppercase">{vehicle?.plateNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Color</span>
                            <span className="font-bold text-gray-900">{vehicle?.color}</span>
                        </div>
                    </div>
                </div>

                {/* Parking Location */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3 text-gray-500">
                        <MapPin size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Parking Location</span>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900">Inorbit Mall</h3>
                        <p className="text-xs text-gray-500 mt-1">Malad West, Mumbai</p>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm">Payment Method</h3>
                    <p className="text-xs text-gray-500 mb-4">Choose how you want to pay</p>

                    <div className="grid grid-cols-2 gap-3">
                        {paymentMethods.map((method) => {
                            const isSelected = selectedMethod === method.id;
                            const Icon = method.icon;

                            // Define color classes dynamically
                            const colorClasses = {
                                indigo: { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600', iconBg: 'bg-indigo-100' },
                                blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', iconBg: 'bg-blue-100' },
                                green: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-600', iconBg: 'bg-green-100' },
                                orange: { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-600', iconBg: 'bg-orange-100' },
                            };

                            const theme = colorClasses[method.color];

                            return (
                                <div
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`relative border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-95 ${isSelected
                                        ? `border-[#4F46E5] ${theme.bg} shadow-md`
                                        : 'border-gray-50 hover:bg-gray-50 hover:border-gray-200'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isSelected ? theme.iconBg : 'bg-gray-50'
                                        } ${isSelected ? theme.text : 'text-gray-400'}`}>
                                        <Icon size={20} />
                                    </div>
                                    <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                        {method.label}
                                    </span>

                                    {isSelected && (
                                        <div className="absolute bottom-2 animate-in fade-in zoom-in duration-300">
                                            <CheckCircle2 size={14} className="text-[#4F46E5] fill-current" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Price Table */}
                <div className="bg-gray-100 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Base Rate</span>
                        <span className="font-bold text-gray-900">₹100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Service Fee</span>
                        <span className="font-bold text-gray-900">₹30</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">GST (18%)</span>
                        <span className="font-bold text-gray-900">₹20</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                        <span className="font-bold text-gray-900">Total Amount</span>
                        <span className="font-bold text-gray-900">₹150</span>
                    </div>
                </div>

                <button
                    disabled={parking}
                    onClick={handleConfirm}
                    className="w-full bg-[#4F46E5] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
                >
                    {parking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Car size={18} />}
                    {parking ? 'Creating Session...' : 'Park My Car'}
                </button>
            </div>
        </div>
    );
}
