import { NavLink } from 'react-router-dom';
import { Home, Clock, Settings } from 'lucide-react';

const DriverBottomNav = () => {
    const navItems = [
        { path: '/driver', label: 'Home', icon: Home, end: true },
        { path: '/driver/history', label: 'History', icon: Clock },
        { path: '/driver/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50">
            {navItems.map(({ path, label, icon: Icon, end }) => (
                <NavLink
                    key={path}
                    to={path}
                    end={end}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? 'text-[#4F46E5]' : 'text-gray-400 hover:text-gray-600'
                        }`
                    }
                >
                    <Icon size={24} strokeWidth={2.5} />
                    <span className="text-[10px] font-semibold">{label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default DriverBottomNav;
