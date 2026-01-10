import { useState, useEffect } from 'react';
import { parkingService } from '../services/parkingService';
import { Clock, Car, MapPin } from 'lucide-react';

export default function UserHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await parkingService.getHistory();
            setHistory(data);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-black text-gray-900">Your Activity</h1>
                <p className="text-sm text-gray-500 font-medium">History of past parking</p>
            </header>

            {loading ? (
                <div className="flex justify-center pt-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F46E5]"></div>
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in-up">
                    {history.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <Clock size={32} />
                            </div>
                            <p className="text-gray-400 font-medium">No history yet.</p>
                        </div>
                    ) : (
                        history.map((item, i) => (
                            <div key={item.id || i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">{item.gateId?.includes('Mall') ? item.gateId : `Inorbit Mall - ${item.gateId || 'Main Gate'}`}</h4>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                            <MapPin size={12} />
                                            <span>Spot: {item.spotNumber}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-gray-900 text-lg">₹{item.amount || 150}</span>
                                        <span className="inline-block text-[10px] bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mt-1">completed</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 my-3"></div>

                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                                        <Car size={14} className="text-gray-400" />
                                        <span className="font-mono font-medium text-gray-600">{item.vehicle?.plateNumber || item.vehicleId}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-gray-400" />
                                        <span>{new Date(item.entryTime).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
