import { Outlet } from 'react-router-dom';
import UserBottomNav from './UserBottomNav';
import { NotificationProvider, useNotifications } from '../context/NotificationContext';
import WhatsAppNotification from './WhatsAppNotification';

const LayoutContent = () => {
    const { notification, vehicle, clearNotification } = useNotifications();

    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans">
            {notification && (
                <WhatsAppNotification
                    message={notification}
                    vehicle={vehicle}
                    onClear={clearNotification}
                />
            )}
            <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-gray-50">
                <Outlet />
            </div>
            <UserBottomNav />
        </div>
    );
};

const UserLayout = () => {
    return (
        <NotificationProvider>
            <LayoutContent />
        </NotificationProvider>
    );
};

export default UserLayout;
