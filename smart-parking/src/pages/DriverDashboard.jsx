import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { parkingService } from '../services/parkingService';
import { Bell, MapPin, User, Clock, ArrowRight, CheckCircle, Car, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SuccessOverlay from '../components/SuccessOverlay';

export default function DriverDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeJob, setActiveJob] = useState(null);
    const [availableJobs, setAvailableJobs] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Initial load and polling
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 25000); // Poll every 25 seconds
        return () => clearInterval(interval);
    }, [refreshTrigger]);

    const fetchData = async () => {
        try {
            // First check for active job
            const current = await parkingService.getCurrentJob();
            setActiveJob(current);

            // If no active job, get available ones
            if (!current) {
                const jobs = await parkingService.getAvailableJobs();
                setAvailableJobs(jobs);
            } else {
                setAvailableJobs([]); // Don't show available jobs if busy
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        }
    };

    const handleAccept = async (ticketId) => {
        try {
            await parkingService.acceptJob(ticketId);
            setRefreshTrigger(prev => prev + 1); // Force refresh
        } catch (error) {
            alert('Failed to accept job. It might have been taken.');
            setRefreshTrigger(prev => prev + 1);
        }
    };

    const handleUpdateStatus = async (status) => {
        if (!activeJob) return;
        try {
            await parkingService.updateJobStatus(activeJob.id, status);

            if (status === 'PARKED' || status === 'COMPLETED') {
                setSuccessMessage(status === 'PARKED' ? 'Vehicle parked successfully' : 'Vehicle retrieved successfully');
                setShowSuccess(true);
            } else {
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            console.error('Update status error:', error);
            alert('Failed to update status.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (user?.driverProfile?.status === 'PENDING') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white max-w-sm w-full rounded-[40px] p-8 shadow-xl text-center border border-gray-100">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 animate-pulse">
                        <Clock size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Pending</h1>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Your account is currently under review. You will be notified once a Super Admin approves your registration.
                    </p>
                    <div className="bg-yellow-50 rounded-2xl p-4 mb-6 text-left flex items-start gap-3">
                        <div className="mt-1 min-w-[20px]">
                            <span className="flex h-5 w-5 rounded-full bg-yellow-200 items-center justify-center text-[10px] font-bold text-yellow-700">i</span>
                        </div>
                        <p className="text-xs text-yellow-800 font-medium">
                            You cannot accept tasks or be assigned vehicles until your account is active.
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors"
                    >
                        Sign Out
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 text-sm text-blue-600 font-medium hover:underline"
                    >
                        Check Status Again
                    </button>
                </div>
            </div>
        );
    }

    if (user?.driverProfile?.status === 'REJECTED') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white max-w-sm w-full rounded-[40px] p-8 shadow-xl text-center border border-gray-100">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                        <User size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Rejected</h1>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Your application has been rejected by the administrator. Please contact support for more details.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {showSuccess && (
                <SuccessOverlay
                    message={successMessage}
                    onComplete={() => {
                        setShowSuccess(false);
                        setRefreshTrigger(prev => prev + 1);
                    }}
                />
            )}
            {/* Header */}
            <div className="bg-[#4F46E5] text-white p-6 pt-12 rounded-b-[40px] shadow-lg mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-blue-200 text-sm font-medium mb-1">Driver Console</p>
                        <h1 className="text-2xl font-bold">Welcome back,<br />{user?.name}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Bell size={24} />
                            {availableJobs.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {availableJobs.length}
                                </span>
                            )}
                        </div>
                        {/* Correct Logout Button in Header */}
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-6 space-y-6">
                {/* Active Job Card */}
                {activeJob && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Current Assignment
                        </h2>
                        <div className="bg-white rounded-[30px] p-6 shadow-xl border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-blue-50  rounded-2xl flex items-center justify-center text-blue-600 ">
                                    <Car size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 ">{activeJob.vehicle?.make} {activeJob.vehicle?.model}</h3>
                                    <p className="text-gray-500  font-mono tracking-wider">{activeJob.vehicle?.plateNumber}</p>
                                    <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-100  text-blue-700 ">
                                        {activeJob.status.includes('PARKING') ? 'Park Vehicle' : 'Retrieve Vehicle'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-4 p-4 bg-gray-50  rounded-2xl">
                                    <User className="text-gray-400" size={18} />
                                    <div>
                                        <p className="text-xs text-gray-500  uppercase font-bold">Customer</p>
                                        <p className="font-semibold text-gray-800 ">{activeJob.user?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-gray-50  rounded-2xl">
                                    <MapPin className="text-gray-400" size={18} />
                                    <div>
                                        <p className="text-xs text-gray-500  uppercase font-bold">Location</p>
                                        <p className="font-semibold text-gray-800 ">Inorbit Mall - {activeJob.gateId || 'Main Gate'}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {activeJob.status.includes('PARKING')
                                                ? `Mark at Spot: ${activeJob.spotNumber}`
                                                : `Retrieve from: ${activeJob.spotNumber}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (activeJob.status === 'VALET_ASSIGNED_FOR_PARKING') {
                                        handleUpdateStatus('PARKED');
                                    } else if (activeJob.status === 'VALET_ASSIGNED_FOR_RETRIEVAL') {
                                        handleUpdateStatus('RETRIEVING');
                                    } else if (activeJob.status === 'RETRIEVING') {
                                        handleUpdateStatus('COMPLETED');
                                    }
                                }}
                                className="w-full bg-[#4F46E5] text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {activeJob.status === 'VALET_ASSIGNED_FOR_PARKING' && <> <CheckCircle size={20} /> Mark as Parked </>}
                                {activeJob.status === 'VALET_ASSIGNED_FOR_RETRIEVAL' && <> <Car size={20} /> Start Retrieval </>}
                                {activeJob.status === 'RETRIEVING' && <> <CheckCircle size={20} /> Complete Retrieval </>}
                            </button>
                        </div>
                    </div>
                )}

                {/* Available Jobs List */}
                {!activeJob && (
                    <div>
                        <h2 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                            <Bell size={18} className="text-blue-600" />
                            New Assignments
                        </h2>

                        {availableJobs.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <Clock size={32} />
                                </div>
                                <p className="text-gray-400 font-medium">No new assignments</p>
                                <p className="text-xs text-gray-300 mt-1">Waiting for requests...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {availableJobs.map(job => (
                                    <div key={job.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${job.status === 'ACTIVE' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                                                    <Car size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{job.vehicle?.make} {job.vehicle?.model}</h3>
                                                    <p className="text-xs text-gray-500 font-mono">{job.vehicle?.plateNumber}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${job.status === 'ACTIVE' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {job.status === 'ACTIVE' ? 'Park Request' : 'Retrieval'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                            <div className="text-xs text-gray-500">
                                                <p>{job.gateId || 'Gate 1'}</p>
                                                <p className="font-medium text-gray-900 mt-0.5">{job.user?.name}</p>
                                            </div>
                                            <button
                                                onClick={() => handleAccept(job.id)}
                                                className="bg-[#4F46E5] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all flex items-center gap-2"
                                            >
                                                Accept <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

