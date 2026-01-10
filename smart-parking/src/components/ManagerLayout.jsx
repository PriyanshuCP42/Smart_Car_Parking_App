import { Outlet } from 'react-router-dom';
import ManagerBottomNav from './ManagerBottomNav';

const ManagerLayout = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans">
            <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
                <Outlet />
            </div>
            <ManagerBottomNav />
        </div>
    );
};

export default ManagerLayout;
