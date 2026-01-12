import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    TrendingUp,
    DollarSign,
    MapPin,
    Car,
    CheckCircle,
    XCircle,
    Building2,
    Ticket,
    LogOut
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BASE_URL =
    import.meta.env.VITE_API_BACKEND_SERVER_URL ||
    import.meta.env.VITE_API_BACKEND_LOCAL_URL;

export default function SuperAdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [pendingDrivers, setPendingDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSite, setSelectedSite] = useState('Inorbit Mall - Malad');
    const { token, logout } = useAuth();

    const fetchDashboardData = async () => {
        try {
            const apiUrl = BASE_URL;
            const response = await axios.get(`${apiUrl}/super-admin/dashboard-summary`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { stats, pendingApprovals } = response.data;
            setStats(stats);
            setPendingDrivers(pendingApprovals);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard summary:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDashboardData();
            const interval = setInterval(fetchDashboardData, 30000);
            return () => clearInterval(interval);
        }
    }, [token, selectedSite]);

    const handleApprove = async (driverId) => {
        try {
            const apiUrl = BASE_URL;
            await axios.post(`${apiUrl}/super-admin/approve-driver/${driverId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingDrivers(prev => prev.filter(d => d.id !== driverId));
            alert('Driver Approved!');
        } catch (error) {
            console.error('Approval failed:', error);
            alert('Failed to approve driver.');
        }
    };

    const handleReject = async (driverId) => {
        if (!window.confirm('Are you sure you want to reject this driver?')) return;
        try {
            const apiUrl = BASE_URL;
            await axios.post(`${apiUrl}/super-admin/reject-driver/${driverId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingDrivers(prev => prev.filter(d => d.id !== driverId));
            alert('Driver Rejected!');
        } catch (error) {
            console.error('Rejection failed:', error);
            alert('Failed to reject driver.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-[#6D28D9] font-medium animate-pulse">Loading Super Admin Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden max-w-md mx-auto shadow-2xl font-['Outfit']">

            {/* Header */}
            <div className="w-full bg-[#7C3AED] p-6 pb-8 rounded-b-[40px] shadow-lg z-10 -mt-6 -mx-6 mb-4">
                <div className="flex items-center gap-3 mb-6 text-white pt-6">
                    <div className="flex-1">
                        <h1 className="text-xl font-semibold">Super Admin</h1>
                        <p className="text-white/70 text-xs">System overview and approvals</p>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-white/20 p-1 rounded-full backdrop-blur-sm">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'overview'
                            ? 'bg-[#7C3AED] text-white shadow-md'
                            : 'text-white hover:bg-white/10'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('approvals')}
                        className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'approvals'
                            ? 'bg-[#7C3AED] text-white shadow-md'
                            : 'text-white hover:bg-white/10'
                            }`}
                    >
                        Approvals
                        {pendingDrivers.length > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                                {pendingDrivers.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full relative overflow-y-auto no-scrollbar">
                {activeTab === 'overview' ? (
                    <div className="space-y-6 animate-fadeIn pb-6">

                        {/* Site Selector */}
                        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                            <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase tracking-wider">Select Site</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C3AED]" size={18} />
                                <select
                                    value={selectedSite}
                                    onChange={(e) => setSelectedSite(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#7C3AED]/20 appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <option>Inorbit Mall - Malad</option>
                                </select>
                            </div>
                        </div>

                        {/* Today's Performance */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Calendar size={16} className="text-[#7C3AED]" />
                                Today's Performance
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">Tickets Issued</p>
                                    <span className="text-2xl font-bold text-[#7C3AED]">{stats?.totalTickets || 0}</span>
                                </div>
                                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">Collection</p>
                                    <span className="text-2xl font-bold text-[#7C3AED]">₹{stats?.totalCollection || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Overall Statistics */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <TrendingUp size={16} className="text-[#7C3AED]" />
                                Overall Statistics
                            </h3>
                            <div className="space-y-3">
                                <StatRow icon={<Ticket size={20} />} label="Total Tickets" value={stats?.totalTickets || 0} color="text-[#7C3AED]" />
                                <StatRow icon={<DollarSign size={20} />} label="Total Collection" value={`₹${stats?.totalCollection || 0}`} color="text-[#10B981]" />
                                <StatRow icon={<Car size={20} />} label="Active Parking" value={stats?.activeParking || 0} color="text-[#3B82F6]" />
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="bg-[#7C3AED]/5 p-5 rounded-3xl mt-2 border border-[#7C3AED]/10">
                            <div className="flex items-start gap-3">
                                <Building2 className="text-[#7C3AED] mt-1" size={20} />
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm">{selectedSite}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Mumbai, Maharashtra</p>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="space-y-4 animate-fadeIn pb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-gray-800">Pending Driver Approvals</h3>
                            <span className="bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold px-2 py-1 rounded-lg">
                                {pendingDrivers.length} Pending
                            </span>
                        </div>

                        {pendingDrivers.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#7C3AED]">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-gray-900 font-semibold mb-1">All Caught Up!</h3>
                                <p className="text-gray-400 text-xs">No pending driver approvals at the moment</p>
                            </div>
                        ) : (
                            pendingDrivers.map((driver) => (
                                <div key={driver.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden">
                                                {driver.driverProfile?.photo ? (
                                                    <img src={driver.driverProfile.photo} alt={driver.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Users size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{driver.name}</h4>
                                                <p className="text-xs text-gray-500">{driver.email}</p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">{driver.driverProfile?.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleApprove(driver.id)}
                                            className="py-2.5 px-4 bg-[#7C3AED] text-white rounded-xl text-xs font-semibold hover:bg-[#6D28D9] transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={14} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(driver.id)}
                                            className="py-2.5 px-4 bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 border border-gray-200"
                                        >
                                            <XCircle size={14} />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}

function StatRow({ icon, label, value, color }) {
    return (
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${color} bg-opacity-10`}>{icon}</div>
                <span className="text-sm font-medium text-gray-600">{label}</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{value}</span>
        </div>
    );
}
