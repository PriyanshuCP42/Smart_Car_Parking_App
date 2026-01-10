import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, MapPin, Trophy, ChevronRight, Power, Car } from 'lucide-react';
import { parkingService } from '../services/parkingService';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Home() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { notify } = useNotifications();
    const [activeTickets, setActiveTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        let timeoutId;

        const pollData = async () => {
            if (user?.role === 'MANAGER' || user?.role === 'SUPER_ADMIN') {
                navigate('/manager', { replace: true });
                return;
            } else if (user?.role === 'DRIVER') {
                navigate('/driver', { replace: true });
                return;
            }

            try {
                const data = await parkingService.getActiveTickets();
                const tickets = Array.isArray(data) ? data : (data ? [data] : []);

                if (isMounted) {
                    setActiveTickets(tickets);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                if (isMounted) setActiveTickets([]);
            } finally {
                if (isMounted) setLoading(false);
            }

            // Schedule next poll only if component is still mounted
            if (isMounted) {
                timeoutId = setTimeout(pollData, 30000); // 30s delay to reduce DB load
            }
        };

        pollData();

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleGetCar = async (ticketId) => {
        if (confirm("Are you ready to retrieve your car? A valet will bring it to the exit.")) {
            try {
                setLoading(true);
                await parkingService.requestRetrieval(ticketId);
                // Refetch immediately to update UI
                const data = await parkingService.getActiveTickets();
                const tickets = Array.isArray(data) ? data : (data ? [data] : []);
                setActiveTickets(tickets);

                const ticket = tickets.find(t => t.id === ticketId);
                notify('🛎️ Retrieval Requested! We have notified our valets to bring your car.', ticket?.vehicle);
            } catch (error) {
                alert("Failed to request retrieval");
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading && activeTickets.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F46E5]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">

            {/* Header - Solid Blue */}
            <div className="bg-[#4F46E5] text-white p-6 pb-16 rounded-b-[40px] shadow-lg relative z-0">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <span className="text-blue-100 text-xs uppercase tracking-widest font-bold">Welcome back</span>
                        <h1 className="text-2xl font-black">{user?.name}</h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all text-red-200"
                            title="Logout"
                        >
                            <Power size={20} />
                        </button>
                    </div>
                </div>

                {/* Promo Banner */}
                <div className="mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[24px] p-5 flex items-center justify-between relative overflow-hidden shadow-xl border border-white/10">
                    <div className="relative z-10">
                        <div className="flex items-center gap-1 text-yellow-300 mb-1">
                            <Trophy size={14} fill="currentColor" />
                            <span className="text-[10px] font-bold tracking-wider">#1 IN INDIA</span>
                        </div>
                        <h2 className="font-bold text-lg text-white leading-tight">Premium Parking <br />Solution</h2>
                        <p className="text-xs text-white/70 mt-1">Trusted by 1M+ users nationwide</p>
                    </div>
                    <img src="https://cdn-icons-png.flaticon.com/512/3085/3085330.png" className="w-24 h-24 object-contain drop-shadow-2xl transform rotate-[-10deg] translate-x-4 translate-y-2" alt="car" />
                </div>
            </div>

            <div className="px-6 -mt-12 relative z-10 space-y-6 pb-8">
                {/* Scan to Park Card - Cream/Yellow */}
                {/* Only show scan if NO active tickets? Or always? Let's leave it always accessible for multiple cars */}
                <div onClick={() => navigate('/scan')} className="bg-[#FFFBEB] p-5 rounded-[24px] shadow-lg border border-orange-100 flex items-center justify-between cursor-pointer active:scale-98 transition-transform">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#F59E0B] rounded-2xl flex items-center justify-center text-white shadow-orange-200 shadow-lg">
                            <Scan size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Scan to Park</h3>
                            <p className="text-gray-500 text-xs mt-1">Scan QR code at parking <br />entrance</p>
                        </div>
                    </div>
                    <div className="text-gray-400">
                        <ChevronRight />
                    </div>
                </div>

                {/* Active Tickets List */}
                <div>
                    <h3 className="font-bold text-gray-800 mb-4 ml-1 flex items-center gap-2">
                        My Vehicles
                        {activeTickets.length > 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{activeTickets.length} Active</span>}
                    </h3>

                    {activeTickets.length === 0 ? (
                        <div className="bg-white p-8 rounded-[24px] border border-dashed border-gray-200 text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                                <MapPin size={24} />
                            </div>
                            <p className="text-gray-500 font-medium">No active parking sessions</p>
                            <p className="text-xs text-gray-400 mt-1">Scan a QR code to park your vehicle</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeTickets.map(ticket => (
                                <div key={ticket.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden">
                                    {/* Status Badge */}
                                    <div className="absolute top-0 right-0">
                                        <div className={`text-[10px] font-bold px-3 py-1 rounded-bl-xl ${['ACTIVE', 'RETRIEVAL_REQUESTED'].includes(ticket.status) ? 'bg-orange-100 text-orange-600' :
                                            ticket.status === 'PARKED' ? 'bg-green-100 text-green-600' :
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                            {ticket.status.replace(/_/g, ' ')}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start mb-4 mt-2">
                                        <div className="flex gap-3 items-center">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${ticket.status === 'PARKED' ? 'bg-green-500 shadow-green-200' : 'bg-blue-600 shadow-blue-200'
                                                }`}>
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{ticket.vehicle?.make} {ticket.vehicle?.model}</h4>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="font-mono text-xs font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                                        {ticket.vehicle?.plateNumber}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center text-sm mb-4">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Location</p>
                                            <p className="font-bold text-gray-800">{ticket.gateId || 'Main Gate'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Spot</p>
                                            <p className="font-bold text-gray-800 text-lg text-[#4F46E5]">{ticket.spotNumber || 'Allocating...'}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons based on Status */}
                                    {ticket.status === 'PARKED' && (
                                        <button
                                            onClick={() => handleGetCar(ticket.id)}
                                            className="w-full bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-gray-200"
                                        >
                                            <Car size={18} /> Get My Car
                                        </button>
                                    )}

                                    {(ticket.status === 'RETRIEVAL_REQUESTED' || ticket.status === 'VALET_ASSIGNED_FOR_RETRIEVAL' || ticket.status === 'RETRIEVING') && (
                                        <div className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 animate-pulse">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                            Car Arriving Soon...
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
