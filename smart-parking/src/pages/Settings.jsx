import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Shield, LogOut, ChevronRight, HelpCircle } from 'lucide-react';

export default function Settings() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50  p-6 space-y-8 pb-24 max-w-md mx-auto ">
            <h1 className="text-2xl font-bold text-gray-900  pt-4">Settings</h1>

            {/* Profile Card */}
            <div className="bg-white  p-6 rounded-[2rem] shadow-sm border border-gray-100  flex flex-col items-center text-center relative overflow-hidden">
                <div className="w-full h-24 bg-gradient-to-r from-[#4F46E5] to-purple-500 absolute top-0 left-0"></div>

                <div className="w-24 h-24 rounded-full p-1 bg-white  relative z-10 mt-8 shadow-lg">
                    <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="Profile" className="w-full h-full rounded-full object-cover" />
                </div>

                <div className="mt-4 mb-2">
                    <h2 className="font-bold text-xl text-gray-900 ">{user?.name || 'Smart User'}</h2>
                    <p className="text-sm text-gray-500  font-medium">{user?.email || 'user@example.com'}</p>
                </div>

                <button className="bg-black  text-white text-xs font-bold px-4 py-2 rounded-full mt-2 hover:bg-gray-800 transition-colors">
                    Edit Profile
                </button>
            </div>

            {/* Sections */}
            <div className="space-y-6">
                <Section title="General">
                    <MenuItem icon={User} label="Account Information" />
                    <MenuItem icon={Bell} label="Notifications" badge="2" />
                </Section>

                <Section title="Support & Security">
                    <MenuItem icon={Shield} label="Privacy & Security" />
                    <MenuItem icon={HelpCircle} label="Help & Support" />
                </Section>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors active:scale-95"
                >
                    <LogOut size={20} />
                    Log Out
                </button>

                <p className="text-center text-xs text-gray-400 font-mono opacity-50">v1.0.0 (Build 2026.01.07)</p>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500  uppercase tracking-wider ml-4">{title}</h3>
            <div className="bg-white  rounded-3xl shadow-sm border border-gray-100  overflow-hidden">
                {children}
            </div>
        </div>
    )
}

function MenuItem({ icon: Icon, label, badge }) {
    return (
        <div
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 group-hover:bg-[#4F46E5] group-hover:text-white ">
                    <Icon size={18} />
                </div>
                <span className="font-semibold text-sm text-gray-800 ">{label}</span>
            </div>

            <div className="flex items-center gap-2">
                {badge && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
                <ChevronRight size={18} className="text-gray-300 " />
            </div>
        </div>
    )
}
