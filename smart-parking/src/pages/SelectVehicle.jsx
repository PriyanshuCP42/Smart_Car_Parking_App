import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Plus, ChevronRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';

export default function SelectVehicle() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const data = await vehicleService.getAll();
            // Map backend data to UI format if needed
            // Backend returns: { id, plateNumber, make, model, color }
            // UI expects: { id, name, plate, model, color, iconColor }
            const formattedVehicles = data.map((v, index) => ({
                id: v.id,
                name: `${v.make} ${v.model}`,
                plate: v.plateNumber,
                model: v.model,
                color: index % 2 === 0 ? 'bg-blue-600' : 'bg-gray-800',
                iconColor: 'text-white'
            }));
            setVehicles(formattedVehicles);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch vehicles:', err);
            setError('Failed to load vehicles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
            {/* Header */}
            <div className="bg-[#4F46E5] text-white p-6 pb-20 rounded-b-[40px] shadow-lg relative z-0">
                <div className="flex items-center gap-4 pt-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold">Select Vehicle</h1>
                </div>
            </div>

            <div className="px-6 -mt-12 relative z-10 space-y-4">
                {loading ? (
                    <div className="bg-white p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm min-h-[200px]">
                        <Loader2 className="w-10 h-10 text-[#4F46E5] animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Loading your garage...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white p-6 rounded-2xl flex flex-col items-center text-center shadow-sm border border-red-100">
                        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Oops!</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={fetchVehicles}
                            className="bg-[#4F46E5] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#4338ca] transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl flex flex-col items-center text-center shadow-sm">
                        <Car className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No vehicles found</p>
                    </div>
                ) : (
                    vehicles.map((v) => (
                        <div
                            key={v.id}
                            onClick={() => navigate('/confirm')}
                            className="bg-white p-5 rounded-2xl flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-md transition-all border border-gray-100"
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 ${v.color} rounded-xl flex items-center justify-center ${v.iconColor} shadow-md`}>
                                    <Car size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{v.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-gray-400 text-xs">{v.model}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-500 font-bold border border-gray-200">{v.plate}</span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-300 group-hover:text-[#4F46E5] transition-colors" size={20} />
                        </div>
                    ))
                )}

                {/* Add New */}
                <button
                    onClick={() => navigate('/register')}
                    className="w-full py-5 border-2 border-dashed border-[#4F46E5]/30 bg-[#4F46E5]/5 rounded-2xl text-[#4F46E5] font-bold flex items-center justify-center gap-2 hover:bg-[#4F46E5]/10 transition-all active:scale-[0.98]"
                >
                    <div className="p-1 bg-[#4F46E5]/20 rounded-full">
                        <Plus size={18} />
                    </div>
                    Add New Vehicle
                </button>
            </div>
        </div>
    );
}
