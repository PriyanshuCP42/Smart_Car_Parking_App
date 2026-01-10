import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Plus,
    Car,
    Clock,
    IndianRupee,
    Phone,
    MapPin,
    User,
    ChevronLeft,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ManagerDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        activeCars: 0,
        retrieving: 0,
        totalToday: 0,
        revenue: 0
    });
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    // Assign Valet Modal State
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 15000); // Poll every 15 seconds to save resources
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
            const response = await axios.get(`${apiUrl}/manager/dashboard-summary`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { stats, operations, drivers } = response.data;
            setStats(stats);
            setOperations(operations);
            setDrivers(drivers);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignValet = async () => {
        if (!selectedDriver || !selectedTicket) return;

        setAssigning(true);
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
            await axios.post(`${apiUrl}/manager/assign-valet`, {
                ticketId: selectedTicket.id,
                valetId: selectedDriver
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh data
            await fetchDashboardData();
            setShowAssignModal(false);
            setSelectedTicket(null);
            setSelectedDriver('');
        } catch (error) {
            console.error('Assign error:', error);
            alert('Failed to assign valet');
        } finally {
            setAssigning(false);
        }
    };

    const openAssignModal = (ticket) => {
        setSelectedTicket(ticket);
        setSelectedDriver(ticket.valet?.id || '');
        setShowAssignModal(true);
    };

    const filteredOps = operations.filter(op => {
        const matchesSearch =
            op.vehicle.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
            op.user.name.toLowerCase().includes(search.toLowerCase()) ||
            (op.valet?.name || '').toLowerCase().includes(search.toLowerCase());

        if (activeTab === 'All') return matchesSearch;
        const mappedStatus = activeTab === 'Returned' ? 'COMPLETED' : activeTab.toUpperCase();
        return matchesSearch && op.status === mappedStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Header */}
            <div className="bg-[#1e293b] text-white px-6 pt-6 pb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/')} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-xl font-semibold">Manager Dashboard</h1>
                    </div>
                    <button
                        onClick={() => navigate('/add-driver')}
                        className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all"
                    >
                        <Plus size={16} />
                        Add Driver
                    </button>
                </div>
                <p className="text-gray-400 text-sm">Manage valet assignments and parking operations</p>
            </div>

            <div className="px-6 py-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Active Cars" value={stats.activeCars} />
                    <StatCard label="Retrieving" value={stats.retrieving} />
                    <StatCard label="Total Today" value={stats.totalToday} />
                    <StatCard label="Revenue" value={`₹${stats.revenue}`} />
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by plate, customer or valet..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-50 border-0 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['All', 'Parked', 'Retrieving', 'Returned'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab
                                ? 'bg-[#1e293b] text-white'
                                : 'bg-white text-gray-600 border border-gray-200'
                                }`}
                        >
                            {tab} {tab === 'All' ? `(${operations.length})` : ''}
                        </button>
                    ))}
                </div>

                {/* Operations List */}
                <div className="space-y-4">
                    {filteredOps.map((op) => (
                        <div key={op.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            {/* Vehicle Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                                        <Car size={24} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{op.vehicle.make} {op.vehicle.model}</h3>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mt-0.5">{op.vehicle.plateNumber}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${op.status === 'PARKED' ? 'bg-teal-50 text-teal-700' :
                                    op.status === 'RETRIEVING' ? 'bg-orange-50 text-orange-700' :
                                        'bg-blue-50 text-blue-700'
                                    }`}>
                                    {op.status}
                                </span>
                            </div>

                            {/* Customer & Valet Info */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-start gap-2">
                                    <User size={16} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Customer</p>
                                        <p className="text-sm font-medium text-gray-900">{op.user?.name || 'Unknown'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 size={16} className={`${op.valet ? 'text-teal-500' : 'text-gray-300'} mt-0.5`} />
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Valet Assigned</p>
                                        <p className="text-sm font-medium text-gray-900">{op.valet?.name || 'Unassigned'}</p>
                                        {op.valet && <p className="text-xs text-gray-400">ID: V{op.valet.id.substring(0, 4)}</p>}
                                    </div>
                                </div>
                                {op.valet && (
                                    <button className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white hover:bg-teal-600 transition-colors">
                                        <Phone size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Reassign Button */}
                            <button
                                onClick={() => openAssignModal(op)}
                                className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium mb-4 hover:bg-gray-100 transition-colors"
                            >
                                {op.valet ? 'Reassign Valet' : 'Assign Valet'}
                            </button>

                            {/* Location & Time Details */}
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Location</p>
                                        <p className="text-sm font-medium text-gray-900">Inorbit Mall</p>
                                        <p className="text-xs text-gray-500">Malad West, Mumbai</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock size={16} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Entry Time</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(op.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, {new Date(op.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </p>
                                        <p className="text-xs text-gray-500">Duration: 2h 0m</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                                <div className="flex items-center gap-1.5">
                                    <IndianRupee size={16} className="text-gray-600" />
                                    <span className="text-lg font-semibold text-gray-900">₹{op.amount || 150}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-teal-50 px-3 py-1.5 rounded-lg">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                    <span className="text-xs font-medium text-teal-700">Paid</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredOps.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            No operations found.
                        </div>
                    )}
                </div>
            </div>
            {/* Assign Valet Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-6 animate-in slide-in-from-bottom duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Assign Valet</h2>
                            <button onClick={() => setShowAssignModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-2 block">Select Valet</label>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {drivers.map(driver => (
                                        <button
                                            key={driver.id}
                                            onClick={() => setSelectedDriver(driver.id)}
                                            disabled={driver.driverProfile?.status !== 'ACTIVE'}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedDriver === driver.id
                                                ? 'border-[#0f172a] bg-gray-50'
                                                : 'border-gray-100 hover:border-gray-200'
                                                } ${driver.driverProfile?.status !== 'ACTIVE' ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                                <img
                                                    src={driver.driverProfile?.photo || `https://ui-avatars.com/api/?name=${driver.name}&background=random`}
                                                    alt={driver.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="text-left flex-1">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold text-sm">{driver.name}</p>
                                                    {driver.driverProfile?.status === 'PENDING' && (
                                                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">Pending</span>
                                                    )}
                                                    {driver.driverProfile?.status === 'REJECTED' && (
                                                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">Rejected</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500">ID: V{driver.id.substring(0, 4)}</p>
                                            </div>
                                            {selectedDriver === driver.id && <CheckCircle2 size={18} className="text-[#0f172a]" />}
                                        </button>
                                    ))}
                                    {drivers.length === 0 && (
                                        <p className="text-center text-sm text-gray-500 py-4">No drivers available. Add one first.</p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleAssignValet}
                                disabled={!selectedDriver || assigning}
                                className="w-full bg-[#0f172a] text-white py-4 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {assigning ? 'Assigning...' : 'Confirm Assignment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-2">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}
