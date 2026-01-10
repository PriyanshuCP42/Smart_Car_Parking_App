import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Settings } from 'lucide-react';

const ManagerBottomNav = () => {
    const navItems = [
        { path: '/manager', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/add-driver', label: 'Add Driver', icon: UserPlus },
        { path: '/manager/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50">
            {navItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                    key={path}
                    to={path}
                    end={path === '/manager'} // Only match exact for home
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? 'text-[#0f172a]' : 'text-gray-400 hover:text-gray-600'
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

export default ManagerBottomNav;
