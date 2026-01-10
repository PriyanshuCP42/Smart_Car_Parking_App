import { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import { X, Car, ChevronRight, Loader2 } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { parkingService } from '../services/parkingService';

export default function Scan() {
    const [data, setData] = useState('No result');
    const [vehicles, setVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(true);
    const [scanning, setScanning] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const data = await vehicleService.getAll();
            setVehicles(data);
        } catch (error) {
            console.error('Failed to load vehicles', error);
        } finally {
            setLoadingVehicles(false);
        }
    };

    const handleScan = async (result, error) => {
        if (!!result && !scanning) {
            setScanning(true);
            setData(result?.text);
            if (navigator.vibrate) navigator.vibrate(200);

            try {
                // Assume the QR code contains the Gate ID. 
                // We'll use the first vehicle as default if none selected locally (simplified flow)
                // In a real app, we might ask to select vehicle FIRST.
                const vehicleId = vehicles.length > 0 ? vehicles[0].id : 1;

                await parkingService.scanQR({
                    vehicleId: vehicleId,
                    gate: result?.text || 'Gate 1'
                });

                // On success, go to ticket
                navigate('/ticket');
            } catch (err) {
                console.error('Scan failed:', err);
                alert('Failed to process scan. Please try again.');
                setScanning(false);
            }
        }
    };

    return (
        <div className="h-screen bg-gray-900 relative flex flex-col font-sans">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 pt-12 z-30 flex items-center justify-between">
                <h1 className="text-white/90 text-lg font-medium">Scan QR Code</h1>
                <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Scanner Area */}
            <div className="flex-1 relative bg-black">
                <div className="w-full h-full absolute inset-0 opacity-60">
                    <QrReader
                        onResult={handleScan}
                        constraints={{ facingMode: 'environment' }}
                        containerStyle={{ width: '100%', height: '100%' }}
                        videoStyle={{ objectFit: 'cover' }}
                        ViewFinder={() => null}
                    />
                </div>

                {/* Dark Overlay Frame */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-12">
                    <div className="w-64 h-64 relative">
                        {/* Blue Corners */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-[#4F46E5] rounded-tl-xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-[#4F46E5] rounded-tr-xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-[#4F46E5] rounded-bl-xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-[#4F46E5] rounded-br-xl"></div>

                        {/* Center Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            {scanning ? (
                                <Loader2 className="w-12 h-12 text-white animate-spin" />
                            ) : (
                                <div className="grid grid-cols-2 gap-1">
                                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                                    <div className="w-3 h-3 border-2 border-white rounded-sm"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sheet - Select Vehicle */}
            <div className="bg-white rounded-t-[30px] p-6 pb-20 relative z-40 animate-slide-up">
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>

                <h2 className="text-lg font-medium text-gray-900 mb-1">Select Your Vehicle</h2>
                <p className="text-xs text-gray-500 mb-4">Choose which vehicle you're parking at Inorbit Mall</p>

                <div className="space-y-3">
                    {loadingVehicles ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="w-6 h-6 text-[#4F46E5] animate-spin" />
                        </div>
                    ) : vehicles.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">No vehicles found. Register one!</p>
                    ) : (
                        vehicles.map((v, i) => (
                            <div
                                key={v.id || i}
                                onClick={() => navigate('/confirm', { state: { vehicleId: v.id } })}
                                className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:border-[#4F46E5] transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-[#4F46E5] group-hover:bg-indigo-50 transition-colors">
                                        <Car size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{v.make} {v.model}</h3>
                                        <p className="text-xs text-gray-400 font-mono mt-0.5">{v.plateNumber}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-300" />
                            </div>
                        ))
                    )}
                </div>

                <button onClick={() => navigate('/register')} className="w-full bg-[#4F46E5] text-white font-bold py-4 rounded-xl mt-6 active:scale-[0.98] transition-transform shadow-lg shadow-indigo-200">
                    Register New Vehicle
                </button>
            </div>
        </div>
    );
}
