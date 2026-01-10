import { useState, useEffect } from 'react';
import { parkingService } from '../services/parkingService';
import { Clock, Car, CheckCircle } from 'lucide-react';

export default function DriverHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await parkingService.getDriverHistory();
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
                <h1 className="text-2xl font-black text-gray-900">Job History</h1>
                <p className="text-sm text-gray-500 font-medium">Your completed assignments</p>
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
                        history.map(job => (
                            <div key={job.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${job.status === 'PARKED' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {job.status === 'PARKED' ? <Car size={24} /> : <CheckCircle size={24} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{job.vehicle?.make} {job.vehicle?.model}</h4>
                                        <p className="text-xs text-gray-500 font-mono">{job.vehicle?.plateNumber}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${job.status === 'PARKED' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {job.status}
                                    </span>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {new Date(job.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
